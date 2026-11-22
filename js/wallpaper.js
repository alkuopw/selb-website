
const imageFiles = [
  "0001.jpg",
  "0002.jpg",
  "0003.jpg",
  "0004.jpg",
  "0005.jpg",
  "0006.jpg",
  "0007.jpg",
  "0008.jpg",
  "0009.jpg",
  "0010.jpg",
  "0011.jpg",
  "0012.jpg",
  "0013.jpg",
  "0014.jpg",
  "0015.jpg",
  "0016.jpg",
  "0017.jpg",
  "0018.jpg",
  "0020.jpg",
  "0021.jpg",
  "0022.jpg",
  "0023.jpg",
  "0024.jpg",
  "0025.jpg",
  "0019.jpg",
  "0026.jpg",
  "0027.jpg",
  "0028.jpg",
  "0029.jpg",
  "0030.jpg",
  "0031.jpg",
  "0032.jpg",
  "0033.jpg",
  "0034.jpg",
  "0035.jpg",
  "0036.jpg",
  "0037.jpg",
  "0038.jpg",
  "0039.jpg",
  "0040.jpg",
  "0041.jpg",
  "0042.jpg",
  "0043.jpg",
  "0044.png",
  "0045.png",
  "0046.jpg",
  "0047.jpg",
  "0048.png",

  "0049.jpg",
  "0050.jpg",
  "0051.jpg",
  "0052.jpg",
  "0053.png",
  "0054.png",
  "0055.jpg",
  "0056.jpg",
  "0057.jpg",
  "0058.jpg",
  "0059.jpg",
  "0060.jpg",
  "0061.jpg",
  "0062.jpg",
  "0063.jpg",
  "0064.jpg",
  "0065.jpg",
  "0066.jpg",
  "0067.jpg",
  "0068.jpg",
  "0069.jpg",
  "0070.jpg",
  "0071.jpg",
  "0072.jpg",
  "0073.jpg",
  "0074.jpg",
  "0075.jpg",
  "0076.jpg",
  "0077.png",
  "0078.jpg",
  "0079.jpg",
  "0080.png",
  "0081.png",
  "0082.png",
  "0083.png",
  "0084.png",
  "0085.png",
  "0086.png",
  "0087.png",
  "0088.png",
  "0089.jpg",
  "0090.jpg",
  "0091.png",
  "0092.png",
  "0093.jpg",
  "0094.png",
  "0095.jpg",
  "0096.jpg",
  "0097.jpg",
  "0098.jpg",
  "0099.jpg",
  "0100.jpg",
  "0101.jpg",
  "0102.jpg",
  "0103.jpg",
  "0104.jpg",
  "0105.png",
  "0106.jpg",
  "0107.jpg",
  "0108.jpg",
  "0109.jpg",
  "0110.jpg",
  "0111.png",
  "0112.jpg",
  "0113.jpg",
  "0114.jpg",
  "0115.jpg",
  "0116.png",
  "0117.jpg",
  "0118.jpg",
  "0119.jpg",
  "0120.jpg",
  "0121.jpg",
  "0122.png",
  "0123.jpg",
  "0124.jpg",
  "0125.jpg",
  "0126.jpg",
  "0127.jpg",
  "0128.jpg",
  "0129.jpg",
  "0130.jpg"
];

// 图片放在仓库的 images/wallpapers/ 目录下
const imageBase = "../images/wallpapers/";

const form = document.getElementById("password-form");
const passwordInput = document.getElementById("password");
const message = document.getElementById("password-message");
const passwordPanel = document.getElementById("password-panel");
const gallery = document.getElementById("gallery");
const mainImage = document.getElementById("main-image");
const thumbnails = document.getElementById("thumbnails");
const nextButton = document.getElementById("next-button");

let currentImage = "";

function imageUrl(filename) {
  return imageBase + encodeURIComponent(filename);
}

function chooseRandom(excluded = []) {
  const candidates = imageFiles.filter(
    filename => !excluded.includes(filename)
  );

  if (candidates.length === 0) {
    return imageFiles[
      Math.floor(Math.random() * imageFiles.length)
    ];
  }

  return candidates[
    Math.floor(Math.random() * candidates.length)
  ];
}

