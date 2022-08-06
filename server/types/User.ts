export type UserRole = "student" | "faculty" | "admin";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  activated: boolean;
  department?: string;
  credit?: number;
  grade?: number;
}
