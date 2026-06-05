import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15m"),
  prefix: "rl:auth",
  analytics: true,
});

export const actionRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "5m"),
  prefix: "rl:action",
  analytics: true,
});
