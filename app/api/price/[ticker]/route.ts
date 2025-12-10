// Alexia's code to fetch stock price data from Alpha Vantage API
import { NextResponse } from "next/server";
import { getTimeSeriesDaily } from "@/utils/alpha-vantage";

// API endpoint to fetch daily price data for a specific stock ticker
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    
    // Fetch daily time series data from Alpha Vantage API
    const data = await getTimeSeriesDaily(ticker.toUpperCase());
    const series = data["Time Series (Daily)"];

    if (!series) {
      return NextResponse.json({ error: "None available" });
    }

    // all dates and sort them - newest to oldest
    const dates = Object.keys(series).sort().reverse();
    
    // most recent trading day's data
    const latest = series[dates[0]];
    
    // previous trading day's data for comparison
    const prev = series[dates[1]];

    // closing prices as numbers
    const latestClose = parseFloat(latest["4. close"]);
    const prevClose = parseFloat(prev["4. close"]);
    
    // Calculate the price difference between latest and previous day
    const diff = latestClose - prevClose;

    return NextResponse.json({
      latestClose,           // Most recent closing price
      prevClose,             // Previous day's closing price
      diff,                  // Price change in dollars
      pct: (diff / prevClose) * 100,  // Percentage change
      high: parseFloat(latest["2. high"]),  // Today's high
      low: parseFloat(latest["3. low"]),    // Today's low
      latestDate: dates[0],  // Date of latest data
      
      // Chart data - last 60 days of closing prices - oldest to newest
      chartData: dates.slice(0, 60).reverse().map((d) => ({
        date: d,
        close: parseFloat(series[d]["4. close"]),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" });
  }
}