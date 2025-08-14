export default function StoriesPage() {
  return (
    <section className="container py-16">
      <h1 className="text-4xl font-bold">Stories</h1>
      <p className="mt-4 text-gray-300">First-person essays on training, resilience, and mindset.</p>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <article className="p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold">The Tire Drag That Broke Me (and Built Me)</h3>
          <p className="mt-2 text-gray-400">What sled work taught me about patience.</p>
        </article>
        <article className="p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold">Denali: A Not-Quite-Summit, Still a Win</h3>
          <p className="mt-2 text-gray-400">Turning a setback into a systems upgrade.</p>
        </article>
      </div>
    </section>
  )
}
