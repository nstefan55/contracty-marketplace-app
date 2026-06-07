"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { auth } from "@/app/auth";
import connectDB from "@/config/database";
import User from "@/models/User";
import { checkActionRateLimit } from "@/lib/action-ratelimit";

const profileNameSchema = z.object({
  name: z.string().min(1).max(60),
});

const profileEmailSchema = z.object({
  email: z.string().email().max(100),
});

export async function updateProfileName(name) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");

  await checkActionRateLimit(`update-profile-name-${session.user.id}`);

  const { name: validatedName } = profileNameSchema.parse({
    name: String(name ?? "").trim(),
  });

  await connectDB();
  await User.updateOne({ _id: session.user.id }, { name: validatedName });
  revalidatePath("/profile");
}

export async function updateProfileEmail(email) {
  const session = await auth();
  if (!session) throw new Error("Not authenticated");

  await checkActionRateLimit(`update-profile-email-${session.user.id}`);

  const { email: validatedEmail } = profileEmailSchema.parse({
    email: String(email ?? "").trim(),
  });

  await connectDB();
  await User.updateOne({ _id: session.user.id }, { email: validatedEmail });
  revalidatePath("/profile");
}
