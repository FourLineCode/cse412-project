import { hash } from "argon2";
import type { NextApiRequest, NextApiResponse } from "next";
import { client, db } from "../../server/mongodb/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const usersColl = db.collection("users");

  await client.connect();

  if (req.method === "GET") {
    const users = await usersColl.find().toArray();

    res.status(200).json({ users });
  } else if (req.method === "POST") {
    const { role, username, id, password } = req.body;

    const user = {
      role,
      username,
      activated: role !== "student",
      password: await hash(password),
      [role === "student" ? "sid" : "email"]: id,
    };

    await usersColl.insertOne(user);

    res.status(200).json({ success: true });
  }

  client.close();
}
