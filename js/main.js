// ============================================
// 个性签名：从三句话中随机抽取一句显示
// 想要增删签名，直接编辑下面的数组即可
// ============================================
const SIGNATURES = [
  '大多数人宁愿被赞美毁掉，也不愿被批评拯救。',
  '点亮蜡烛很难，诅咒黑暗甚易',
  '这才是真正的不幸，习惯于绝望的处境比绝望的处境本身还糟————————加缪《鼠疫》'
];

(function renderSignature() {
  const el = document.querySelector('[data-signature]');
  if (!el) return;
  const pick = SIGNATURES[Math.floor(Math.random() * SIGNATURES.length)];
  el.textContent = pick;
})();

// ============================================
// 汉堡菜单：点击切换为 X，展开/收起导航
// ============================================
(function initMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-nav-overlay]');
  if (!toggle || !overlay) return;

  function closeMenu() {
    toggle.classList.remove('is-open');
    overlay.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    toggle.classList.add('is-open');
    overlay.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  overlay.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', closeMenu);
  });
})();
