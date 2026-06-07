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
