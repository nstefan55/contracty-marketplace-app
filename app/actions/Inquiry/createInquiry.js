"use server";
import { inquirySchema } from "@/lib/zod";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";

import Inquiry from "@/models/Inquiry";
import { checkActionRateLimit } from "@/lib/action-ratelimit";

export async function createInquiry(contractorSlug, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be signed in to send an inquiry");

  await checkActionRateLimit(`inquiry-${session.user.id}`);

  const data = inquirySchema.parse({
    projectType: formData.projectType,
    budget: formData.budget,
    timeline: formData.timeline,
    siteAddress: formData.siteAddress,
    description: formData.description,
  });

  await connectDB();

  const contractor = await Contractor.findOne({ slug: contractorSlug });
  if (!contractor) throw new Error("Contractor not found");

  await Inquiry.create({
    sender: session.user.id,
    recipient: contractor.owner,
    contractor: contractor._id,
    ...data,
  });

  revalidatePath(`/${contractorSlug}/dashboard`);
}
