(function () {

    const buttons =
        document.querySelectorAll(
            '.thinking-topic__button'
        );


    buttons.forEach(button => {

        button.addEventListener(
            'click',
            async function () {

                const topic =
                    this.dataset.topic;

                const articleContainer =
                    document.querySelector(
                        `[data-articles="${topic}"]`
                    );

                const expanded =
                    this.getAttribute(
                        'aria-expanded'
                    ) === 'true';


                /*
                 * 如果已经打开，则关闭
                 */

                if (expanded) {

                    this.setAttribute(
                        'aria-expanded',
                        'false'
                    );

                    articleContainer.hidden =
                        true;

                    this
                        .querySelector(
                            '.thinking-topic__symbol'
                        )
                        .textContent = '+';

                    return;
                }


                /*
                 * 打开栏目
                 */

                this.setAttribute(
                    'aria-expanded',
                    'true'
                );

                articleContainer.hidden =
                    false;

                this
                    .querySelector(
                        '.thinking-topic__symbol'
                    )
                    .textContent = '−';


                /*
                 * 如果已经加载过文章，
                 * 不重复请求
                 */

                if (
                    articleContainer.dataset.loaded
                    === 'true'
                ) {
                    return;
                }


                articleContainer.innerHTML = `
                    <div class="article-loading">
                        正在加载……
                    </div>
                `;


                try {

                    const response =
                        await fetch(
                            `../articles/thinking/${topic}/index.json`
                        );


                    if (!response.ok) {
                        throw new Error(
                            '文章列表读取失败'
                        );
                    }


                    const articles =
                        await response.json();


                    /*
                     * 最新文章在前
                     */

                    articles.sort(
                        (a, b) =>
                            new Date(b.date) -
                            new Date(a.date)
                    );


                    if (
                        articles.length === 0
                    ) {

                        articleContainer.innerHTML = `
                            <div class="article-loading">
                                暂无文章。
                            </div>
                        `;

                        return;
                    }


                    /*
                     * 生成所有文章卡片
                     */

                    articleContainer.innerHTML =
                        articles.map(
                            (article, index) => {

                                const path =
                                    article.file
                                        .replace(
                                            /\.md$/,
                                            ''
                                        );

                                return `

<a
    href="article.html?post=thinking/${topic}/${encodeURIComponent(path)}"
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


                    articleContainer.dataset.loaded =
                        'true';


                } catch (error) {

                    console.error(error);

                    articleContainer.innerHTML = `
                        <div class="article-loading">
                            文章加载失败。
                        </div>
                    `;

                }

            }
        );

    });

})();
