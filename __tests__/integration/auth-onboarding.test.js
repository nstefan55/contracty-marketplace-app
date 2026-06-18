// End-to-end style: drive the real route handlers against a real Mongo
// (via mongodb-memory-server). We mock Resend (email), Upstash Redis, and the
// `auth()` helper — but everything from request → zod → Mongoose → JWT shape
// is real. We pick direct invocation of the route exports rather than
// next-test-api-route-handler because the handlers are plain `async function POST`
// taking a thin Request — wrapping them adds friction without buying anything.
import { describe, it, expect, vi, beforeEach } from "vitest";

import { makeCookieStore, makeRequest } from "../helpers/next-mocks.mjs";

const cookieStore = makeCookieStore();
const headerStore = { get: (k) => (k === "x-forwarded-for" ? "10.0.0.1" : null) };
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
  headers: vi.fn(async () => headerStore),
}));

const resendSend = vi.fn(async () => ({ id: "msg_int" }));
vi.mock("@/config/resend", () => ({
  resend: { emails: { send: resendSend } },
}));

const redisState = new Map();
vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: () => ({
      get: vi.fn(async (k) => redisState.get(k) ?? null),
      set: vi.fn(async (k, v) => {
        redisState.set(k, v);
        return "OK";
      }),
      del: vi.fn(async (k) => {
        redisState.delete(k);
        return 1;
      }),
    }),
  },
}));

const limit = vi.fn(async () => ({ success: true, reset: Date.now() + 60_000 }));
vi.mock("@/lib/ratelimit", () => ({
  authRateLimiter: { limit },
  actionRateLimiter: { limit },
}));

const authFn = vi.fn(async () => null);
vi.mock("@/app/auth", () => ({ auth: authFn }));

let registerPOST;
let setRolePOST;
let verifyOtpPOST;
let User;

beforeEach(async () => {
  for (const k of Object.keys(cookieStore._bag)) delete cookieStore._bag[k];
  redisState.clear();
  resendSend.mockClear();
  limit.mockClear();
  limit.mockResolvedValue({ success: true, reset: Date.now() + 60_000 });
  authFn.mockReset();
  authFn.mockResolvedValue(null);

  ({ POST: registerPOST } = await import("@/app/api/register/route"));
  ({ POST: setRolePOST } = await import(
    "@/app/api/onboarding/set-role/route"
  ));
  ({ POST: verifyOtpPOST } = await import(
    "@/app/api/onboarding/verify-otp/route"
  ));
  ({ default: User } = await import("@/models/User"));
});

