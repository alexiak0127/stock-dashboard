// Top Movers by Alexia Kim
// API endpoint to fetch top movers using Alpha Vantage's TOP_GAINERS_LOSERS function
// https://www.alphavantage.co/documentation/ explains this function
// This endpoint provides real market data for biggest movers without needing to query all stocks
import { NextResponse } from "next/server";

const BASE_URL = "https://www.alphavantage.co/query";
const apiKeyEnv = process.env.ALPHA_VANTAGE_API_KEY;
let API_KEYS: string[] = [];
if (apiKeyEnv) {
  API_KEYS = apiKeyEnv.split(",");
}

export async function GET() {
  try {
    if (API_KEYS.length === 0) {
      throw new Error("ALPHA_VANTAGE_API_KEY is not set");
    }

    for (const apiKey of API_KEYS) {
      try {
        // Use Alpha Vantage's TOP_GAINERS_LOSERS function to get real market movers
        const url = `${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();

        // Check for errors
        if (data["Error Message"] || data["Note"]) {
          continue;
        }

        // Extract top gainers and losers from the response
        const topGainers = data.top_gainers || [];
        const topLosers = data.top_losers || [];

        if (topGainers.length === 0 && topLosers.length === 0) {
          continue;
        }

        // Combine gainers and losers, then sort by absolute change percentage
        const allMovers = [
          ...topGainers.map((stock: any) => {
            const changeNum = parseFloat(stock.change_percentage.replace('%', ''));
            return {
              ticker: stock.ticker,
              change: changeNum,
              // Make sure positive changes have the plus sign for proper color coding
              changeFormatted: changeNum >= 0 ? `+${changeNum.toFixed(2)}%` : `${changeNum.toFixed(2)}%`
            };
          }),
          ...topLosers.map((stock: any) => {
            const changeNum = parseFloat(stock.change_percentage.replace('%', ''));
            return {
              ticker: stock.ticker,
              change: changeNum,
              // Make sure proper formatting with sign
              changeFormatted: changeNum >= 0 ? `+${changeNum.toFixed(2)}%` : `${changeNum.toFixed(2)}%`
            };
          })
        ];

        // Sort by absolute percentage change to get biggest movers overall
        const topMovers = allMovers
          .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
          .slice(0, 5) // Get top 5 biggest movers
          .map((m) => ({
            ticker: m.ticker,
            change: m.changeFormatted
          }));

        return NextResponse.json({ movers: topMovers });
      } catch (error) {
        console.error(`API key failed:`, error);
        continue;
      }
    }

    return NextResponse.json({ 
      error: "All API keys exhausted or rate limited" 
    }, { status: 503 });
    
  } catch (error) {
    console.error("Top movers error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch top movers" 
    }, { status: 500 });
  }
}
