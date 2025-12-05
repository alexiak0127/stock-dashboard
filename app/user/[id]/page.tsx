"use server";
//Charles Yao
import Image from "next/image";
import { auth } from "@/auth";
import { LogOutButton } from "@/components/logoutButton";
import { redirect } from "next/navigation";

export default async function UserProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
//added color shifting to background similar to fit the main page
  return (
    <main className="h-screen bg-slate-900 text-white flex flex-col">
      <div className="flex items-center justify-center flex-1">
        <div className="items-center justify-center w-[90%] max-w-lg p-12 bg-gradient-to-b from-white/10 to-slate-900/10 rounded-3xl shadow-2xl border border-white/10 flex flex-col gap-6 ">
          <h1 className="font-semibold tracking-tight text-4xl ">You are signed in!</h1>
          {session.user.image && (
            <Image 
              src={session.user.image} 
              alt={session.user.name ?? "Avatar"} 
              width={80} 
              height={80}
              className="rounded-full border-3 border-lime-100"
            />
          )}
          <div className="text-center space-y-2">
            <p className="text-lg text-gray-300">Username: <span className="font-semibold">{session.user.name}</span></p>
            <p className="text-lg text-gray-300">Email: <span className="font-semibold">{session.user.email}</span></p>
          </div>
          <div className="mt-4">
            <div><p className="text-gray-400 mb-4">ADD favorite list here</p></div>
            <LogOutButton />
          </div>
        </div>
      </div>
    </main>
  );
}
