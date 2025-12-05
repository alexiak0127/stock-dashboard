"use client";
//Styled button for github login, by Charles
import {logIn} from "@/lib/auth";
import Image from "next/image";
import githubLogo from "@/public/github.png";
export const AuthButton=()=>{
    return <button onClick={()=>logIn()} className="bg-lime-100 text-slate-900 flex w-[24vw] h-[6vh] items-center justify-center gap-2 rounded-md font-semibold text-xl hover:brightness-115 transition-all">
        <Image src={githubLogo} alt="Github Logo" width={31} height={31}/>
        <span>Continue with Github</span>
    </button>
}