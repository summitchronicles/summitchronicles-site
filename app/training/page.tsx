// app/training/page.tsx
'use client'

import React from 'react'

type Item = {
  id: number
  name: string
  type: string
  distance_km: number
  moving_time_min: number
  elev_gain_m: number
  start_date: string
}

export default function TrainingPage() {
  const [items, setItems] = React.useState<Item[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/strava/recent', { cache: 'no-store' })
        const json = await res.json()
        if (!res.ok || json.error) throw new Error(json.error || 'Failed to load activities')
        setItems(json.items || [])
      } catch (e: any) {
        setError(e?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <section className="py-8">
      <h1 className="mb-4 text-2xl font-bold">Training Notes</h1>
      <p className="mb-6 text-[var(--fg)]/80">Recent Strava activities (last 20)</p>

      {loading && <div className="rounded border p-4">Loading…</div>}
      {error && <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="rounded border p-4">No activities found.</div>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto rounded-token border">
          <table className="min-w-full text-sm">
            <thead className="bg-black/5 text-left">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Distance (km)</th>
                <th className="px-3 py-2">Time (min)</th>
                <th className="px-3 py-2">Elev (m)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(a.start_date).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">{a.name}</td>
                  <td className="px-3 py-2">{a.type}</td>
                  <td className="px-3 py-2">{a.distance_km}</td>
                  <td className="px-3 py-2">{a.moving_time_min}</td>
                  <td className="px-3 py-2">{a.elev_gain_m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}