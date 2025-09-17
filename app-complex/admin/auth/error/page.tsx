'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied:
    'Access denied. You are not authorized to access this admin area.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication. Please try again.',
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error') || 'Default';

  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-2xl mb-6"
        >
          <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
        </motion.div>

        {/* Error Content */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Authentication Error
        </h1>

        <p className="text-white/70 mb-8">{message}</p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/admin/auth/signin"
            className="block w-full bg-summitGold text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Try Again
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-summitGold transition-colors text-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Summit Chronicles
          </Link>
        </div>

        {/* Error Details (for debugging) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-xs text-white/40 mb-2">Debug Info:</p>
            <p className="text-xs text-white/60 font-mono">Error: {error}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
