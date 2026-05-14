"use server";

import { signInWithToken } from "@/app/actions/auth-actions";

export async function credentialsSignIn(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const signInToken = signInWithToken(email, password);
  return signInToken;
}
