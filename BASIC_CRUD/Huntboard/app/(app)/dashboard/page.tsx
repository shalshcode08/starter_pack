import Link from "next/link";

import { FunnelChart } from "@/components/dashboard/funnel-chart";
import { OverTimeChart } from "@/components/dashboard/over-time-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats } from "@/lib/data/stats";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireUser();
  const stats = await getDashboardStats(user.id);

  if (stats.total === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>
        <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <p className="text-sm text-slate-600">
            No data yet. Add applications to see your stats.
          </p>
          <Link
            href="/applications/new"
            className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            New application
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Response rate" value={stats.responseRate} suffix="%" />
        <StatCard label="Interview rate" value={stats.interviewRate} suffix="%" />
        <StatCard label="Offer rate" value={stats.offerRate} suffix="%" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Applications over time" subtitle="Added per week (last 8 weeks)">
          <OverTimeChart data={stats.overTime} />
        </ChartCard>
        <ChartCard title="Pipeline funnel" subtitle="Based on current stage">
          <FunnelChart data={stats.funnel} />
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
