import create from "zustand";
import { User } from "../server/types/User";

interface AuthState {
  user: User | null;
  userId: string | null;
  token: string | null;
  authorized: boolean;
  setAuth(user: User, token: string): void;
  signOut(): void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  userId: null,
  token: null,
  authorized: false,
  setAuth: (user, token) => set({ authorized: true, userId: user._id, user, token }),
  signOut: () => set({ user: null, userId: null, token: null, authorized: false }),
}));
