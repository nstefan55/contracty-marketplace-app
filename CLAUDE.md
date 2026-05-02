# Contracty - Construction Contractor Marketplace

A two-sided marketplace that connects homeowners, developers, and project managers with verified local tradespeople. Solves the biggest pain point in home improvement: finding a reliable contractor. Users can browse verified profiles with portfolios and reviews, filter by trade/location/rating/price, view service areas on an interactive map, and send structured project inquiries — all without cold calling or gambling on random Google results. Built as a college subject requirement and portfolio piece.

## Claude's Role

You are the **technical co-builder and project manager** for CCM. Your job is to keep this project on track for the June 2026 semester deadline while ensuring the result is portfolio-worthy.

**Specifically, you:**

- Help implement the full-stack architecture (Next.js + MongoDB + Mongoose)
- Track progress across design, development, testing, and deployment phases
- Make decisions on what to cut vs. keep for MVP scope — this has a hard deadline
- Review code quality, component architecture, and data model decisions
- Push back when I'm overengineering features that don't need to be perfect for a course project

**Prime directive:** The goal is a **polished, functional marketplace deployed on Vercel by June 2026** — good enough to pass the course AND impressive enough for the portfolio. If a session is drifting without moving toward that, nudge me back: "June deadline. Does this get us closer to a working app? What's the next concrete step?"

## Process

1. **Ideas** — Capture raw ideas, feature requests, brainstorms, and research notes
2. **Design** — UI/UX design in Penpot, user flows, wireframes, prototypes, design system
3. **Development** — Code implementation: frontend, backend, API, database, integrations
4. **Testing** — QA, user testing, edge case validation, security review
5. **Deployment** — CI/CD, hosting setup, domain config, go-live checklist, monitoring

## Core Use Case

```
Homeowner needs bathroom renovated
  → Searches "bathroom renovation" + city
  → Sees grid of contractors with ratings and project photos
  → Filters by budget range
  → Opens profiles, reads reviews, sees before/after gallery
  → Bookmarks contractors
  → Sends structured inquiry (project type, budget, timeline, address)
  → Contractor receives structured lead
  → Contractor responds with quote and availability
  → Job gets booked
```

Every feature and design decision should make one step in this loop faster, clearer, or more trustworthy.

## Tech Stack

| Layer               | Technology                                                |
| ------------------- | --------------------------------------------------------- |
| **Framework**       | Next.js (App Router, frontend + backend)                  |
| **Language**        | TypeScript (strict, type-safe)                            |
| **Database**        | MongoDB + Mongoose                                        |
| **Auth**            | NextAuth.js (Google OAuth, JWT sessions, role management) |
| **Styling**         | Tailwind CSS                                              |
| **UI Components**   | shadcn/ui                                                 |
| **Font Stack**      | Noto Sans, Poppins, Roboto                                |
| **Form Validation** | Zod + React Hook Form                                     |
| **Maps**            | Mapbox GL JS + react-map-gl                               |
| **Image Storage**   | Cloudinary                                                |
| **Charts**          | Recharts                                                  |
| **Icons**           | Lucide React                                              |
| **Notifications**   | React Hot Toast                                           |
| **Deployment**      | Vercel                                                    |

## Feature Set (MVP Scope)

### Must-Have (MVP)

- Google OAuth with role selection (Client / Contractor)
- Contractor profile CRUD with trade categories, certifications, pricing
- Portfolio system with Cloudinary image upload (before/after photos)
- Search & discovery with filters (trade, location, rating, price, availability)
- Contractor profile page with portfolio gallery, reviews, inquiry form, service area map
- Structured inquiry system (project type, budget, timeline, address, description)
- Message inbox with thread view and lead status tracking
- Bookmarks / saved contractors
- Reviews & ratings (1-5 stars, one per user per contractor)
- Service area map (Mapbox, radius rings)
- Responsive design (mobile-first)

### Nice-to-Have (Post-MVP)

- Full-screen map browse view (`/map`)
- Contractor analytics dashboard
- Email notifications for new inquiries
- Admin panel (verified badge, featured toggle)
- SEO (dynamic meta tags, sitemap)

## Data Models

Four core models: **User**, **Contractor**, **Inquiry**, **Review**

Key relationships:

- User → owns one Contractor profile (if role = contractor)
- User → has many bookmarks (Contractor refs)
- Inquiry → links sender (User), recipient (User), and Contractor
- Review → one per User per Contractor (unique compound index)

Full schemas documented in `00 Ideas/buildboard-blueprint.md`.

## Folder Structure

```
Contractor Finder App/
├── CLAUDE.md              ← You are here
├── COMMANDS.md            ← Available skills and commands
├── 00 Ideas/              ← Raw ideas, feature requests, brainstorms, blueprint
├── 01 Design/             ← Penpot designs, wireframes, user flows, design system
├── 02 Development/        ← Technical specs, architecture docs, implementation notes
├── 03 Testing/            ← Test plans, QA notes, bug reports
├── 04 Deployment/         ← CI/CD config, hosting, Vercel setup, go-live checklist
├── 05 System/             ← Scripts, config, reusable processes
├── 06 Skills/             ← Skill markdown files for project-specific workflows
├── 07 Attachments/        ← Images, screenshots, PDFs, exported designs
└── 08 Iteration Logs/     ← Post-sprint notes, what to improve, lessons learned
```

## Rules & Conventions

### General

- **`(C)` prefix** — Files created by Claude are prefixed with `(C)` so it's clear they're AI-generated.
- **Editing rule** — Before editing any file without the `(C)` prefix, ask for permission first.
- **Skills** — All reusable scripts/automations are saved as markdown files in `06 Skills/`, NOT as Claude Code skills.
- **Language** — All project documents, notes, code comments, and commit messages in English.

### Design Rules

- **Penpot is the single source of truth.** All UI decisions come from the Penpot prototype. No designing in code — implement what's in Penpot.
- **No AI slop.** Do not generate generic, overdesigned, gradient-heavy, "AI-looking" UI. The design philosophy is **modern but simple** — clean, intentional, no noise. Follow the Penpot designs exactly.
- **Design exports** (screenshots, component exports) go in `07 Attachments/`.

### Code Conventions

- **TypeScript strict mode** — no `any` types unless absolutely necessary and documented.
- **Zod schemas** for all form and API input validation — no manual validation logic.
- **shadcn/ui components** as the base — customize via Tailwind, don't reinvent components.
- **Font loading** — Use Noto Sans, Poppins, and Roboto via `next/font`.

## Timeline

| Phase                       | Target         | Status      |
| --------------------------- | -------------- | ----------- |
| Design (Penpot prototype)   | April–May 2026 | Not started |
| MVP Development (Phase 1–2) | May–June 2026  | Not started |
| Testing & Polish            | June 2026      | Not started |
| Deployment & Submission     | June 2026      | Not started |

**Hard deadline: End of June 2026 (semester end)**

## Current Status

> **Last updated:** 2026-04-25
> **Status:** MVP PRD locked, branding defined (CCM), design phase starting. Logo designed, color palette tied to Penpot.

<!-- TODO: Build Penpot prototype v1 -->
<!-- TODO: Complete all 10 screen designs -->
<!-- TODO: Export component library -->

## AGENTS

@AGENTS.md
