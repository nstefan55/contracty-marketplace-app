import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDB from "@/config/database";
import User from "@/models/User";
import { resend } from "@/config/resend";

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;

  if (!email) {
    return NextResponse.json(
      { error: "Session expired. Please sign up again." },
      { status: 401 },
    );
  }

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.emailVerified) {
    return NextResponse.json(
      { error: "Email is already verified" },
      { status: 400 },
    );
  }

  // Rate limit: block if last OTP was sent less than 60s ago
  if (user.otpExpiry && user.otpExpiry > new Date(Date.now() + 9 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Please wait before requesting a new code" },
      { status: 429 },
    );
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await User.updateOne({ email }, { otp, otpExpiry });

  if (process.env.NODE_ENV === "development") {
    console.log(`[OTP] ${email} → ${otp}`);
  }

  await resend.emails.send({
    from: "Contracty <onboarding@contracty.com>",
    to: email,
    subject: "Your new Contracty verification code",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 420px; margin: 0 auto; padding: 48px 24px;">
        <h2 style="color: #1e293b; font-size: 22px; margin: 0 0 8px;">New verification code</h2>
        <p style="color: #64748b; font-size: 15px; margin: 0 0 32px;">Here is your new code. It expires in 10 minutes.</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 32px;">
          <span style="font-size: 40px; font-weight: 700; letter-spacing: 10px; color: #1e293b; font-family: monospace;">${otp}</span>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
