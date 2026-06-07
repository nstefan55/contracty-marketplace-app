import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";

export async function GET(request, { params }) {
  await connectDB();

  const { slug } = await params;

  const contractor = await Contractor.findOne({
    slug,
  })
    .select("-owner")
    .lean();

  if (!contractor) {
    return NextResponse.json(
      {
        error: "Contractor not found",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(contractor);
}
