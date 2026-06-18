import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeCookieStore, makeRequest } from "../../helpers/next-mocks.mjs";

const cookieStore = makeCookieStore();
vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => cookieStore),
  headers: vi.fn(async () => ({ get: () => null })),
}));

const connectDB = vi.fn(async () => {});
vi.mock("@/config/database", () => ({ default: connectDB }));

const findOne = vi.fn();
const create = vi.fn();
vi.mock("@/models/User", () => ({
  default: {
    findOne: (...args) => findOne(...args),
    create: (...args) => create(...args),
  },
}));

const saltAndHashPassword = vi.fn(async (pw) => `hashed:${pw}`);
vi.mock("@/lib/password", () => ({ saltAndHashPassword }));

let POST;
beforeEach(async () => {
  vi.clearAllMocks();
  // Reset cookie bag between tests.
  for (const k of Object.keys(cookieStore._bag)) delete cookieStore._bag[k];
  ({ POST } = await import("@/app/api/register/route"));
});

describe("POST /api/register", () => {
  it("creates a new user, hashes the password, sets pending_email cookie", async () => {
    findOne.mockResolvedValueOnce(null);
    create.mockResolvedValueOnce({ _id: "u1" });

    const res = await POST(
      makeRequest({
        name: "Alice Builder",
        email: "alice@example.com",
        password: "areallystrongpw",
      }),
    );
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(saltAndHashPassword).toHaveBeenCalledWith("areallystrongpw");
    expect(create).toHaveBeenCalledWith({
      name: "Alice Builder",
      email: "alice@example.com",
      password: "hashed:areallystrongpw",
    });
    expect(cookieStore.set).toHaveBeenCalledWith(
      "pending_email",
      "alice@example.com",
      expect.objectContaining({ httpOnly: true, sameSite: "lax" }),
    );
  });

  it("falls back to the email-local-part when name is missing", async () => {
    findOne.mockResolvedValueOnce(null);
    create.mockResolvedValueOnce({ _id: "u1" });

    await POST(
      makeRequest({
        email: "bob@example.com",
        password: "areallystrongpw",
      }),
    );

    expect(create.mock.calls[0][0].name).toBe("bob");
  });

  it("returns 409 when the email is already registered", async () => {
    findOne.mockResolvedValueOnce({ _id: "existing" });

    const res = await POST(
      makeRequest({
        email: "dup@example.com",
        password: "areallystrongpw",
      }),
    );
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({
      error: "An account with this email already exists",
    });
    expect(create).not.toHaveBeenCalled();
  });

  // NOTE: production code in app/api/register/route.js currently accesses
  // `error.errors[0]?.message` which is undefined on zod v4 (the field is
  // `error.issues` now). The TypeError thrown inside the catch is itself
  // uncaught, so the route currently crashes on invalid input instead of
  // returning a 400. This test documents the bug — see the audit report.
  it("[BUG] currently throws instead of returning 400 on invalid input (zod v4)", async () => {
    await expect(
      POST(makeRequest({ email: "bad-email", password: "shortpw" })),
    ).rejects.toThrow();
  });

  it("treats duplicate-key Mongo error (code 11000) as a 409", async () => {
    findOne.mockResolvedValueOnce(null);
    const dupErr = Object.assign(new Error("dup"), { code: 11000 });
    create.mockRejectedValueOnce(dupErr);

    const res = await POST(
      makeRequest({
        email: "race@example.com",
        password: "areallystrongpw",
      }),
    );
    expect(res.status).toBe(409);
  });

  it("returns a 500 for unknown errors", async () => {
    findOne.mockRejectedValueOnce(new Error("boom"));
    const res = await POST(
      makeRequest({
        email: "x@example.com",
        password: "areallystrongpw",
      }),
    );
    expect(res.status).toBe(500);
  });
});
