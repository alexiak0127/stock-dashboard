"use server";
import { signIn, signOut} from "@/auth";

export const logIn = async(provider: "github" | "google") => {
    await signIn(provider);
}

export const logOut = async() => {
    await signOut({redirectTo:"/"});
}