'use client';

import useSWR from 'swr';
import MetricCard from './components/MetricCard';
import ActivityFeed from './components/ActivityFeed';
import DraftsList from './components/DraftsList';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DashboardOverview() {
  const { data: draftsData } = useSWR('/api/drafts', fetcher);
  const { data: insightsData } = useSWR('/api/insights', fetcher);
  const { data: subscribersData } = useSWR('/api/newsletter/subscribers', fetcher);

  const allDrafts = draftsData?.drafts || [];
  const totalPosts = allDrafts.length;
  const pendingDrafts = allDrafts.filter((d: any) => d.status !== 'published').length;
  const subscriberCount = subscribersData?.subscribers?.length || 0;

  const insights = insightsData?.insights;
  const latestInsight = Array.isArray(insights) ? insights[0] : insights;

  return (
    <div className="max-w-6xl">
      <h1 className="sr-only">Dashboard Overview</h1>
      <h2 className="text-2xl font-bold font-oswald text-white mb-6">Overview</h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Posts" value={totalPosts} icon="◧" />
        <MetricCard label="Pending Drafts" value={pendingDrafts} icon="◨" />
        <MetricCard label="Agent Runs Today" value="--" icon="⚙" trend="Check agents page" />
        <MetricCard label="Subscribers" value={subscriberCount} icon="✉" />
      </div>

      {/* Two-column: Activity + Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ActivityFeed />

        {latestInsight && (
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-summit-gold/20 rounded-lg p-5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Weekly Coaching Insight
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-mono">Focus</span>
                <div className="text-lg text-emerald-400 font-bold">{latestInsight.focus}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-mono">Summary</span>
                <div className="text-sm text-zinc-300">{latestInsight.weekSummary}</div>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-500 font-mono">Tip</span>
                <div className="text-sm text-zinc-300 italic">&ldquo;{latestInsight.tip}&rdquo;</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Drafts */}
      <div>
        <h3 className="text-lg font-bold text-white mb-3">Recent Drafts</h3>
        <DraftsList />
      </div>
    </div>
  );
}
