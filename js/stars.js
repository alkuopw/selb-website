(function () {

    const starField = document.createElement('div');

    starField.className = 'star-field';
    starField.setAttribute('aria-hidden', 'true');

    document.body.prepend(starField);

    const starCount = 110;

    const colors = [
        'rgba(180, 205, 255, 0.55)',
        'rgba(150, 175, 255, 0.45)',
        'rgba(205, 220, 255, 0.50)',
        'rgba(150, 220, 235, 0.42)',
        'rgba(190, 165, 235, 0.40)',
        'rgba(225, 205, 165, 0.35)'
    ];

    for (let i = 0; i < starCount; i++) {

        const star = document.createElement('span');

        star.className = 'star';

        star.style.left =
            `${Math.random() * 100}%`;

        star.style.top =
            `${Math.random() * 100}%`;

        const size =
            Math.random() < 0.88
                ? Math.random() * 1.5 + 0.5
                : Math.random() * 2.5 + 1.5;

        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        const color =
    colors[
        Math.floor(
            Math.random() *
            colors.length
        )
    ];

star.style.background = color;
star.style.boxShadow =
    `0 0 4px ${color}`;
       star.style.opacity =
    Math.random() * 0.45 + 0.45;

        const duration =
            Math.random() * 5 + 3;

        star.style.animationDuration =
            `${duration}s`;

        star.style.animationDelay =
            `${Math.random() * -8}s`;

        starField.appendChild(star);
    }

})();
