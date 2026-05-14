import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcryptjs from "bcryptjs";

import connectDB from "@/config/database";
import User from "@/models/User";

export async function POST(request) {
  const { name, email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  await User.create({
    name: name?.trim() || email.split("@")[0],
    email,
    password: hashedPassword,
  });

  const cookieStore = await cookies();
  cookieStore.set("pending_email", email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 30,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
