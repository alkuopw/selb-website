// 生成随机流星，颜色为淡黄色，通过 CSS 变量控制角度/速度/位置
(function () {
  const field = document.querySelector('.meteor-field');
  if (!field) return;

  const METEOR_COUNT = window.innerWidth < 768 ? 12 : 22;

  function spawnMeteor() {
    const m = document.createElement('div');
    m.className = 'meteor';

    const startLeft = Math.random() * 120 - 10; // -10% ~ 110%，让部分从右侧飞入
    const duration = 3.5 + Math.random() * 4.5;  // 3.5s ~ 8s
    const delay = Math.random() * 8;             // 0 ~ 8s 随机延迟
    const scale = 0.6 + Math.random() * 1;       // 长度/亮度变化

    m.style.left = startLeft + 'vw';
    m.style.animationDuration = duration + 's';
    m.style.animationDelay = delay + 's';
    m.style.transform = `scale(${scale})`;

    field.appendChild(m);
  }

  for (let i = 0; i < METEOR_COUNT; i++) spawnMeteor();
})();
