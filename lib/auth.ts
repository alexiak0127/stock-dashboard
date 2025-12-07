"use server";
import { signIn, signOut} from "@/auth";
//.ts backend function for logging in and out, by Charles Yao
export const logIn = async() => {
    await signIn("github");
}

export const logOut = async() => {
    await signOut({redirectTo:"/"});
}