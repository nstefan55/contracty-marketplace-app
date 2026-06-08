"use server";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import connectDB from "@/config/database";
import Inquiry from "@/models/Inquiry";
import { checkActionRateLimit } from "@/lib/action-ratelimit";

export async function markInquiryAsRead(inquiryId) {
  const session = await auth();
  if (!session)
    throw new Error("You must be signed in to update an inquiry");

  await checkActionRateLimit(`mark-inquiry-read-${session.user.id}`);

  await connectDB();

  const inquiry = await Inquiry.findById(inquiryId);
  if (!inquiry) throw new Error("Inquiry not found");

  if (inquiry.recipient.toString() !== session.user.id) {
    throw new Error("Unauthorized");
  }

  inquiry.status = inquiry.status === "read" ? "new" : "read";
  await inquiry.save();

  revalidatePath("/messages", "layout");

  return inquiry.status;
}
