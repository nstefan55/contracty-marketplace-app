/**
 * Creates a Contractor profile for an existing user.
 * Usage: node scripts/create-contractor-profile.mjs your@email.com
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env") });

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/create-contractor-profile.mjs <email>");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection.db;
const user = await db.collection("users").findOne({ email });

if (!user) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

if (user.role !== "contractor") {
  console.error(`User exists but role is "${user.role}", not "contractor". Complete onboarding first.`);
  process.exit(1);
}

const existing = await db.collection("contractors").findOne({ owner: user._id });
if (existing) {
  console.log(`Contractor profile already exists: /${existing.slug}/dashboard`);
  await mongoose.disconnect();
  process.exit(0);
}

const slug = user.name
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, "")
  .trim()
  .replace(/\s+/g, "-")
  .concat("-contractor");

await db.collection("contractors").insertOne({
  owner: user._id,
  name: user.name,
  slug,
  profileImage: user.image,
  trade: "General Contractor",
  bio: "",
  phone: "",
  email: user.email,
  serviceArea: { radiusKm: 20 },
  certifications: [],
  priceRange: { currency: "EUR" },
  available: true,
  featured: false,
  verified: false,
  averageRating: 0,
  reviewCount: 0,
  viewCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log(`✓ Contractor profile created`);
console.log(`  Dashboard: http://localhost:3000/${slug}/dashboard`);

await mongoose.disconnect();
