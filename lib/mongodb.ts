//  * MongoDB Client Promise provides a MongoDB client connection for NextAuth's MongoDBAdapter - Alexia
 
import { MongoClient } from "mongodb";

// Validate env variable
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

const uri = process.env.MONGO_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  // Create new connection if doesn't exist
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // create fresh connection
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
