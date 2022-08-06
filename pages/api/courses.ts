import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { client, db } from "../../server/mongodb/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const coursesColl = db.collection("courses");

  await client.connect();

  if (req.method === "GET") {
    const courses = await coursesColl.find().toArray();

    res.status(200).json({ courses });
  } else if (req.method === "POST") {
    const {} = req.body;

    // TODO: add course
    const course = {};

    await coursesColl.insertOne(course);

    res.status(200).json({ success: true });
  } else if (req.method === "PUT") {
    const {} = req.body;

    // TODO: update course

    res.status(200).json({ success: true });
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    const _id = new ObjectId(id);

    const user = await coursesColl.findOne({ _id });
    if (!user) return res.status(404).json({ success: false, error: "Course not found" });

    await coursesColl.deleteOne({ _id });

    res.status(200).json({ success: true });
  }

  client.close();
}
