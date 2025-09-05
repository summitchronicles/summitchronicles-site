import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseServer'

export const runtime = 'nodejs'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: {
    database: {
      status: 'up' | 'down'
      responseTime: number
      error?: string
    }
    sentry: {
      status: 'up' | 'down'
      configured: boolean
    }
    analytics: {
      status: 'up' | 'down'
      responseTime: number
      error?: string
    }
    build: {
      version: string
      deployedAt: string
    }
  }
  uptime: number
  memory: {
    used: number
    free: number
    total: number
  }
}

const startTime = Date.now()

async function checkDatabase(): Promise<HealthStatus['checks']['database']> {
  const start = Date.now()
  try {
    const supabase = getSupabaseAdmin()
    
    // Simple ping query - use blog_posts table which exists
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1)
    
    if (error) throw error
    
    return {
      status: 'up',
      responseTime: Date.now() - start
    }
  } catch (error: any) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      error: error.message
    }
  }
}

function checkSentry(): HealthStatus['checks']['sentry'] {
  return {
    status: process.env.SENTRY_DSN ? 'up' : 'down',
    configured: !!process.env.SENTRY_DSN
  }
}

async function checkAnalytics(): Promise<HealthStatus['checks']['analytics']> {
  const start = Date.now()
  try {
    // Test analytics endpoint
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/analytics/track`, {
      method: 'GET'
    })
    
    if (!response.ok) throw new Error(`Analytics endpoint returned ${response.status}`)
    
    return {
      status: 'up',
      responseTime: Date.now() - start
    }
  } catch (error: any) {
    return {
      status: 'down',
      responseTime: Date.now() - start,
      error: error.message
    }
  }
}

function getBuildInfo(): HealthStatus['checks']['build'] {
  return {
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
    deployedAt: process.env.VERCEL_DEPLOYMENT_DATE || new Date().toISOString()
  }
}

function getMemoryUsage(): HealthStatus['memory'] {
  const usage = process.memoryUsage()
  const total = usage.heapTotal
  const used = usage.heapUsed
  const free = total - used
  
  return {
    used: Math.round(used / 1024 / 1024 * 100) / 100, // MB
    free: Math.round(free / 1024 / 1024 * 100) / 100, // MB
    total: Math.round(total / 1024 / 1024 * 100) / 100 // MB
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const timestamp = new Date().toISOString()
  const uptime = Math.round((Date.now() - startTime) / 1000)
  
  try {
    // Run all health checks in parallel
    const [databaseCheck, analyticsCheck] = await Promise.all([
      checkDatabase(),
      checkAnalytics()
    ])
    
    const sentryCheck = checkSentry()
    const buildInfo = getBuildInfo()
    const memory = getMemoryUsage()
    
    const checks = {
      database: databaseCheck,
      sentry: sentryCheck,
      analytics: analyticsCheck,
      build: buildInfo
    }
    
    // Determine overall status
    let status: HealthStatus['status'] = 'healthy'
    
    if (checks.database.status === 'down') {
      status = 'unhealthy'
    } else if (checks.analytics.status === 'down' || !checks.sentry.configured) {
      status = 'degraded'
    }
    
    const healthStatus: HealthStatus = {
      status,
      timestamp,
      checks,
      uptime,
      memory
    }
    
    // Return appropriate HTTP status based on health
    const httpStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503
    
    return NextResponse.json(healthStatus, { status: httpStatus })
    
  } catch (error: any) {
    const healthStatus: HealthStatus = {
      status: 'unhealthy',
      timestamp,
      checks: {
        database: { status: 'down', responseTime: 0, error: 'Health check failed' },
        sentry: { status: 'down', configured: false },
        analytics: { status: 'down', responseTime: 0, error: 'Health check failed' },
        build: getBuildInfo()
      },
      uptime,
      memory: getMemoryUsage()
    }
    
    return NextResponse.json(healthStatus, { status: 503 })
  }
}

// Simple liveness probe endpoint
export async function HEAD(): Promise<NextResponse> {
  return new NextResponse(null, { status: 200 })
}