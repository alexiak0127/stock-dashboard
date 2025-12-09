import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import clientPromise from "@/lib/mongodb";

// Charles Yao
// Wishlist API route, does GET, POST, and DELETE operations @mongodb for user wishlists functionality
// we used NextResponse.json() as it is for converting data to JSON format from our APIs json returns, more convenient than res.json(), 

//GET /api/wishlist
// show all stocks in the logged-in user wishlist from MongoDB
export async function GET() {
  try {
    // verify user is logged in
    const session = await auth();

    // error if not logged in
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    // connect to MongoDB database
    const client = await clientPromise; // From Alexia's mongodb utils
    const db = client.db("stock_dashboard");

    // query the wishlists collection for all stocks saved by the user with their email
    const wishlist = await db
      .collection("wishlists")
      .find({ userEmail: session.user.email })
      .toArray();

    // return the wishlist data as JSON
    return NextResponse.json({ wishlist });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" });
  }
}

//POST /api/wishlist
//Adds a new stock to the user's wishlist in MongoDB, with parems { ticker, name, region, currency }
export async function POST(request: NextRequest) {
  try {
    //verify log in
    const session = await auth();

    // error if not logged in
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    // break down body for the parems we are looking for
    const body = await request.json();
    const { ticker, name, region, currency } = body;

    // connect to mongodb
    const client = await clientPromise;
    const db = client.db("stock_dashboard");

    // in wishlist? check
    const existing = await db.collection("wishlists").findOne({
      userEmail: session.user.email,
      ticker: ticker,
    });
    if (existing) {
      return NextResponse.json({ error: "In wishlist" });
    } //returns error if in wishlist

    // new stock inserted to db, connect to user via user email
    await db.collection("wishlists").insertOne({
      userEmail: session.user.email,
      ticker: ticker,
      name: name || ticker, // use ticker name if name not provided
      region: region || "N/A", //default N/A if no region
      currency: currency || "USD", // default USD if no currency
    });

    // json response
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to add" });
  }
}

//DELETE/api/wishlist?ticker=xxx
//remove a stock from a the user's wishlist in Mongodb, with parems { ticker }
export async function DELETE(request: NextRequest) {
  try {
    // verify log in
    const session = await auth();

    // error if not logged in
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" });
    }

    // use ticker from query params to identify stock to remove
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    // Validate ticker symbol
    if (!ticker) {
      return NextResponse.json({ error: "Ticker required" });
    }

    // Connect to MongoDB database, from Alexia's mongodb utils
    const client = await clientPromise;
    const db = client.db("stock_dashboard");

    // Delete the stock from the user's wishlist mathing both userEmail and ticker
    await db.collection("wishlists").deleteOne({
      userEmail: session.user.email,
      ticker: ticker,
    });

    // return response with success message, if successfully deleted
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove" });
  }
}
