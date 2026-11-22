function md5(input) {
  const bytes = new TextEncoder().encode(input);
  const bitLength = bytes.length * 8;
  const paddedLength = (((bytes.length + 8) >>> 6) + 1) * 64;
  const data = new Uint8Array(paddedLength);
  data.set(bytes);
  data[bytes.length] = 0x80;

  const view = new DataView(data.buffer);
  view.setUint32(paddedLength - 8, bitLength >>> 0, true);
  view.setUint32(paddedLength - 4, Math.floor(bitLength / 0x100000000), true);

  const shifts = [
    7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,
    5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,
    4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,
    6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21
  ];
  const constants = Array.from({ length: 64 }, (_, i) =>
    Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0
  );
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;

  for (let offset = 0; offset < paddedLength; offset += 64) {
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }

      const word = view.getUint32(offset + g * 4, true);
      const sum = (a + f + constants[i] + word) >>> 0;
      const rotated = (sum << shifts[i]) | (sum >>> (32 - shifts[i]));
      [a, d, c, b] = [d, c, b, (b + rotated) >>> 0];
    }
    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  return [a0, b0, c0, d0].map(word =>
    [0, 8, 16, 24].map(shift =>
      ((word >>> shift) & 0xff).toString(16).padStart(2, "0")
    ).join("")
  ).join("");
}

function pixivHeaders() {
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, "+00:00");
  const hash = md5(
    now + "28c1fdd170a5204386cb1313c7077b34f83e4aaf4aa829ce78c231e05b0bae2c"
  );
  return {
    "X-Client-Time": now,
    "X-Client-Hash": hash,
    "App-OS": "Android",
    "App-OS-Version": "14",
    "App-Version": "5.0.166",
    "User-Agent": "PixivAndroidApp/5.0.166 (Android 14; Pixel 8)"
  };
}

async function getAccessToken(env) {
  const cache = caches.default;
  const cacheKey = new Request("https://clweb-internal.invalid/pixiv-token");
  const cached = await cache.match(cacheKey);

  let previousToken = null;
  if (cached) {
    previousToken = await cached.json();
    if (
      previousToken.access_token &&
      previousToken.refresh_token &&
      Number(previousToken.expires_at) > Date.now() + 60_000
    ) {
      return previousToken;
    }
  }

  const refreshToken =
    previousToken?.refresh_token || env.PIXIV_REFRESH_TOKEN;

  if (!refreshToken) {
    throw new Error("PIXIV_NOT_CONFIGURED");
  }

  const body = new URLSearchParams({
    client_id: "MOBrBDS8blbauoSck0ZfDbtuzpyT",
    client_secret: "lsACyCD94FhDUtGTXi3QzcFE2uU1hqtDaKeqrdwj",
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    include_policy: "true"
  });

  const response = await fetch("https://oauth.secure.pixiv.net/auth/token", {
    method: "POST",
    headers: {
      ...pixivHeaders(),
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body
  });

  if (!response.ok) {
    throw new Error("PIXIV_AUTH_FAILED");
  }

  const result = await response.json();
  if (!result.access_token || !result.refresh_token) {
    throw new Error("PIXIV_AUTH_INVALID_RESPONSE");
  }

  const token = {
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_at: Date.now() + Math.max(60, Number(result.expires_in || 3600) - 120) * 1000
  };

  // Keep the latest refresh token in the edge cache beyond the access-token lifetime.
  // The access token itself is only reused until expires_at.
  await cache.put(
    cacheKey,
    new Response(JSON.stringify(token), {
      headers: {
        "Cache-Control": "public, max-age=1209600",
        "Content-Type": "application/json"
      }
    })
  );

  return token;
}

export async function onRequestGet({ env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  };

  try {
    const token = await getAccessToken(env);
    const response = await fetch(
      "https://app-api.pixiv.net/v1/illust/ranking?mode=day_r18&filter=for_android",
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "App-OS": "Android",
          "App-OS-Version": "14",
          "App-Version": "5.0.166",
          "User-Agent": "PixivAndroidApp/5.0.166 (Android 14; Pixel 8)"
        }
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Pixiv 插画服务暂时不可用，请稍后重试。" }),
        { status: 502, headers }
      );
    }

    const data = await response.json();
    const candidates = (data.illusts || []).filter(item =>
      item &&
      item.type === "illust" &&
      item.x_restrict === 1 &&
      item.image_urls &&
      (item.image_urls.large || item.image_urls.medium) &&
      item.user &&
      Number.isFinite(Number(item.id))
    );

    if (candidates.length === 0) {
      return new Response(
        JSON.stringify({ error: "本次没有找到符合条件的 R-18 插画，请再试一次。" }),
        { status: 404, headers }
      );
    }

    const selected = candidates[Math.floor(Math.random() * candidates.length)];

    return new Response(
      JSON.stringify({
        ok: true,
        illust: {
          id: selected.id,
          title: selected.title || "未命名作品",
          user: selected.user.name || "未知画师",
          image: selected.image_urls.large || selected.image_urls.medium,
          originalUrl: `https://www.pixiv.net/artworks/${selected.id}`,
          pageCount: selected.page_count || 1,
          xRestrict: selected.x_restrict
        }
      }),
      { status: 200, headers }
    );
  } catch (error) {
    const message = error && error.message;
    const status = message === "PIXIV_NOT_CONFIGURED" ? 503 : 502;
    const publicMessage = message === "PIXIV_NOT_CONFIGURED"
      ? "服务器尚未配置 Pixiv Token。"
      : message === "PIXIV_AUTH_FAILED"
        ? "Pixiv 授权失败，请检查 Refresh Token 是否有效。"
        : "获取 Pixiv 插画失败，请稍后重试。";

    return new Response(
      JSON.stringify({ error: publicMessage }),
      { status, headers }
    );
  }
}
