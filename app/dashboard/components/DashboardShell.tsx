'use client';

import Sidebar from './Sidebar';
import PublishModal from './PublishModal';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
      <PublishModal />
    </div>
  );
}