describe("Credentials sign-up + onboarding integration", () => {
  it("walks the full signup → set-role → OTP-verify flow end-to-end", async () => {
    // 1. Register
    const regRes = await registerPOST(
      makeRequest({
        name: "Alice Builder",
        email: "alice@example.com",
        password: "areallystrongpw",
      }),
    );
    expect(regRes.status).toBe(200);
    expect(cookieStore._bag.pending_email).toBe("alice@example.com");

    const created = await User.findOne({ email: "alice@example.com" });
    expect(created).toBeTruthy();
    expect(created.password).toMatch(/^\$2[aby]\$/);
    expect(created.emailVerified).toBeNull();

    // NOTE: register/route.js does NOT set needsOnboarding: true on the new
    // user, but set-role/route.js's cookie-only branch requires it
    // (`if (!session?.user && !user?.needsOnboarding) return 403`). In
    // production this means Credentials signups are blocked from completing
    // onboarding via the cookie path. We set it here to exercise the
    // intended flow; the audit report flags this as a registration bug.
    await User.updateOne(
      { email: "alice@example.com" },
      { needsOnboarding: true },
    );

    // 2. Set role (no session — relies on pending_email cookie)
    const roleRes = await setRolePOST(makeRequest({ role: "contractor" }));
    const roleBody = await roleRes.json();
    expect(roleRes.status).toBe(200);
    expect(roleBody).toEqual({ success: true, requiresOTP: true });
    expect(resendSend).toHaveBeenCalledTimes(1);

    const afterRole = await User.findOne({ email: "alice@example.com" });
    expect(afterRole.role).toBe("contractor");
    expect(afterRole.otp).toMatch(/^\d{6}$/);
    expect(afterRole.otpExpiry).toBeInstanceOf(Date);

    // 3. Verify OTP
    const otpRes = await verifyOtpPOST(makeRequest({ otp: afterRole.otp }));
    const otpBody = await otpRes.json();
    expect(otpRes.status).toBe(200);
    expect(otpBody.success).toBe(true);
    expect(otpBody.email).toBe("alice@example.com");
    expect(otpBody.signInToken).toMatch(/^[a-f0-9]{64}$/);

    const verified = await User.findOne({ email: "alice@example.com" });
    expect(verified.emailVerified).toBeInstanceOf(Date);
    expect(verified.otp).toBeNull();
    expect(verified.signInToken).toBe(otpBody.signInToken);
    expect(cookieStore._bag.pending_email).toBeUndefined();
  });

  it("blocks duplicate registration with a 409", async () => {
    await User.create({
      email: "dup@example.com",
      password: "stub",
    });
    const res = await registerPOST(
      makeRequest({
        email: "dup@example.com",
        password: "areallystrongpw",
      }),
    );
    expect(res.status).toBe(409);
  });

  it("rejects the wrong OTP without consuming the verification window", async () => {
    await User.create({
      email: "bob@example.com",
      password: "stub",
      otp: "111111",
      otpExpiry: new Date(Date.now() + 60_000),
    });
    cookieStore._bag.pending_email = "bob@example.com";

    const res = await verifyOtpPOST(makeRequest({ otp: "999999" }));
    expect(res.status).toBe(400);

    const stillHasOtp = await User.findOne({ email: "bob@example.com" });
    expect(stillHasOtp.otp).toBe("111111");
    expect(stillHasOtp.emailVerified).toBeNull();
  });

  it("returns 400 when the OTP has expired", async () => {
    await User.create({
      email: "stale@example.com",
      password: "stub",
      otp: "222222",
      otpExpiry: new Date(Date.now() - 1000),
    });
    cookieStore._bag.pending_email = "stale@example.com";

    const res = await verifyOtpPOST(makeRequest({ otp: "222222" }));
    expect(res.status).toBe(400);
  });

  it("returns 429 once the per-IP rate-limit is exhausted", async () => {
    cookieStore._bag.pending_email = "rl@example.com";
    await User.create({
      email: "rl@example.com",
      password: "stub",
      otp: "333333",
      otpExpiry: new Date(Date.now() + 60_000),
    });
    limit.mockResolvedValueOnce({
      success: false,
      reset: Date.now() + 60_000,
    });
    const res = await verifyOtpPOST(makeRequest({ otp: "333333" }));
    expect(res.status).toBe(429);
  });
});

describe("Google sign-in branch of set-role", () => {
  it("marks needsOnboarding=false and writes role for an authenticated Google user", async () => {
    const user = await User.create({
      email: "google@example.com",
      needsOnboarding: true,
    });
    authFn.mockResolvedValue({
      user: { email: "google@example.com", id: user._id.toString() },
    });

    const res = await setRolePOST(makeRequest({ role: "homeowner" }));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ success: true, requiresOTP: false });
    expect(cookieStore._bag.onboarding_done).toBe("1");

    const after = await User.findOne({ email: "google@example.com" });
    expect(after.role).toBe("homeowner");
    expect(after.needsOnboarding).toBe(false);
    expect(resendSend).not.toHaveBeenCalled();
  });

  it("returns 403 when no session and the account is already onboarded", async () => {
    await User.create({
      email: "done@example.com",
      role: "homeowner",
      needsOnboarding: false,
    });
    cookieStore._bag.pending_email = "done@example.com";

    const res = await setRolePOST(makeRequest({ role: "contractor" }));
    expect(res.status).toBe(403);
  });
});
