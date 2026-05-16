(function (window) {
  const NS = (window.DevCheatsheet = window.DevCheatsheet || {});

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function hexToRgba(hex, alpha) {
    const value = hex.replace("#", "");
    const bigint = Number.parseInt(value, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function sanitizeHex(color, fallback) {
    if (typeof color !== "string") return fallback;
    const t = color.trim();
    return /^#[0-9A-Fa-f]{6}$/.test(t) ? t : fallback;
  }

  function renderCategoryHeader(category, strings) {
    const cmdCountLabel = strings?.cmdCount ?? "commands";
    const safeColor = sanitizeHex(category.color, "#00ff9d");
    return `
    <div class="cat-header" data-cat="${escapeAttr(category.key)}">
      <div class="cat-icon" style="background:${hexToRgba(safeColor, 0.1)};color:${safeColor}">${category.icon}</div>
      <div class="cat-title" style="color:${safeColor}">${escapeAttr(category.title)}</div>
      <div class="cat-line"></div>
      <div class="cat-count">${category.commands.length} ${cmdCountLabel}</div>
    </div>
  `;
  }

  function renderCommandCard(category, command, index, strings) {
    const dangerClass = command.danger ? " cmd-danger" : "";
    const copyTitle = strings?.copyTitle ?? "Copy";
    const copyLabel = strings?.copyLabel ?? "Copy command";
    const fallbackBadge = strings?.fallbackBadge ?? "EN";
    const fallbackTitle = strings?.fallbackTitle ?? "Not translated yet - shown in English";
    const fallbackMarkup = command._fallback === "en"
      ? `<span class="cmd-fallback-badge" title="${escapeAttr(fallbackTitle)}" aria-label="${escapeAttr(fallbackTitle)}">${fallbackBadge}</span>`
      : "";
    return `
    <div
      class="cmd-card"
      data-id="${category.key}:${index}"
      data-cat="${escapeAttr(category.key)}"
      data-cmd="${escapeAttr(command.command)}"
      data-desc="${escapeAttr(command.searchDescription)}"
      style="--cat-color:${sanitizeHex(category.color, "#00ff9d")}"
    >
      <div class="cmd-top">
        <div class="cmd-code">${command.codeHtml}</div>
        ${fallbackMarkup}
        <button class="copy-btn" title="${escapeAttr(copyTitle)}" aria-label="${escapeAttr(copyLabel)}">⧉</button>
      </div>
      <div class="cmd-desc${dangerClass}">${command.descriptionHtml}</div>
    </div>
  `;
  }

  function sectionLogoMarkup(section) {
    const paths = NS.paths;
    if (!paths || !section.logo) return "";

    const src = paths.assetUrl(section.logo);
    if (!src) return "";

    return `<img class="section-pill-logo" src="${escapeAttr(src)}" alt="" width="22" height="22" decoding="async" loading="lazy" aria-hidden="true" />`;
  }

  NS.render = {
    renderCategories(gridElement, noResultsElement, categories, strings) {
      const markup = categories
        .map((category) => {
          const cards = category.commands
            .map((command, index) => renderCommandCard(category, command, index, strings))
            .join("");
          return `${renderCategoryHeader(category, strings)}${cards}`;
        })
        .join("");

      noResultsElement.insertAdjacentHTML("beforebegin", markup);
    },

    renderTabs(tabsElement, categories, activeCategory, strings) {
      const total = categories.reduce((sum, category) => sum + category.commands.length, 0);
      const tabAllLabel = strings?.tabAll ?? "All";
      const allClass = activeCategory === "all" ? "tab active" : "tab";
      const markup = [
        `<button type="button" class="${allClass}" data-cat="all">${tabAllLabel} <span class="count">${total}</span></button>`,
        ...categories.map((category) => {
          const tabClass = activeCategory === category.key ? "tab active" : "tab";
          return `<button type="button" class="${tabClass}" data-cat="${escapeAttr(category.key)}">${category.icon} ${escapeAttr(category.title)} <span class="count">${category.commands.length}</span></button>`;
        }),
      ].join("");

      tabsElement.innerHTML = markup;
    },

    renderSectionPills(sectionsElement, sections, activeSectionKey) {
      const markup = sections
        .map((section) => {
          const isActive = section.key === activeSectionKey;
          const activeClass = isActive ? " active" : "";
          const safeColor = sanitizeHex(section.color, "#00ff9d");
          const style = `--sec-color:${safeColor}`;
          const logo = sectionLogoMarkup(section);
          return `
        <button
          type="button"
          class="section-pill${activeClass}"
          data-section="${escapeAttr(section.key)}"
          style="${style}"
          aria-pressed="${isActive}"
          aria-label="${escapeAttr(section.title || section.key)}"
        >
          ${logo}
          <span class="section-pill-label">${escapeAttr(section.title || section.key)}</span>
        </button>
      `;
        })
        .join("");

      sectionsElement.innerHTML = markup;
    },

    applySectionTheme(section) {
      if (!section) return;
      const safeColor = sanitizeHex(section.color, "#00ff9d");
      document.documentElement.style.setProperty("--section-color", safeColor);

      const accentEl = document.getElementById("h1-section");
      if (accentEl) {
        accentEl.textContent = section.title;
        accentEl.style.color = safeColor;
      }

      const themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", "#0a0e17");
      }
    },

    applyDocsLink(section, strings) {
      const docsLink = document.getElementById("footer-docs-link");
      if (!docsLink) return;
      docsLink.href = section.docsUrl ?? "#";
      const labelKey = section.docsLabelKey;
      const fallbackLabel = strings?.footerDocs ?? "Official Docs";
      const label = labelKey && strings && labelKey in strings ? strings[labelKey] : fallbackLabel;
      docsLink.textContent = label;
    },
  };
})(window);
