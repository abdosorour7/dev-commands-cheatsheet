export async function loadCommandsData() {
  const response = await fetch("assets/data/commands.json");
  if (!response.ok) {
    throw new Error(`Failed to load commands data: ${response.status}`);
  }
  return response.json();
}
