"use server";
import { auth } from "@/app/auth";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";

export async function getAuthenticatedContractor(slug) {
  const session = await auth();
  if (!session || session.user.role !== "contractor")
    throw new Error("Unauthorized");

  await connectDB();
  const contractor = await Contractor.findOne({ slug, owner: session.user.id });
  if (!contractor) throw new Error("Contractor not found");

  return { session, contractor };
}
