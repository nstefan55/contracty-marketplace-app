import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import crypto from "crypto";

import { authRateLimiter } from "@/lib/ratelimit";
import { Redis } from "@upstash/redis";

import { verifyCredOtpSchema } from "@/lib/zod";

import connectDB from "@/config/database";
import User from "@/models/User";

const redis = Redis.fromEnv();

export async function POST(request) {
  const { otp } = verifyCredOtpSchema.parse(await request.json());

  if (!otp || otp.length !== 6) {
    return NextResponse.json(
      { error: "Please enter a 6-digit code" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;

  if (!email) {
    return NextResponse.json(
      { error: "Session expired. Please sign up again." },
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

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.otp || !user.otpExpiry) {
    return NextResponse.json(
      { error: "No verification code found. Please request a new one." },
      { status: 400 },
    );
  }

  if (new Date() > user.otpExpiry) {
    return NextResponse.json(
      { error: "Code has expired. Please request a new one." },
      { status: 400 },
    );
  }

  // Check Redis first; fall back to the OTP stored in MongoDB
  let expectedOtp = user.otp;
  try {
    const cachedOtp = await redis.get(`otp:${email}`);
    if (cachedOtp) expectedOtp = cachedOtp;
  } catch (redisErr) {
    console.error("Redis OTP read failed, using DB");
  }

  if (expectedOtp !== otp) {
    return NextResponse.json(
      { error: "Incorrect code. Please try again." },
      { status: 400 },
    );
  }

  const signInToken = crypto.randomBytes(32).toString("hex");
  const signInTokenExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await User.updateOne(
    { email },
    {
      emailVerified: new Date(),
      otp: null,
      otpExpiry: null,
      signInToken,
      signInTokenExpiry,
    },
  );

  try {
    await redis.del(`otp:${email}`);
  } catch (redisErr) {
    console.error("Redis OTP delete failed:", redisErr);
  }

  cookieStore.delete("pending_email");

  return NextResponse.json({ success: true, email, signInToken });
}