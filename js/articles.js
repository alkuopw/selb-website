const articleContainer =
    document.getElementById('article');


async function loadArticle() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const post =
        params.get('post');


    if (!post) {

        articleContainer.innerHTML = `
            <h1 class="page__title">
                找不到文章
            </h1>
        `;

        return;
    }


    /*
     * 防止通过 URL 请求仓库之外的文件。
     */

    if (
        post.includes('..') ||
        post.startsWith('/') ||
        post.includes('\\')
    ) {

        articleContainer.innerHTML = `
            <h1 class="page__title">
                无效文章
            </h1>
        `;

        return;
    }


    const url =
        `../articles/${post}.md`;


    try {

        const response =
            await fetch(url);


        if (!response.ok) {
            throw new Error(
                '文章不存在'
            );
        }


        const markdown =
            await response.text();


        articleContainer.innerHTML =
            marked.parse(markdown);


    } catch (error) {

        console.error(error);


        articleContainer.innerHTML = `
            <h1 class="page__title">
                文章加载失败
            </h1>

            <p class="page__body">
                找不到这篇文章。
            </p>
        `;

    }

}


loadArticle();
