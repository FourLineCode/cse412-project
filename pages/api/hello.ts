import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../server/mongodb/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await db.collection("test").findOne({});

  res.status(200).json(data);
}
