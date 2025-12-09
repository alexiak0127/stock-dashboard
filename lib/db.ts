// MongoDB Connection by Alexia

import { MongoClient, Db, Collection } from "mongodb";

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable is undefined");
}

const DB_NAME = "stock-dashboard";
export const WATCHLIST_COLLECTION = "watchlists";

let client: MongoClient | null = null;
let db: Db | null = null;

async function connect(): Promise<Db> {
  // Only create if doesn't exist
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client.db(DB_NAME);
}

export default async function getCollection(
  collectionName: string,
): Promise<Collection> {
  // Connect to db if not connected
  if (!db) {
    db = await connect();
  }
  return db.collection(collectionName);
}
