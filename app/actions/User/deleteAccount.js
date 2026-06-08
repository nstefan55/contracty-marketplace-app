"use server";

import { auth } from "@/app/auth";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { verifyPassword } from "@/lib/password";
import { checkActionRateLimit } from "@/lib/action-ratelimit";
import cloudinary from "@/config/cloudinary";
import { revalidatePath } from "next/cache";

function extractCloudinaryPublicId(url) {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  if (url === "/images/default-image.png") return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/);
  return match ? match[1] : null;
}

export async function deleteAccount(confirmPassword) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await checkActionRateLimit(`delete-account-${session.user.id}`);

  await connectDB();

  const user = await User.findById(session.user.id);
  if (!user) throw new Error("User not found");

  // Re-verify password before destructive operation
  if (user.password) {
    if (!confirmPassword) throw new Error("Password confirmation is required");
    const valid = await verifyPassword(confirmPassword, user.password);
    if (!valid) throw new Error("Incorrect password");
  }

  if (session.user.role === "contractor") {
    const contractor = await Contractor.findOne({ owner: session.user.id });
    if (contractor) {
      // Collect all Cloudinary public IDs before deleting documents
      const portfolioItems = await Portfolio.find({
        contractor: contractor._id,
      }).lean();
      const publicIdsToDelete = [];

      for (const item of portfolioItems) {
        for (const imageUrl of item.images ?? []) {
          const publicId = extractCloudinaryPublicId(imageUrl);
          if (publicId) publicIdsToDelete.push(publicId);
        }
      }

      // Delete profile image if it's a custom Cloudinary upload
      const profileImageId = extractCloudinaryPublicId(contractor.profileImage);
      if (profileImageId) publicIdsToDelete.push(profileImageId);

      // Batch-delete from Cloudinary (max 100 per call)
      const BATCH = 100;
      for (let i = 0; i < publicIdsToDelete.length; i += BATCH) {
        const batch = publicIdsToDelete.slice(i, i + BATCH);
        await cloudinary.api.delete_resources(batch).catch(() => {
          // Non-fatal: DB cleanup proceeds even if Cloudinary call fails
        });
      }

      await Portfolio.deleteMany({ contractor: contractor._id });
      await contractor.deleteOne();
    }
  }

  await User.findByIdAndDelete(session.user.id);

  revalidatePath("/signin");

  return { success: true };
}
