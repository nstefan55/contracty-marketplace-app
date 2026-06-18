import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Contractor from "@/models/Contractor";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(request) {
  const cacheKey = "contractors:all";

  try {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json({
        data: cachedData.contractors,
        meta: { total: cachedData.total },
        source: "cache",
      });
    }
  } catch (redisErr) {
    console.error("Redis read error, falling back to DB:", redisErr);
  }

  try {
    await connectDB();

    const [contractors, total] = await Promise.all([
      Contractor.find().select("-owner").lean(),
      Contractor.countDocuments(),
    ]);

    try {
      await redis.set(cacheKey, { contractors, total }, { ex: 600 });
    } catch (redisErr) {
      console.error("Redis write error, skipping cache:", redisErr);
    }

    return NextResponse.json({
      data: contractors,
      meta: { total },
      source: "database",
    });
  } catch (err) {
    console.error("DB error fetching contractors:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
