import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri && process.env.NODE_ENV === "development") {
  throw new Error("Please add MONGODB_URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Make globalThis.cache for hot reload in dev
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    if (!uri) throw new Error("Please add MONGODB_URI to .env.local");
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  if (!uri) {
    // In production, we don't want to throw a top-level error that renders HTML.
    // We'll return a promise that rejects, which can be caught in the API route.
    clientPromise = Promise.reject(new Error("MONGODB_URI is not defined"));
  } else {
    client = new MongoClient(uri);
    clientPromise = client.connect();
  }
}

export default clientPromise;
