export async function onRequestGet({ request }) {
  const headers = {
    "Cache-Control": "public, max-age=3600",
    "X-Content-Type-Options": "nosniff"
  };

  const requested = new URL(request.url).searchParams.get("url");
  if (!requested) {
    return new Response("Missing image URL.", { status: 400 });
  }

  let imageUrl;
  try {
    imageUrl = new URL(requested);
  } catch {
    return new Response("Invalid image URL.", { status: 400 });
  }

  if (
    imageUrl.protocol !== "https:" ||
    !["i.pximg.net", "i-f.pximg.net"].includes(imageUrl.hostname)
  ) {
    return new Response("Image host is not allowed.", { status: 403 });
  }

  try {
    const upstream = await fetch(imageUrl.toString(), {
      headers: {
        Referer: "https://www.pixiv.net/",
        "User-Agent": "Mozilla/5.0"
      }
    });

    if (!upstream.ok) {
      return new Response("Pixiv image is unavailable.", {
        status: upstream.status === 404 ? 404 : 502
      });
    }

    const contentType = upstream.headers.get("Content-Type") || "";
    if (!contentType.startsWith("image/")) {
      return new Response("Upstream did not return an image.", { status: 502 });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...headers,
        "Content-Type": contentType
      }
    });
  } catch {
    return new Response("Unable to fetch Pixiv image.", { status: 502 });
  }
}
