import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Training - Summit Chronicles',
  description:
    "Live training telemetry, weekly mission logs, and long-view performance tracking for Summit Chronicles.",
  keywords:
    'training, intervals.icu, mission logs, mountaineering fitness, VO2 max, recovery, expedition training',
  openGraph: {
    title: 'Training | Summit Chronicles',
    description:
      'Live training telemetry and weekly mission logs for high-altitude mountaineering.',
    type: 'website',
  },
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
