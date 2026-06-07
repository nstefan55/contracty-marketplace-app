import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import crypto from "crypto";

import { verifyCredOtpSchema } from "@/lib/zod";

import connectDB from "@/config/database";
import User from "@/models/User";
import { authRateLimiter } from "@/lib/ratelimit";

const MAX_ATTEMPTS = 5;

export async function POST(request) {
  const cookieStore = await cookies();
  const email = cookieStore.get("signin_email")?.value;

  if (!email) {
    return NextResponse.json(
      { error: "Session expired. Please try signing in again." },
      { status: 401 },
    );
  }

  // Rate limit by IP
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "anonymous";
  const ipLimit = await authRateLimiter.limit(`verify-otp:ip:${ip}`);
  if (!ipLimit.success) {
    return NextResponse.json(
      { error: "Too many requests from this IP. Try again later." },
      { status: 429 },
    );
  }

  // Rate limit by email
  const emailLimit = await authRateLimiter.limit(`verify-otp:${email}`);
  if (!emailLimit.success) {
    return NextResponse.json(
      { error: "Too many attempts for this email. Try again later." },
      { status: 429 },
    );
  }

  let otp;
  try {
    ({ otp } = verifyCredOtpSchema.parse(await request.json()));
  } catch {
    return NextResponse.json(
      { error: "Please enter a valid 6-digit code" },
      { status: 400 },
    );
  }

  await connectDB();
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.otp || !user.otpExpiry) {
    return NextResponse.json(
      { error: "No code found. Please request a new one." },
      { status: 400 },
    );
  }

  if (new Date() > user.otpExpiry) {
    return NextResponse.json(
      { error: "Code has expired. Please request a new one." },
      { status: 400 },
    );
  }

  if (user.otp !== otp) {
    const updated = await User.findOneAndUpdate(
      { email },
      { $inc: { otpAttempts: 1 } },
      { new: true },
    );

    if (updated.otpAttempts >= MAX_ATTEMPTS) {
      await User.updateOne(
        { email },
        { $unset: { otp: "", otpExpiry: "" }, $set: { otpAttempts: 0 } },
      );
      return NextResponse.json(
        {
          error: "Too many incorrect attempts. Please request a new code.",
          lockout: true,
        },
        { status: 429 },
      );
    }

    const remaining = MAX_ATTEMPTS - updated.otpAttempts;
    return NextResponse.json(
      {
        error: `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
      },
      { status: 400 },
    );
  }

  // OTP correct — generate signInToken, clear all OTP state
  const signInToken = crypto.randomBytes(32).toString("hex");
  const signInTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await User.updateOne(
    { email },
    {
      $unset: { otp: "", otpExpiry: "" },
      $set: { otpAttempts: 0, signInToken, signInTokenExpiry },
      // Do NOT touch emailVerified — sign-in is not email verification
    },
  );

  // Bind token to httpOnly cookie — never exposed to client JS
  const response = NextResponse.json({ success: true, email });
  response.cookies.delete("signin_email");
  response.cookies.set("signin_token", signInToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 5 * 60, // matches signInTokenExpiry
  });
  return response;
}
