(function (window) {
  const NS = (window.DevCheatsheet = window.DevCheatsheet || {});

  function cloneCommand(command) {
    return { ...command };
  }

  /** Collapses whitespace for stable string comparison (HTML + plain). */
  function normalizeComparable(value) {
    if (typeof value !== "string") return "";
    return value.replace(/\s+/g, " ").trim();
  }

  function mergeCategoryCommands(baseCategory, localizedCategory) {
    const localizedByCommand = new Map(
      localizedCategory.commands.map((command) => [command.command, command]),
    );

    return baseCategory.commands.map((baseCommand) => {
      const localizedCommand = localizedByCommand.get(baseCommand.command);
      if (localizedCommand) return cloneCommand(localizedCommand);
      return { ...cloneCommand(baseCommand), _fallback: "en" };
    });
  }

  function mergeWithEnglish(baseData, localizedData) {
    const localizedByCategory = new Map(
      localizedData.categories.map((category) => [category.key, category]),
    );

    const categories = baseData.categories.map((baseCategory) => {
      const localizedCategory = localizedByCategory.get(baseCategory.key);
      if (!localizedCategory) {
        return {
          ...baseCategory,
          commands: baseCategory.commands.map((command) => ({ ...cloneCommand(command), _fallback: "en" })),
        };
      }

      return {
        key: baseCategory.key,
        title: localizedCategory.title ?? baseCategory.title,
        icon: localizedCategory.icon ?? baseCategory.icon,
        color: localizedCategory.color ?? baseCategory.color,
        commands: mergeCategoryCommands(baseCategory, localizedCategory),
      };
    });

    return { categories };
  }

  /** Whole dataset is English because no locale file exists — badge every card for non-EN UI. */
  function tagAllCommandsAsEnglishFallback(data) {
    return {
      categories: data.categories.map((category) => ({
        ...category,
        commands: category.commands.map((command) => ({ ...cloneCommand(command), _fallback: "en" })),
      })),
    };
  }

  /**
   * After merge: keep explicit _fallback from merge, and add EN when description still matches English
   * (e.g. placeholder copy in a new locale file). Removes _fallback when description clearly differs.
   */
  function applyTranslationFallbackMarkers(baseData, mergedData) {
    const baseCatByKey = new Map(baseData.categories.map((c) => [c.key, c]));

    return {
      categories: mergedData.categories.map((mergedCat) => {
        const baseCat = baseCatByKey.get(mergedCat.key);
        if (!baseCat) {
          return {
            ...mergedCat,
            commands: mergedCat.commands.map((cmd) => ({ ...cloneCommand(cmd), _fallback: "en" })),
          };
        }

        const baseCmdByKey = new Map(baseCat.commands.map((c) => [c.command, c]));

        return {
          ...mergedCat,
          commands: mergedCat.commands.map((cmd) => {
            const baseCmd = baseCmdByKey.get(cmd.command);
            if (!baseCmd) {
              return { ...cloneCommand(cmd), _fallback: "en" };
            }

            const descMatchesEnglish =
              normalizeComparable(cmd.descriptionHtml) === normalizeComparable(baseCmd.descriptionHtml);

            const needsEnglishBadge = cmd._fallback === "en" || descMatchesEnglish;

            if (needsEnglishBadge) {
              return { ...cloneCommand(cmd), _fallback: "en" };
            }

            const { _fallback: _ignored, ...rest } = cloneCommand(cmd);
            return rest;
          }),
        };
      }),
    };
  }

  let cachedSectionsManifest = null;

  async function fetchSectionsManifest() {
    if (cachedSectionsManifest) return cachedSectionsManifest;
    const url = NS.paths.dataUrl("sections.json");
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load sections manifest: ${response.status}`);
    }
    const json = await response.json();
    cachedSectionsManifest = json.sections ?? [];
    return cachedSectionsManifest;
  }

  async function fetchSectionData(sectionKey, lang) {
    const url = NS.paths.dataUrl(`${sectionKey}.${lang}.json`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load section data (${sectionKey}/${lang}): ${response.status}`);
    }
    return response.json();
  }

  NS.dataLoader = {
    async loadSections() {
      return fetchSectionsManifest();
    },

    /**
     * @param {string} sectionKey
     * @param {string} [lang]
     */
    async loadSectionData(sectionKey, lang) {
      const effectiveLang = lang || "en";
      if (effectiveLang === "en") {
        return fetchSectionData(sectionKey, "en");
      }

      const [baseResult, localizedResult] = await Promise.allSettled([
        fetchSectionData(sectionKey, "en"),
        fetchSectionData(sectionKey, effectiveLang),
      ]);

      if (baseResult.status !== "fulfilled") {
        throw baseResult.reason;
      }

      const baseData = baseResult.value;

      if (localizedResult.status !== "fulfilled") {
        return tagAllCommandsAsEnglishFallback(baseData);
      }

      const merged = mergeWithEnglish(baseData, localizedResult.value);
      return applyTranslationFallbackMarkers(baseData, merged);
    },
  };
})(window);
