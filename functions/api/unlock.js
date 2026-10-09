
export async function onRequestPost({ request, env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  };

  if (!env.WALLPAPER_PASSWORD) {
    return new Response(
      JSON.stringify({ error: "服务器尚未配置口令" }),
      { status: 500, headers }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "请求格式错误" }),
      { status: 400, headers }
    );
  }

  if (
    typeof body.password !== "string" ||
    body.password.length > 256
  ) {
    return new Response(
      JSON.stringify({ error: "口令格式错误" }),
      { status: 400, headers }
    );
  }

  if (body.password !== env.WALLPAPER_PASSWORD) {
    return new Response(
      JSON.stringify({ error: "口令不正确，请重试" }),
      { status: 401, headers }
    );
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers }
  );
}
