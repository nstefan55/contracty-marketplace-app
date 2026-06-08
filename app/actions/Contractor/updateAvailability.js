"use server";
import { getAuthenticatedContractor } from "@/app/actions/Contractor/getAuthenticatedContractor";
import { revalidatePath } from "next/cache";

export async function updateAvailability(slug, available) {
  const { contractor } = await getAuthenticatedContractor(slug);

  contractor.available = available;
  await contractor.save();
  revalidatePath(`/${slug}/dashboard`);

  return { success: true };
}
