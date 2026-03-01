import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB || "portfolio";

type GlobalMongoCache = {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
};

const globalForMongo = globalThis as typeof globalThis & {
  _mongo?: GlobalMongoCache;
};

const cache = globalForMongo._mongo || { client: null, promise: null };

if (!globalForMongo._mongo) {
  globalForMongo._mongo = cache;
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!MONGODB_URI) {
    throw new Error("Missing required environment variable: MONGODB_URI");
  }

  if (cache.client) {
    return cache.client;
  }

  if (!cache.promise) {
    cache.promise = new MongoClient(MONGODB_URI as string).connect();
  }

  cache.client = await cache.promise;
  return cache.client;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(MONGODB_DB);
}
