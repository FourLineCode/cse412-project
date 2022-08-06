import { hash } from "argon2";
import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { client, db } from "../../server/mongodb/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const usersColl = db.collection("users");

  await client.connect();

  if (req.method === "GET") {
    const users = await usersColl.find().toArray();

    res.status(200).json({ users });
  } else if (req.method === "POST") {
    const { role, username, id, password, department } = req.body;

    const user = {
      role,
      username,
      activated: role !== "student",
      password: await hash(password),
      [role === "student" ? "sid" : "email"]: id,
      ...(role === "student" ? { department, completedCredit: 0, grade: 0 } : {}),
    };

    await usersColl.insertOne(user);

    res.status(200).json({ success: true });
  } else if (req.method === "PUT") {
    const { id } = req.body;
    const _id = new ObjectId(id);

    const user = await usersColl.findOne({ _id });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    delete req.body["id"];
    await usersColl.updateOne({ _id }, { $set: req.body });

    res.status(200).json({ success: true });
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    const _id = new ObjectId(id);

    const user = await usersColl.findOne({ _id });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    await usersColl.deleteOne({ _id });

    res.status(200).json({ success: true });
  }

  client.close();
}
