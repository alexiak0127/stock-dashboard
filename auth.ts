import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
//authentication setup by Charles Yao

export const { auth, handlers, signIn, signOut}= NextAuth( {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GitHub,
        Google
    ],
})