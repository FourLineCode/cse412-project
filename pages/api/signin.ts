import { verify } from "argon2";
import { Document, WithId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../server/mongodb/client";
import { UserRole } from "../../server/types/User";
import { generateToken } from "../../server/utils/token";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return;

  const { email, id, password } = req.body;

  let user: WithId<Document> | null = null;

  const users = db.collection("users");
  if (email) {
    user = await users.findOne({ email });
  } else if (id) {
    user = await users.findOne({ sid: id });
  }

  if (!user) return res.status(404).json({ success: false, error: "User not found" });

  const verified = await verify(user.password, password);
  if (!verified) return res.status(400).json({ success: false, error: "Invalid password" });

  const token = generateToken({ userId: user._id, role: user.role as UserRole });

  res.status(200).json({ success: true, token, user });
}
