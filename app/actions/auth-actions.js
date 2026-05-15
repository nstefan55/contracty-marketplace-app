"use server";

import { signIn } from "@/app/auth";
import { AuthError } from "next-auth";

export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}

export async function signInWithOTP(email, signInToken) {
  try {
    await signIn("credentials", { email, signInToken, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Sign-in failed. Please try again." };
    }
    throw error;
  }
}

export async function signInWithToken(email, signInToken) {
  try {
    await signIn("credentials", {
      email,
      signInToken,
      redirectTo: "/onboarding/welcome",
    });
  } catch (error) {
    // Re-throw redirects so Next.js can handle them
    if (error?.message === "NEXT_REDIRECT") throw error;
    if (error instanceof AuthError) {
      return { error: "Sign-in failed. Please try signing in manually." };
    }
    throw error;
  }
}
