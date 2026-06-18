import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  makeCookieStore,
  makeHeaders,
  makeRequest,
} from "../../helpers/next-mocks.mjs";

const cookieStore = makeCookieStore();
const headerStore = makeHeaders({ "x-forwarded-for": "10.0.0.1" });
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
  headers: vi.fn(async () => headerStore),
}));

const limit = vi.fn(async () => ({ success: true }));
vi.mock("@/lib/ratelimit", () => ({
  authRateLimiter: { limit },
}));

const redisGet = vi.fn();
const redisDel = vi.fn(async () => 1);
vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: () => ({ get: redisGet, del: redisDel }),
  },
}));

const connectDB = vi.fn(async () => {});
vi.mock("@/config/database", () => ({ default: connectDB }));

const findOne = vi.fn();
const updateOne = vi.fn(async () => ({ acknowledged: true }));
vi.mock("@/models/User", () => ({
  default: {
    findOne: (...args) => findOne(...args),
    updateOne: (...args) => updateOne(...args),
  },
}));

let POST;
beforeEach(async () => {
  vi.clearAllMocks();
  for (const k of Object.keys(cookieStore._bag)) delete cookieStore._bag[k];
  cookieStore._bag.pending_email = "user@example.com";
  limit.mockResolvedValue({ success: true });
  ({ POST } = await import("@/app/api/onboarding/verify-otp/route"));
});

describe("POST /api/onboarding/verify-otp", () => {
  it("happy path: valid OTP issues a signInToken and marks emailVerified", async () => {
    findOne.mockResolvedValueOnce({
      _id: "u1",
      email: "user@example.com",
      otp: "123456",
      otpExpiry: new Date(Date.now() + 60_000),
    });
    redisGet.mockResolvedValueOnce(null);

    const res = await POST(makeRequest({ otp: "123456" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.email).toBe("user@example.com");
    expect(body.signInToken).toMatch(/^[a-f0-9]{64}$/);
    expect(updateOne).toHaveBeenCalledWith(
      { email: "user@example.com" },
      expect.objectContaining({
        emailVerified: expect.any(Date),
        otp: null,
        otpExpiry: null,
        signInToken: expect.any(String),
        signInTokenExpiry: expect.any(Date),
      }),
    );
    expect(cookieStore.delete).toHaveBeenCalledWith("pending_email");
  });

  it("prefers the Redis-cached OTP over the DB OTP when both are present", async () => {
    findOne.mockResolvedValueOnce({
      _id: "u1",
      email: "user@example.com",
      otp: "000000",
      otpExpiry: new Date(Date.now() + 60_000),
    });
    redisGet.mockResolvedValueOnce("999111");

    const wrong = await POST(makeRequest({ otp: "000000" }));
    expect(wrong.status).toBe(400);

    // New attempt with the Redis value
    findOne.mockResolvedValueOnce({
      _id: "u1",
      email: "user@example.com",
      otp: "000000",
      otpExpiry: new Date(Date.now() + 60_000),
    });
    redisGet.mockResolvedValueOnce("999111");

    const right = await POST(makeRequest({ otp: "999111" }));
    expect(right.status).toBe(200);
  });

  it("returns 429 when the per-IP rate limit trips", async () => {
    limit.mockResolvedValueOnce({ success: false });
    const res = await POST(makeRequest({ otp: "123456" }));
    expect(res.status).toBe(429);
  });

  it("returns 429 when the per-email rate limit trips (IP passes)", async () => {
    limit
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false });
    const res = await POST(makeRequest({ otp: "123456" }));
    expect(res.status).toBe(429);
  });

  it("returns 401 when the pending_email cookie is missing", async () => {
    delete cookieStore._bag.pending_email;
    const res = await POST(makeRequest({ otp: "123456" }));
    expect(res.status).toBe(401);
  });

  it("returns 404 when the user is missing", async () => {
    findOne.mockResolvedValueOnce(null);
    const res = await POST(makeRequest({ otp: "123456" }));
    expect(res.status).toBe(404);
  });

  it("returns 400 when the OTP is expired", async () => {
    findOne.mockResolvedValueOnce({
      _id: "u1",
      email: "user@example.com",
      otp: "123456",
      otpExpiry: new Date(Date.now() - 1000),
    });
    redisGet.mockResolvedValueOnce(null);
    const res = await POST(makeRequest({ otp: "123456" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when no OTP has been issued yet", async () => {
    findOne.mockResolvedValueOnce({
      _id: "u1",
      email: "user@example.com",
      otp: null,
      otpExpiry: null,
    });
    const res = await POST(makeRequest({ otp: "123456" }));
    expect(res.status).toBe(400);
  });

  it("rejects non-6-digit OTPs via zod (throws)", async () => {
    await expect(POST(makeRequest({ otp: "12345" }))).rejects.toThrow();
  });

  it("survives Redis read failures by falling back to the DB OTP", async () => {
    findOne.mockResolvedValueOnce({
      _id: "u1",
      email: "user@example.com",
      otp: "123456",
      otpExpiry: new Date(Date.now() + 60_000),
    });
    redisGet.mockRejectedValueOnce(new Error("redis down"));
    const res = await POST(makeRequest({ otp: "123456" }));
    expect(res.status).toBe(200);
  });

  it("survives Redis delete failures after a successful verification", async () => {
    findOne.mockResolvedValueOnce({
      _id: "u1",
      email: "user@example.com",
      otp: "123456",
      otpExpiry: new Date(Date.now() + 60_000),
    });
    redisGet.mockResolvedValueOnce(null);
    redisDel.mockRejectedValueOnce(new Error("redis down"));
    const res = await POST(makeRequest({ otp: "123456" }));
    expect(res.status).toBe(200);
  });
});
