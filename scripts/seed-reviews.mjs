import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

dotenv.config({
  path: resolve(dirname(fileURLToPath(import.meta.url)), "../.env"),
});

// Import models - using dynamic import workaround for CommonJS
const User = await import("../models/User.js").then(m => m.default);
const Review = await import("../models/Review.js").then(m => m.default);

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

const DEFAULT_PROFILE_IMAGE_URL =
  "https://res.cloudinary.com/devslulj5/image/upload/v1777836733/default-image_yywmnk.png";

// Contractor IDs from seed-contractors.mjs (first 3 contractors for reviews)
const CONTRACTOR_IDS = [
  new mongoose.Types.ObjectId("6650000000000000000000b1"), // Marko Horvat
  new mongoose.Types.ObjectId("6650000000000000000000b2"), // Ivan Perić
  new mongoose.Types.ObjectId("6650000000000000000000b3"), // Next contractor
];

// Test users to seed
const TEST_USERS = [
  {
    name: "Ana Novak",
    email: "ana.novak@test.com",
    password: "SecurePass123!",
    role: "client",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
  },
  {
    name: "Petar Marković",
    email: "petar.markovic@test.com",
    password: "TestPassword456!",
    role: "client",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
  },
  {
    name: "Marija Kovačić",
    email: "marija.kovacic@test.com",
    password: "MySecure789Pass!",
    role: "client",
    profileImage: DEFAULT_PROFILE_IMAGE_URL,
  },
];

// Review data with realistic comments
const REVIEW_DATA = [
  {
    rating: 5,
    comment:
      "Marko was absolutely fantastic! Completed our bathroom renovation ahead of schedule and the quality is exceptional. Highly recommend!",
    projectType: "Bathroom Renovation",
    verified: true,
  },
  {
    rating: 4,
    comment:
      "Ivan installed our smart home system and EV charger. Professional and knowledgeable. A few minor communication delays but overall very satisfied.",
    projectType: "Electrical Installation",
    verified: true,
  },
  {
    rating: 5,
    comment:
      "Outstanding work on our kitchen renovation. The attention to detail was impressive and the team was respectful of our home throughout the project.",
    projectType: "Kitchen Renovation",
    verified: true,
  },
];

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    // Clean up existing test users and reviews (optional - remove if you want to keep existing data)
    const testEmails = TEST_USERS.map((u) => u.email);
    await User.deleteMany({ email: { $in: testEmails } });
    console.log("✓ Cleaned up existing test users");

    // Create users with hashed passwords
    const createdUsers = [];

    for (const userData of TEST_USERS) {
      // Generate salt and hash password
      const salt = await bcryptjs.genSalt(10); // 10 rounds for security
      const hashedPassword = await bcryptjs.hash(userData.password, salt);

      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        profileImage: userData.profileImage,
        image: userData.profileImage,
      });

      createdUsers.push(user);
      console.log(`✓ Created user: ${user.email}`);
    }

    // Create reviews linking users to contractors
    const createdReviews = [];

    for (let i = 0; i < createdUsers.length; i++) {
      const review = await Review.create({
        user: createdUsers[i]._id,
        contractor: CONTRACTOR_IDS[i],
        rating: REVIEW_DATA[i].rating,
        comment: REVIEW_DATA[i].comment,
        projectType: REVIEW_DATA[i].projectType,
        verified: REVIEW_DATA[i].verified,
      });

      createdReviews.push(review);
      console.log(
        `✓ Created review: User "${createdUsers[i].name}" → Contractor ID ${CONTRACTOR_IDS[i]}`
      );
    }

    console.log("\n✅ Seed completed successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   • ${createdUsers.length} users created`);
    console.log(`   • ${createdReviews.length} reviews created`);
    console.log(`\n📝 Test Credentials:`);
    TEST_USERS.forEach((user, index) => {
      console.log(
        `   ${index + 1}. Email: ${user.email} | Password: ${user.password}`
      );
    });
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}

main();
