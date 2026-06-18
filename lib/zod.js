import z, { object, string } from "zod";

export const signInSchema = object({
  email: string({ required_error: "Please enter your email address" }).min(
    1,
    "Please enter your email address",
  ),
  password: string({ required_error: "Please enter your password" })
    .min(1, "Please enter your password")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  email: z.string().email().max(254),
  password: z.string().min(12).max(72), // bcrypt truncates at 72; enforce minimum > 8 for production
});

export const roleSchema = z.object({
  role: z.enum(["homeowner", "contractor"]),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, "Must be a 6-digit code")
    .optional(),
});

export const verifyCredOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Must be a 6-digit code"),
});
export const verifyEmail = z.object({
  email: z.string().email().max(254),
});

export const profileNameSchema = object({
  name: string({
    required_error: "Profile name is required.",
    invalid_type_error: "Profile name must be a text.",
  })
    .trim()
    .min(3, { message: "Profile name must have at least 3 characters." })
    .max(60, { message: "Profile name can have at most 60 characters." })
    .regex(/^[a-zA-ZčćžšđČĆŽŠĐ]+$/, {
      message: "Profile name can only contain letters.",
    }),
});

export const profileEmailSchema = z.object({
  email: z.string().email().max(254, "Email can have at most 254 characters"),
});

export const inquirySchema = z.object({
  projectType: z.string().min(1).max(100),
  budget: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  siteAddress: z.string().max(200).optional(),
  description: z.string().min(1).max(1000),
});

export const contractorProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(1000).optional(),
  phone: z.string().max(30).optional(),
  email: z
    .string()
    .email()
    .max(254, "Email can have at most 254 characters")
    .optional(),
  trade: z
    .enum([
      "General Contractor",
      "Electrician",
      "Plumber",
      "HVAC Technician",
      "Handyman",
      "Roofer",
      "Landscaper",
      "Mason",
      "Carpenter",
      "Concrete & Paving",
      "Painter",
      "Tiler",
      "Flooring Specialist",
      "Window & Door Specialist",
    ])
    .optional(),
  yearsExperience: z.number().int().min(0).max(60).optional(),
  certifications: z.array(z.string().max(100)).max(20).optional(),
  serviceArea: z
    .object({
      address: z.string().max(200).optional(),
      postcode: z.string().max(20).optional(),
      radiusKm: z.number().int().min(1).max(500).optional(),
    })
    .optional(),
});

export const portfolioItemSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().max(1000).optional(),
  images: z.array(z.string().url()).max(20).optional(),
  projectType: z.string().max(100).optional(),
  location: z.string().max(200).optional(),
  completedAt: z.string().date().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(12, "New password must be at least 12 characters"),
});
