"use server";

import { auth } from "@/app/auth";

import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";

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
