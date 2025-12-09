"use client";
//Charles Yao, add session provider so that the user image could be shown on the navbar
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
//Providers component wraps the application with SessionProvider for authentication context
//For our use, just for the image to render without weird bugs
export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
