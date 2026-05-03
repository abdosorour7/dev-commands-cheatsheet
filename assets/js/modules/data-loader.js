export async function loadCommandsData(lang = "en") {
  const response = await fetch(`assets/data/commands.${lang}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load commands data: ${response.status}`);
  }
  return response.json();
}
