"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import {
  DocumentTextIcon,
  NewspaperIcon,
  ChartBarIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface SystemStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  lastChecked: string;
  description: string;
}

function AdminDashboardContent() {
  const { data: session } = useSession();

  const systemStatus: SystemStatus[] = [
    {
      name: "Strava Integration",
      status: "healthy",
      lastChecked: new Date().toLocaleString(),
      description: "Token refresh system active"
    },
    {
      name: "Newsletter System", 
      status: "healthy",
      lastChecked: new Date().toLocaleString(),
      description: "Buttondown integration working"
    },
    {
      name: "AI Knowledge Base",
      status: "healthy", 
      lastChecked: new Date().toLocaleString(),
      description: "RAG system operational"
    },
    {
      name: "Blog Management",
      status: "healthy",
      lastChecked: new Date().toLocaleString(), 
      description: "Supabase CMS active"
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-8">
            <KeyIcon className="w-12 h-12 text-summitGold mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-white/60">Enter admin password to continue</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
              required
            />
            
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
            
            <button
              type="submit"
              className="w-full px-4 py-3 bg-summitGold text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Access Admin
            </button>
          </form>
          
          <p className="text-white/40 text-xs text-center mt-6">
            Protected admin area for Summit Chronicles management
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Summit Chronicles
            <span className="block text-2xl md:text-3xl text-summitGold font-normal">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-xl text-white/70">
            Manage your mountaineering platform
          </p>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 text-summitGold" />
            System Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStatus.map((system, index) => (
              <div key={system.name} className="bg-black/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  {system.status === 'healthy' && (
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                  )}
                  {system.status === 'warning' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                  )}
                  {system.status === 'error' && (
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                  )}
                  <h3 className="text-white font-semibold text-sm">{system.name}</h3>
                </div>
                <p className="text-white/60 text-xs mb-1">{system.description}</p>
                <p className="text-white/40 text-xs">Last checked: {system.lastChecked}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Blog Management */}
          <Link href="/admin/blog">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/8 transition-all duration-300 cursor-pointer group"
            >
              <DocumentTextIcon className="w-12 h-12 text-summitGold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-3">Blog Management</h3>
              <p className="text-white/60 mb-4">
                Create, edit, and manage blog posts and expedition stories.
              </p>
              <div className="text-summitGold font-medium group-hover:translate-x-2 transition-transform">
                Manage Posts →
              </div>
            </motion.div>
          </Link>

          {/* Newsletter Admin */}
          <Link href="/admin/newsletter">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/8 transition-all duration-300 cursor-pointer group"
            >
              <NewspaperIcon className="w-12 h-12 text-summitGold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-3">Newsletter</h3>
              <p className="text-white/60 mb-4">
                Generate newsletter drafts from recent blog posts and manage subscriber content.
              </p>
              <div className="text-summitGold font-medium group-hover:translate-x-2 transition-transform">
                Create Newsletter →
              </div>
            </motion.div>
          </Link>

          {/* Strava Analytics */}
          <Link href="/admin/strava">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/8 transition-all duration-300 cursor-pointer group"
            >
              <ChartBarIcon className="w-12 h-12 text-summitGold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-bold text-white mb-3">Strava Monitor</h3>
              <p className="text-white/60 mb-4">
                Monitor training data sync, token status, and activity imports.
              </p>
              <div className="text-summitGold font-medium group-hover:translate-x-2 transition-transform">
                View Analytics →
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-summitGold/10 to-yellow-400/10 backdrop-blur-sm border border-summitGold/30 rounded-3xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="/api/strava/refresh-tokens"
              target="_blank"
              className="px-4 py-2 bg-summitGold/20 border border-summitGold/30 text-summitGold rounded-xl hover:bg-summitGold/30 transition-colors text-sm"
            >
              🔄 Refresh Strava Tokens
            </a>
            <a
              href="/api/rss"
              target="_blank"
              className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              📡 View RSS Feed
            </a>
            <a
              href="/"
              className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors text-sm"
            >
              🏠 Back to Site
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}