import { describe, it, expect } from "vitest";
import { saltAndHashPassword, verifyPassword } from "@/lib/password";

describe("password helpers", () => {
  it("produces a bcrypt-formatted hash", async () => {
    const hash = await saltAndHashPassword("supersecret123");
    expect(hash).toMatch(/^\$2[aby]\$10\$/);
    expect(hash).not.toContain("supersecret123");
  });

  it("verifies a matching password", async () => {
    const hash = await saltAndHashPassword("supersecret123");
    expect(await verifyPassword("supersecret123", hash)).toBe(true);
  });

  it("rejects a non-matching password", async () => {
    const hash = await saltAndHashPassword("supersecret123");
    expect(await verifyPassword("wrongpassword!!", hash)).toBe(false);
  });

  it("rejects empty password against a real hash", async () => {
    const hash = await saltAndHashPassword("supersecret123");
    expect(await verifyPassword("", hash)).toBe(false);
  });

  it("produces different hashes for the same password (salt is fresh)", async () => {
    const a = await saltAndHashPassword("samepassword12");
    const b = await saltAndHashPassword("samepassword12");
    expect(a).not.toBe(b);
    expect(await verifyPassword("samepassword12", a)).toBe(true);
    expect(await verifyPassword("samepassword12", b)).toBe(true);
  });
});
