(function (w) {
  const SUPPORTED_LANGS = ["en", "it", "fr", "es"];
  const DEFAULT_LANG = "en";
  const DEFAULT_SECTION = "git";
  const STORAGE_KEY = "cheatsheet-lang";
  const SECTION_STORAGE_KEY = "cheatsheet-section";

  let cachedUiStrings = null;

  w.DevCheatsheet = w.DevCheatsheet || {};
  w.DevCheatsheet.i18n = {
    SUPPORTED_LANGS,
    DEFAULT_LANG,
    DEFAULT_SECTION,
    getStoredLang() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGS.includes(stored)) {
          return stored;
        }
      } catch {
        // localStorage unavailable
      }
      return DEFAULT_LANG;
    },
    setStoredLang(lang) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // ignore
      }
    },
    getStoredSection() {
      try {
        const stored = localStorage.getItem(SECTION_STORAGE_KEY);
        if (stored && typeof stored === "string") {
          return stored;
        }
      } catch {
        // ignore
      }
      return DEFAULT_SECTION;
    },
    setStoredSection(sectionKey) {
      try {
        localStorage.setItem(SECTION_STORAGE_KEY, sectionKey);
      } catch {
        // ignore
      }
    },
    async loadUiStrings() {
      if (cachedUiStrings) return cachedUiStrings;
      const url = w.DevCheatsheet.paths.dataUrl("ui.json");
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load UI strings: ${response.status}`);
      }
      cachedUiStrings = await response.json();
      return cachedUiStrings;
    },
    applyUiStrings(lang, allStrings) {
      const effectiveLang = allStrings[lang] ? lang : DEFAULT_LANG;
      const strings = allStrings[effectiveLang];

      document.documentElement.lang = effectiveLang;

      if (strings.pageTitle) {
        document.title = strings.pageTitle;
      }
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && strings.pageDescription) {
        metaDesc.setAttribute("content", strings.pageDescription);
      }

      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        if (key in strings) {
          el.textContent = strings[key];
        }
      });

      document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.dataset.i18nPlaceholder;
        if (key in strings) {
          el.placeholder = strings[key];
        }
      });

      document.querySelectorAll("[data-i18n-title]").forEach((el) => {
        const key = el.dataset.i18nTitle;
        if (key in strings) {
          el.title = strings[key];
        }
      });

      document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
        const key = el.dataset.i18nAriaLabel;
        if (key in strings) {
          el.setAttribute("aria-label", strings[key]);
        }
      });
    },
    updateLangSwitcher(lang) {
      document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
        btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
      });
    },
  };
})(window);
