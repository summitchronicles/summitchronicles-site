import Hero from '@/components/Hero'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="container py-16">
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[
            ['Denali', 'Alaska — 2025', '/expeditions'],
            ['Elbrus', 'Russia — 2024', '/expeditions'],
            ['Aconcagua', 'Argentina — 2024', '/expeditions'],
          ].map(([name, meta, href]) => (
            <Link
              key={name}
              href={href}
              className="group p-6 rounded-3xl border border-white/10 hover:border-white/30 transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{name}</h3>
                <span className="text-xs text-gray-400">{meta}</span>
              </div>
              <p className="mt-3 text-gray-400">See route, kit, notes, and gallery.</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
