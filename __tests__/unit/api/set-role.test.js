import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeCookieStore, makeRequest } from "../../helpers/next-mocks.mjs";

const cookieStore = makeCookieStore();
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
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

const resendSend = vi.fn(async () => ({ id: "msg_1" }));
vi.mock("@/config/resend", () => ({
  resend: { emails: { send: resendSend } },
}));

const auth = vi.fn();
vi.mock("@/app/auth", () => ({ auth }));

const redisSet = vi.fn(async () => "OK");
vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: () => ({ set: redisSet }) },
}));

let POST;
beforeEach(async () => {
  // resetAllMocks (not clearAllMocks) is required: clear leaves queued
  // mockResolvedValueOnce values intact, and prior tests that throw before
  // consuming them poison subsequent tests.
  vi.resetAllMocks();
  // re-establish stable default implementations cleared by resetAllMocks
  redisSet.mockResolvedValue("OK");
  resendSend.mockResolvedValue({ id: "msg_1" });
  updateOne.mockResolvedValue({ acknowledged: true });
  connectDB.mockResolvedValue();
  for (const k of Object.keys(cookieStore._bag)) delete cookieStore._bag[k];
  ({ POST } = await import("@/app/api/onboarding/set-role/route"));
});

describe("POST /api/onboarding/set-role", () => {
  it("returns 401 when there is no session and no pending_email cookie", async () => {
    auth.mockResolvedValueOnce(null);
    const res = await POST(makeRequest({ role: "homeowner" }));
    expect(res.status).toBe(401);
  });

  it("returns 404 when the user record is missing", async () => {
    auth.mockResolvedValueOnce(null);
    cookieStore._bag.pending_email = "ghost@example.com";
    findOne.mockResolvedValueOnce(null);

    const res = await POST(makeRequest({ role: "contractor" }));
    expect(res.status).toBe(404);
  });

  it("Google user (has session): writes role, sets onboarding_done cookie, no OTP", async () => {
    auth.mockResolvedValueOnce({
      user: { email: "google@example.com", id: "u1" },
    });
    findOne.mockResolvedValueOnce({
      _id: "u1",
      email: "google@example.com",
      needsOnboarding: true,
    });

    const res = await POST(makeRequest({ role: "contractor" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ success: true, requiresOTP: false });
    expect(updateOne).toHaveBeenCalledWith(
      { email: "google@example.com" },
      { role: "contractor", needsOnboarding: false },
    );
    expect(cookieStore.set).toHaveBeenCalledWith(
      "onboarding_done",
      "1",
      expect.objectContaining({ httpOnly: true, maxAge: 600 }),
    );
    expect(resendSend).not.toHaveBeenCalled();
  });

  it("Credentials user (cookie path): writes role, sends OTP email, mirrors to Redis", async () => {
    auth.mockResolvedValueOnce(null);
    cookieStore._bag.pending_email = "cred@example.com";
    findOne.mockResolvedValueOnce({
      _id: "u2",
      email: "cred@example.com",
      needsOnboarding: true,
    });

    const res = await POST(makeRequest({ role: "homeowner" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ success: true, requiresOTP: true });

    // role + otp + otpExpiry written
    expect(updateOne).toHaveBeenCalledWith(
      { email: "cred@example.com" },
      expect.objectContaining({
        role: "homeowner",
        otp: expect.stringMatching(/^\d{6}$/),
        otpExpiry: expect.any(Date),
      }),
    );
    expect(resendSend).toHaveBeenCalledTimes(1);
    expect(redisSet).toHaveBeenCalledWith(
      "otp:cred@example.com",
      expect.stringMatching(/^\d{6}$/),
      { ex: 600 },
    );
  });

  it("returns 403 when an unauthenticated user targets an already-onboarded account", async () => {
    auth.mockResolvedValueOnce(null);
    cookieStore._bag.pending_email = "done@example.com";
    findOne.mockResolvedValueOnce({
      _id: "u3",
      email: "done@example.com",
      needsOnboarding: false,
    });

    const res = await POST(makeRequest({ role: "homeowner" }));
    expect(res.status).toBe(403);
  });

  it("throws on invalid role payload (zod)", async () => {
    auth.mockResolvedValueOnce({ user: { email: "x@y.com" } });
    await expect(POST(makeRequest({ role: "wizard" }))).rejects.toThrow();
  });

  it("survives a Redis write failure without breaking the response", async () => {
    auth.mockResolvedValueOnce(null);
    cookieStore._bag.pending_email = "cred@example.com";
    findOne.mockResolvedValueOnce({
      _id: "u4",
      email: "cred@example.com",
      needsOnboarding: true,
    });
    redisSet.mockRejectedValueOnce(new Error("redis down"));

    const res = await POST(makeRequest({ role: "homeowner" }));
    expect(res.status).toBe(200);
    expect((await res.json()).requiresOTP).toBe(true);
  });
});
