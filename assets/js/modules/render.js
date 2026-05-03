function renderCategoryHeader(category, strings) {
  const cmdCountLabel = strings?.cmdCount ?? "commands";
  return `
    <div class="cat-header" data-cat="${category.key}">
      <div class="cat-icon" style="background:${hexToRgba(category.color, 0.1)};color:${category.color}">${category.icon}</div>
      <div class="cat-title" style="color:${category.color}">${category.title}</div>
      <div class="cat-line"></div>
      <div class="cat-count">${category.commands.length} ${cmdCountLabel}</div>
    </div>
  `;
}

function renderCommandCard(category, command, index, strings) {
  const dangerClass = command.danger ? " cmd-danger" : "";
  const copyTitle = strings?.copyTitle ?? "Copy";
  const copyLabel = strings?.copyLabel ?? "Copy command";
  return `
    <div
      class="cmd-card"
      data-id="${category.key}:${index}"
      data-cat="${category.key}"
      data-cmd="${command.command}"
      data-desc="${command.searchDescription}"
      style="--cat-color:${category.color}"
    >
      <div class="cmd-top">
        <div class="cmd-code">${command.codeHtml}</div>
        <button class="copy-btn" title="${copyTitle}" aria-label="${copyLabel}">⧉</button>
      </div>
      <div class="cmd-desc${dangerClass}">${command.descriptionHtml}</div>
    </div>
  `;
}

function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const bigint = Number.parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

export function renderCategories(gridElement, noResultsElement, categories, strings) {
  const markup = categories
    .map((category) => {
      const cards = category.commands
        .map((command, index) => renderCommandCard(category, command, index, strings))
        .join("");
      return `${renderCategoryHeader(category, strings)}${cards}`;
    })
    .join("");

  noResultsElement.insertAdjacentHTML("beforebegin", markup);
}

export function renderTabs(tabsElement, categories, activeCategory, strings) {
  const total = categories.reduce((sum, category) => sum + category.commands.length, 0);
  const tabAllLabel = strings?.tabAll ?? "All";
  const allClass = activeCategory === "all" ? "tab active" : "tab";
  const markup = [
    `<button class="${allClass}" data-cat="all">${tabAllLabel} <span class="count">${total}</span></button>`,
    ...categories.map((category) => {
      const tabClass = activeCategory === category.key ? "tab active" : "tab";
      return `<button class="${tabClass}" data-cat="${category.key}">${category.icon} ${category.title} <span class="count">${category.commands.length}</span></button>`;
    }),
  ].join("");

  tabsElement.innerHTML = markup;
}
