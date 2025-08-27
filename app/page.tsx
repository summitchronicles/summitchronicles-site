// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="py-12 md:py-16">
      <div className="rounded-token border p-6 md:p-10">
        <p className="mb-2 text-sm uppercase tracking-wide text-[var(--muted)]">
          Summit Chronicles
        </p>
        <h1 className="mb-4 text-3xl font-extrabold leading-tight md:text-5xl">
          Stories from the world’s highest peaks
        </h1>
        <p className="mb-6 max-w-2xl text-[var(--fg)]/80">
          Follow the journey: training, expeditions, and lessons learned on the path to the Seven Summits.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/expeditions"
            className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white"
          >
            View expeditions
          </Link>
          <Link
            href="/training"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2"
          >
            Training notes
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2"
          >
            Ask the site
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-token border p-5">
          <h3 className="mb-1 text-lg font-semibold">Live tracker (coming soon)</h3>
          <p className="text-[var(--fg)]/70">Follow progress, elevation, and mileage.</p>
        </div>
        <div className="rounded-token border p-5">
          <h3 className="mb-1 text-lg font-semibold">Gear room</h3>
          <p className="text-[var(--fg)]/70">What I carry on high‑altitude climbs.</p>
        </div>
      </div>
    </section>
  )
}