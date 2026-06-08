"use server";
import { auth } from "@/app/auth";
import connectDB from "@/config/database";
import Inquiry from "@/models/Inquiry";
import { checkActionRateLimit } from "@/lib/action-ratelimit";

export async function getUnreadInquiriesCount() {
  const session = await auth();
  if (!session)
    throw new Error("You must be signed in to view unread inquiries count");

  await checkActionRateLimit(`get-unread-inquiries-count-${session.user.id}`);

  await connectDB();

  const countInquiries = await Inquiry.countDocuments({
    recipient: session.user.id,
    status: "new"
  });

  return { countInquiries };
}

