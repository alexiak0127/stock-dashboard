import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";
//charles Yao
//wishlist database operations
export async function GET() {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" });
    }
    const client = await clientPromise; // from alexia's mongodb utils to establish connection.
    const db = client.db("stock_dashboard");
    
    // get wishlist
    const wishlist = await db
      .collection("wishlists")
      .find({ userEmail: session.user.email })
      .toArray();

    return NextResponse.json({ wishlist });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch" });
  }
}
//add
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" });
    }
    const body = await request.json();
    const { ticker, name, region, currency } = body;

    if (!ticker) {
      return NextResponse.json({ error: "Ticker required" });
    }
    const client = await clientPromise;
    const db = client.db("stock_dashboard");

    // in wishlist?
    const existing = await db.collection("wishlists").findOne({
      userEmail: session.user.email,
      ticker: ticker,
    });

    if (existing) {
      return NextResponse.json({ error: "In wishlist" });
    }
    await db.collection("wishlists").insertOne({
      userEmail: session.user.email,
      ticker: ticker,
      name: name || ticker,
      region: region || "N/A",
      currency: currency || "USD",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add" });
  }
}
//delete, similar with add.
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" });
    }
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json({ error: "Ticker required" });
    }
    const client = await clientPromise;
    const db = client.db("stock_dashboard");

    await db.collection("wishlists").deleteOne({
      userEmail: session.user.email,
      ticker: ticker,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to remove" });
  }
}
