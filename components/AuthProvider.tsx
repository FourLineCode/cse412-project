import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../stores/useAuth";

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const auth = useAuth();
  const router = useRouter();

  if (!auth.authorized) {
    if (typeof window !== "undefined") {
      router.push("/signin");
    }
    return null;
  }

  return <>{children}</>;
}
