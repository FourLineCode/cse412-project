import { Document, ObjectId, WithId } from "mongodb";
import create from "zustand";
import { UserRole } from "../server/utils/token";

export interface User extends WithId<Document> {
  username: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  userId: ObjectId | null;
  token: string | null;
  authorized: boolean;
  setAuth(user: User, token: string): void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  userId: null,
  token: null,
  authorized: false,
  setAuth: (user, token) => set({ authorized: true, userId: user._id, user, token }),
}));
