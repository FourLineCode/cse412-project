import { Document, WithId } from "mongodb";

export type UserRole = "student" | "faculty" | "admin";

export interface User extends WithId<Document> {
  username: string;
  email: string;
  role: UserRole;
}
