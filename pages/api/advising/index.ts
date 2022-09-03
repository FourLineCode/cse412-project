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

    // Check if same course already taken (course id or code)
    for (const advising of advisings) {
      if ((advising.courseId as ObjectId).toString() === courseId) {
        return res.status(400).json({ success: false, message: "Course already taken!" });
      }
      if (advising.course.code === course.code) {
        return res.status(400).json({ success: false, message: "Course already taken!" });
      }
    }

    // Check if maximum credit of student exceeds
    const MAXIMUM_CREDIT = 15;
    const currCreditTaken = advisings.reduce((acc, ad) => acc + ad.course.credit, 0);
    if (currCreditTaken + course.credit > MAXIMUM_CREDIT) {
      return res
        .status(400)
        .json({ success: false, message: "Total credits exceeds maximum of 15!" });
    }

    // Check if no seats left
    if (course.takenSeats + 1 > course.maxSeats) {
      return res.status(400).json({ success: false, message: "Section is full!" });
    }

    // Check if student has required credit
    if (student.completedCredit < course.creditRequired) {
      return res.status(400).json({
        success: false,
        message: `Minimum of ${course.creditRequired} credit is required to take this course!`,
      });
    }

    // TODO: check if student has done prereq course (pending)

    // Utils
    const haveCommon = (str1: string, str2: string) => {
      for (const c of str1.split("")) {
        if (str2.includes(c)) return true;
      }
      return false;
    };

    const commonChars = (str1: string, str2: string) => {
      const commons = [];
      for (const c of str1.split("")) {
        if (str2.includes(c)) commons.push(c);
      }
      return commons.join("");
    };

    const rangesOverlap = (range1: number[], range2: number[]) => {
      if (range1.length !== 2 || range2.length !== 2) return true;
      return Math.max(range1[0], range2[0]) <= Math.min(range1[1], range2[1]);
    };

    // Check if class slot overlap
    const courseSlot = course.classSlot;
    for (const adv of advisings) {
      const advCourse = adv.course;
      // Check if 2 class times overlap
      if (
        haveCommon(courseSlot, advCourse.classSlot) &&
        course.classStart === advCourse.classStart
      ) {
        return res.status(400).json({
          success: false,
          message: `Class time conflicts with ${advCourse.code} on slot ${commonChars(
            courseSlot,
            advCourse.classSlot
          )} ${course.classStart} - ${course.classEnd}`,
        });
      }

      // Check if class time overlap with lab time
      if (advCourse.hasLab && courseSlot.includes(advCourse.labSlot)) {
        const range1 = [
          Number(course.classStart.split(":").join("")),
          Number(course.classEnd.split(":").join("")),
        ];
        const range2 = [
          Number(advCourse.labStart.split(":").join("")),
          Number(advCourse.labEnd.split(":").join("")),
        ];

        if (rangesOverlap(range1, range2)) {
          return res.status(400).json({
            success: false,
            message: `Class time conflicts with ${advCourse.code} on slot ${advCourse.labSlot} ${advCourse.labStart} - ${advCourse.labEnd}`,
          });
        }
      }
    }

    // TODO: check if lab slot overlap
    if (course.hasLab) {
      const labSlot = course.labSlot;
      for (const adv of advisings) {
        const advCourse = adv.course;
        // Check if lab time overlap with class time
        if (advCourse.classSlot.includes(labSlot)) {
          const range1 = [
            Number(course.labStart.split(":").join("")),
            Number(course.labEnd.split(":").join("")),
          ];
          const range2 = [
            Number(advCourse.classStart.split(":").join("")),
            Number(advCourse.classEnd.split(":").join("")),
          ];

          if (rangesOverlap(range1, range2)) {
            return res.status(400).json({
              success: false,
              message: `Lab time conflicts with ${advCourse.code} on slot ${commonChars(
                advCourse.classSlot,
                labSlot
              )} ${advCourse.classStart} - ${advCourse.classEnd}`,
            });
          }
        }

        // Check if 2 lab times overlap
        if (labSlot === advCourse.labSlot && course.labStart === advCourse.labStart) {
          return res.status(400).json({
            success: false,
            message: `Lab time conflicts with ${advCourse.code} on slot ${labSlot} ${course.labStart} - ${course.labEnd}`,
          });
        }
      }
    }

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

/*

ST
MW
TR
SR

830 - 1000
1010 - 1140
1150 - 120
130 - 300
310 - 440
450 - 620



S
M
T
W
R

800 - 1000
1010 - 1210
130 - 330
450 - 650

*/
