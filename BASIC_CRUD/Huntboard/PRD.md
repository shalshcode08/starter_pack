# Landed — Product Requirements Document

## One-liner
A job-application tracker that models your search as a pipeline — every application moves through stages, carries a timeline of events, and rolls up into stats that show you what's working.

## Problem
Job seekers track applications in spreadsheets or memory. Both lose history, hide patterns (which stage you're leaking at, your real response rate), and offer no quick view of what to act on next.

## Target user
Active job seekers — primarily students and early-career engineers running 20–100+ applications.

## Goals
- Capture every application and its full event history in one place.
- Make pipeline state and progress visible at a glance.
- Surface derived insight (response rate, stage conversion) the user can't easily get from a sheet.

## Non-goals (v1)
No job-board scraping, no email integration, no auto-import, no team/multi-user sharing. Single user, manual entry only.

## Core features (v1)
- Email + Google auth; all data scoped strictly to the owner.
- Application CRUD — company, role, URL, location, salary, source, status.
- Stage pipeline: Wishlist → Applied → OA → Interview → Offer / Rejected.
- Application detail page with a chronological event timeline (applied, OA, interview, follow-up, outcome).
- Kanban board with drag-and-drop to change stage.
- Dashboard: applications over time, response rate, conversion per stage.
- One-click guest login seeded with demo data.

## Data model
`User` 1—* `Application` 1—* `Event`. (Optional: `Contact`, `Tag`.)

| Entity | Key fields |
| --- | --- |
| User | id, email, passwordHash, createdAt |
| Application | id, userId (FK), company, role, jobUrl, location, salaryRange, status (enum), source, appliedAt, timestamps |
| Event | id, applicationId (FK), type, notes, scheduledAt |
| Contact *(optional)* | id, applicationId (FK), name, role, email |
| Tag *(optional)* | many-to-many with Application |

## Tech stack
Next.js (App Router) + TypeScript, PostgreSQL via Prisma, Auth.js, Zod validation, Tailwind. Deployed on Vercel + Neon.

## Success criteria
- Deployed and publicly reachable.
- A guest can land on a populated board in one click.
- CRUD, kanban, and dashboard all functional.
- Every query authorization-scoped to the user.
- Clean README with live link and screenshots.

## Future (v2+)
- Email parsing to auto-log events.
- Browser extension to add a job from a posting.
- Reminders / follow-up nudges.
- CSV import / export.