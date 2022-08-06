import type { NextApiRequest, NextApiResponse } from "next";
import { client, db } from "../../server/mongodb/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const usersColl = db.collection("users");

  await client.connect();

  if (req.method === "GET") {
    const users = await usersColl.find({ role: "faculty" }).toArray();

    res.status(200).json({ faculties: users });
  }
}
