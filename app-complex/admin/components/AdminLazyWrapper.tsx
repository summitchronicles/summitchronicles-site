'use client';

import { Suspense } from 'react';

interface AdminLazyWrapperProps {
  children: React.ReactNode;
  title: string;
}

// Loading fallback for admin pages
function AdminFallback({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-gray-900 to-black">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-summitGold mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Loading {title}
            </h2>
            <p className="text-white/60">Preparing admin dashboard...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLazyWrapper({
  children,
  title,
}: AdminLazyWrapperProps) {
  return (
    <Suspense fallback={<AdminFallback title={title} />}>{children}</Suspense>
  );
}
