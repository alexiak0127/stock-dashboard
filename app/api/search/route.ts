//Ahemed's Code
import { NextResponse } from "next/server";
import { searchSymbols } from "../../../utils/alpha-vantage";

type RawMatch = {
  [key: string]: string;
};

type SearchResult = {
  symbol: string;
  name: string;
  region: string;
  currency: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";
//query would look like http://localhost:3000/api/search?q=AAPL
//so the it would search for AAPL
  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const raw = await searchSymbols(query.trim());    //it woulds call the SYMBOL_SEARCH
    const matches: RawMatch[] = raw?.bestMatches ?? [];

    const topMatches = matches.slice(0, 5); //limit it to 5 

    //for each match get relevant info (price fetched separately when modal opens)
    const results: SearchResult[] = topMatches.map((m) => {
      const symbol = m["1. symbol"];
      const name = m["2. name"];
      const region = m["4. region"];
      const currency = m["8. currency"];

      return { symbol, name, region, currency };
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" });
  }
}
