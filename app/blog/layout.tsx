import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stories & Insights - Summit Chronicles',
  description:
    'Authentic mountain journey blog: personal stories, technical guides, and the human side of extreme mountaineering.',
  keywords:
    'mountaineering stories, climbing blog, high altitude, Seven Summits, adventure log, Sherpa stories',
  openGraph: {
    title: 'Stories & Insights | Summit Chronicles',
    description:
      'Real struggles, breakthroughs, and preparation on the road to the Seven Summits.',
    type: 'website',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
