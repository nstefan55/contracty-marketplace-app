# Security Audit Report — contracty-app

**Date:** 2026-06-06
**Auditor:** VoltAgent QA Security Team (`voltagent-qa-sec`)
**Project:** contracty-app (Next.js 16 App Router, NextAuth v5 beta, MongoDB/Mongoose, Cloudinary)
**Scope:** API routes, auth, data models, server actions, upload pipeline, headers, env handling
**Overall Status:** CRITICAL — multiple Critical and High findings that must be addressed before any production deploy

---

## Executive Summary

The application has a generally sound architectural foundation: NextAuth v5 with both Google OAuth and credentials providers, bcryptjs password hashing, Zod input validation on the sign-in form, Upstash sliding-window rate limiting on auth attempts, and an authenticated upload endpoint that goes through Cloudinary. However, the audit identified two **Critical** items (live secrets committed in plaintext on disk and an OTP-driven sign-in flow that lets the client mint an authenticated session without ever verifying the password) and several **High** items (missing security headers / no CSP, no MIME/size validation on file uploads, unbounded regex injection in the contractor search filter, and missing payload schema validation on most API routes). Detailed findings, file/line references, and remediation steps follow.

---

## Risk Matrix

| Category            | Critical | High | Medium | Low | Info |
| ------------------- | -------- | ---- | ------ | --- | ---- |
| Auth & Session      | 1        | 2    | 2      | 1   | 0    |
| Secrets Management  | 1        | 0    | 1      | 0   | 0    |
| API / Input Valid.  | 0        | 3    | 2      | 1   | 0    |
| File Upload         | 0        | 1    | 1      | 0   | 0    |
| Headers / Transport | 0        | 1    | 1      | 1   | 0    |
| Database / Queries  | 0        | 1    | 1      | 0   | 1    |
| Logging / Disclosure| 0        | 0    | 2      | 1   | 0    |
| **Totals**          | **2**    | **8**| **10** | **4**| **1**|

**QA Health Score: 26 / 100** (status: CRITICAL)

---

## CRITICAL Findings

### C-1. Live production-style secrets sit in plaintext in `.env` and were exposed to this audit

**File:** `.env` (repo root)
**Severity:** Critical
**OWASP:** A02:2021 – Cryptographic Failures / A07 – Identification & Auth Failures

The `.env` file at the project root contains live-looking values for: `MONGODB_URI` (incl. `ccm_admin` password), `AUTH_SECRET` (NextAuth JWT signing key), `AUTH_RESEND_KEY`, `GOOGLE_CLIENT_SECRET`, `CLOUDINARY_API_SECRET`/`CLOUDINARY_URL`, and `NEXT_PUBLIC_OPENCAGE_API_KEY`. While `.gitignore` does exclude `.env*` from git (verified), these values were readable during the audit and any value that has ever been shared (logs, screenshots, copy-paste, prior commits) must be treated as compromised.

**Why this is Critical**

- `AUTH_SECRET` signs the session JWT. Anyone with this value can forge sessions for any user, including the admin role, and bypass the entire auth system.
- The MongoDB connection string includes user `ccm_admin` with full read/write — leakage = total data compromise.
- Google OAuth client secret + Cloudinary API secret enable impersonation of the app to those providers.

**Remediation (do all of these)**

1. Rotate immediately, in this order:
   - MongoDB Atlas user `ccm_admin` — change password and restrict to least privilege; if this DB stores real user data, audit access logs.
   - Regenerate `AUTH_SECRET` with `openssl rand -hex 32`. Note: regenerating invalidates all existing sessions (expected).
   - Rotate Google OAuth client secret in Google Cloud Console.
   - Rotate `AUTH_RESEND_KEY` (Resend dashboard).
   - Rotate Cloudinary API secret.
   - Rotate MapTiler and OpenCage API keys (these are `NEXT_PUBLIC_*` so they ship to the browser anyway — apply HTTP referrer / IP restrictions on the provider dashboards).
2. Verify the `.env` file is **not** in git history: `git log --all --full-history -- .env`. If any commit contains it, scrub history (`git filter-repo`) and force-push — but **only after rotating**.
3. Create `.env.example` with empty placeholders so contributors know which vars to set, and commit only that file.
4. For deployment, store secrets in Vercel project env (or equivalent), not in `.env`.

### C-2. OTP sign-in path returns a one-time `signInToken` to the client and uses it as proof of identity without binding to a session, device, or password

