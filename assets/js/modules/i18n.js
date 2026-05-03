export const SUPPORTED_LANGS = ["en", "it", "fr"];
export const DEFAULT_LANG = "en";
const STORAGE_KEY = "cheatsheet-lang";

let cachedUiStrings = null;

export function getStoredLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage unavailable (e.g. private browsing restrictions)
  }
  return DEFAULT_LANG;
}

export function setStoredLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore write failures
  }
}

export async function loadUiStrings() {
  if (cachedUiStrings) return cachedUiStrings;
  const response = await fetch("assets/data/ui.json");
  if (!response.ok) {
    throw new Error(`Failed to load UI strings: ${response.status}`);
  }
  cachedUiStrings = await response.json();
  return cachedUiStrings;
}

export function applyUiStrings(lang, allStrings) {
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
}

export function updateLangSwitcher(lang) {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });
}
