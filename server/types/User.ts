export type UserRole = "student" | "faculty" | "admin";

export interface User {
  _id: string;
  username: string;
  email?: string;
  sid?: string;
  role: UserRole;
  activated: boolean;
  department?: string;
  completedCredit?: number;
  grade?: number;
}
