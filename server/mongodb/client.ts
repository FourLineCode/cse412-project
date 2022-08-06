import { config } from "dotenv";
import { MongoClient } from "mongodb";

config();

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MongoDB URI is not set in environment Variable");
}

export const client = new MongoClient(uri);
export const db = client.db("advising");
