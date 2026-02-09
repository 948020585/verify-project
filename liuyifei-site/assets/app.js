(function () {
  const i18n = {
    zh: {
      navHome: "首页",
      navWorks: "作品",
      navAnalysis: "人物分析",
      navGallery: "作品截图",
      switchLabel: "EN",
      filterAll: "全部",
      filterTv: "电视剧",
      filterFilm: "电影",
      linkWiki: "维基",
      linkImdb: "IMDb",
      linkDouban: "豆瓣",
      typeTv: "电视剧",
      typeFilm: "电影"
    },
    en: {
      navHome: "Home",
      navWorks: "Works",
      navAnalysis: "Analysis",
      navGallery: "Screenshots",
      switchLabel: "中",
      filterAll: "All",
      filterTv: "TV",
      filterFilm: "Film",
      linkWiki: "Wiki",
      linkImdb: "IMDb",
      linkDouban: "Douban",
      typeTv: "TV Series",
      typeFilm: "Film"
    }
  };

  const savedLang = localStorage.getItem("liuyifei-lang");
  let currentLang = savedLang === "en" ? "en" : "zh";

  function text(key) {
    return i18n[currentLang][key] || key;
  }

  function applyI18n() {
    document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      el.textContent = text(key);
    });

    document.querySelectorAll("[data-zh][data-en]").forEach((el) => {
      const value = currentLang === "zh" ? el.getAttribute("data-zh") : el.getAttribute("data-en");
      el.innerHTML = value;
    });

    const switchBtn = document.querySelector("#lang-switch");
    if (switchBtn) {
      switchBtn.textContent = text("switchLabel");
    }
  }

  function createWorkCard(item) {
    const card = document.createElement("article");
    card.className = "work-card";
    card.dataset.type = item.type;

    const labelType = item.type === "tv" ? text("typeTv") : text("typeFilm");
    const title = currentLang === "zh" ? item.titleZh : item.titleEn;
    const role = currentLang === "zh" ? item.roleZh : item.roleEn;
    const summary = currentLang === "zh" ? item.summaryZh : item.summaryEn;

    card.innerHTML = `
      <img src="${item.poster}" alt="${title}" loading="lazy" referrerpolicy="no-referrer" />
      <div class="content">
        <div class="badge-row">
          <span class="badge">${item.year}</span>
          <span class="badge">${labelType}</span>
        </div>
        <h3 class="work-title">${title}</h3>
        <p class="work-role">${currentLang === "zh" ? "角色" : "Role"}: ${role}</p>
        <p class="work-summary">${summary}</p>
        <div class="link-row">
          <a href="${item.links.wiki}" target="_blank" rel="noopener">${text("linkWiki")}</a>
          <a href="${item.links.imdb}" target="_blank" rel="noopener">${text("linkImdb")}</a>
          <a href="${item.links.douban}" target="_blank" rel="noopener">${text("linkDouban")}</a>
        </div>
      </div>
    `;

    return card;
  }

  function renderWorks(filter) {
    const mount = document.querySelector("#works-grid");
    if (!mount || !window.WORKS_DATA) return;

    mount.innerHTML = "";
    const data = filter && filter !== "all"
      ? window.WORKS_DATA.filter((item) => item.type === filter)
      : window.WORKS_DATA;

    data
      .slice()
      .sort((a, b) => a.year - b.year)
      .forEach((item) => mount.appendChild(createWorkCard(item)));
  }

  function renderFeatured() {
    const mount = document.querySelector("#featured-grid");
    if (!mount || !window.WORKS_DATA) return;

    const featuredIds = ["condor-heroes", "mulan", "tale-of-rose"];
    mount.innerHTML = "";
    window.WORKS_DATA
      .filter((item) => featuredIds.includes(item.id))
      .forEach((item) => mount.appendChild(createWorkCard(item)));
  }

  function renderGallery() {
    const mount = document.querySelector("#gallery-grid");
    if (!mount || !window.WORKS_DATA) return;

    mount.innerHTML = "";
    window.WORKS_DATA.forEach((item) => {
      const title = currentLang === "zh" ? item.titleZh : item.titleEn;
      const figure = document.createElement("figure");
      figure.className = "gallery-item";
      figure.innerHTML = `
        <img src="${item.poster}" alt="${title}" loading="lazy" referrerpolicy="no-referrer" />
        <figcaption>${title} (${item.year})</figcaption>
      `;
      mount.appendChild(figure);
    });
  }

  function setupFilterButtons() {
    const bar = document.querySelector("#works-filter");
    if (!bar) return;

    bar.innerHTML = "";
    const defs = [
      { key: "all", label: "filterAll" },
      { key: "tv", label: "filterTv" },
      { key: "film", label: "filterFilm" }
    ];

    defs.forEach((def, index) => {
      const btn = document.createElement("button");
      btn.className = "lang-switch";
      btn.textContent = text(def.label);
      if (index === 0) btn.style.borderColor = "rgba(228, 179, 90, 0.6)";
      btn.addEventListener("click", () => {
        bar.querySelectorAll("button").forEach((b) => {
          b.style.borderColor = "var(--line)";
        });
        btn.style.borderColor = "rgba(228, 179, 90, 0.6)";
        renderWorks(def.key);
      });
      bar.appendChild(btn);
    });
  }

  function repaint() {
    applyI18n();
    setupFilterButtons();
    renderWorks("all");
    renderFeatured();
    renderGallery();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const switchBtn = document.querySelector("#lang-switch");
    if (switchBtn) {
      switchBtn.addEventListener("click", () => {
        currentLang = currentLang === "zh" ? "en" : "zh";
        localStorage.setItem("liuyifei-lang", currentLang);
        repaint();
      });
    }

    repaint();
  });
})();
