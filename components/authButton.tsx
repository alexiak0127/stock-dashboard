"use client";
// Styled button for github login, with homemade login(), by Charles
// Google login by Alexia
import {logIn} from "@/lib/auth";
import Image from "next/image";
import githubLogo from "@/public/github.png";
import googleLogo from "@/public/google.png";

export const AuthButton=()=>{
    return (
        <div className="flex flex-row gap-4 w-full">
            {/* GitHub Login Button, with log in onClick */}
            <button 
                onClick={()=>logIn("github")} 
                className="bg-white text-slate-900 flex w-200 h-[6vh] items-center justify-center gap-2 rounded-md font-semibold text-xl hover:brightness-115 transition-all"
            >
                <Image src={githubLogo} alt="Github Logo" width={31} height={31}/>
            </button>
            {/* Google login button, with log in onClick */}
            <button 
                onClick={()=>logIn("google")} 
                className="bg-white text-slate-900 flex w-200 h-[6vh] items-center justify-center gap-1 rounded-md font-semibold text-xl hover:brightness-95 transition-all"
            >
                <Image src={googleLogo} alt="Google Logo" width={40} height={40}/>
                
            </button>
        </div>
    );
}