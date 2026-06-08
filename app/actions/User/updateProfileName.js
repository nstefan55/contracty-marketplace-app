"use server";

import { revalidatePath } from "next/cache";

import { profileNameSchema } from "@/lib/zod";

import { auth } from "@/app/auth";
import connectDB from "@/config/database";
import User from "@/models/User";
import { checkActionRateLimit } from "@/lib/action-ratelimit";

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