**File:** `app/api/auth/verify-signin-otp/route.js` (lines 57–73) and `app/auth.js` (lines 65–86)
**Severity:** Critical
**OWASP:** A07:2021 – Identification & Authentication Failures

Flow today:

1. User submits email → `/api/auth/send-signin-otp` writes an OTP onto the user document and emails it.
2. User submits the 6-digit OTP to `/api/auth/verify-signin-otp` (which only requires the `signin_email` cookie set in step 1).
3. The server mints a 32-byte hex `signInToken`, writes it to the DB, and **returns it in the JSON response body**.
4. The client then calls `signIn("credentials", { email, signInToken })`. The `authorize` callback in `app/auth.js` matches `{ email, signInToken, signInTokenExpiry > now }` and issues a full session — **without ever checking the password**.

**Why this is Critical**

- The `signInToken` is functionally a bearer credential equivalent to a password reset token, but it is delivered over the response body of an unauthenticated endpoint. Anyone who can read the response (browser extension, malicious script via a contained XSS, mis-configured logging, MITM if HTTPS is ever downgraded) gains full account takeover for 5 minutes.
- There is no rate limiting on `/api/auth/verify-signin-otp`. The OTP is only 6 digits (1,000,000 combinations) and the route allows unlimited guesses. With even modest concurrency an attacker can brute-force the OTP for any known email well within the 10-minute expiry window.
- The OTP path also unconditionally sets `emailVerified = user.emailVerified ?? new Date()` (line 63), which means any user who can pass the OTP step bypasses the explicit email-verification flow used by the signup branch. (For signup the email-verified state is gated correctly.)
- There is no check that the user originally chose passwordless sign-in. A user with a password set can be signed in by anyone who possesses (or guesses) the OTP, with no second factor.

**Remediation**

1. Bind `signInToken` to a single-use cookie set httpOnly+secure+sameSite=strict on the verify response, then in the credentials `authorize` callback read the cookie instead of the request body. The client never sees the token.
2. Add per-email + per-IP rate limiting to `/api/auth/verify-signin-otp` (e.g., 5 attempts per 15 minutes). Reuse `authRateLimiter` with a `verify-otp:${email}` key.
3. On 5 failed OTP attempts, invalidate the current OTP and require resend.
4. Increase OTP length to 8 digits or use a 6-digit OTP plus a server-stored attempt counter on the User document.
5. Do not promote `emailVerified` on the sign-in OTP path unless that path is explicitly used as the first verification (separate the “verify-email” concern from “sign-in”).
6. After consuming `signInToken` in `authorize()`, unset it atomically (already done) — but also unset it on any failed credentials attempt to prevent attacker race against legitimate user.

---

## HIGH Findings

### H-1. No security headers / no CSP / no HSTS

**File:** `next.config.mjs`
**Severity:** High
**OWASP:** A05:2021 – Security Misconfiguration

`next.config.mjs` does not export a `headers()` function. The app currently sends no `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, or `X-Content-Type-Options`.

**Remediation** — add to `next.config.mjs`:

```js
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "img-src 'self' data: https://res.cloudinary.com https://lh3.googleusercontent.com https://api.maptiler.com",
            "script-src 'self' 'unsafe-inline' https://upload-widget.cloudinary.com",
            "style-src 'self' 'unsafe-inline'",
            "connect-src 'self' https://*.cloudinary.com https://api.maptiler.com https://api.opencagedata.com https://*.upstash.io",
            "frame-src https://upload-widget.cloudinary.com",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join("; "),
        },
      ],
    },
  ];
}
```

### H-2. File-upload endpoint trusts client-declared MIME and has no size limit

**File:** `app/api/upload/route.js`
**Severity:** High
**OWASP:** A04:2021 – Insecure Design / A05 – Misconfiguration

```js
const buffer = Buffer.from(await file.arrayBuffer());
const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
```

- `file.type` comes from the client and is included in the `data:` URI handed to Cloudinary. A client can declare any MIME they like; while Cloudinary applies `allowed_formats`, the buffering happens before any validation, so a malicious client can upload an arbitrarily large blob to fill memory.
- No `Content-Length` or `byteLength` cap is enforced. The Next.js `serverActions.bodySizeLimit` is set to `10mb` for server actions, but this route is an API route (not a server action) and not subject to that limit by default.
- No magic-byte sniffing.

**Remediation**

```js
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

