import { describe, it, expect } from "vitest";
import {
  signInSchema,
  registerSchema,
  roleSchema,
  reviewSchema,
  verifyOtpSchema,
  verifyCredOtpSchema,
  verifyEmail,
  profileNameSchema,
  profileEmailSchema,
  inquirySchema,
  contractorProfileSchema,
  portfolioItemSchema,
  changePasswordSchema,
} from "@/lib/zod";

describe("signInSchema", () => {
  it("accepts a well-formed email and password", () => {
    const r = signInSchema.safeParse({
      email: "user@example.com",
      password: "supersecret",
    });
    expect(r.success).toBe(true);
  });

  it("rejects passwords shorter than 8 chars", () => {
    const r = signInSchema.safeParse({ email: "a@b.com", password: "short" });
    expect(r.success).toBe(false);
  });

  it("rejects passwords longer than 32 chars", () => {
    const r = signInSchema.safeParse({
      email: "a@b.com",
      password: "a".repeat(33),
    });
    expect(r.success).toBe(false);
  });

  it("rejects missing email", () => {
    const r = signInSchema.safeParse({ password: "supersecret" });
    expect(r.success).toBe(false);
  });

  it("rejects empty email string", () => {
    const r = signInSchema.safeParse({ email: "", password: "supersecret" });
    expect(r.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts a valid registration payload", () => {
    const r = registerSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      password: "areallystrongpw",
    });
    expect(r.success).toBe(true);
  });

  it("allows name to be omitted", () => {
    const r = registerSchema.safeParse({
      email: "alice@example.com",
      password: "areallystrongpw",
    });
    expect(r.success).toBe(true);
  });

  it("rejects passwords under 12 chars (the policy minimum)", () => {
    const r = registerSchema.safeParse({
      email: "alice@example.com",
      password: "shortpw1234",
    });
    expect(r.success).toBe(false);
  });

  it("rejects passwords over 72 chars (bcrypt truncates)", () => {
    const r = registerSchema.safeParse({
      email: "alice@example.com",
      password: "a".repeat(73),
    });
    expect(r.success).toBe(false);
  });

  it("rejects malformed emails", () => {
    const r = registerSchema.safeParse({
      email: "not-an-email",
      password: "areallystrongpw",
    });
    expect(r.success).toBe(false);
  });

  it("rejects emails over 254 chars", () => {
    const longEmail = "a".repeat(245) + "@b.com"; // 251 < 254 ok, 250+ > 254
    const tooLong = "a".repeat(250) + "@b.com";
    const r = registerSchema.safeParse({
      email: tooLong,
      password: "areallystrongpw",
    });
    expect(r.success).toBe(false);
    // Sanity: a shorter one passes
    const r2 = registerSchema.safeParse({
      email: longEmail,
      password: "areallystrongpw",
    });
    expect(r2.success).toBe(true);
  });

  it("rejects names over 60 chars", () => {
    const r = registerSchema.safeParse({
      name: "a".repeat(61),
      email: "alice@example.com",
      password: "areallystrongpw",
    });
    expect(r.success).toBe(false);
  });
});

describe("roleSchema", () => {
  it.each(["homeowner", "contractor"])("accepts role=%s", (role) => {
    expect(roleSchema.safeParse({ role }).success).toBe(true);
  });

  it("rejects unknown roles", () => {
    expect(roleSchema.safeParse({ role: "admin" }).success).toBe(false);
    expect(roleSchema.safeParse({ role: "" }).success).toBe(false);
    expect(roleSchema.safeParse({}).success).toBe(false);
  });
});

describe("reviewSchema", () => {
  it("accepts ratings 1..5 with optional comment", () => {
    for (let r = 1; r <= 5; r++) {
      expect(reviewSchema.safeParse({ rating: r }).success).toBe(true);
    }
    expect(
      reviewSchema.safeParse({ rating: 4, comment: "Good work" }).success,
    ).toBe(true);
  });

  it("rejects ratings outside 1..5 and non-integers", () => {
    expect(reviewSchema.safeParse({ rating: 0 }).success).toBe(false);
    expect(reviewSchema.safeParse({ rating: 6 }).success).toBe(false);
    expect(reviewSchema.safeParse({ rating: 3.5 }).success).toBe(false);
  });

  it("rejects comments over 1000 chars", () => {
    expect(
      reviewSchema.safeParse({ rating: 5, comment: "a".repeat(1001) }).success,
    ).toBe(false);
  });
});

describe("verifyOtpSchema / verifyCredOtpSchema", () => {
  it("verifyOtpSchema allows omitting otp", () => {
    expect(verifyOtpSchema.safeParse({}).success).toBe(true);
  });

  it("rejects non-6-digit codes", () => {
    expect(verifyOtpSchema.safeParse({ otp: "12345" }).success).toBe(false);
    expect(verifyOtpSchema.safeParse({ otp: "1234567" }).success).toBe(false);
    expect(verifyOtpSchema.safeParse({ otp: "abcdef" }).success).toBe(false);
  });

  it("accepts valid 6-digit code", () => {
    expect(verifyOtpSchema.safeParse({ otp: "123456" }).success).toBe(true);
    expect(verifyCredOtpSchema.safeParse({ otp: "123456" }).success).toBe(true);
  });

  it("verifyCredOtpSchema requires the otp field", () => {
    expect(verifyCredOtpSchema.safeParse({}).success).toBe(false);
  });
});

