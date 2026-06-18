import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock both upstash packages BEFORE importing the module under test.
vi.mock("@upstash/redis", () => {
  return {
    Redis: { fromEnv: vi.fn(() => ({ __mock: "redis" })) },
  };
});

const ratelimitCtorSpy = vi.fn();
vi.mock("@upstash/ratelimit", () => {
  const slidingWindow = vi.fn((max, window) => ({
    __limiter: "sliding",
    max,
    window,
  }));
  class Ratelimit {
    constructor(opts) {
      ratelimitCtorSpy(opts);
      this.opts = opts;
    }
  }
  Ratelimit.slidingWindow = slidingWindow;
  return { Ratelimit };
});

beforeEach(() => {
  ratelimitCtorSpy.mockClear();
});

describe("rate-limiters module", () => {
  it("constructs auth and action limiters with the documented thresholds", async () => {
    const mod = await import("@/lib/ratelimit");
    expect(mod.authRateLimiter).toBeDefined();
    expect(mod.actionRateLimiter).toBeDefined();

    const calls = ratelimitCtorSpy.mock.calls.map((c) => c[0]);
    const auth = calls.find((c) => c.prefix === "rl:auth");
    const action = calls.find((c) => c.prefix === "rl:action");

    expect(auth).toBeDefined();
    expect(auth.analytics).toBe(true);
    expect(auth.limiter).toEqual({
      __limiter: "sliding",
      max: 5,
      window: "15m",
    });

    expect(action).toBeDefined();
    expect(action.analytics).toBe(true);
    expect(action.limiter).toEqual({
      __limiter: "sliding",
      max: 20,
      window: "5m",
    });
  });
});
