export async function onRequestGet({ env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  };

  const relayUrl = (env.PIXIV_RELAY_URL || "").replace(/\/+$/, "");
  const relaySecret = env.PIXIV_RELAY_SECRET || "";

  if (!relayUrl || !relaySecret) {
    return new Response(
      JSON.stringify({ error: "Pixiv 中转服务尚未配置。" }),
      { status: 503, headers }
    );
  }

  try {
    const upstream = await fetch(`${relayUrl}/api/random`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${relaySecret}`,
        Accept: "application/json"
      },
      signal: AbortSignal.timeout(90000)
    });

    const raw = await upstream.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error("RELAY_INVALID_RESPONSE");
    }

    if (!upstream.ok || !data.ok || !data.illustration) {
      return new Response(
        JSON.stringify({
          error: data.error || "Pixiv 插画服务暂时不可用，请稍后重试。"
        }),
        { status: upstream.status >= 400 ? upstream.status : 502, headers }
      );
    }

    const item = data.illustration;

    return new Response(
      JSON.stringify({
        ok: true,
        illust: {
          id: item.id,
          title: item.title || "未命名作品",
          user: item.user || "未知画师",
          image: item.image,
          originalUrl: item.originalUrl || `https://www.pixiv.net/artworks/${item.id}`,
          pageCount: item.pageCount || 1,
          xRestrict: item.xRestrict
        }
      }),
      { status: 200, headers }
    );
  } catch (error) {
    const message = error?.message || "";
    return new Response(
      JSON.stringify({
        error: message === "RELAY_INVALID_RESPONSE"
          ? "Pixiv 中转服务返回了无法识别的数据。"
          : "获取 Pixiv 插画失败，请稍后重试。"
      }),
      { status: 502, headers }
    );
  }
}
