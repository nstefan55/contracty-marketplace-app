"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/app/auth";
import connectDB from "@/config/database";
import User from "@/models/User";

export async function updateProfileName(name) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");

  const trimmed = String(name ?? "").trim();
  if (!trimmed) throw new Error("Name is required");
  if (trimmed.length > 60) throw new Error("Name is too long");

  await connectDB();
  await User.updateOne({ _id: session.user.id }, { name: trimmed });

  revalidatePath("/profile");
}

export async function updateProfileEmail(email) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");

  const trimmed = String(email ?? "").trim();
  if (!trimmed) throw new Error("Email is required");
  if (trimmed.length > 60) throw new Error("Email is too long");

  await connectDB();
  await User.updateOne({ _id: session.user.id }, { email: trimmed });

  revalidatePath("/profile");
}
