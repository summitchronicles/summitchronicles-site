import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stories - Summit Chronicles',
  description:
    'Authentic mountain journey blog with personal stories and real challenges.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
