import { hash } from "argon2";
import { client, db } from "./client";

async function seed() {
  await client.connect();

  const users = db.collection("users");
  const user = await users.findOne({});

  if (user) return client.close();

  const passwordHash = await hash("root");

  await users.insertMany([
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
    },
  ]);

  client.close();
}

seed()
  .then(() => console.log("Database seeded successfully!"))
  .catch((error) => console.error("Error seeding database!", error));
