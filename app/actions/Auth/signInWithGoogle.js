"use server";

import { signIn } from "@/app/auth";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" });
} 


