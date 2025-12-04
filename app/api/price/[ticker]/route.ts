import { NextResponse } from "next/server";
import { getTimeSeriesDaily } from "@/utils/alpha-vantage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const data = await getTimeSeriesDaily(ticker.toUpperCase());
    const series = data["Time Series (Daily)"];

    if (!series) {
      return NextResponse.json({ error: "None available" });
    }

    const dates = Object.keys(series).sort().reverse();
    const latest = series[dates[0]];
    const prev = series[dates[1]];

    const latestClose = parseFloat(latest["4. close"]);
    const prevClose = parseFloat(prev["4. close"]);
    const diff = latestClose - prevClose;

    return NextResponse.json({
      latestClose,
      prevClose,
      diff,
      pct: (diff / prevClose) * 100,
      high: parseFloat(latest["2. high"]),
      low: parseFloat(latest["3. low"]),
      latestDate: dates[0],
      chartData: dates.slice(0, 60).reverse().map((d) => ({
        date: d,
        close: parseFloat(series[d]["4. close"]),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" });
  }
}
