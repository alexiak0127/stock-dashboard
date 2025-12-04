const apiKeyEnv = process.env.ALPHA_VANTAGE_API_KEY;
let API_KEYS: string[] = [];
if (apiKeyEnv) {
  API_KEYS = apiKeyEnv.split(",");
}
const BASE_URL = "https://www.alphavantage.co/query";

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

export async function getCompanyOverview(ticker: string) {
  return fetchData("OVERVIEW", ticker);
}

export async function getTimeSeriesDaily(ticker: string) {
  return fetchData("TIME_SERIES_DAILY", ticker);
}

export async function getIncomeStatement(ticker: string) {
  return fetchData("INCOME_STATEMENT", ticker);
}

export async function getBalanceSheet(ticker: string) {
  return fetchData("BALANCE_SHEET", ticker);
}

export async function getCashFlow(ticker: string) {
  return fetchData("CASH_FLOW", ticker);
}

export async function getAllFinancialStatements(ticker: string) {
  const [incomeStatement, balanceSheet, cashFlow] = await Promise.all([
    getIncomeStatement(ticker),
    getBalanceSheet(ticker),
    getCashFlow(ticker),
  ]);

  return { incomeStatement, balanceSheet, cashFlow };
}

export async function searchSymbols(keywords: string) {
  return fetchSearch(keywords);
}
