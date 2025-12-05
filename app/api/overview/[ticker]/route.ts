import { NextResponse } from "next/server";
import { getCompanyOverview } from "@/utils/alpha-vantage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const data = await getCompanyOverview(ticker.toUpperCase());

    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data available" });
    }

    return NextResponse.json({
      name: data.Name,
      description: data.Description,
      sector: data.Sector,
      industry: data.Industry,
      marketCap: data.MarketCapitalization,
      peRatio: data.PERatio,
      dividendYield: data.DividendYield,
      eps: data.EPS,
      profitMargin: data.ProfitMargin,
      trailingPE: data.TrailingPE,
      forwardPE: data.ForwardPE,
      priceToSalesRatio: data.PriceToSalesRatioTTM,
      bookValue: data.BookValue,
      beta: data.Beta,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch overview data" });
  }
}
