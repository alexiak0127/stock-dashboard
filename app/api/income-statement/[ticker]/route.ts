// Raymond Code Block Start
import { NextResponse } from "next/server";
import { getIncomeStatement } from "@/utils/alpha-vantage";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker } = await params;
    const data = await getIncomeStatement(ticker.toUpperCase());
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch income statement" });
  }
}
// Raymond Code Block End
