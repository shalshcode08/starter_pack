# Huntboard

A job-application tracker that models your search as a pipeline. Every application moves through stages, carries a timeline of events, and rolls up into stats that show what is working.

> Live demo: https://huntboard.vercel.app
>
> One click into a populated demo board - no signup needed.

<!-- Add screenshots here: board, application detail, dashboard -->

## Features

- Email and password auth (self-hosted, credentials + JWT sessions). Every query is scoped to the signed-in user.
- Application CRUD: company, role, URL, location, salary, source, status.
- Stage pipeline: Wishlist, Applied, OA, Interview, Offer, Rejected.
- Application detail page with a chronological event timeline.
- Kanban board with drag-and-drop to change stage (optimistic updates).
- Dashboard: applications over time, response rate, and pipeline funnel.
- One-click guest login seeded with realistic demo data.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **PostgreSQL** on **Neon** via **Prisma 7** (driver adapter `@prisma/adapter-pg`)
- **Auth.js (NextAuth v5)** credentials provider, JWT sessions, `bcryptjs`
- **Zod** validation, **Tailwind CSS 4**, **@dnd-kit**, **Recharts**
- **pnpm**

## Architecture highlights

- **Authorization is enforced on every operation.** Reads use `findFirst({ id, userId })`; writes use `updateMany`/`deleteMany` scoped by `{ id, userId }`, so a request for another user's row affects zero rows. Child resources (events) are scoped through a relation filter on the parent.
- **Layered data access:** reads in `lib/data`, mutations in `lib/actions` (Server Actions), one Prisma client singleton in `lib/prisma.ts`.
- **Edge-safe auth split:** `auth.config.ts` (used by `proxy.ts`) carries no DB or bcrypt imports; the full provider lives in `auth.ts`.
- **Separate Neon branches** for development and production.

## Local setup

Requires Node 22+, pnpm, and a PostgreSQL database (Neon recommended).

```bash
pnpm install
cp .env.example .env        # then fill in DATABASE_URL and AUTH_SECRET
pnpm prisma migrate dev     # create the schema
pnpm dev                    # http://localhost:3000
```

Generate an auth secret with `openssl rand -base64 33`.

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Generate the Prisma client and build for production |
| `pnpm db:migrate` | Create and apply a migration (dev) |
| `pnpm db:deploy` | Apply migrations (production) |
| `pnpm db:studio` | Open Prisma Studio |

## Learning guide

`learn.html` is a deep, from-scratch walkthrough of the entire codebase, phase by phase - open it in a browser.
