import { actionRateLimiter } from "@/lib/ratelimit";

import { headers } from "next/headers";

export async function checkActionRateLimit(identifier) {
  let key = identifier;

  if (!key) {
    const headersList = await headers();
    key = headersList.get("x-forwarded-for") ?? "anonymous";
  }

  const { success, reset } = await actionRateLimiter.limit(key);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    throw new Error(
      `Too many requests. Please try again in ${retryAfter} seconds.`,
    );
  }
}
