import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import React from "react";

import connectDB from "@/config/database";
import User from "@/models/User";
import { resend } from "@/config/resend";
import SignInOTP from "@/emails/SignInOTP";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST() {
  const cookieStore = await cookies();
  const email = cookieStore.get("signin_email")?.value;

  if (!email) {
    return NextResponse.json(
      { error: "Session expired. Please try signing in again." },
      { status: 401 },
    );
  }

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Rate limit: block if last OTP was sent less than 60s ago
  if (user.otpExpiry && user.otpExpiry > new Date(Date.now() + 9 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Please wait before requesting a new code." },
      { status: 429 },
    );
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await User.updateOne({ email }, { otp, otpExpiry, otpAttempts: 0 });

  if (process.env.NODE_ENV === "development")
    console.log(`[OTP] ${email} → ${otp}`);

  const { error: emailError } = await resend.emails.send({
    from: "Contracty <onboarding@resend.dev>",
    to: email,
    subject: "Your new Contracty sign-in code",
    react: SignInOTP({ verificationCode: otp, userEmail: email }),
  });

  if (emailError)
    console.error("[resend-signin-otp] Resend error:", emailError);

  return NextResponse.json({ success: true });
}
