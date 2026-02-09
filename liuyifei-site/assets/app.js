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
      typeFilm: "电影",
      roleLabel: "角色",
      sourceLabel: "来源",
      votesLabel: "评价人数",
      updateLink: "查看页面"
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
      typeFilm: "Film",
      roleLabel: "Role",
      sourceLabel: "Source",
      votesLabel: "Votes",
      updateLink: "Open"
    }
  };

  const savedLang = localStorage.getItem("liuyifei-lang");
  let currentLang = savedLang === "en" ? "en" : "zh";

  function text(key) {
    return i18n[currentLang][key] || key;
  }

  function getWorkById(id) {
    if (!window.WORKS_DATA) return null;
    return window.WORKS_DATA.find((item) => item.id === id) || null;
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
    card.className = "work-card reveal";
    card.dataset.type = item.type;
    card.setAttribute("data-reveal", "");

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
        <p class="work-role">${text("roleLabel")}: ${role}</p>
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
      figure.className = "gallery-item reveal";
      figure.setAttribute("data-reveal", "");
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
        setupReveal();
      });
      bar.appendChild(btn);
    });
  }

  function renderNews() {
    const mount = document.querySelector("#news-grid");
    if (!mount || !window.NEWS_FEED) return;

    mount.innerHTML = "";
    window.NEWS_FEED.forEach((item) => {
      const card = document.createElement("article");
      card.className = "news-card reveal";
      card.setAttribute("data-reveal", "");
      card.innerHTML = `
        <span class="news-date">${item.date}</span>
        <h3 class="news-title">${currentLang === "zh" ? item.titleZh : item.titleEn}</h3>
        <p class="news-summary">${currentLang === "zh" ? item.summaryZh : item.summaryEn}</p>
        <a class="news-link" href="${item.link}">${text("updateLink")} →</a>
      `;
      mount.appendChild(card);
    });
  }

  function renderRatingBars() {
    const mount = document.querySelector("#rating-bars");
    if (!mount || !window.RATING_SNAPSHOT) return;

    mount.innerHTML = "";
    const sorted = window.RATING_SNAPSHOT
      .slice()
      .sort((a, b) => b.rating - a.rating);

    sorted.forEach((row) => {
      const work = getWorkById(row.id);
      if (!work) return;

      const name = currentLang === "zh" ? work.titleZh : work.titleEn;
      const block = document.createElement("div");
      block.className = "metric-row";
      block.innerHTML = `
        <div class="metric-meta">
          <span class="metric-title">${name}</span>
          <span class="metric-value">${row.rating.toFixed(1)} / 10</span>
        </div>
        <div class="metric-track"><span class="metric-fill" data-width="${row.rating * 10}"></span></div>
        <p class="metric-sub">${text("sourceLabel")}: Douban Snapshot · ${text("votesLabel")}: ${row.votes.toLocaleString()}</p>
      `;
      mount.appendChild(block);
    });

    // Animate bars after layout paint.
    requestAnimationFrame(() => {
      mount.querySelectorAll(".metric-fill").forEach((el) => {
        el.style.width = `${el.getAttribute("data-width")}%`;
      });
    });
  }

  function renderAwards() {
    const mount = document.querySelector("#awards-timeline");
    if (!mount || !window.AWARD_MILESTONES) return;

    mount.innerHTML = "";
    window.AWARD_MILESTONES
      .slice()
      .sort((a, b) => a.year - b.year)
      .forEach((item) => {
        const node = document.createElement("article");
        node.className = "mini-item";
        node.innerHTML = `
          <h4>${item.year} · ${currentLang === "zh" ? item.titleZh : item.titleEn}</h4>
          <p>${currentLang === "zh" ? item.workZh : item.workEn}</p>
        `;
        mount.appendChild(node);
      });
  }

  function setupReveal() {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    nodes.forEach((node, index) => {
      node.style.transitionDelay = `${Math.min(index * 35, 280)}ms`;
      observer.observe(node);
    });
  }

  function setupParallax() {
    const moving = Array.from(document.querySelectorAll("[data-parallax]"));
    if (!moving.length || window.matchMedia("(max-width: 900px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onScroll = () => {
      const vh = window.innerHeight;
      moving.forEach((el) => {
        const speed = Number(el.getAttribute("data-parallax")) || 0;
        const rect = el.getBoundingClientRect();
        const progress = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
        const shift = progress * speed * -80;
        if (el.classList.contains("poster-focus")) {
          el.style.transform = `translateY(${shift.toFixed(2)}px)`;
        } else {
          el.style.transform = `translateY(${shift.toFixed(2)}px)`;
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setupPosterTilt() {
    const poster = document.querySelector(".poster-focus");
    if (!poster || window.matchMedia("(max-width: 900px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    poster.addEventListener("mousemove", (event) => {
      const rect = poster.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 10;
      const rotateX = (0.5 - y) * 8;
      poster.style.transform = `translateY(-2px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
    });

    poster.addEventListener("mouseleave", () => {
      poster.style.transform = "translateY(0) rotateX(0deg) rotateY(0deg)";
    });
  }

  function repaint() {
    applyI18n();
    setupFilterButtons();
    renderWorks("all");
    renderFeatured();
    renderGallery();
    renderNews();
    renderRatingBars();
    renderAwards();
    setupReveal();
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
    setupParallax();
    setupPosterTilt();
  });
})();
