'use client'
import useSWR from 'swr'
const fetcher = (url: string) => fetch(url).then(r => r.json())

function fmtHours(sec: number) { return `${Math.round(((sec||0)/3600)*10)/10} h` }
function fmtKm(km: number) { return `${(km??0).toLocaleString(undefined,{maximumFractionDigits:1})} km` }
function fmtElev(m: number) { return `${(m??0).toLocaleString()} m` }

export default function StatsTracker() {
  const { data, error, isLoading } = useSWR('/api/strava/stats', fetcher)

  return (
    <section className="container py-12">
      <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Lifetime Tracker</h2>

      {isLoading && <p className="mt-4 text-gray-400">Loading stats…</p>}
      {error && <p className="mt-4 text-amber-300">Couldn’t load stats. Check Strava env vars.</p>}

      {data && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-gray-400">Total Number of Runs</div>
            <div className="mt-1 text-3xl font-semibold">{data.runs.count}</div>
            <div className="mt-2 text-sm text-gray-300">{fmtKm(data.runs.distance_km)} • {fmtHours(data.runs.moving_sec)}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-gray-400">Total Hikes</div>
            <div className="mt-1 text-3xl font-semibold">{data.hikes.count}</div>
            <div className="mt-2 text-sm text-gray-300">{fmtKm(data.hikes.distance_km)} • {fmtElev(data.hikes.elevation_m)} • {fmtHours(data.hikes.moving_sec)}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-gray-400">Total Cycling Sessions</div>
            <div className="mt-1 text-3xl font-semibold">{data.rides.count}</div>
            <div className="mt-2 text-sm text-gray-300">{fmtKm(data.rides.distance_km)} • {fmtHours(data.rides.moving_sec)}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-gray-400">Overall Elevation Gained</div>
            <div className="mt-1 text-3xl font-semibold">{fmtElev(data.overall.elevation_m)}</div>
          </div>
        </div>
      )}
    </section>
  )
}