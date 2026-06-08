"use server";

import { revalidatePath } from "next/cache";

import { profileEmailSchema } from "@/lib/zod";

import { auth } from "@/app/auth";
import connectDB from "@/config/database";
import User from "@/models/User";
import { checkActionRateLimit } from "@/lib/action-ratelimit";

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
