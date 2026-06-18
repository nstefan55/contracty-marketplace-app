"use server";

import { auth } from "@/app/auth";

import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

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

  // Generate a unique slug from the user's name.
  // Fetch all conflicting slugs in one query, then resolve the suffix in memory
  // to avoid N sequential round-trips for common names.
  const base = toSlug(session.user.name || "contractor");
  const conflicts = await Contractor.find(
    { slug: { $regex: `^${base}(-\\d+)?$` } },
    { slug: 1, _id: 0 },
  ).lean();
  const taken = new Set(conflicts.map((c) => c.slug));
  let slug = base;
  let attempt = 0;
  while (taken.has(slug)) {
    slug = `${base}-${++attempt}`;
  }

  await Promise.all([
    Contractor.create({
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
    }),
    User.updateOne({ _id: session.user.id }, { needsOnboarding: false }),
  ]);

  revalidatePath(`/${slug}/dashboard/edit-profile`, "layout");
  revalidatePath("/contractors", "page");
  return { slug };
}


w