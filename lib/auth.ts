"use server";
// Server actions for authentication - Charles Yao

import { signIn, signOut } from "@/auth";
//signIn and signOut are imported from auth.ts
export const logIn = async(provider: "github" | "google") => {
    await signIn(provider);
}
//logOut calls signOut from auth.ts with redirect to home page
export const logOut = async() => {
    await signOut({ redirectTo: "/" });
}