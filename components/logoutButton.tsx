"use client";
//styled logout button by Charles Yao
import { signOut } from "next-auth/react";
//homemade logout failed, have to implement the built in next-auth to actually singed out.
export const LogOutButton = () => {
    return (
        <button 
        onClick={() => signOut({ callbackUrl: "/" })} className="bg-lime-100 text-slate-900 flex w-[15vw] h-[6vh] items-center justify-center rounded-md font-semibold text-xl hover:brightness-115 transition-all"
        >Log out</button>
    );
};