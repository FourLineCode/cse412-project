import { ObjectId } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { client, db } from "../../../server/mongodb/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const advisingColl = db.collection("advising");
  const usersColl = db.collection("users");
  const coursesColl = db.collection("courses");

  await client.connect();

  if (req.method === "GET") {
    const id = req.query.id as string;
    const _id = new ObjectId(id);

    const advisings = await advisingColl.find({ studentId: _id }).toArray();

    return res.status(200).json({ advisings });
  } else if (req.method === "POST") {
    const { studentId, courseId } = req.body;
    const _studentId = new ObjectId(studentId);
    const _courseId = new ObjectId(courseId);

    const course = await coursesColl.findOne({ _id: _courseId });
    const student = await usersColl.findOne({ _id: _studentId });
    if (!course || !student) {
      return res.status(400).json({ success: false, message: "Invalid student or course!" });
    }

    const advisings = await advisingColl.find({ studentId: _studentId }).toArray();

    // TODO: check if same course already taken (course id or code)
    for (const advising of advisings) {
      if ((advising.courseId as ObjectId).toString() === courseId) {
        return res.status(400).json({ success: false, message: "Course already taken!" });
      }
      if (advising.course.code === course.code) {
        return res.status(400).json({ success: false, message: "Course already taken!" });
      }
    }

    // TODO: check if maximum credit of student exceeds
    const MAXIMUM_CREDIT = 15;
    const currCreditTaken = advisings.reduce((acc, ad) => acc + ad.course.credit, 0);
    if (currCreditTaken + course.credit > MAXIMUM_CREDIT) {
      return res
        .status(400)
        .json({ success: false, message: "Total credits exceeds maximum of 15!" });
    }

    // TODO: check if no seats left
    if (course.takenSeats + 1 > course.maxSeats) {
      return res.status(400).json({ success: false, message: "Section is full!" });
    }

    // TODO: check if student has required credit
    // TODO: check if student has done prereq course (pending)
    // TODO: check if class slot overlap
    // TODO: check if lab slot overlap

    await advisingColl.insertOne({
      course,
      studentId: _studentId,
      courseId: _courseId,
    });
    await coursesColl.updateOne(
      { _id: course._id },
      { $set: { takenSeats: course.takenSeats + 1 } }
    );

    return res.status(200).json({ success: true });
  } else if (req.method === "DELETE") {
    const id = req.query.id as string;
    const _id = new ObjectId(id);

    const advising = await advisingColl.findOne({ _id });
    if (!advising) {
      return res.status(400).json({ success: false, message: "Advising course not found!" });
    }
    const course = await coursesColl.findOne({ _id: advising.courseId });
    if (!course) {
      return res.status(400).json({ success: false, message: "Course not found!" });
    }

    await advisingColl.deleteOne({ _id });
    await coursesColl.updateOne(
      { _id: course._id },
      { $set: { takenSeats: Math.max(0, course.takenSeats - 1) } }
    );
    return res.status(200).json({ success: true });
  }
}
