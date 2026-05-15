import { object, string } from "zod";

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
