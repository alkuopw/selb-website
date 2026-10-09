
const imageFiles = [
  "wallpaper-01.jpg",
  "wallpaper-02.jpg",
  "wallpaper-03.jpg",
  "wallpaper-04.jpg",
  "wallpaper-05.jpg",
  "wallpaper-06.jpg"
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
