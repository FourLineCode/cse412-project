import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { client, db } from "../../../server/mongodb/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const usersColl = db.collection("users");

  await client.connect();

  if (req.method === "GET") {
    const id = req.query.id as string;
    const _id = new ObjectId(id);

    const user = await usersColl.findOne({ _id });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({ user });
  }
}
