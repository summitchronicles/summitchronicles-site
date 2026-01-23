import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Dashboard',
  description: 'Manage your AI agents, blog drafts, and training insights.',
  robots: {
    index: false, // Dashboard should probably not be indexed
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
