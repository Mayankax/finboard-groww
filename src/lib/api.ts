export async function fetchApi(endpoint: string) {
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
