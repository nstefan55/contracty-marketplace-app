import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import connectDB from "@/config/database";
import User from "@/models/User";
import { saltAndHashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/zod";

export async function POST(request) {
  try {
    const { name, email, password } = registerSchema.parse(
      await request.json(),
    );

    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await saltAndHashPassword(password);

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
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }
    console.error("[register]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
