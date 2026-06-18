import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(request, { params }) {
  const { slug } = await params;
  const cacheKey = `contractors:${slug}`;

  try {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json({
        data: cachedData.contractor,
        meta: { slug },
        source: "cache",
      });
    }

    await connectDB();

    const contractor = await Contractor.findOne({ slug })
      .select("-owner")
      .lean();

    if (!contractor) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 },
      );
    }

    await redis.set(cacheKey, { contractor }, { ex: 600 });

    return NextResponse.json({
      data: contractor,
      meta: { slug },
      source: "database",
    });
  } catch (err) {
    console.error("Error fetching contractor");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
