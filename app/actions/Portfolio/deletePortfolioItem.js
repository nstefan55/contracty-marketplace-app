"use server";
import { getAuthenticatedContractor } from "@/app/actions/Contractor/getAuthenticatedContractor";
import { revalidatePath } from "next/cache";
import Portfolio from "@/models/Portfolio";

export async function deletePortfolioItem(slug, portfolioId) {
  const { contractor } = await getAuthenticatedContractor(slug);

  await Portfolio.findOneAndDelete({
    _id: portfolioId,
    contractor: contractor._id,
  });
  revalidatePath(`/${slug}/dashboard/portfolio`);

  return { success: true };
}