if (!ALLOWED.has(file.type)) return Response.json({ error: "Unsupported type" }, { status: 415 });
if (file.size > MAX_BYTES) return Response.json({ error: "File too large" }, { status: 413 });
// Optional: sniff magic bytes (first 12 bytes) to confirm it really is an image.
```

Also rate-limit per-user uploads through `actionRateLimiter` keyed on `session.user.id`.

### H-3. ReDoS / NoSQL-injection-like risk in contractor filter regex

**File:** `lib/contractorFilterQuery.js` (lines 4–17)
**Severity:** High
**OWASP:** A03:2021 – Injection

User-controlled search-params values are passed straight into `new RegExp(value, "i")`. A malicious search string such as `(.*a){30}` produces a catastrophic-backtracking regex that pegs the MongoDB server CPU. There is also no length cap, so a query like `?serviceArea=` followed by 100KB of metacharacters is accepted.

**Remediation**

```js
function safeRegex(input) {
  const s = String(input).slice(0, 64);
  const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escaped, "i");
}
```

Or use MongoDB Atlas text search / `$text` instead of substring regex.

### H-4. No payload schema validation on most API routes

**Files:** `app/api/register/route.js`, `app/api/onboarding/set-role/route.js`, `app/api/onboarding/verify-otp/route.js`, `app/api/auth/send-signin-otp/route.js`, `app/api/auth/verify-signin-otp/route.js`
**Severity:** High
**OWASP:** A03 – Injection / A04 – Insecure Design

Only `signInSchema` (Zod) is used. Other routes call `await request.json()` and trust the result. Examples:

- `/api/register` reads `name`, `email`, `password` with no email-format check, no max-length on `name`, no password-strength check beyond length, and no enforcement that `email` is a string. A non-string `email` reaches Mongoose and can interact badly with `User.findOne({ email })` (e.g., `email: { $ne: null }` is rejected by Mongoose strictQuery, but is still a footgun).
- `/api/onboarding/verify-otp` and `/api/auth/verify-signin-otp` take a 6-character `otp` but do not check that it is digits-only.
- `/api/onboarding/set-role` validates the enum, but the `role` field is the only field validated.

**Remediation** — add Zod schemas for every payload, e.g.:

```js
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  email: z.string().email().max(254),
  password: z.string().min(12).max(72), // bcrypt truncates at 72; enforce minimum > 8 for production
});
const { name, email, password } = registerSchema.parse(await request.json());
```

### H-5. Server actions are missing rate limiting and (in some cases) input validation

**File:** `app/actions/contractor-actions.js`
**Severity:** High
**OWASP:** A04 – Insecure Design

- `createInquiry`, `updateContractorProfile`, `addPortfolioItem`, `toggleBookmark`, `changePassword`, `deleteAccount` — none call `checkActionRateLimit` (`lib/action-ratelimit.js` exists but is unreferenced by these actions).
- `createInquiry` writes `formData.description` straight into the DB. `Inquiry.description` has `maxlength: 1000`, but the trade/budget/timeline/siteAddress fields are not capped and no Zod schema is applied; a logged-in user can spam huge payloads.
- `changePassword` does not enforce a minimum new-password length (the credentials sign-in schema requires ≥8, but this action accepts anything).
- `deleteAccount` does not re-prompt for password / OTP — a single CSRF-bypass or stolen session immediately destroys account + portfolio.

**Remediation**

1. Wrap each action body with `await checkActionRateLimit(session.user.id)`.
2. Add a Zod schema per action and parse the inputs.
3. For `changePassword`, enforce `min(12)`; for `deleteAccount`, require the user to re-enter their password (or send an OTP) before the destructive operation.

### H-6. Profile page logs raw DB errors and silently swallows them

**File:** `app/[contractor]/(profile)/page.jsx` (lines 30–34)
**Severity:** High (data-integrity + observability)
**OWASP:** A09 – Logging Failures

```js
try {
  contractorDoc = await Contractor.findOne({ slug }).lean();
} catch (error) {
  console.log(error);
}
```

`slug` comes from the URL. If Mongoose throws (cast error, malformed input), the page proceeds with `contractorDoc = null` and calls `notFound()` — fine for the user, but the error goes to `console.log`, which on Vercel becomes a structured log that may leak query internals. More importantly, all subsequent `Portfolio.findOne({ contractor: contractor._id })` calls assume `contractor._id` exists, so a failure mode could trigger if `notFound()` is ever bypassed.

Also `config/database.js`:

```js
catch (error) { console.log(error); }
```

The DB connection swallows failures. In production this means a misconfigured `MONGODB_URI` produces zero visible error — every query thereafter throws with a less useful message.

**Remediation**

- Use a structured logger (e.g., `pino`) and **never** `console.log(error)` in production paths; log message + code only.
- In `config/database.js`, rethrow the error after logging so the app fails loudly.
- In `app/[contractor]/(profile)/page.jsx`, treat a DB failure as a 500, not a 404, so the operator notices.

### H-7. `config/database.js` is racy and may leak connections under load

**File:** `config/database.js`
**Severity:** High (reliability/availability, secondary security)
**OWASP:** A05 – Misconfiguration

```js
let connected = false;
const connectDB = async () => {
  if (connected) { console.log("..."); }
  try { await mongoose.connect(process.env.MONGODB_URI); connected = true; }
  catch (error) { console.log(error); }
};
```

The `if (connected)` branch does **not** `return`, so every call re-invokes `mongoose.connect`. The local `connected` flag is also per-module; under Next.js hot reload (and across serverless function instances) you get N concurrent connections, exhausting Atlas connection limits, which itself is a DoS vector.

**Remediation** — use the cached-promise pattern:

```js
let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
```

### H-8. Information disclosure via OTP console.log in non-dev environments

**File:** `app/api/onboarding/set-role/route.js` (line 61–62)
**Severity:** High
**OWASP:** A09 – Logging Failures

```js
if (process.env.NODE_ENV !== "development")
  console.log(`[OTP] ${email} → ${otp}`);
