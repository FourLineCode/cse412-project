import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MongoDB URI is not set in environment Variable");
}

const client = new MongoClient(uri);
export const db = client.db("student-advising");
