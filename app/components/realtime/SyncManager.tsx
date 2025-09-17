'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Database, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Settings,
  BarChart3
} from 'lucide-react'

interface SyncStatus {
  isRunning: boolean
  config: {
    intervalMinutes: number
    enableStrava: boolean
    enableWeather: boolean
    enableCache: boolean
  }
  cacheSize: number
  lastSync: string | null
}

interface SyncResult {
  success: boolean
  synced: string[]
  errors: string[]
}

export function SyncManager() {
  const [status, setStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null)

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/sync?action=status')
      const data = await response.json()
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch sync status:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleStart = async () => {
    try {
      const response = await fetch('/api/sync?action=start')
      const data = await response.json()
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      console.error('Failed to start sync:', error)
    }
  }

  const handleStop = async () => {
    try {
      const response = await fetch('/api/sync?action=stop')
      const data = await response.json()
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      console.error('Failed to stop sync:', error)
    }
  }

  const handleManualSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/sync?action=sync')
      const data = await response.json()
      setLastSyncResult(data.data)
      await fetchStatus() // Refresh status after sync
    } catch (error) {
      console.error('Failed to perform manual sync:', error)
    } finally {
      setSyncing(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-spa-stone/10 shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-spa-stone/20 rounded w-48"></div>
          <div className="h-16 bg-spa-stone/20 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-white rounded-xl border border-spa-stone/10 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8" />
            <h2 className="text-2xl font-light">Data Sync Manager</h2>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
            status?.isRunning 
              ? 'bg-green-500/20 text-green-100' 
              : 'bg-red-500/20 text-red-100'
          }`}>
            {status?.isRunning ? (
              <>
                <Play className="w-4 h-4" />
                Running
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                Stopped
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Sync Controls */}
        <div className="flex gap-3">
          <button
            onClick={status?.isRunning ? handleStop : handleStart}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              status?.isRunning
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {status?.isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Stop Auto-Sync
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Auto-Sync
              </>
            )}
          </button>
          
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="flex items-center gap-2 bg-alpine-blue text-white px-4 py-2 rounded-lg hover:bg-alpine-blue/90 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            Manual Sync
          </button>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-spa-cloud/10 rounded-lg">
            <Clock className="w-6 h-6 mx-auto mb-2 text-alpine-blue" />
            <div className="text-lg font-light text-spa-charcoal">
              {status?.config.intervalMinutes}min
            </div>
            <div className="text-xs text-spa-charcoal/60">Sync Interval</div>
          </div>
          
          <div className="text-center p-3 bg-spa-cloud/10 rounded-lg">
            <Database className="w-6 h-6 mx-auto mb-2 text-alpine-blue" />
            <div className="text-lg font-light text-spa-charcoal">
              {status?.cacheSize || 0}
            </div>
            <div className="text-xs text-spa-charcoal/60">Cache Entries</div>
          </div>
          
          <div className="text-center p-3 bg-spa-cloud/10 rounded-lg">
            <Activity className="w-6 h-6 mx-auto mb-2 text-alpine-blue" />
            <div className={`text-lg font-light ${
              status?.config.enableStrava ? 'text-green-600' : 'text-gray-400'
            }`}>
              {status?.config.enableStrava ? 'ON' : 'OFF'}
            </div>
            <div className="text-xs text-spa-charcoal/60">Strava Sync</div>
          </div>
          
          <div className="text-center p-3 bg-spa-cloud/10 rounded-lg">
            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-alpine-blue" />
            <div className={`text-lg font-light ${
              status?.config.enableWeather ? 'text-green-600' : 'text-gray-400'
            }`}>
              {status?.config.enableWeather ? 'ON' : 'OFF'}
            </div>
            <div className="text-xs text-spa-charcoal/60">Weather Sync</div>
          </div>
        </div>

        {/* Last Sync Result */}
        {lastSyncResult && (
          <div className={`p-4 rounded-lg border ${
            lastSyncResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {lastSyncResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <h4 className={`font-medium ${
                lastSyncResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                Last Sync {lastSyncResult.success ? 'Successful' : 'Failed'}
              </h4>
            </div>
            
            {lastSyncResult.synced.length > 0 && (
              <div className="mb-2">
                <span className={`text-sm ${
                  lastSyncResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  Synced: {lastSyncResult.synced.join(', ')}
                </span>
              </div>
            )}
            
            {lastSyncResult.errors.length > 0 && (
              <div>
                <span className="text-sm text-red-800">
                  Errors: {lastSyncResult.errors.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Configuration Info */}
        <div className="bg-spa-cloud/20 rounded-lg p-4">
          <h4 className="font-medium text-spa-charcoal mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Sync Configuration
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-spa-charcoal/70">
            <div>
              <strong>Auto-sync:</strong> Every {status?.config.intervalMinutes} minutes
            </div>
            <div>
              <strong>Cache:</strong> {status?.config.enableCache ? 'Enabled' : 'Disabled'}
            </div>
            <div>
              <strong>Strava Integration:</strong> {status?.config.enableStrava ? 'Active' : 'Inactive'}
            </div>
            <div>
              <strong>Weather Integration:</strong> {status?.config.enableWeather ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}