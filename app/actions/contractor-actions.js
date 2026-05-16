"use server";
import { auth } from "@/app/auth";
import { revalidatePath } from "next/cache";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import Portfolio from "@/models/Portfolio";
import User from "@/models/User";
import { verifyPassword, saltAndHashPassword } from "@/lib/password";

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function setupContractorProfile() {
  const session = await auth();
  if (!session || session.user.role !== "contractor") throw new Error("Unauthorized");

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
  if (!session || session.user.role !== "contractor") throw new Error("Unauthorized");

  await connectDB();
  const contractor = await Contractor.findOne({ slug, owner: session.user.id });
  if (!contractor) throw new Error("Contractor not found");

  return { session, contractor };
}

export async function updateContractorProfile(slug, formData) {
  const { contractor } = await getAuthenticatedContractor(slug);

  contractor.name = formData.name || contractor.name;
  contractor.bio = formData.bio ?? contractor.bio;
  contractor.phone = formData.phone ?? contractor.phone;
  contractor.email = formData.email ?? contractor.email;
  contractor.trade = formData.trade || contractor.trade;
  contractor.yearsExperience = formData.yearsExperience
    ? Number(formData.yearsExperience)
    : contractor.yearsExperience;
  contractor.certifications = formData.certifications ?? contractor.certifications;

  await contractor.save();
  revalidatePath(`/${slug}/dashboard`);
  revalidatePath(`/${slug}/dashboard/edit-profile`);

  return { success: true };
}

export async function addPortfolioItem(slug, formData) {
  const { contractor } = await getAuthenticatedContractor(slug);

  await Portfolio.create({
    contractor: contractor._id,
    title: formData.title,
    description: formData.description,
    images: formData.images || [],
    projectType: formData.projectType,
    location: formData.location,
    completedAt: formData.completedAt ? new Date(formData.completedAt) : undefined,
  });

  revalidatePath(`/${slug}/dashboard/portfolio`);
  return { success: true };
}

export async function deletePortfolioItem(slug, portfolioId) {
  const { contractor } = await getAuthenticatedContractor(slug);

  await Portfolio.findOneAndDelete({ _id: portfolioId, contractor: contractor._id });
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

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user || !user.password) throw new Error("No password set on this account");

  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) throw new Error("Current password is incorrect");

  user.password = await saltAndHashPassword(newPassword);
  await user.save();

  return { success: true };
}

export async function deleteAccount() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await connectDB();

  if (session.user.role === "contractor") {
    const contractor = await Contractor.findOne({ owner: session.user.id });
    if (contractor) {
      await Portfolio.deleteMany({ contractor: contractor._id });
      await contractor.deleteOne();
    }
  }

  await User.findByIdAndDelete(session.user.id);
  return { success: true };
}
