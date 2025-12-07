import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
//authentication setup by Charles Yao
export const { auth, handlers, signIn, signOut}= NextAuth( {
    providers: [
        GitHub
    ],
})