```

The condition is inverted — OTPs are logged in **production** but not dev. Every user’s 6-digit code lands in the Vercel logs (or wherever stdout goes), readable by anyone with log access, indefinitely.

**Remediation** — change to `if (process.env.NODE_ENV === "development")` (the other OTP routes already do this correctly) **and** rotate any logs that may already contain OTPs.

---

## MEDIUM Findings

### M-1. `models/User.js` indexes `email` only via the `unique: true` shortcut, with no case normalisation

Emails are stored verbatim. `User.findOne({ email })` is case-sensitive, so `Alice@x.com` and `alice@x.com` are different accounts. This breaks the "Don’t reveal whether the account exists" guard in `send-signin-otp` and allows duplicate registrations. Lowercase all emails before write (`email.toLowerCase().trim()`).

### M-2. NextAuth session callback trusts `token.id` without verifying the user still exists / is not banned

`app/auth.js` callbacks `session()` and `jwt()` accept whatever is on the JWT. A user who was deleted, banned, or had their role downgraded still holds a valid JWT until expiry. For the contractor dashboard this means a deleted contractor can keep editing for up to JWT TTL. Add a periodic DB check on `jwt({trigger: "update" })` and on critical actions.

### M-3. `signInSchema` has no real password-strength check

`lib/zod.js`: `min(8).max(32)`. 32 is too short for users who want passphrases, and there is no complexity check. Recommend min 12, no max < 72 (bcrypt limit), use zxcvbn or similar for strength scoring.

### M-4. `/api/register` returns different status codes for "email exists" vs "ok", enabling user enumeration

Line 28: `return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })`. This lets an attacker enumerate valid emails by attempting registration. The sign-in OTP routes do the right thing (always return 200) — registration should match: respond with 200 and silently send a "you already have an account, sign in" email if the address is already registered.

### M-5. CSRF posture relies entirely on SameSite=Lax + NextAuth defaults

Server actions and most routes are POST without any explicit CSRF token. NextAuth provides this for its own routes, but the custom routes under `/api/register`, `/api/upload`, `/api/onboarding/*`, `/api/auth/send-signin-otp`, etc., rely solely on the session cookie. Default SameSite is `lax` for the session cookie — adequate today, but if a future change ever issues a cookie with `SameSite=None`, every custom POST becomes a CSRF target. Add explicit `Origin` checks or use NextAuth’s `getCsrfToken` middleware.

### M-6. `/api/onboarding/verify-otp` does not verify the OTP belongs to the right user when both `pending_email` and a session exist simultaneously

Line 16 reads `pending_email` cookie unconditionally. If a Google-authed user (who has a session) somehow has a stale `pending_email` cookie (e.g., signed up before linking), the verification flow targets a different user record. Use `await auth()` to resolve identity authoritatively, fall back to cookie only if no session.

### M-7. Upload route does not bind uploaded asset to a user/contractor

`app/api/upload/route.js` returns `{ url, publicId }` to the caller. Nothing in the DB or Cloudinary metadata associates the uploaded image with `session.user.id`. A user can flood the “Contractry/Portfolio” folder with images they later orphan, and there is no way to enforce per-user storage quotas or cleanup on account deletion.

Add `context: { user_id: session.user.id }` to the Cloudinary upload params and record the `publicId` on a per-user collection (or directly on the `Portfolio` document) before returning success.

### M-8. `viewCount` increment in profile page is unauthenticated and trivially abused

`app/[contractor]/(profile)/page.jsx` lines 65–68 increment the contractor’s view count on every request — easily inflated by a bot loop. Either move this to a debounced server action keyed on `session.user.id` or use IP-throttling via Upstash.

### M-9. Mongoose `connectDB` connection-error path leaves `connected = false` but allows queries to proceed

Because the error is swallowed, the next line in callers (`User.findOne(...)`) tries to run against an unconnected client and throws a less actionable `MongoNotConnectedError`. See H-7 remediation.

### M-10. Hardcoded default profile image points to a personal-looking Cloudinary URL

`models/User.js` line 5, `models/Contractor.js` line 14, `app/auth.js` line 24:

```
https://res.cloudinary.com/devslulj5/image/upload/v1777836733/default-image_yywmnk.png
```

This is fine functionally, but couples the codebase to a specific Cloudinary account / asset. If that asset is deleted, every "default" avatar 404s. Move to `/public/images/default-avatar.png` and serve locally.

---

## LOW Findings

### L-1. `proxy.js` middleware matcher excludes `images` (folder name), not Next’s asset patterns

`matcher: ["/((?!api|_next/static|_next/image|favicon\\.ico|images).*)"]` — works, but a route like `/imagestore` would also be excluded. Tighten to `^/(?!api|_next|favicon\\.ico|images/).*`.

### L-2. `NEXT_PUBLIC_OPENCAGE_API_KEY` is shipped to the browser

It must be, given the package name and usage, but it should be locked down in the OpenCage dashboard with HTTP referrer restrictions. Note: as of the audit, all `NEXT_PUBLIC_*` keys are public by definition — this is informational guidance, not a code defect.

### L-3. `npm audit` not present in CI; no lockfile pinning policy

No `npm audit` script, no Renovate / Dependabot config in repo. Add a `audit` script and enable GitHub Dependabot.

### L-4. `console.log` left in `app/[contractor]/(profile)/page.jsx` and `config/database.js`

Replace with structured logger or remove.

---

## INFO

### I-1. Mongoose `Schema.Types.ObjectId` casts protect against most NoSQL-injection attacks

Pattern is consistent across models — good.

---

## Passing Checks

- Passwords hashed with bcryptjs at 10 rounds (acceptable; consider raising to 12).
- Auth rate limiter applied on both credentials and Google sign-in.
- HTTPS-only `secure` cookie flag set when `NODE_ENV === "production"`.
- Mongoose `strictQuery: true` set — limits `find({ field: { $where: ... } })` style abuses.
- Server actions consistently check `await auth()` and role before mutating.
- `serverExternalPackages` lists `mongoose` and `bcryptjs` — avoids Edge runtime issues.
- Cloudinary upload uses `allowed_formats` constraint server-side.

---

## Priority Action Items

1. **C-1** Rotate all secrets in `.env` and migrate to a secret manager.
2. **C-2** Remove `signInToken` from the response body, bind it to an httpOnly cookie, and rate-limit OTP verification.
3. **H-1** Add CSP + HSTS + standard security headers in `next.config.mjs`.
4. **H-2** Add size + MIME validation on `/api/upload`.
5. **H-3** Escape regex input in `contractorFilterQuery.js`.
6. **H-4** Add Zod schemas to every API route.
7. **H-7** Fix the connection-cache pattern in `config/database.js`.
8. **H-8** Fix inverted OTP-log condition in `app/api/onboarding/set-role/route.js`.

---

## Audit Metadata

- **Files Scanned:** 32 (API routes, server actions, models, lib, config, middleware, layout, modified files)
- **Tests Run:** Static analysis + manual review; runtime fuzzing not performed.
- **Duration:** ~25 minutes
- **Next Recommended Audit:** After the items above are closed, or before the first production launch — whichever is sooner.
