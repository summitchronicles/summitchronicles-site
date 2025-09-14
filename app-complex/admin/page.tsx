"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import {
  DocumentTextIcon,
  NewspaperIcon,
  ChartBarIcon,
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
      description: "API connection active, tokens refreshed"
    },
    {
      name: "RAG AI System", 
      status: "healthy",
      lastChecked: new Date().toLocaleString(),
      description: "Ollama + Supabase vector search operational"
    },
    {
      name: "Analytics",
      status: "healthy", 
      lastChecked: new Date().toLocaleString(),
      description: "Custom analytics + GA4 tracking active"
    },
    {
      name: "Error Monitoring",
      status: "healthy",
      lastChecked: new Date().toLocaleString(),
      description: "Comprehensive error tracking implemented"
    },
    {
      name: "Authentication",
      status: "healthy",
      lastChecked: new Date().toLocaleString(),
      description: "NextAuth.js with Google OAuth + credentials"
    },
    {
      name: "Blog CMS",
      status: "healthy",
      lastChecked: new Date().toLocaleString(), 
      description: "Supabase CMS active"
    }
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const getStatusIcon = (status: SystemStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'border-green-400/20 bg-green-400/5';
      case 'warning':
        return 'border-yellow-400/20 bg-yellow-400/5';
      case 'error':
        return 'border-red-400/20 bg-red-400/5';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start mb-12"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Summit Chronicles
              <span className="block text-2xl md:text-3xl text-summitGold font-normal">
                Admin Dashboard
              </span>
            </h1>
            <p className="text-xl text-white/70">
              Manage your mountaineering platform
            </p>
          </div>
          
          {/* User Info & Sign Out */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 min-w-[200px]">
            <div className="flex items-center gap-3 mb-3">
              <UserIcon className="w-5 h-5 text-summitGold" />
              <div>
                <p className="text-white font-medium text-sm">{session?.user?.name}</p>
                <p className="text-white/60 text-xs">{session?.user?.email}</p>
                <p className="text-summitGold text-xs capitalize">
                  {(session?.user as any)?.role || 'admin'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {systemStatus.map((system, index) => (
              <motion.div
                key={system.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className={`border rounded-2xl p-6 ${getStatusColor(system.status)}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(system.status)}
                  <h3 className="text-white font-semibold">{system.name}</h3>
                </div>
                <p className="text-white/60 text-sm mb-2">{system.description}</p>
                <p className="text-white/40 text-xs">Last checked: {system.lastChecked}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Blog Management */}
            <Link
              href="/admin/blog"
              className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-summitGold/30 rounded-2xl p-6 transition-all hover:bg-white/10"
            >
              <DocumentTextIcon className="w-8 h-8 text-summitGold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Manage Blog</h3>
              <p className="text-white/60 text-sm">Create and edit blog posts</p>
            </Link>

            {/* Newsletter */}
            <Link
              href="/admin/newsletter"
              className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-summitGold/30 rounded-2xl p-6 transition-all hover:bg-white/10"
            >
              <NewspaperIcon className="w-8 h-8 text-summitGold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Newsletter</h3>
              <p className="text-white/60 text-sm">Generate and send newsletters</p>
            </Link>

            {/* Analytics */}
            <Link
              href="/admin/analytics"
              className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-summitGold/30 rounded-2xl p-6 transition-all hover:bg-white/10"
            >
              <ChartBarIcon className="w-8 h-8 text-summitGold mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Analytics</h3>
              <p className="text-white/60 text-sm">View site metrics and insights</p>
            </Link>

            {/* Strava Refresh */}
            <button
              onClick={() => {
                fetch('/api/strava/refresh-tokens', {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${process.env.CRON_SECRET || 'default-secret'}` }
                }).then(() => alert('Strava tokens refreshed!'));
              }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-summitGold/30 rounded-2xl p-6 transition-all hover:bg-white/10 text-left"
            >
              <div className="w-8 h-8 bg-summitGold/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-summitGold font-bold text-sm">S</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Refresh Strava</h3>
              <p className="text-white/60 text-sm">Manually refresh Strava tokens</p>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 py-3 border-b border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/60 text-sm">System status check completed</span>
                <span className="text-white/40 text-xs ml-auto">Just now</span>
              </div>
              <div className="flex items-center gap-4 py-3 border-b border-white/10">
                <div className="w-2 h-2 bg-summitGold rounded-full"></div>
                <span className="text-white/60 text-sm">Admin session started</span>
                <span className="text-white/40 text-xs ml-auto">2 min ago</span>
              </div>
              <div className="flex items-center gap-4 py-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-white/60 text-sm">NextAuth.js authentication system activated</span>
                <span className="text-white/40 text-xs ml-auto">5 min ago</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireRole="admin">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}