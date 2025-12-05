"use client";

import {logOut} from "@/lib/auth";

export const LogOutButton=()=>{
    return <button onClick={()=>logOut()} className="bg-lime-100 text-slate-900 flex w-[15vw] h-[6vh] items-center justify-center rounded-md font-semibold text-xl hover:brightness-115 transition-all">Log out</button>
}