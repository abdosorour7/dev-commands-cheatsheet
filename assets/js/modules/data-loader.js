function cloneCommand(command) {
  return { ...command };
}

function mergeCategoryCommands(baseCategory, localizedCategory) {
  const localizedByCommand = new Map(
    localizedCategory.commands.map((command) => [command.command, command]),
  );

  return baseCategory.commands.map((baseCommand) => {
    const localizedCommand = localizedByCommand.get(baseCommand.command);
    if (localizedCommand) return { ...cloneCommand(baseCommand), ...cloneCommand(localizedCommand) };
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

async function fetchCommandsData(lang) {
  const response = await fetch(`assets/data/commands.${lang}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load commands data (${lang}): ${response.status}`);
  }
  return response.json();
}

export async function loadCommandsData(lang = "en") {
  if (lang === "en") {
    return fetchCommandsData("en");
  }

  const [baseResult, localizedResult] = await Promise.allSettled([
    fetchCommandsData("en"),
    fetchCommandsData(lang),
  ]);

  if (baseResult.status !== "fulfilled") {
    throw baseResult.reason;
  }

  if (localizedResult.status !== "fulfilled") {
    return baseResult.value;
  }

  return mergeWithEnglish(baseResult.value, localizedResult.value);
}
