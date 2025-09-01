export async function fetchUrl(url) {
  const rawData = await fetch(url);
  return rawData.json();
}
