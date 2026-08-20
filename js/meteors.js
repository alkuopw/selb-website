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
    const size = 0.6 + Math.random() * 1;        // 光点/拖尾整体大小

    // 下落角度：以 150deg 为基准，±10deg 随机浮动，让每颗流星角度略有不同
    const angle = 150 + (Math.random() * 20 - 10);
    const distance = 600 + Math.random() * 200; // 平移距离，配合角度决定飞出屏幕的位置

    m.style.left = startLeft + 'vw';
    m.style.animationDuration = duration + 's';
    m.style.animationDelay = delay + 's';
    m.style.setProperty('--meteor-angle', angle + 'deg');
    m.style.setProperty('--meteor-distance', distance + 'px');
    m.style.width = (2 * size) + 'px';
    m.style.height = (2 * size) + 'px';

    field.appendChild(m);
  }

  for (let i = 0; i < METEOR_COUNT; i++) spawnMeteor();
})();
