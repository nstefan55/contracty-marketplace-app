"use server";
import { changePasswordSchema } from "@/lib/zod";
import { auth } from "@/app/auth";
import connectDB from "@/config/database";
import User from "@/models/User";
import { verifyPassword, saltAndHashPassword } from "@/lib/password";
import { checkActionRateLimit } from "@/lib/action-ratelimit";

export async function changePassword(currentPassword, newPassword) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await checkActionRateLimit(`change-password-${session.user.id}`);

  const { newPassword: validatedNew } = changePasswordSchema.parse({
    currentPassword,
    newPassword,
  });

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user || !user.password)
    throw new Error("No password set on this account");

  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) throw new Error("Current password is incorrect");

  user.password = await saltAndHashPassword(validatedNew);
  await user.save();

  return { success: true };
}
