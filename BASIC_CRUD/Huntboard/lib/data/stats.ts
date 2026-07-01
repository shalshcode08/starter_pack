import { prisma } from "@/lib/prisma";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/constants/application";

export type DashboardStats = {
  total: number;
  applied: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  statusCounts: Record<ApplicationStatus, number>;
  funnel: { stage: string; count: number }[];
  overTime: { label: string; count: number }[];
};

function startOfWeek(date: Date) {
  const d = new Date(date);
  const mondayOffset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - mondayOffset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function pct(part: number, whole: number) {
  return whole === 0 ? 0 : Math.round((part / whole) * 100);
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const applications = await prisma.application.findMany({
    where: { userId },
    select: { status: true, createdAt: true },
  });

  const statusCounts = Object.fromEntries(
    APPLICATION_STATUSES.map((s) => [s, 0]),
  ) as Record<ApplicationStatus, number>;
  for (const app of applications) {
    statusCounts[app.status] += 1;
  }

  const total = applications.length;
  const applied = total - statusCounts.WISHLIST;
  const responded =
    statusCounts.OA + statusCounts.INTERVIEW + statusCounts.OFFER + statusCounts.REJECTED;
  const reachedInterview = statusCounts.INTERVIEW + statusCounts.OFFER;

  const funnel = [
    { stage: "Applied", count: applied },
    { stage: "OA", count: statusCounts.OA + reachedInterview },
    { stage: "Interview", count: reachedInterview },
    { stage: "Offer", count: statusCounts.OFFER },
  ];

  const base = startOfWeek(new Date());
  const overTime = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(base);
    weekStart.setDate(base.getDate() - (7 - i) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const count = applications.filter(
      (a) => a.createdAt >= weekStart && a.createdAt < weekEnd,
    ).length;
    return {
      label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(weekStart),
      count,
    };
  });

  return {
    total,
    applied,
    responseRate: pct(responded, applied),
    interviewRate: pct(reachedInterview, applied),
    offerRate: pct(statusCounts.OFFER, applied),
    statusCounts,
    funnel,
    overTime,
  };
}
