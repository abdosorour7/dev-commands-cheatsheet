(function () {
  const CS = window.DevCheatsheet;
  if (!CS || !CS.paths || !CS.dataLoader || !CS.render || !CS.state || !CS.interactions || !CS.i18n) {
    console.error("DevCheatsheet: missing script modules. Load paths.js, state, interactions, render, data-loader, i18n before app.js.");
    return;
  }

  const { loadSections, loadSectionData } = CS.dataLoader;
  const {
    renderCategories,
    renderTabs,
    renderSectionPills,
    applySectionTheme,
    applyDocsLink,
  } = CS.render;
  const { createAppState, filterCommands, countVisibleByCategory } = CS.state;
  const { bindCopyButtons, bindKeyboardShortcuts, bindScrollToTop } = CS.interactions;
  const {
    getStoredLang,
    setStoredLang,
    loadUiStrings,
    applyUiStrings,
    updateLangSwitcher,
    getStoredSection,
    setStoredSection,
    DEFAULT_SECTION,
  } = CS.i18n;

  const searchInput = document.getElementById("search");
  const tabs = document.getElementById("tabs");
  const grid = document.getElementById("grid");
  const noResults = document.getElementById("no-results");
  const noResQuery = document.getElementById("no-res-query");
  const totalCount = document.getElementById("total-count");
  const categoryCount = document.getElementById("category-count");
  const scrollBtn = document.getElementById("scrollTop");
  const langSwitcher = document.getElementById("lang-switcher");
  const sectionsBar = document.getElementById("sections-bar");

  const ctx = {
    state: null,
    strings: null,
    sections: [],
    lang: "en",
  };

  function applyCardAnimationDelays() {
    Array.from(document.querySelectorAll(".cmd-card")).forEach((card, index) => {
      card.style.animationDelay = `${Math.min(index * 18, 400)}ms`;
    });
  }

  function applyVisibility() {
    const { state, strings } = ctx;
    if (!state?.categories) return;
    const query = searchInput.value;
    const results = filterCommands(state, query);
    const visibleByCategory = countVisibleByCategory(results.visibleCommands);

    Array.from(document.querySelectorAll(".cmd-card")).forEach((card) => {
      const shouldShow = results.visibleCommands.has(card.dataset.id);
      card.style.display = shouldShow ? "" : "none";
    });

    Array.from(document.querySelectorAll(".cat-header")).forEach((header) => {
      const key = header.dataset.cat;
      const shouldShow = (state.activeCategory === "all" || state.activeCategory === key) && (visibleByCategory.get(key) ?? 0) > 0;
      header.style.display = shouldShow ? "" : "none";
    });

    noResults.classList.toggle("show", results.visibleCommands.size === 0);
    if (results.visibleCommands.size === 0) {
      const noResultsTry = strings?.noResultsTry ?? "Try searching for something else — ";
      noResQuery.textContent = `${noResultsTry}"${query}"`;
    }
  }

  function clearGrid() {
    Array.from(grid.children).forEach((child) => {
      if (child !== noResults) child.remove();
    });
  }

  function findSection(sectionKey) {
    return ctx.sections.find((section) => section.key === sectionKey) ?? ctx.sections[0];
  }

  async function renderSection(sectionKey, lang, allStrings) {
    const section = findSection(sectionKey);
    let effectiveLang = lang;
    let data;

    try {
      data = await loadSectionData(section.key, lang);
    } catch {
      try {
        data = await loadSectionData(section.key, "en");
        effectiveLang = "en";
      } catch (err) {
        throw new Error(`Could not load "${section.key}" data: ${err?.message ?? err}`);
      }
    }

    if (!data?.categories || !Array.isArray(data.categories)) {
      throw new Error(`Invalid data for section "${section.key}" (missing categories).`);
    }

    const strings = allStrings[effectiveLang] ?? allStrings.en;

    clearGrid();
    ctx.state = createAppState({
      sections: ctx.sections,
      activeSection: section.key,
      categories: data.categories,
    });
    ctx.strings = strings;
    ctx.lang = effectiveLang;

    if (sectionsBar) {
      renderSectionPills(sectionsBar, ctx.sections, section.key);
    }
    applySectionTheme(section);
    applyDocsLink(section, strings);

    renderCategories(grid, noResults, data.categories, strings);
    renderTabs(tabs, data.categories, ctx.state.activeCategory, strings);
    totalCount.textContent = String(ctx.state.totalCommands);
    categoryCount.textContent = String(ctx.state.categories.length);

    bindCopyButtons();
    applyCardAnimationDelays();
    applyVisibility();

    return effectiveLang;
  }

  async function init() {
    const lang = getStoredLang();
    const allStrings = await loadUiStrings();

    applyUiStrings(lang, allStrings);
    updateLangSwitcher(lang);

    ctx.sections = await loadSections();
    if (!ctx.sections.length) {
      throw new Error("No sections available in sections.json");
    }

    let storedSection = getStoredSection();
    if (!ctx.sections.some((section) => section.key === storedSection)) {
      storedSection = ctx.sections[0]?.key ?? DEFAULT_SECTION;
    }

    await renderSection(storedSection, lang, allStrings);

    bindKeyboardShortcuts(searchInput);
    bindScrollToTop(scrollBtn);

    tabs.addEventListener("click", (event) => {
      const tab = event.target.closest(".tab");
      if (!tab) return;
      ctx.state.activeCategory = tab.dataset.cat;
      renderTabs(tabs, ctx.state.categories, ctx.state.activeCategory, ctx.strings);
      applyVisibility();
    });

    if (sectionsBar) {
      sectionsBar.addEventListener("click", async (event) => {
        const pill = event.target.closest(".section-pill");
        if (!pill) return;
        const sectionKey = pill.dataset.section;
        if (sectionKey === ctx.state.activeSection) return;

        sectionsBar.querySelectorAll(".section-pill").forEach((p) => {
          p.disabled = true;
        });

        try {
          setStoredSection(sectionKey);
          searchInput.value = "";
          await renderSection(sectionKey, ctx.lang, allStrings);
        } finally {
          sectionsBar.querySelectorAll(".section-pill").forEach((p) => {
            p.disabled = false;
          });
        }
      });
    }

    searchInput.addEventListener("input", () => applyVisibility());

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("./sw.js")
          .then(() => console.log("Service Worker registered"))
          .catch((err) => console.log("Service Worker registration failed", err));
      });
    }

    langSwitcher.addEventListener("click", async (event) => {
      const btn = event.target.closest(".lang-btn");
      if (!btn) return;
      const newLang = btn.dataset.lang;
      if (btn.classList.contains("active")) return;

      const allBtns = langSwitcher.querySelectorAll(".lang-btn");
      allBtns.forEach((b) => {
        b.disabled = true;
      });

      try {
        setStoredLang(newLang);
        updateLangSwitcher(newLang);
        applyUiStrings(newLang, allStrings);
        const effectiveLang = await renderSection(ctx.state.activeSection, newLang, allStrings);
        if (effectiveLang !== newLang) {
          setStoredLang(effectiveLang);
          updateLangSwitcher(effectiveLang);
          applyUiStrings(effectiveLang, allStrings);
        }
      } finally {
        allBtns.forEach((b) => {
          b.disabled = false;
        });
      }
    });
  }

  function showInitFailure(error) {
    console.error("Failed to initialize app:", error);
    const banner = document.getElementById("load-error");
    const detail = document.getElementById("load-error-detail");
    if (banner) {
      banner.hidden = false;
      if (detail) detail.textContent = error?.message ?? String(error);
    }
  }

  init().catch(showInitFailure);
})();
