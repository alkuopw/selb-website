(function () {

    const starField =
        document.createElement('div');

    starField.className = 'star-field';

    starField.setAttribute(
        'aria-hidden',
        'true'
    );

    document.body.prepend(starField);


    /*
     * 星星数量
     *
     * 数字越大越密集。
     * 目前设置为 110。
     */
    const starCount = 110;


    /*
     * 不同颜色的星星
     *
     * 都是比较暗的颜色，
     * 避免抢过正文。
     */
    const colors = [
        'rgba(180, 205, 255, 0.55)',
        'rgba(150, 175, 255, 0.45)',
        'rgba(205, 220, 255, 0.50)',
        'rgba(150, 220, 235, 0.42)',
        'rgba(190, 165, 235, 0.40)',
        'rgba(225, 205, 165, 0.35)'
    ];


    for (let i = 0; i < starCount; i++) {

        const star =
            document.createElement('span');

        star.className = 'star';


        /*
         * 随机位置
         */
        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;


        /*
         * 随机大小
         *
         * 大部分比较小，
         * 偶尔出现较亮的大星。
         */
        const size =
            Math.random() < 0.88
                ? Math.random() * 1.5 + 0.5
                : Math.random() * 2.5 + 1.5;

        star.style.width =
            `${size}px`;

        star.style.height =
            `${size}px`;


        /*
         * 随机颜色
         */
        star.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        /*
         * 随机透明度
         */
        star.style.opacity =
            Math.random() * 0.55 + 0.25;


        /*
         * 随机闪烁速度
         */
        const duration =
            Math.random() * 5 + 3;

        star.style.animationDuration =
            `${duration}s`;


        /*
         * 随机延迟
         */
        star.style.animationDelay =
            `${Math.random() * -8}s`;


        starField.appendChild(star);
    }

})();
