"use server";

import { signIn } from "@/app/auth";
import { AuthError } from "next-auth";

export async function signInWithOTP(email) {
  try {
    await signIn("credentials", { email, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Sign-in failed. Please try again." };
    }
    throw error;
  }
}
