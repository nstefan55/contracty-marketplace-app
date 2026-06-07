"use server";
import { z } from "zod";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { verifyPassword, saltAndHashPassword } from "@/lib/password";
import Inquiry from "@/models/Inquiry";
import { checkActionRateLimit } from "@/lib/action-ratelimit";
import cloudinary from "@/config/cloudinary";

const DEFAULT_CLOUDINARY_IMAGE =
  "https://res.cloudinary.com/devslulj5/image/upload/v1777836733/default-image_yywmnk.png";

function extractCloudinaryPublicId(url) {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  if (url === DEFAULT_CLOUDINARY_IMAGE) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^./]+)?$/);
  return match ? match[1] : null;
}

const TRADES = [
  "General Contractor","Electrician","Plumber","HVAC Technician","Handyman",
  "Roofer","Landscaper","Mason","Carpenter","Concrete & Paving","Painter",
  "Tiler","Flooring Specialist","Window & Door Specialist",
];

const inquirySchema = z.object({
  projectType: z.string().min(1).max(100),
  budget: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  siteAddress: z.string().max(200).optional(),
  description: z.string().min(1).max(1000),
});

const contractorProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(1000).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().max(100).optional(),
  trade: z.enum(TRADES).optional(),
  yearsExperience: z.number().int().min(0).max(60).optional(),
  certifications: z.array(z.string().max(100)).max(20).optional(),
});

const portfolioItemSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
  images: z.array(z.string().url()).max(20).optional(),
  projectType: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  completedAt: z.string().datetime({ offset: true }).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(12, "New password must be at least 12 characters"),
});

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

export async function toggleBookmark(contractorId) {
  const session = await auth();
  if (!session) throw new Error("Sign in to bookmark contractors");

  await checkActionRateLimit(`bookmark-${session.user.id}`);

  await connectDB();

  const user = await User.findById(session.user.id);
  if (!user) throw new Error("User not found");

  const alreadyBookmarked = user.bookmarks.some(
    (id) => id.toString() === contractorId,
  );

  if (alreadyBookmarked) {
    await User.updateOne(
      { _id: session.user.id },
      { $pull: { bookmarks: contractorId } },
    );
  } else {
    await User.updateOne(
      { _id: session.user.id },
      { $addToSet: { bookmarks: contractorId } },
    );
  }
}

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function setupContractorProfile() {
  const session = await auth();
  if (!session || session.user.role !== "contractor")
    throw new Error("Unauthorized");

  await connectDB();

  const existing = await Contractor.findOne({ owner: session.user.id }).lean();
  if (existing) return { slug: existing.slug };

  // Generate a unique slug from the user's name
  const base = toSlug(session.user.name || "contractor");
  let slug = base;
  let attempt = 0;
  while (await Contractor.exists({ slug })) {
    attempt++;
    slug = `${base}-${attempt}`;
  }

  await Contractor.create({
    owner: session.user.id,
    name: session.user.name || "My Profile",
    slug,
    profileImage: session.user.image,
    trade: "General Contractor",
    available: true,
    featured: false,
    verified: false,
    averageRating: 0,
    reviewCount: 0,
    viewCount: 0,
  });

  return { slug };
}

async function getAuthenticatedContractor(slug) {
  const session = await auth();
  if (!session || session.user.role !== "contractor")
    throw new Error("Unauthorized");

  await connectDB();
  const contractor = await Contractor.findOne({ slug, owner: session.user.id });
  if (!contractor) throw new Error("Contractor not found");

  return { session, contractor };
}

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
  });

  if (data.name !== undefined) contractor.name = data.name;
  if (data.bio !== undefined) contractor.bio = data.bio;
  if (data.phone !== undefined) contractor.phone = data.phone;
  if (data.email !== undefined) contractor.email = data.email;
  if (data.trade !== undefined) contractor.trade = data.trade;
  if (data.yearsExperience !== undefined) contractor.yearsExperience = data.yearsExperience;
  if (data.certifications !== undefined) contractor.certifications = data.certifications;

  await contractor.save();
  revalidatePath(`/${slug}/dashboard`);
  revalidatePath(`/${slug}/dashboard/edit-profile`);

  return { success: true };
}

export async function addPortfolioItem(slug, formData) {
  const { session, contractor } = await getAuthenticatedContractor(slug);

  await checkActionRateLimit(`portfolio-${session.user.id}`);

  const data = portfolioItemSchema.parse({
    title: formData.title,
    description: formData.description,
    images: formData.images,
    projectType: formData.projectType,
    location: formData.location,
    completedAt: formData.completedAt,
  });

  await Portfolio.create({
    contractor: contractor._id,
    ...data,
    completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
  });

  revalidatePath(`/${slug}/dashboard/portfolio`);
  return { success: true };
}

export async function deletePortfolioItem(slug, portfolioId) {
  const { contractor } = await getAuthenticatedContractor(slug);

  await Portfolio.findOneAndDelete({
    _id: portfolioId,
    contractor: contractor._id,
  });
  revalidatePath(`/${slug}/dashboard/portfolio`);

  return { success: true };
}

export async function updateAvailability(slug, available) {
  const { contractor } = await getAuthenticatedContractor(slug);

  contractor.available = available;
  await contractor.save();
  revalidatePath(`/${slug}/dashboard`);

  return { success: true };
}

export async function changePassword(currentPassword, newPassword) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await checkActionRateLimit(`change-password-${session.user.id}`);

  const { newPassword: validatedNew } = changePasswordSchema.parse({
    currentPassword,
    newPassword,
  });

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user || !user.password)
    throw new Error("No password set on this account");

  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) throw new Error("Current password is incorrect");

  user.password = await saltAndHashPassword(validatedNew);
  await user.save();

  return { success: true };
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
      const portfolioItems = await Portfolio.find({ contractor: contractor._id }).lean();
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
  return { success: true };
}
