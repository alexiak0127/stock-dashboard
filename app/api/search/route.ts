import { NextResponse } from "next/server";
import {
  searchSymbols,
  getTimeSeriesDaily,
} from "../../../utils/alpha-vantage";

type RawMatch = {
  [key: string]: string;
};

type SearchResult = {
  symbol: string;
  name: string;
  region: string;
  currency: string;
  price: number | null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const raw = await searchSymbols(query.trim());
    const matches: RawMatch[] = raw?.bestMatches ?? [];

    const topMatches = matches.slice(0, 5);

    const results: SearchResult[] = await Promise.all(
      topMatches.map(async (m) => {
        const symbol = m["1. symbol"];
        const name = m["2. name"];
        const region = m["4. region"];
        const currency = m["8. currency"];

        let price: number | null = null;

        try {
          const ts = await getTimeSeriesDaily(symbol);
          const series = ts["Time Series (Daily)"];
          const latestDate = Object.keys(series)[0];
          const latest = series[latestDate];
          price = parseFloat(latest["4. close"]);
        } catch {
          price = null;
        }

        return { symbol, name, region, currency, price };
      })
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" });
  }
}
