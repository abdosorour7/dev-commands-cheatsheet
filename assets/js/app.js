import { loadCommandsData } from "./modules/data-loader.js";
import { renderCategories, renderTabs } from "./modules/render.js";
import { createAppState, filterCommands, countVisibleByCategory } from "./modules/state.js";
import { bindCopyButtons, bindKeyboardShortcuts, bindScrollToTop } from "./modules/interactions.js";

const searchInput = document.getElementById("search");
const tabs = document.getElementById("tabs");
const grid = document.getElementById("grid");
const noResults = document.getElementById("no-results");
const noResQuery = document.getElementById("no-res-query");
const totalCount = document.getElementById("total-count");
const categoryCount = document.getElementById("category-count");
const scrollBtn = document.getElementById("scrollTop");

function applyCardAnimationDelays() {
  Array.from(document.querySelectorAll(".cmd-card")).forEach((card, index) => {
    card.style.animationDelay = `${Math.min(index * 18, 400)}ms`;
  });
}

function applyVisibility(state) {
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
    noResQuery.textContent = `Try searching for something else — "${query}"`;
  }
}

async function init() {
  const data = await loadCommandsData();
  const state = createAppState(data.categories);

  renderCategories(grid, noResults, data.categories);
  renderTabs(tabs, data.categories, state.activeCategory);
  totalCount.textContent = String(state.totalCommands);
  categoryCount.textContent = String(state.categories.length);

  bindCopyButtons();
  bindKeyboardShortcuts(searchInput);
  bindScrollToTop(scrollBtn);
  applyCardAnimationDelays();
  applyVisibility(state);

  tabs.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (!tab) return;
    state.activeCategory = tab.dataset.cat;
    renderTabs(tabs, data.categories, state.activeCategory);
    applyVisibility(state);
  });

  searchInput.addEventListener("input", () => applyVisibility(state));
}

init().catch((error) => {
  console.error("Failed to initialize app:", error);
});
