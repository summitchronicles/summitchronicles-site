import Link from 'next/link';

export default function ConnectPage() {
  return (
    <main className="min-h-screen bg-obsidian text-white">
      <section className="max-w-4xl mx-auto px-6 py-32">
        <p className="text-sm uppercase tracking-[0.3em] text-summit-gold mb-4">
          Connect
        </p>
        <h1 className="text-5xl md:text-7xl font-oswald uppercase tracking-tight mb-6">
          Reach Summit Chronicles
        </h1>
        <p className="text-lg text-white/70 leading-relaxed max-w-2xl mb-10">
          For partnerships, speaking requests, media inquiries, or expedition
          collaboration, use the channels below and include enough context for a
          fast response.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-oswald uppercase mb-3">Primary</h2>
            <p className="text-white/70 mb-4">
              Email is the fastest path for serious inquiries.
            </p>
            <a
              href="mailto:hello@summitchronicles.com"
              className="text-summit-gold hover:text-white transition-colors"
            >
              hello@summitchronicles.com
            </a>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-oswald uppercase mb-3">Next Steps</h2>
            <p className="text-white/70 mb-4">
              If the request is commercial, include timeline, budget, and
              expected deliverables.
            </p>
            <Link
              href="/partnerships"
              className="text-summit-gold hover:text-white transition-colors"
            >
              View partnership information
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
