export default function TermsPage() {
  return (
    <main className="min-h-screen bg-obsidian text-white">
      <section className="max-w-4xl mx-auto px-6 py-32">
        <p className="text-sm uppercase tracking-[0.3em] text-summit-gold mb-4">
          Terms
        </p>
        <h1 className="text-5xl md:text-7xl font-oswald uppercase tracking-tight mb-6">
          Terms of Service
        </h1>
        <div className="space-y-6 text-white/75 leading-relaxed">
          <p>
            Site content is provided for informational purposes. Expedition,
            training, and gear information should not be treated as medical,
            legal, or life-safety advice.
          </p>
          <p>
            You may not misuse automated endpoints, interfere with site
            operation, or copy proprietary content for commercial reuse without
            permission.
          </p>
          <p>
            Continued use of the site constitutes acceptance of these terms and
            related policy updates.
          </p>
        </div>
      </section>
    </main>
  );
}
