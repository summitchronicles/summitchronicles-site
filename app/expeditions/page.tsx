export default function ExpeditionsPage() {
  return (
    <section className="container py-16">
      <h1 className="text-4xl font-bold">Expeditions</h1>
      <p className="mt-4 text-gray-300">A timeline of major expeditions with debriefs and kit lists.</p>
      <ul className="mt-8 space-y-4">
        <li className="p-4 rounded-2xl border border-white/10">
          <strong>Denali • 2025</strong> — Lessons from the mountain and prep for Everest.
        </li>
        <li className="p-4 rounded-2xl border border-white/10"><strong>Elbrus • 2024</strong></li>
        <li className="p-4 rounded-2xl border border-white/10"><strong>Aconcagua • 2024</strong></li>
        <li className="p-4 rounded-2xl border border-white/10"><strong>Kilimanjaro • 2023</strong></li>
      </ul>
    </section>
  )
}
