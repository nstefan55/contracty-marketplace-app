import { describe, it, expect, vi } from "vitest";

// next-auth pulls in next/server which Vitest can't resolve without the .js
// extension under Node ESM. We don't need the real CredentialsSignin class —
// just a stand-in base so the prototype chain is verifiable.
class FakeCredentialsSignin extends Error {}
vi.mock("next-auth", () => ({ CredentialsSignin: FakeCredentialsSignin }));

const { RateLimitError } = await import("@/lib/error");

describe("RateLimitError", () => {
  it("extends the CredentialsSignin base", () => {
    const err = new RateLimitError(5);
    expect(err).toBeInstanceOf(FakeCredentialsSignin);
    expect(err).toBeInstanceOf(Error);
  });

  it("encodes the retry-after window in the code", () => {
    expect(new RateLimitError(7).code).toBe(
      "Too many attempts. Please try again in 7 minute(s).",
    );
  });

  it("handles zero / large values without throwing", () => {
    expect(new RateLimitError(0).code).toContain("0 minute(s)");
    expect(new RateLimitError(999).code).toContain("999 minute(s)");
  });
});
