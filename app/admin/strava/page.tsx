"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

export default function StravaAdminPage() {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkStravaConnection();
  }, []);

  const checkStravaConnection = async () => {
    try {
      const response = await fetch('/api/strava/recent');
      const data = await response.json();
      
      if (data.source === 'mock') {
        setConnectionStatus('disconnected');
      } else {
        setConnectionStatus('connected');
        setTokenInfo(data);
      }
    } catch (err) {
      setError('Failed to check Strava connection');
      setConnectionStatus('disconnected');
    }
  };

  const handleStravaConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID || '172794';
    const redirectUri = `${window.location.origin}/api/strava/callback`;
    const scope = 'read,activity:read_all';
    
    const authUrl = `https://www.strava.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `approval_prompt=force&` +
      `scope=${scope}`;
    
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/blog"
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-white" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Strava Integration</h1>
                <p className="text-white/60">Connect your Strava account to display real training data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Connection Status Card */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-6">
            {connectionStatus === 'checking' && (
              <div className="w-8 h-8 border-2 border-summitGold border-t-transparent rounded-full animate-spin" />
            )}
            {connectionStatus === 'connected' && (
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            )}
            {connectionStatus === 'disconnected' && (
              <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400" />
            )}
            
            <div>
              <h2 className="text-xl font-semibold text-white">
                {connectionStatus === 'checking' && 'Checking Connection...'}
                {connectionStatus === 'connected' && 'Strava Connected'}
                {connectionStatus === 'disconnected' && 'Strava Not Connected'}
              </h2>
              <p className="text-white/60">
                {connectionStatus === 'checking' && 'Verifying your Strava integration status'}
                {connectionStatus === 'connected' && 'Your real training data is being displayed'}
                {connectionStatus === 'disconnected' && 'Currently showing mock data - connect to see your real activities'}
              </p>
            </div>
          </div>

          {connectionStatus === 'disconnected' && (
            <div className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div className="text-sm text-yellow-200">
                    <p className="font-medium mb-1">Mock Data Currently Active</p>
                    <p>The application is showing generated training data. Connect your Strava account to display your actual mountaineering and training activities.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStravaConnect}
                className="flex items-center gap-3 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.917"/>
                </svg>
                Connect with Strava
                <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {connectionStatus === 'connected' && tokenInfo && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-400 mt-0.5" />
                <div className="text-sm text-green-200">
                  <p className="font-medium mb-1">Successfully Connected</p>
                  <p>Your Strava account is connected and your real training data is being displayed throughout the application.</p>
                  <div className="mt-3 space-y-1 text-xs text-green-300">
                    <p>• Training analytics show your actual activities</p>
                    <p>• Recent workouts display your latest sessions</p>
                    <p>• Statistics reflect your real progress</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="text-sm text-red-200">
                  <p className="font-medium mb-1">Connection Error</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">How to Connect Your Strava Account</h3>
          <div className="space-y-3 text-white/80">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-summitGold text-black rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <p>Click &quot;Connect with Strava&quot; above to start the authorization process</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-summitGold text-black rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <p>You&apos;ll be redirected to Strava to authorize Summit Chronicles to access your activities</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-summitGold text-black rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <p>After authorization, you&apos;ll be redirected back and your real training data will appear</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-summitGold text-black rounded-full flex items-center justify-center text-sm font-medium">4</span>
              <p>Visit the training analytics page to see your actual mountaineering and training progress</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}