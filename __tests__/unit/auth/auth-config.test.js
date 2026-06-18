import { describe, it, expect } from "vitest";
import { authConfig } from "@/auth.config";

describe("authConfig (slim, middleware-safe)", () => {
  it("trusts the host so it works behind Vercel's proxy", () => {
    expect(authConfig.trustHost).toBe(true);
  });

  it("exposes a /signin page", () => {
    expect(authConfig.pages.signIn).toBe("/signin");
  });

  it("declares no providers (the rich config lives in app/auth.js)", () => {
    expect(authConfig.providers).toEqual([]);
  });

  describe("jwt callback", () => {
    const { jwt } = authConfig.callbacks;

    it("returns the token unchanged when no user is present", async () => {
      const t = { id: "x", role: "homeowner", needsOnboarding: false };
      expect(await jwt({ token: { ...t } })).toEqual(t);
    });

    it("hydrates id / role / needsOnboarding when user is supplied", async () => {
      const out = await jwt({
        token: {},
        user: {
          id: "u1",
          role: "contractor",
          needsOnboarding: true,
        },
      });
      expect(out).toEqual({
        id: "u1",
        role: "contractor",
        needsOnboarding: true,
      });
    });

    it("falls back to defaults when user fields are missing", async () => {
      const out = await jwt({ token: {}, user: { id: "u2" } });
      expect(out.id).toBe("u2");
      expect(out.role).toBeNull();
      expect(out.needsOnboarding).toBe(false);
    });
  });

  describe("session callback", () => {
    const { session } = authConfig.callbacks;

    it("projects token fields onto session.user", async () => {
      const s = await session({
        session: { user: {} },
        token: {
          id: "u1",
          role: "contractor",
          needsOnboarding: false,
          contractorSlug: "alice-builders",
        },
      });
      expect(s.user).toMatchObject({
        id: "u1",
        role: "contractor",
        needsOnboarding: false,
        contractorSlug: "alice-builders",
      });
    });

    it("defaults contractorSlug to null when absent", async () => {
      const s = await session({
        session: { user: {} },
        token: { id: "u2", role: "homeowner", needsOnboarding: false },
      });
      expect(s.user.contractorSlug).toBeNull();
    });
  });
});
