import { loadCommandsData } from "./modules/data-loader.js";
import { renderCategories, renderTabs } from "./modules/render.js";
import { createAppState, filterCommands, countVisibleByCategory } from "./modules/state.js";
import { bindCopyButtons, bindKeyboardShortcuts, bindScrollToTop } from "./modules/interactions.js";
import { getStoredLang, setStoredLang, loadUiStrings, applyUiStrings, updateLangSwitcher } from "./modules/i18n.js";

const searchInput = document.getElementById("search");
const tabs = document.getElementById("tabs");
const grid = document.getElementById("grid");
const noResults = document.getElementById("no-results");
const noResQuery = document.getElementById("no-res-query");
const totalCount = document.getElementById("total-count");
const categoryCount = document.getElementById("category-count");
const scrollBtn = document.getElementById("scrollTop");
const langSwitcher = document.getElementById("lang-switcher");

// Mutable context — updated on every language change so closures always read current values
const ctx = { state: null, strings: null };

function applyCardAnimationDelays() {
  Array.from(document.querySelectorAll(".cmd-card")).forEach((card, index) => {
    card.style.animationDelay = `${Math.min(index * 18, 400)}ms`;
  });
}

function applyVisibility() {
  const { state, strings } = ctx;
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

async function switchLanguage(lang, allStrings) {
  let effectiveLang = lang;
  let data;
  try {
    data = await loadCommandsData(lang);
  } catch {
    data = await loadCommandsData("en");
    effectiveLang = "en";
  }

  const strings = allStrings[effectiveLang] ?? allStrings["en"];

  clearGrid();
  ctx.state = createAppState(data.categories);
  ctx.strings = strings;

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

  await switchLanguage(lang, allStrings);

  bindKeyboardShortcuts(searchInput);
  bindScrollToTop(scrollBtn);

  tabs.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab) return;
    ctx.state.activeCategory = tab.dataset.cat;
    renderTabs(tabs, ctx.state.categories, ctx.state.activeCategory, ctx.strings);
    applyVisibility();
  });

  searchInput.addEventListener("input", () => applyVisibility());

  langSwitcher.addEventListener("click", async (event) => {
    const btn = event.target.closest(".lang-btn");
    if (!btn) return;
    const newLang = btn.dataset.lang;
    if (btn.classList.contains("active")) return;

    // Disable the switcher for the duration of the async load to prevent race conditions
    const allBtns = langSwitcher.querySelectorAll(".lang-btn");
    allBtns.forEach((b) => { b.disabled = true; });

    try {
      setStoredLang(newLang);
      updateLangSwitcher(newLang);
      applyUiStrings(newLang, allStrings);
      const effectiveLang = await switchLanguage(newLang, allStrings);
      // If fetch failed and fell back to English, sync all UI state
      if (effectiveLang !== newLang) {
        setStoredLang(effectiveLang);
        updateLangSwitcher(effectiveLang);
        applyUiStrings(effectiveLang, allStrings);
      }
    } finally {
      allBtns.forEach((b) => { b.disabled = false; });
    }
  });
}

init().catch((error) => {
  console.error("Failed to initialize app:", error);
});
