import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

import connectDB from "@/config/database";
import User from "@/models/User";

export async function POST(request) {
  const { otp } = await request.json();

  if (!otp || otp.length !== 6) {
    return NextResponse.json(
      { error: "Please enter a 6-digit code" },
      { status: 400 },
    );
  }

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
      emailVerified: user.emailVerified ?? new Date(),
      otp: null,
      otpExpiry: null,
      signInToken,
      signInTokenExpiry,
    },
  );

  cookieStore.delete("signin_email");

  return NextResponse.json({ success: true, email, signInToken });
}