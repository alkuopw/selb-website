(async function () {

    const container =
        document.getElementById('art-articles');

    if (!container) {
        return;
    }


    try {

        const response =
            await fetch('../articles/art/index.json');

        if (!response.ok) {
            throw new Error(
                '无法读取文章列表'
            );
        }


        const articles =
            await response.json();


        /*
         * 按日期从新到旧排序
         */
        articles.sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


        /*
         * 显示全部文章
         */
        if (articles.length === 0) {

            container.innerHTML = `
                <p class="article-loading">
                    暂无文章。
                </p>
            `;

            return;
        }


        container.innerHTML =
            articles.map(
                (article, index) => {

                    const articlePath =
                        article.file
                            .replace(/\.md$/, '');

                    return `

<a
    href="article.html?post=art/${encodeURIComponent(articlePath)}"
    class="article-card"
>

    <div class="article-card__meta">
        ${String(index + 1).padStart(2, '0')}
        &nbsp; / &nbsp;
        ${article.date}
    </div>


    <h3 class="article-card__title">
        ${article.title}
    </h3>


    <p class="article-card__excerpt">
        ${article.description}
    </p>


    <span class="article-card__more">
        阅读全文 →
    </span>

</a>

`;

                }
            ).join('');


    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p class="article-loading">
                文章列表加载失败。
            </p>
        `;

    }

})();
