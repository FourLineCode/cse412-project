import type { NextApiRequest, NextApiResponse } from "next";
import { client, db } from "../../../server/mongodb/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const coursesColl = db.collection("courses");

  await client.connect();

  if (req.method === "GET") {
    const courses = await coursesColl.find().toArray();

    res.status(200).json({ courses });
  }
}
