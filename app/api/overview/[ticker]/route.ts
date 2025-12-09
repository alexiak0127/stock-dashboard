import { NextResponse } from "next/server";
import { getCompanyOverview } from "@/utils/alpha-vantage";
//Charles Yao
//Since We are making multiple api calls, and the format is fairly, so I reused the teammates' framework for search and price
//The fact thtat the whole overview, price, search, and financial statement is conditionaly rederended after API call
//The reason everything is conditionaly rendered is because the stock data is pretty time sensitive
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const data = await getCompanyOverview(ticker.toUpperCase());
    //no data
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No data available" });
    }
    //instead of making a seperate .ts type, I just get them all fetch with nextresponse, which is actually pretty convenient so i dont need to create a seperate file
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
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch overview data" });
  }
}
