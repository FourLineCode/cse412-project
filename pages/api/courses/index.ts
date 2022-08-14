import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { client, db } from "../../../server/mongodb/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const coursesColl = db.collection("courses");

  await client.connect();

  if (req.method === "GET") {
    const courses = await coursesColl.find().toArray();

    res.status(200).json({ courses });
  } else if (req.method === "POST") {
    const {
      code,
      title,
      credit,
      department,
      section,
      room,
      facultyUserId,
      maxSeats,
      takenSeats,
      creditRequired,
      prerequisite,
      classSlot,
      classStart,
      classEnd,
      hasLab,
      labSlot,
      labStart,
      labEnd,
    } = req.body;

    const course = {
      code,
      title,
      credit,
      department,
      section,
      room,
      facultyUserId: new ObjectId(facultyUserId),
      maxSeats,
      takenSeats,
      creditRequired,
      prerequisite,
      classSlot,
      classStart,
      classEnd,
      hasLab,
      labSlot,
      labStart,
      labEnd,
    };

    await coursesColl.insertOne(course);

    res.status(200).json({ success: true });
  } else if (req.method === "PUT") {
    const { id } = req.body;
    const _id = new ObjectId(id);

    const user = await coursesColl.findOne({ _id });
    if (!user) return res.status(404).json({ success: false, error: "Course not found" });

    delete req.body["id"];
    req.body.facultyUserId = new ObjectId(req.body.facultyUserId);
    await coursesColl.updateOne({ _id }, { $set: req.body });

    res.status(200).json({ success: true });
  } else if (req.method === "DELETE") {
    const { id } = req.body;
    const _id = new ObjectId(id);

    const user = await coursesColl.findOne({ _id });
    if (!user) return res.status(404).json({ success: false, error: "Course not found" });

    await coursesColl.deleteOne({ _id });

    res.status(200).json({ success: true });
  }
}
