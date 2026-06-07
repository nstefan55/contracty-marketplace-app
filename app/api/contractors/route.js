import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";

export async function GET(request) {
  await connectDB();

  const [contractors, total] = await Promise.all([
    Contractor.find().select("-owner").lean(),
    Contractor.countDocuments(),
  ]);

  return NextResponse.json({
    data: contractors,
    meta: {
      total,
    },
  });
}
