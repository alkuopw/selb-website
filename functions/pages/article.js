export async function onRequest(context) {
    const url = new URL(context.request.url);
    const post = url.searchParams.get("post") || "";
    const ua = context.request.headers.get("User-Agent") || "";

    // ================================
    // 1. 微信 / QQ 内置浏览器检测
    // ================================
    const blockedBrowser =
        /MicroMessenger|WeChat|MMWEBSDK|XWEB|QQ\/|V1_AND_SQ|MQQBrowser|QQBrowser/i
        .test(ua);


    // ================================
    // 2. 正义栏目文章
    // ================================
    const isJusticeArticle =
        url.pathname === "/pages/article" &&
        post.startsWith("zy/");


    // ================================
    // 3. 正义栏目文章禁止搜索引擎索引
    // ================================
    if (isJusticeArticle) {

        // 如果是微信 / QQ，直接拒绝
        if (blockedBrowser) {
            return new Response(
                `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport"
      content="width=device-width,initial-scale=1">
<title>无法访问</title>
<style>
body {
    font-family: sans-serif;
    max-width: 600px;
    margin: 80px auto;
    padding: 20px;
    line-height: 1.8;
}
</style>
</head>

<body>

<h2>此文章无法在当前浏览器中打开</h2>

<p>正义栏目不支持微信或 QQ 内置浏览器。</p>

<p>请使用 Chrome、Edge、Firefox 或其他独立浏览器打开。</p>

</body>
</html>`,
                {
                    status: 403,
                    headers: {
                        "Content-Type": "text/html; charset=UTF-8",
                        "Cache-Control": "no-store",
                        "X-Robots-Tag":
                            "noindex, nofollow, noarchive, nosnippet"
                    }
                }
            );
        }

        // ================================
        // 普通浏览器：
        // 允许访问，但是禁止搜索引擎索引
        // ================================
        const response = await context.next();

        const newResponse = new Response(
            response.body,
            response
        );

        newResponse.headers.set(
            "X-Robots-Tag",
            "noindex, nofollow, noarchive, nosnippet"
        );

        return newResponse;
    }


    // ================================
    // 4. 其他页面正常访问
    // ================================
    return context.next();
}
