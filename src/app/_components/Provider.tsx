"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}
