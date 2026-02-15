import type { Metadata } from 'next';
import DashboardShell from './components/DashboardShell';

export const metadata: Metadata = {
  title: 'Mission Control - Summit Chronicles',
  description: 'Manage your AI agents, blog drafts, and training insights.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
