"use server";
import { portfolioItemSchema } from "@/lib/zod";
import { revalidatePath } from "next/cache";
import Portfolio from "@/models/Portfolio";
import { checkActionRateLimit } from "@/lib/action-ratelimit";
import { getAuthenticatedContractor } from "@/app/actions/Contractor/getAuthenticatedContractor";

export async function addPortfolioItem(slug, formData) {
  const { session, contractor } = await getAuthenticatedContractor(slug);

  await checkActionRateLimit(`portfolio-${session.user.id}`);

  const data = portfolioItemSchema.parse({
    title: formData.title,
    description: formData.description,
    images: formData.images,
    projectType: formData.projectType,
    location: formData.location,
    completedAt: formData.completedAt || undefined,
  });

  await Portfolio.create({
    contractor: contractor._id,
    ...data,
    completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
  });

  revalidatePath(`/${slug}/dashboard/portfolio`);
  return { success: true };
}
