import { hash } from "argon2";
import { client, db } from "./client";

async function seed() {
  await client.connect();

  const users = db.collection("users");
  const courses = db.collection("courses");
  const user = await users.findOne({});

  if (user) return client.close();

  const passwordHash = await hash("root");

  const insertedUsers = await users.insertMany([
    {
      username: "Admin User",
      email: "root@root.com",
      password: passwordHash,
      role: "admin",
      activated: true,
    },
    {
      username: "Faculty User",
      email: "faculty@root.com",
      password: passwordHash,
      role: "faculty",
      activated: true,
    },
    {
      username: "Student User",
      sid: "2222-2-22-222",
      password: passwordHash,
      role: "student",
      activated: true,
      department: "cse",
      completedCredit: 140,
      grade: 4.0,
    },
    {
      username: "CSE Faculty #1",
      email: "faculty1@root.com",
      password: passwordHash,
      role: "faculty",
      activated: true,
    },
    {
      username: "CSE Faculty #2",
      email: "faculty2@root.com",
      password: passwordHash,
      role: "faculty",
      activated: true,
    },
    {
      username: "ENG Faculty #1",
      email: "faculty3@root.com",
      password: passwordHash,
      role: "faculty",
      activated: true,
    },
    {
      username: "MPS Faculty #1",
      email: "faculty4@root.com",
      password: passwordHash,
      role: "faculty",
      activated: true,
    },
    {
      username: "Test Student #1",
      sid: "2222-2-22-223",
      password: passwordHash,
      role: "student",
      activated: true,
      department: "cse",
      completedCredit: 46,
      grade: 3.86,
    },
    {
      username: "Test Student #2",
      sid: "2222-2-22-224",
      password: passwordHash,
      role: "student",
      activated: true,
      department: "bba",
      completedCredit: 12,
      grade: 3.59,
    },
  ]);

  await courses.insertMany([
    {
      code: "CSE103",
      title: "Structured Programming",
      credit: 4.5,
      department: "cse",
      section: 1,
      room: 102,
      facultyUserId: insertedUsers.insertedIds[3],
      maxSeats: 30,
      takenSeats: 0,
      creditRequired: 0,
      prerequisite: null,
      classSlot: "MW",
      classStart: "8:30",
      classEnd: "10:00",
      hasLab: true,
      labSlot: "M",
      labStart: "1:30",
      labEnd: "3:30",
    },
    {
      code: "CSE103",
      title: "Structured Programming",
      credit: 4.5,
      department: "cse",
      section: 2,
      room: 108,
      facultyUserId: insertedUsers.insertedIds[3],
      maxSeats: 30,
      takenSeats: 0,
      creditRequired: 0,
      prerequisite: null,
      classSlot: "TR",
      classStart: "11:50",
      classEnd: "1:20",
      hasLab: true,
      labSlot: "R",
      labStart: "10:10",
      labEnd: "12:10",
    },
    {
      code: "CSE110",
      title: "Object Oriented Programming",
      credit: 4.5,
      department: "cse",
      section: 1,
      room: 104,
      facultyUserId: insertedUsers.insertedIds[4],
      maxSeats: 30,
      takenSeats: 0,
      creditRequired: 0,
      prerequisite: "CSE103",
      classSlot: "ST",
      classStart: "10:10",
      classEnd: "11:40",
      hasLab: true,
      labSlot: "R",
      labStart: "10:10",
      labEnd: "12:10",
    },
    {
      code: "CSE110",
      title: "Object Oriented Programming",
      credit: 4.5,
      department: "cse",
      section: 2,
      room: 104,
      facultyUserId: insertedUsers.insertedIds[4],
      maxSeats: 30,
      takenSeats: 0,
      creditRequired: 0,
      prerequisite: "CSE103",
      classSlot: "TR",
      classStart: "8:30",
      classEnd: "10:00",
      hasLab: true,
      labSlot: "T",
      labStart: "1:30",
      labEnd: "3:30",
    },
    {
      code: "CSE110",
      title: "Object Oriented Programming",
      credit: 4.5,
      department: "cse",
      section: 3,
      room: 104,
      facultyUserId: insertedUsers.insertedIds[4],
      maxSeats: 30,
      takenSeats: 0,
      creditRequired: 0,
      prerequisite: "CSE103",
      classSlot: "SR",
      classStart: "3:10",
      classEnd: "4:40",
      hasLab: true,
      labSlot: "T",
      labStart: "4:50",
      labEnd: "6:50",
    },
    {
      code: "CSE207",
      title: "Data Structures",
      credit: 4,
      department: "cse",
      section: 1,
      room: 335,
      facultyUserId: insertedUsers.insertedIds[4],
      maxSeats: 35,
      takenSeats: 0,
      creditRequired: 35,
      prerequisite: "CSE110",
      classSlot: "SR",
      classStart: "3:10",
      classEnd: "4:40",
      hasLab: true,
      labSlot: "S",
      labStart: "8:00",
      labEnd: "10:00",
    },
    {
      code: "ENG101",
      title: "Basic English",
      credit: 3,
      department: "english",
      section: 1,
      room: 201,
      facultyUserId: insertedUsers.insertedIds[5],
      maxSeats: 40,
      takenSeats: 0,
      creditRequired: 0,
      prerequisite: null,
      classSlot: "MW",
      classStart: "11:50",
      classEnd: "1:20",
      hasLab: false,
      labSlot: null,
      labStart: null,
      labEnd: null,
    },
    {
      code: "ENG102",
      title: "Composition & Communication Skills",
      credit: 3,
      department: "english",
      section: 1,
      room: 204,
      facultyUserId: insertedUsers.insertedIds[5],
      maxSeats: 40,
      takenSeats: 0,
      creditRequired: 0,
      prerequisite: "ENG101",
      classSlot: "TR",
      classStart: "10:10",
      classEnd: "11:40",
      hasLab: false,
      labSlot: null,
      labStart: null,
      labEnd: null,
    },
    {
      code: "PHY109",
      title: "Engineering Physics",
      credit: 4,
      department: "mps",
      section: 1,
      room: 325,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 40,
      takenSeats: 0,
      creditRequired: 10,
      prerequisite: null,
      classSlot: "ST",
      classStart: "1:30",
      classEnd: "3:00",
      hasLab: true,
      labSlot: "T",
      labStart: "4:50",
      labEnd: "6:50",
    },
    {
      code: "PHY109",
      title: "Engineering Physics",
      credit: 4,
      department: "mps",
      section: 2,
      room: 326,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 40,
      takenSeats: 5,
      creditRequired: 10,
      prerequisite: null,
      classSlot: "ST",
      classStart: "11:50",
      classEnd: "1:20",
      hasLab: true,
      labSlot: "S",
      labStart: "4:50",
      labEnd: "6:50",
    },
    {
      code: "PHY109",
      title: "Engineering Physics",
      credit: 4,
      department: "mps",
      section: 3,
      room: 327,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 40,
      takenSeats: 1,
      creditRequired: 10,
      prerequisite: null,
      classSlot: "MW",
      classStart: "1:30",
      classEnd: "3:00",
      hasLab: true,
      labSlot: "W",
      labStart: "1:30",
      labEnd: "3:30",
    },
    {
      code: "CHE109",
      title: "Engineering Chemistry",
      credit: 4,
      department: "pharmacy",
      section: 1,
      room: 702,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 40,
      takenSeats: 0,
      creditRequired: 25,
      prerequisite: "PHY109",
      classSlot: "TR",
      classStart: "3:10",
      classEnd: "4:40",
      hasLab: true,
      labSlot: "S",
      labStart: "1:30",
      labEnd: "3:30",
    },
    {
      code: "CHE109",
      title: "Engineering Chemistry",
      credit: 4,
      department: "pharmacy",
      section: 2,
      room: 703,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 40,
      takenSeats: 7,
      creditRequired: 25,
      prerequisite: "PHY109",
      classSlot: "MW",
      classStart: "3:10",
      classEnd: "4:40",
      hasLab: true,
      labSlot: "W",
      labStart: "8:00",
      labEnd: "10:00",
    },
    {
      code: "CHE109",
      title: "Engineering Chemistry",
      credit: 4,
      department: "pharmacy",
      section: 3,
      room: 704,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 40,
      takenSeats: 2,
      creditRequired: 25,
      prerequisite: "PHY109",
      classSlot: "SR",
      classStart: "8:30",
      classEnd: "10:00",
      hasLab: true,
      labSlot: "T",
      labStart: "10:10",
      labEnd: "12:10",
    },
    {
      code: "CHE109",
      title: "Engineering Chemistry",
      credit: 4,
      department: "pharmacy",
      section: 4,
      room: 706,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 40,
      takenSeats: 0,
      creditRequired: 25,
      prerequisite: "PHY109",
      classSlot: "SR",
      classStart: "10:10",
      classEnd: "11:40",
      hasLab: true,
      labSlot: "R",
      labStart: "4:50",
      labEnd: "6:50",
    },
    {
      code: "GEN102",
      title: "Emergence of Bangladesh",
      credit: 3,
      department: "english",
      section: 1,
      room: 402,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 30,
      takenSeats: 10,
      creditRequired: 15,
      prerequisite: null,
      classSlot: "SR",
      classStart: "1:30",
      classEnd: "3:00",
      hasLab: false,
      labSlot: null,
      labStart: null,
      labEnd: null,
    },
    {
      code: "GEN102",
      title: "Emergence of Bangladesh",
      credit: 3,
      department: "english",
      section: 2,
      room: 404,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 30,
      takenSeats: 30,
      creditRequired: 15,
      prerequisite: null,
      classSlot: "MW",
      classStart: "3:10",
      classEnd: "4:40",
      hasLab: false,
      labSlot: null,
      labStart: null,
      labEnd: null,
    },
    {
      code: "GEN102",
      title: "Emergence of Bangladesh",
      credit: 3,
      department: "english",
      section: 3,
      room: 405,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 30,
      takenSeats: 4,
      creditRequired: 15,
      prerequisite: null,
      classSlot: "SR",
      classStart: "11:50",
      classEnd: "1:20",
      hasLab: false,
      labSlot: null,
      labStart: null,
      labEnd: null,
    },
    {
      code: "GEN226",
      title: "Emergence of Bangladesh II",
      credit: 3,
      department: "english",
      section: 1,
      room: 408,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 30,
      takenSeats: 8,
      creditRequired: 15,
      prerequisite: null,
      classSlot: "MW",
      classStart: "8:30",
      classEnd: "10:00",
      hasLab: false,
      labSlot: null,
      labStart: null,
      labEnd: null,
    },
    {
      code: "GEN226",
      title: "Emergence of Bangladesh II",
      credit: 3,
      department: "english",
      section: 2,
      room: 410,
      facultyUserId: insertedUsers.insertedIds[6],
      maxSeats: 30,
      takenSeats: 2,
      creditRequired: 15,
      prerequisite: null,
      classSlot: "ST",
      classStart: "3:10",
      classEnd: "4:40",
      hasLab: false,
      labSlot: null,
      labStart: null,
      labEnd: null,
    },
  ]);

  client.close();
}

seed()
  .then(() => console.log("Database seeded successfully!"))
  .catch((error) => console.error("Error seeding database!", error));
