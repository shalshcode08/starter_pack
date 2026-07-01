import { prisma } from "@/lib/prisma";
import type { ApplicationStatus } from "@/lib/constants/application";
import type { EventType } from "@/lib/constants/event";

// Guests cannot log in with a password; this sentinel never matches bcrypt.compare.
const GUEST_PASSWORD_SENTINEL = "guest-account-no-login";

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

type DemoEvent = { type: EventType; notes?: string; scheduledAt?: Date };
type DemoApplication = {
  company: string;
  role: string;
  status: ApplicationStatus;
  location?: string;
  salaryRange?: string;
  source?: string;
  appliedAt?: Date;
  createdAt: Date;
  events: DemoEvent[];
};

const DEMO_APPLICATIONS: DemoApplication[] = [
  {
    company: "Stripe",
    role: "Backend Engineer",
    status: "OFFER",
    location: "Remote",
    salaryRange: "$150k - $180k",
    source: "Referral",
    appliedAt: daysAgo(42),
    createdAt: daysAgo(42),
    events: [
      { type: "APPLIED", notes: "Referred by a friend on the payments team." },
      { type: "OA", notes: "Take-home API design." },
      { type: "INTERVIEW", notes: "System design round." },
      { type: "OFFER", notes: "Verbal offer, negotiating." },
    ],
  },
  {
    company: "Vercel",
    role: "Frontend Engineer",
    status: "INTERVIEW",
    location: "Remote",
    salaryRange: "$140k - $170k",
    source: "LinkedIn",
    appliedAt: daysAgo(24),
    createdAt: daysAgo(24),
    events: [
      { type: "APPLIED" },
      { type: "INTERVIEW", notes: "Onsite loop.", scheduledAt: daysAgo(-3) },
    ],
  },
  {
    company: "Linear",
    role: "Product Engineer",
    status: "OA",
    location: "Remote",
    source: "Company site",
    appliedAt: daysAgo(17),
    createdAt: daysAgo(17),
    events: [
      { type: "APPLIED" },
      { type: "OA", notes: "Frontend take-home due Friday.", scheduledAt: daysAgo(-2) },
    ],
  },
  {
    company: "Notion",
    role: "Fullstack Engineer",
    status: "REJECTED",
    location: "San Francisco",
    source: "LinkedIn",
    appliedAt: daysAgo(31),
    createdAt: daysAgo(31),
    events: [
      { type: "APPLIED" },
      { type: "REJECTED", notes: "Rejected after recruiter screen." },
    ],
  },
  {
    company: "Airbnb",
    role: "Software Engineer",
    status: "INTERVIEW",
    location: "Remote",
    salaryRange: "$155k - $185k",
    source: "Referral",
    appliedAt: daysAgo(20),
    createdAt: daysAgo(20),
    events: [
      { type: "APPLIED" },
      { type: "INTERVIEW", notes: "Technical phone screen went well." },
    ],
  },
  {
    company: "Figma",
    role: "Frontend Engineer",
    status: "APPLIED",
    location: "Remote",
    source: "Job board",
    appliedAt: daysAgo(9),
    createdAt: daysAgo(9),
    events: [{ type: "APPLIED" }],
  },
  {
    company: "Cloudflare",
    role: "Systems Engineer",
    status: "APPLIED",
    location: "Austin",
    source: "LinkedIn",
    appliedAt: daysAgo(5),
    createdAt: daysAgo(5),
    events: [{ type: "APPLIED" }],
  },
  {
    company: "Datadog",
    role: "Backend Engineer",
    status: "REJECTED",
    location: "New York",
    source: "Job board",
    appliedAt: daysAgo(36),
    createdAt: daysAgo(36),
    events: [
      { type: "APPLIED" },
      { type: "OA", notes: "Timed coding assessment." },
      { type: "REJECTED" },
    ],
  },
  {
    company: "Ramp",
    role: "Fullstack Engineer",
    status: "WISHLIST",
    location: "Remote",
    createdAt: daysAgo(3),
    events: [],
  },
  {
    company: "OpenAI",
    role: "ML Engineer",
    status: "WISHLIST",
    location: "San Francisco",
    createdAt: daysAgo(1),
    events: [{ type: "NOTE", notes: "Tailor resume before applying." }],
  },
];

export async function createGuestUser() {
  const user = await prisma.user.create({
    data: {
      name: "Guest",
      email: `guest_${crypto.randomUUID()}@huntboard.local`,
      passwordHash: GUEST_PASSWORD_SENTINEL,
      isGuest: true,
    },
  });

  for (const app of DEMO_APPLICATIONS) {
    const { events, ...fields } = app;
    await prisma.application.create({
      data: {
        ...fields,
        userId: user.id,
        events: { create: events },
      },
    });
  }

  return user;
}
