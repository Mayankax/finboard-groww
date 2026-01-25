const FINNHUB_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

export async function fetchApi(endpoint: string) {
  let finalUrl = endpoint;

  // 🔐 Auto-inject Finnhub API key
  if (
    endpoint.includes("finnhub.io/api") &&
    !endpoint.includes("token=")
  ) {
    if (!FINNHUB_KEY) {
      throw new Error("Missing Finnhub API key");
    }

    finalUrl =
      endpoint +
      (endpoint.includes("?") ? "&" : "?") +
      `token=${FINNHUB_KEY}`;
  }

  const response = await fetch(finalUrl);

  // 🚫 Rate limit
  if (response.status === 429) {
    throw new Error("RATE_LIMIT_EXCEEDED");
  }

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();

  // ✅ Normalize array of primitives (Finnhub peers, symbols, etc.)
  if (Array.isArray(data) && typeof data[0] !== "object") {
    return data.map((item) => ({ value: item }));
  }

  return data;
}