function renderGallery(filename) {
  currentImage = filename;

  mainImage.src = imageUrl(filename);
  mainImage.alt = "壁纸：" + filename;

  // 从其他图片中随机选出四张缩略图
  const others = imageFiles.filter(
    item => item !== filename
  );

  const shuffled = others.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 4);

  thumbnails.replaceChildren();

  selected.forEach(item => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "thumbnail";
    button.setAttribute("aria-label", "查看另一张壁纸");
    button.setAttribute("aria-current", "false");

    const img = document.createElement("img");
    img.src = imageUrl(item);
    img.alt = "壁纸缩略图";
    img.loading = "lazy";

    button.appendChild(img);

    button.addEventListener("click", () => {
      renderGallery(item);
    });

    thumbnails.appendChild(button);
  });
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  message.textContent = "正在验证……";

  const password = passwordInput.value;

  try {
    const response = await fetch("/api/unlock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ password })
    });

    const result = await response.json();

    if (!response.ok || result.ok !== true) {
      message.textContent =
        result.error || "验证失败，请稍后重试。";
      return;
    }

    if (imageFiles.length === 0) {
      message.textContent = "尚未配置壁纸图片。";
      return;
    }

    passwordPanel.hidden = true;
    gallery.hidden = false;

    renderGallery(chooseRandom());
  } catch {
    message.textContent =
      "暂时无法连接验证服务，请稍后重试。";
  }
});

nextButton.addEventListener("click", () => {
  renderGallery(chooseRandom([currentImage]));
});

// Pixiv R-18 随机插画
const pixivAgeConfirm = document.getElementById("pixiv-age-confirm");
const pixivRandomButton = document.getElementById("pixiv-random-button");
const pixivStatus = document.getElementById("pixiv-status");
const pixivResult = document.getElementById("pixiv-result");
const pixivImage = document.getElementById("pixiv-image");
const pixivInfo = document.getElementById("pixiv-info");
const pixivOriginal = document.getElementById("pixiv-original");

if (pixivAgeConfirm && pixivRandomButton) {
  const syncPixivButton = () => {
    pixivRandomButton.disabled = !pixivAgeConfirm.checked;
  };

  // Bind the checkbox independently from the optional result-display elements.
  pixivAgeConfirm.addEventListener("click", syncPixivButton);
  pixivAgeConfirm.addEventListener("input", syncPixivButton);
  pixivAgeConfirm.addEventListener("change", syncPixivButton);
  syncPixivButton();

  pixivRandomButton.addEventListener("click", async () => {
    if (!pixivAgeConfirm.checked) {
      if (pixivStatus) {
        pixivStatus.textContent = "请先确认自己已年满 18 周岁。";
      }
      syncPixivButton();
      return;
    }

    pixivRandomButton.disabled = true;
    pixivRandomButton.textContent = "正在获取插画……";
    if (pixivStatus) pixivStatus.textContent = "正在连接 Pixiv，请稍候。";
    if (pixivResult) pixivResult.hidden = true;

    try {
      const response = await fetch("/api/pixiv/random", {
        method: "GET",
        headers: { "Accept": "application/json" },
        cache: "no-store"
      });

      const result = await response.json();

      if (!response.ok || result.ok !== true || !result.illust) {
        throw new Error(result.error || "获取插画失败，请稍后重试。");
      }

      const illust = result.illust;
      if (!pixivImage || !pixivInfo || !pixivOriginal || !pixivResult) {
        throw new Error("页面缺少插画展示区域，请刷新页面后重试。");
      }

      const proxiedImage = "/api/pixiv/image?url=" +
        encodeURIComponent(illust.image);

      pixivImage.onload = () => {
        pixivResult.hidden = false;
        if (pixivStatus) pixivStatus.textContent = "已获取一张 Pixiv R-18 插画。";
      };
      pixivImage.onerror = () => {
        pixivResult.hidden = true;
        if (pixivStatus) {
          pixivStatus.textContent = "插画信息已获取，但图片加载失败。请再试一次。";
        }
      };

      pixivImage.alt = illust.title || "Pixiv R-18 插画";
      pixivImage.src = proxiedImage;
      pixivInfo.textContent =
        (illust.title || "未命名作品") + " — " +
        (illust.user || "未知画师");
      pixivOriginal.href = illust.originalUrl;
      pixivOriginal.textContent = "在 Pixiv 查看原作品";
      pixivResult.hidden = false;
      if (pixivStatus) pixivStatus.textContent = "插画信息已获取，正在加载图片。";
    } catch (error) {
      if (pixivStatus) {
        pixivStatus.textContent =
          error.message || "暂时无法获取 Pixiv 插画，请稍后重试。";
      }
    } finally {
      syncPixivButton();
      pixivRandomButton.textContent = "再来一张 Pixiv 随机图";
    }
  });
}
