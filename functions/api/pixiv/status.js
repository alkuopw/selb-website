export async function onRequestGet({ env }) {
  const pixivRefreshTokenConfigured =
    typeof env.PIXIV_REFRESH_TOKEN === "string" &&
    env.PIXIV_REFRESH_TOKEN.length > 0;

  const wallpaperPasswordConfigured =
    typeof env.WALLPAPER_PASSWORD === "string" &&
    env.WALLPAPER_PASSWORD.length > 0;

  return new Response(
    JSON.stringify({
      ok: true,
      pixivRefreshTokenConfigured,
      wallpaperPasswordConfigured,
      message: pixivRefreshTokenConfigured
        ? "Pixiv refresh token is configured."
        : "Pixiv refresh token is missing."
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      }
    }
  );
}
