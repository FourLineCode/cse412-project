import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { UserRole } from "../types/User";

const SECRET = process.env.JWT_SECRET ?? "jwt-secret";

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
