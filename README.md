# Contracty

> Find your trusted local contractor. A two-sided marketplace that helps homeowners discover verified tradespeople and gives contractors a simple, branded space to showcase their work, receive inquiries, and grow their business.

Contracty is a full-stack Next.js application built around a contractor directory with portfolios, reviews, geolocated service areas, and an inquiry-based messaging system. Homeowners can browse, filter, and contact contractors; contractors can manage their own profile, portfolio, and inbox from a dedicated dashboard.

---

## Table of Contents

- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Authentication Flows](#authentication-flows)
- [Data Models](#data-models)
- [Security](#security)
- [Demo](#demo)

---

## Core Features

### For Homeowners
- **Search & filter contractors** by trade (Electrician, Plumber, HVAC, Roofer, Mason, Painter, and more) and by location.
- **Sidebar filters** for price range, rating, availability, and verification status, with applied-filter chips and a clear-filters action.
- **Contractor profiles** with bio, certifications, hourly/project price ranges, years of experience, average rating, and review count.
- **Portfolio gallery** for each contractor showcasing completed projects with images, descriptions, and project location.
- **Service-area map** rendered with MapTiler, with addresses resolved through OpenCage geocoding.
- **Reviews & ratings** — one review per contractor per user, 1–5 stars, with optional comment and project type.
- **Bookmark / save contractors** to a personal saved list.
- **Inquiry system** — send a detailed project inquiry (project type, budget, timeline, site address, description) and receive replies from the contractor.
- **Shareable profiles** via social share buttons.

### For Contractors
- **Branded contractor URL** (`/[slug]`) generated during onboarding.
- **Dashboard** with stats (inquiries, bookmarks, views), recent messages, and quick actions.
- **Profile editing** — bio, trade, contact details, certifications, service area + radius, pricing, years of experience, availability toggle.
- **Portfolio manager** to add, edit, and delete portfolio items with multi-image uploads.
- **Inbox** with read/unread status, reply threads, and inquiry deletion.
- **Unread inquiry badge** in the navbar, kept in sync via a React context.
- **Account settings** — change password, update email/name, delete account.

### Platform-wide
- **Email + password auth**, **Google OAuth**, and **passwordless OTP sign-in** via email.
- **Onboarding flow** for new users (role selection: homeowner or contractor, welcome step, email verification).
- **Transactional emails** (welcome, sign-in OTP) built with React Email and delivered through Resend.
- **Image uploads** routed through Cloudinary.
- **Rate limiting** on auth endpoints and server actions, backed by Upstash Redis.
- **Strict security headers** and Content Security Policy.

---

## Tech Stack

### Framework & Runtime
- **Next.js 16** (App Router, route groups, server actions, dynamic segments)
- **React 19** with the **React Compiler** enabled
- **Node.js** server runtime

### UI & Styling
- **Tailwind CSS 4** + `tw-animate-css`
- **shadcn/ui** primitives + **Base UI (`@base-ui/react`)**
- **Lucide React** icons
- **react-hot-toast** for notifications
- **react-spinners** for loading states
- **next-flex-rating** for star ratings

### Forms & Validation
- **React Hook Form**
- **Zod** schemas (sign-in, sign-up, profile updates)

### Data Layer
- **MongoDB** with **Mongoose** ODM
- **`@auth/mongodb-adapter`** for NextAuth session persistence

### Auth
- **NextAuth (Auth.js) v5 beta** with `CredentialsProvider` and `GoogleProvider`
- **bcryptjs** for password hashing
- **OTP** via signed tokens stored on the user document

### Media, Email, & Maps
- **Cloudinary** (`next-cloudinary`) for image uploads and delivery
- **Resend** + **React Email** for transactional mail
- **MapTiler SDK** for map rendering
- **OpenCage** for geocoding

### Infrastructure & Security
- **Upstash Redis** + **`@upstash/ratelimit`** for sliding-window rate limits
- Strict **CSP**, **HSTS**, **X-Frame-Options: DENY**, and other hardened headers in `next.config.mjs`

### Tooling
- **ESLint** (`eslint-config-next`)
- **Babel React Compiler plugin**

---

## Project Structure

```
contracty-app/
├── app/
│   ├── (public)/              # Public route group (landing, signin, signup, onboarding, etc.)
│   ├── [contractor]/          # Dynamic contractor namespace
│   │   ├── (profile)/         # Public contractor profile page
│   │   └── dashboard/         # Authenticated contractor dashboard, portfolio, settings
│   ├── actions/               # Server actions, grouped by domain (Auth, User, Contractor, Inquiry, Portfolio, Review)
│   ├── api/                   # Route handlers (auth, onboarding, register, upload, contractors)
│   ├── context/               # React contexts (e.g. InquiryContext for unread badge)
│   ├── contractors/           # Listing + saved + detail pages
│   ├── profile/               # Authenticated user profile (homeowner)
│   ├── auth.js                # NextAuth setup
│   └── layout.jsx             # Root layout, providers, fonts
├── auth.config.js             # Edge-safe NextAuth config (callbacks for JWT/session)
├── components/                # Reusable UI (Navbar, Footer, ContractorCard, profile/*, dashboard/*, ui/*)
├── config/                    # Cloudinary, database, Resend clients
├── emails/                    # React Email templates (Welcome, SignInOTP)
├── lib/                       # Cross-cutting helpers (zod schemas, password, ratelimit, errors, utils)
├── models/                    # Mongoose schemas (User, Contractor, Portfolio, Review, Inquiry)
├── public/                    # Static assets (logo, default images)
├── scripts/                   # Database seed scripts
├── next.config.mjs            # Next.js config + security headers + CSP
└── jsconfig.json              # `@/*` path alias to project root
```

---

## Getting Started

### Prerequisites
- **Node.js** 20+ (Node 24 LTS recommended)
- A **MongoDB** database (Atlas or local)
- Accounts / API keys for: **Cloudinary**, **Resend**, **MapTiler**, **OpenCage**, **Google OAuth**, **Upstash Redis**

### Install
```bash
npm install
```

### Configure environment
Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables) below).

### Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Seed sample data (optional)
```bash
npm run seed:all
```
This populates users, contractors, reviews, portfolios, and inquiries. You can also run each seed script individually (`seed:users`, `seed:reviews`, `seed:portfolios`, `seed:inquiries`).

### Preview email templates
```bash
npm run email:dev
```
Opens the React Email preview server to iterate on `emails/Welcome.jsx` and `emails/SignInOTP.jsx`.

---

## Environment Variables

```env
# Database
MONGODB_URI=

# NextAuth
AUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Resend (transactional email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# Maps & geocoding
NEXT_PUBLIC_MAPTILER_API_KEY=
NEXT_PUBLIC_OPENCAGE_API_KEY=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

> Variable names may vary slightly based on the helper that consumes them — check `config/`, `lib/ratelimit.js`, and `app/auth.js` for the exact keys read at runtime.

---

## Available Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |
| `npm run email:dev` | Launch the React Email preview server |
| `npm run seed:users` | Seed sample users |
| `npm run seed:reviews` | Seed sample reviews |
| `npm run seed:portfolios` | Seed sample portfolio items |
| `npm run seed:inquiries` | Seed sample inquiries |
| `npm run seed:all` | Run every seed script in order |

---

## Authentication Flows

Contracty supports three sign-in paths, all wired through a single NextAuth `CredentialsProvider` plus a `GoogleProvider`:

1. **Password sign-in** — standard email + bcrypt-verified password, gated by `emailVerified`.
2. **OTP sign-in** — user requests a one-time code, code is verified, and a short-lived `signInToken` is set in an httpOnly cookie. The credentials authorize step reads the cookie (the token never appears in the request body).
3. **Token sign-in (onboarding)** — after email verification, a one-time `signInToken` is exchanged directly via credentials to complete sign-up without a password.
4. **Google OAuth** — first-time Google users are created with `needsOnboarding: true` and routed into the onboarding flow to pick a role.

The JWT callback self-heals stale tokens (role, onboarding state, contractor slug) by re-reading the DB when needed, since `session.update()` in Auth.js v5 beta does not always rewrite the cookie.

---

## Data Models

- **User** — name, email, image, hashed password (optional for OAuth users), role (`homeowner` / `contractor` / `admin`), `emailVerified`, `needsOnboarding`, OTP/sign-in token fields, bookmarks (refs to Contractors).
- **Contractor** — owner (User ref), name, slug, profile image, trade (enum), bio, contact info, service area (lat/lng/radius/address/postcode), certifications, hourly + project price ranges, years of experience, availability, featured/verified flags, aggregated rating + review count + view count.
- **Portfolio** — contractor ref, title, description, images, project type, location, completedAt.
- **Review** — user ref, contractor ref, rating (1–5), comment, project type, verified flag. Compound unique index on `{ user, contractor }` enforces one review per pair.
- **Inquiry** — sender, recipient, contractor refs, project type, budget, timeline, site address, description (≤1000 chars), reply thread, status (`new` / `read` / `replied` / `closed`).

---

## Demo

https://github.com/user-attachments/assets/3304b7ed-cddd-419f-a826-8a6649a37173



### App Version : 1.0.1

