export async function onRequest(context) {
    const url = new URL(context.request.url);
    const post = url.searchParams.get("post") || "";
    const ua = context.request.headers.get("User-Agent") || "";

    // 判断是否为微信 / QQ 内置浏览器
    const blockedBrowser =
        /MicroMessenger|WeChat|MMWEBSDK|XWEB|QQ\/|V1_AND_SQ|MQQBrowser|QQBrowser/i
        .test(ua);

    // 只保护 zy 栏目
const isThinkingPage = url.pathname === "/pages/thinking";

if (isThinkingPage && blockedBrowser) {
    return new Response(
            `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
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
<h2>此页面无法在当前浏览器中打开</h2>
<p>不支持微信或 QQ 内置浏览器。</p>
<p>请使用 Chrome、Edge、Firefox 或其他独立浏览器打开。</p>
</body>
</html>`,
            {
                status: 403,
                headers: {
                    "Content-Type": "text/html; charset=UTF-8"
                }
            }
        );
    }

    return context.next();
}
