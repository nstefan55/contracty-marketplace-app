"use server";

import { signIn } from "@/app/auth";
import { AuthError } from "next-auth";

export async function credentialsSignIn(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error?.message === "NEXT_REDIRECT") throw error;
    if (error instanceof AuthError) {
      return {
        message: error.cause?.err?.message || "Invalid email or password.",
      };
    }
    throw error;
  }
}
