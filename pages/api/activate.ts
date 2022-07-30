import { hash, verify } from "argon2";
import type { NextApiRequest, NextApiResponse } from "next";
import { client, db } from "../../server/mongodb/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return;

  await client.connect();

  const { id, oldPassword, newPassword } = req.body;

  const users = db.collection("users");
  const user = await users.findOne({ sid: id, activated: false });

  if (!user) return res.status(404).json({ success: false, error: "User not found" });

  const verified = await verify(user.password, oldPassword);
  if (!verified) return res.status(400).json({ success: false, error: "Invalid password" });

  await users.updateOne(
    { sid: id },
    { $set: { activated: true, password: await hash(newPassword) } }
  );

  res.status(200).json({ success: true });
}
