'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'admin' | 'owner';
  fallbackUrl?: string;
}

export default function ProtectedRoute({
  children,
  requireRole = 'admin',
  fallbackUrl = '/admin/auth/signin',
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading session

    if (!session) {
      router.push(fallbackUrl);
      return;
    }

    // Check role requirements
    const userRole = (session.user as any)?.role;

    if (requireRole === 'owner' && userRole !== 'owner') {
      router.push('/admin/auth/error?error=AccessDenied');
      return;
    }

    if (requireRole === 'admin' && !['admin', 'owner'].includes(userRole)) {
      router.push('/admin/auth/error?error=AccessDenied');
      return;
    }
  }, [session, status, router, requireRole, fallbackUrl]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-summitGold mx-auto mb-4"></div>
          <p className="text-white/60">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or authorized
  if (!session) {
    return null;
  }

  const userRole = (session.user as any)?.role;
  if (requireRole === 'owner' && userRole !== 'owner') {
    return null;
  }

  if (requireRole === 'admin' && !['admin', 'owner'].includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
