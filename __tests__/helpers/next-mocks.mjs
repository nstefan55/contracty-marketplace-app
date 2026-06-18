import { vi } from "vitest";

// Helper to build a fake `cookies()` store with get/set/delete.
export function makeCookieStore(initial = {}) {
  const bag = { ...initial };
  return {
    get: vi.fn((name) =>
      bag[name] === undefined ? undefined : { name, value: bag[name] },
    ),
    set: vi.fn((name, value /*, opts */) => {
      bag[name] = value;
    }),
    delete: vi.fn((name) => {
      delete bag[name];
    }),
    _bag: bag,
  };
}

// Helper to build a fake `headers()` store.
export function makeHeaders(initial = {}) {
  const map = new Map(Object.entries(initial));
  return {
    get: (k) => map.get(k.toLowerCase()) ?? map.get(k) ?? null,
  };
}

// Build a fake Request whose .json() returns the supplied body.
export function makeRequest(body) {
  return { json: async () => body };
}
