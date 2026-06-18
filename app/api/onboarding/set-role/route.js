import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/config/database";
import User from "@/models/User";
import { resend } from "@/config/resend";
import { auth } from "@/app/auth";
import { Redis } from "@upstash/redis";

import { roleSchema } from "@/lib/zod";

import crypto from "crypto";

const redis = Redis.fromEnv();

function generateOTP() {
  return crypto.randomInt(100000, 1000000).toString();
}

export async function POST(request) {
  const { role } = roleSchema.parse(await request.json());

  await connectDB();

  const session = await auth();
  const cookieStore = await cookies();
  const pendingEmail = cookieStore.get("pending_email")?.value;
  const email = session?.user?.email || pendingEmail;

  if (!email) {
    return NextResponse.json(
      { error: "Session expired. Please sign up again." },
      { status: 401 },
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!session?.user && !user?.needsOnboarding) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Google user: save role and mark onboarding complete, no OTP needed
  if (session?.user) {
    await User.updateOne({ email }, { role, needsOnboarding: false });
    // Set a short-lived cookie so middleware can bypass the stale JWT
    // immediately — auth.js v5 beta doesn't reliably update the JWT cookie
    // via update(), so we can't depend on JWT refresh for the next redirect.
    cookieStore.set("onboarding_done", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10, // 10 minutes — long enough to reach /onboarding/welcome and /
    });
    return NextResponse.json({ success: true, requiresOTP: false });
  }

  // Credentials user: save role and send OTP
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await User.updateOne({ email }, { role, otp, otpExpiry });

  if (process.env.NODE_ENV === "development")
    console.log(`[OTP] ${email} → ${otp}`);

  await resend.emails.send({
    from: "Contracty <onboarding@contracty.com>",
    to: email,
    subject: "Your Contracty verification code",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 420px; margin: 0 auto; padding: 48px 24px; background: #ffffff;">
        <img src="https://res.cloudinary.com/devslulj5/image/upload/v1777836733/default-image_yywmnk.png" alt="Contracty" width="48" style="margin-bottom: 24px;" />
        <h2 style="color: #1e293b; font-size: 22px; margin: 0 0 8px;">Verify your email address</h2>
        <p style="color: #64748b; font-size: 15px; margin: 0 0 32px;">Enter this code to complete your Contracty account. It expires in 10 minutes.</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 32px;">
          <span style="font-size: 40px; font-weight: 700; letter-spacing: 10px; color: #1e293b; font-family: monospace;">${otp}</span>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">If you didn't create a Contracty account, you can safely ignore this email.</p>
      </div>
    `,
  });

  try {
    await redis.set(`otp:${email}`, otp, { ex: 600 });
  } catch (redisErr) {
    console.error("OTP write failed");
  }

  return NextResponse.json({ success: true, requiresOTP: true });
}