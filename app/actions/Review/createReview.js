"use server";
import { reviewSchema } from "@/lib/zod";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Review from "@/models/Review";
import { checkActionRateLimit } from "@/lib/action-ratelimit";

export async function createReview(contractorId, formData) {
  const session = await auth();
  if (!session) throw new Error("Sign in to leave a review");

  await checkActionRateLimit(`review-${session.user.id}`);

  const data = reviewSchema.parse({
    rating: Number(formData.rating),
    comment: formData.comment || undefined,
  });

  await connectDB();

  const contractor = await Contractor.findById(contractorId);
  if (!contractor) throw new Error("Contractor not found");

  if (contractor.owner.toString() === session.user.id) {
    throw new Error("You cannot review your own profile");
  }

  try {
    await Review.create({
      user: session.user.id,
      contractor: contractorId,
      rating: data.rating,
      comment: data.comment,
    });
  } catch (err) {
    if (err.code === 11000)
      throw new Error("You have already reviewed this contractor");
    throw err;
  }

  const stats = await Review.aggregate([
    { $match: { contractor: contractor._id } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await Contractor.updateOne(
      { _id: contractorId },
      {
        averageRating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count,
      },
    );
  }

  revalidatePath(`/${contractor.slug}`);
  return { success: true };
}
