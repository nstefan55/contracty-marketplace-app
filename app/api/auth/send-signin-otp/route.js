import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import React from "react";
import { z } from "zod";

import connectDB from "@/config/database";
import User from "@/models/User";
import { resend } from "@/config/resend";
import SignInOTP from "@/emails/SignInOTP";

const verifyEmail = z.object({ email: z.string().email() });

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  const { email } = verifyEmail.parse(await request.json());

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email });

  // Don't reveal whether the account exists
  if (!user) {
    return NextResponse.json({ success: true });
  }

  // Rate limit: block if last OTP was sent less than 60s ago
  if (user.otpExpiry && user.otpExpiry > new Date(Date.now() + 9 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Please wait before requesting another code." },
      { status: 429 },
    );
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await User.updateOne({ email }, { otp, otpExpiry, otpAttempts: 0 });

  if (process.env.NODE_ENV === "development")
    console.log(`[OTP] ${email} → ${otp}`);

  const cookieStore = await cookies();
  cookieStore.set("signin_email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  const { error: emailError } = await resend.emails.send({
    from: "Contracty <onboarding@resend.dev>",
    to: email,
    subject: "Your Contracty sign-in code",
    react: SignInOTP({ verificationCode: otp, userEmail: email }),
  });

  if (emailError) console.error("[send-signin-otp] Resend error:", emailError);

  return NextResponse.json({ success: true });
}
