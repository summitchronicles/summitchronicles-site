import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Training & Rehabilitation - Summit Chronicles',
  description:
    "Track Sunith's systematic rehabilitation progress, VO2 Max metrics, and training roadmap for the Seven Summits expedition.",
  keywords:
    'training, rehabilitation, mountaineering fitness, VO2 max, recovery, ACL recovery, expedition training',
  openGraph: {
    title: 'Training & Rehabilitation | Summit Chronicles',
    description:
      'Detailed training logs and recovery metrics for high-altitude mountaineering.',
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
