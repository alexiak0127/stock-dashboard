"use server";

import { auth } from "@/auth";
import { AuthButton } from "@/components/authButton";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect(`/user/${session.user.id || session.user.email}`);
  }
  
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="flex items-center justify-center flex-1">
        <div className="flex flex-col gap-8 items-center justify-center w-[90%] max-w-lg p-12 bg-gradient-to-b from-white/10 to-slate-900/10 rounded-3xl shadow-2xl border border-white/10">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight mb-4">Sign In / Create Account</h1>
            <p className="text-xl text-gray-300 max-w-md">To access your personal stock dashboard</p>
          </div>
          <AuthButton />
        </div>
      </div>
    </main>
  );
}
