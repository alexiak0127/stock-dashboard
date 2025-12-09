// Authentication setup by Charles Yao
// Google provider and MongoDB adapter integration added by Alexia Kim

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";

export const { auth, handlers, signIn, signOut } = NextAuth({
    // MongoDB adapter stores user data, sessions, and accounts
    // Uses clientPromise from lib/mongodb.ts for database connection
    adapter: MongoDBAdapter(clientPromise),
    
    // OAuth providers for user authentication
    providers: [
        GitHub,
        Google
    ],
})