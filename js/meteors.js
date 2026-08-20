/*
 * Freesia Hybrida
 * 流星背景特效
 *
 * 设计原则：
 *
 * 1. 每颗流星拥有独立的运动角度
 * 2. 流星头和拖尾属于同一个元素
 * 3. 拖尾永远位于运动方向的反方向
 * 4. 页面加载后立即有流星进入
 * 5. 桌面端和移动端使用不同数量
 */

(function () {

  'use strict';


  /* ==========================================
     找到流星容器
     ========================================== */

  const field =
    document.querySelector('.meteor-field');

  if (!field) {
    return;
  }


  /* ==========================================
     基本参数
     ========================================== */

  const isMobile =
    window.innerWidth < 768;


  /*
   * 流星数量
   *
   * 桌面：
   * 24 颗
   *
   * 手机：
   * 10 颗
   */
  const METEOR_COUNT =
    isMobile ? 10 : 24;


  /*
   * 默认运动角度
   *
   * CSS 中：
   *
   * 0deg   = 向右
   * 90deg  = 向下
   * 135deg = 左下
   * 180deg = 向左
   *
   * 这里使用 135deg 左右，
   * 让流星整体呈现左下划过天空的感觉。
   */
  const BASE_ANGLE = 135;


  /* ==========================================
     创建一颗流星
     ========================================== */

  function createMeteor(index) {

    const meteor =
      document.createElement('div');

    meteor.className = 'meteor';


    /* ------------------------------------------
       起始位置
       ------------------------------------------ */

    /*
     * 流星主要从屏幕上方进入。
     *
     * 使用 -10% ~ 110%，
     * 可以让部分流星从屏幕边缘进入。
     */
    const startLeft =
      -10 + Math.random() * 120;

    const startTop =
      -15 + Math.random() * 45;


    meteor.style.left =
      startLeft + 'vw';

    meteor.style.top =
      startTop + 'vh';


    /* ------------------------------------------
       运动角度
       ------------------------------------------ */

    /*
     * 在 135deg 附近随机 ±10deg。
     *
     * 例如：
     *
     * 126deg
     * 131deg
     * 137deg
     * 143deg
     *
     * 这样不会所有流星完全平行。
     */
    const angle =
      BASE_ANGLE +
      (Math.random() * 20 - 10);


    meteor.style.setProperty(
      '--meteor-angle',
      angle + 'deg'
    );


    /* ------------------------------------------
       流星长度
       ------------------------------------------ */

    /*
     * 桌面端稍长，
     * 手机端稍短。
     */
    const tailLength = isMobile
      ? 70 + Math.random() * 60
      : 90 + Math.random() * 100;


    meteor.style.setProperty(
      '--meteor-tail-length',
      tailLength + 'px'
    );


    /* ------------------------------------------
       运动距离
       ------------------------------------------ */

    /*
     * 让流星能够完整穿过屏幕。
     *
     * 距离越大：
     *     流星飞得越远
     *
     * 同时动画持续时间也会相应增加。
     */
    const distance = isMobile
      ? 420 + Math.random() * 240
      : 600 + Math.random() * 350;


    meteor.style.setProperty(
      '--meteor-distance',
      distance + 'px'
    );


    /* ------------------------------------------
       运动速度
       ------------------------------------------ */

    /*
     * 桌面端：
     * 4 ~ 7 秒
     *
     * 手机端：
     * 4.5 ~ 7 秒
     */
    const duration = isMobile
      ? 4.5 + Math.random() * 2.5
      : 4 + Math.random() * 3;


    meteor.style.animationDuration =
      duration + 's';


    /* ------------------------------------------
       初始延迟
       ------------------------------------------ */

    /*
     * 原来的代码是 0 ~ 8 秒。
     *
     * 这会导致：
     *
     *     打开网站
     *         ↓
     *     长时间什么都看不到
     *
     * 现在缩短到 0 ~ 2.5 秒。
     */
    const delay =
      Math.random() * 2.5;


    meteor.style.animationDelay =
      delay + 's';


    /* ------------------------------------------
       流星大小
       ------------------------------------------ */

    const size =
      isMobile
        ? 0.8 + Math.random() * 0.5
        : 0.8 + Math.random() * 0.7;


    meteor.style.width =
      (4 * size) + 'px';

    meteor.style.height =
      (4 * size) + 'px';


    /* ------------------------------------------
       稍微随机透明度
       ------------------------------------------ */

    meteor.style.setProperty(
      '--meteor-opacity',
      0.7 + Math.random() * 0.3
    );


    /* ------------------------------------------
       加入页面
       ------------------------------------------ */

    field.appendChild(meteor);
  }


  /* ==========================================
     创建全部流星
     ========================================== */

  for (
    let i = 0;
    i < METEOR_COUNT;
    i++
  ) {

    createMeteor(i);

  }


})();
