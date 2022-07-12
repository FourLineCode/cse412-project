import { useRouter } from "next/router";
import React from "react";
import { UserRole } from "../server/types/User";
import { useAuth } from "../stores/useAuth";

interface Props {
  role?: UserRole;
  children: React.ReactNode;
}

export function AuthProvider({ role, children }: Props) {
  const auth = useAuth();
  const router = useRouter();

  if (!auth.authorized) {
    if (typeof window !== "undefined") router.push("/signin");
    return null;
  }

  if (role && auth.user?.role !== role) {
    if (typeof window !== "undefined") router.push("/signin");
    return null;
  }

  return <>{children}</>;
}
