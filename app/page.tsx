'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  return (
    <section className="container py-16">
      <div className="text-6xl md:text-7xl font-extrabold leading-tight">
        <span className="block hollow">Summit</span>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="block"
        >
          Chronicles
        </motion.span>
      </div>
      <p className="mt-6 max-w-2xl text-gray-300">
        A living log of an Indian mountaineer’s pursuit of the 7 Summits. Training, expeditions,
        hard-won lessons, and a community that moves.
      </p>
      <div className="mt-10 flex gap-4">
        <Link href="/expeditions" className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition">Explore Expeditions</Link>
        <Link href="/stories" className="px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/5 transition">Read Stories</Link>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {[
          ['Denali', 'Alaska — 2025', '/expeditions'],
          ['Elbrus', 'Russia — 2024', '/expeditions'],
          ['Aconcagua', 'Argentina — 2024', '/expeditions'],
        ].map(([name, meta, href]) => (
          <Link key={name} href={href} className="group p-6 rounded-3xl border border-white/10 hover:border-white/30 transition">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{name}</h3>
              <span className="text-xs text-gray-400">{meta}</span>
            </div>
            <p className="mt-3 text-gray-400">See route, kit, notes, and gallery.</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
