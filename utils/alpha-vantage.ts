// Raymond Code Block Start
// Supports multiple API keys (comma-separated) for fallback when rate limits are hit
const apiKeyEnv = process.env.ALPHA_VANTAGE_API_KEY;
let API_KEYS: string[] = [];
if (apiKeyEnv) {
  API_KEYS = apiKeyEnv.split(",");
}
const BASE_URL = "https://www.alphavantage.co/query";

// Generic function to fetch Alpha Vantage data with automatic API key rotation
// Tries each API key until one succeeds or all fail (handles rate limits)
async function fetchData(functionName: string, symbol: string) {
  if (API_KEYS.length === 0) {
    throw new Error("ALPHA_VANTAGE_API_KEY is not set");
  }

  for (const apiKey of API_KEYS) {
    try {
      const url =
        BASE_URL +
        "?function=" +
        functionName +
        "&symbol=" +
        symbol.toUpperCase() +
        "&apikey=" +
        apiKey;

      const response = await fetch(url);
      const data = await response.json();

      // Skip if API returns error or rate limit message, try next key
      if (data["Error Message"] || data["Note"]) {
        continue;
      }

      return data;
    } catch (error) {
      continue;
    }
  }

  throw new Error("All API keys failed");
}

// Similar to fetchData but for symbol search (uses different API endpoint)
async function fetchSearch(keywords: string) {
  if (API_KEYS.length === 0) {
    throw new Error("ALPHA_VANTAGE_API_KEY is not set");
  }

  for (const apiKey of API_KEYS) {
    try {
      const url =
        BASE_URL +
        "?function=SYMBOL_SEARCH&keywords=" +
        encodeURIComponent(keywords) +
        "&apikey=" +
        apiKey;

      const response = await fetch(url);
      const data = await response.json();

      // Skip if API returns error or rate limit message, try next key
      if (data["Error Message"] || data["Note"]) {
        continue;
      }

      return data;
    } catch (error) {
      continue;
    }
  }

  throw new Error("All API keys failed");
}

// Exported API functions - wrapper functions for different Alpha Vantage endpoints
export async function getCompanyOverview(ticker: string) {
  return fetchData("OVERVIEW", ticker);
}

export async function getTimeSeriesDaily(ticker: string) {
  return fetchData("TIME_SERIES_DAILY", ticker);
}

export async function getIncomeStatement(ticker: string) {
  return fetchData("INCOME_STATEMENT", ticker);
}

export async function searchSymbols(keywords: string) {
  return fetchSearch(keywords);
}
// Raymond Code Block End