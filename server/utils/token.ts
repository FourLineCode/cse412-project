import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const SECRET = process.env.JWT_SECRET ?? "jwt-secret";

export type UserRole = "student" | "faculty" | "admin";

export interface JWTPayload {
  userId: ObjectId;
  role: UserRole;
}

export function generateToken(payload: JWTPayload) {
  return jwt.sign(payload, SECRET);
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, SECRET) as JWTPayload;
}
