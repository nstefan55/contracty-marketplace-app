"use server";
import { contractorProfileSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import { checkActionRateLimit } from "@/lib/action-ratelimit";
import { getAuthenticatedContractor } from "@/app/actions/Contractor/getAuthenticatedContractor";

export async function updateContractorProfile(slug, formData) {
  const { session, contractor } = await getAuthenticatedContractor(slug);

  await checkActionRateLimit(`update-profile-${session.user.id}`);

  const data = contractorProfileSchema.parse({
    name: formData.name,
    bio: formData.bio,
    phone: formData.phone,
    email: formData.email,
    trade: formData.trade,
    yearsExperience: formData.yearsExperience
      ? Number(formData.yearsExperience)
      : undefined,
    certifications: formData.certifications,
    serviceArea: formData.serviceArea
      ? {
          address: formData.serviceArea.address || undefined,
          postcode: formData.serviceArea.postcode || undefined,
          radiusKm: formData.serviceArea.radiusKm
            ? Number(formData.serviceArea.radiusKm)
            : undefined,
        }
      : undefined,
  });

  if (data.name !== undefined) contractor.name = data.name;
  if (data.bio !== undefined) contractor.bio = data.bio;
  if (data.phone !== undefined) contractor.phone = data.phone;
  if (data.email !== undefined) contractor.email = data.email;
  if (data.trade !== undefined) contractor.trade = data.trade;
  if (data.yearsExperience !== undefined)
    contractor.yearsExperience = data.yearsExperience;
  if (data.certifications !== undefined)
    contractor.certifications = data.certifications;
  if (data.serviceArea !== undefined)
    contractor.serviceArea = { ...contractor.serviceArea, ...data.serviceArea };

  await contractor.save();
  revalidatePath(`/${slug}/dashboard`);
  revalidatePath(`/${slug}/dashboard/edit-profile`);

  return { success: true };
}