describe("verifyEmail", () => {
  it("rejects malformed and oversized emails", () => {
    expect(verifyEmail.safeParse({ email: "bad" }).success).toBe(false);
    expect(
      verifyEmail.safeParse({ email: "a".repeat(255) + "@b.com" }).success,
    ).toBe(false);
  });
  it("accepts valid emails", () => {
    expect(verifyEmail.safeParse({ email: "a@b.com" }).success).toBe(true);
  });
});

describe("profileNameSchema", () => {
  it("accepts a normal alphabetic name", () => {
    expect(profileNameSchema.safeParse({ name: "Alice" }).success).toBe(true);
  });

  it("accepts South Slavic diacritics", () => {
    expect(profileNameSchema.safeParse({ name: "Šime" }).success).toBe(true);
    expect(profileNameSchema.safeParse({ name: "Čedo" }).success).toBe(true);
  });

  it("rejects names with digits or punctuation", () => {
    expect(profileNameSchema.safeParse({ name: "Alice1" }).success).toBe(false);
    expect(profileNameSchema.safeParse({ name: "Mary-Jane" }).success).toBe(
      false,
    );
    expect(profileNameSchema.safeParse({ name: "Al ice" }).success).toBe(false);
  });

  it("rejects too-short or too-long names", () => {
    expect(profileNameSchema.safeParse({ name: "Al" }).success).toBe(false);
    expect(profileNameSchema.safeParse({ name: "a".repeat(61) }).success).toBe(
      false,
    );
  });
});

describe("profileEmailSchema", () => {
  it("validates email length", () => {
    expect(profileEmailSchema.safeParse({ email: "ok@ok.com" }).success).toBe(
      true,
    );
    expect(
      profileEmailSchema.safeParse({ email: "a".repeat(250) + "@bb.com" })
        .success,
    ).toBe(false);
  });
});

describe("inquirySchema", () => {
  it("accepts a minimal inquiry", () => {
    expect(
      inquirySchema.safeParse({
        projectType: "Kitchen remodel",
        description: "Need help redoing the kitchen.",
      }).success,
    ).toBe(true);
  });

  it("rejects oversized description / missing projectType", () => {
    expect(
      inquirySchema.safeParse({
        projectType: "X",
        description: "a".repeat(1001),
      }).success,
    ).toBe(false);
    expect(inquirySchema.safeParse({ description: "hi" }).success).toBe(false);
  });
});

describe("contractorProfileSchema", () => {
  it("accepts a valid partial profile", () => {
    expect(
      contractorProfileSchema.safeParse({
        name: "Bob",
        trade: "Electrician",
        yearsExperience: 5,
        certifications: ["NICEIC"],
        serviceArea: { address: "Zagreb", postcode: "10000", radiusKm: 30 },
      }).success,
    ).toBe(true);
  });

  it("rejects unknown trade", () => {
    expect(
      contractorProfileSchema.safeParse({ trade: "Astronaut" }).success,
    ).toBe(false);
  });

  it("rejects yearsExperience outside bounds", () => {
    expect(
      contractorProfileSchema.safeParse({ yearsExperience: -1 }).success,
    ).toBe(false);
    expect(
      contractorProfileSchema.safeParse({ yearsExperience: 61 }).success,
    ).toBe(false);
  });

  it("rejects too many certifications", () => {
    expect(
      contractorProfileSchema.safeParse({
        certifications: Array.from({ length: 21 }, (_, i) => `c${i}`),
      }).success,
    ).toBe(false);
  });

  it("rejects serviceArea radiusKm outside 1..500", () => {
    expect(
      contractorProfileSchema.safeParse({ serviceArea: { radiusKm: 0 } })
        .success,
    ).toBe(false);
    expect(
      contractorProfileSchema.safeParse({ serviceArea: { radiusKm: 501 } })
        .success,
    ).toBe(false);
  });
});

describe("portfolioItemSchema", () => {
  it("accepts a valid portfolio entry", () => {
    expect(
      portfolioItemSchema.safeParse({
        title: "Bathroom remodel",
        description: "Full reno",
        images: ["https://example.com/a.jpg"],
        completedAt: "2025-04-01",
      }).success,
    ).toBe(true);
  });

  it("rejects non-URL images", () => {
    expect(
      portfolioItemSchema.safeParse({ title: "x", images: ["not-a-url"] })
        .success,
    ).toBe(false);
  });

  it("rejects malformed dates", () => {
    expect(
      portfolioItemSchema.safeParse({ title: "x", completedAt: "yesterday" })
        .success,
    ).toBe(false);
  });

  it("rejects empty title", () => {
    expect(portfolioItemSchema.safeParse({ title: "" }).success).toBe(false);
  });
});

describe("changePasswordSchema", () => {
  it("requires currentPassword and a 12+ char newPassword", () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "old",
        newPassword: "newpassword01",
      }).success,
    ).toBe(true);
  });

  it("rejects short newPassword", () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "old",
        newPassword: "tooShort",
      }).success,
    ).toBe(false);
  });

  it("rejects empty currentPassword", () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "",
        newPassword: "newpassword01",
      }).success,
    ).toBe(false);
  });
});
