export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-obsidian text-white">
      <section className="max-w-4xl mx-auto px-6 py-32">
        <p className="text-sm uppercase tracking-[0.3em] text-summit-gold mb-4">
          Privacy
        </p>
        <h1 className="text-5xl md:text-7xl font-oswald uppercase tracking-tight mb-6">
          Privacy Policy
        </h1>
        <div className="space-y-6 text-white/75 leading-relaxed">
          <p>
            Summit Chronicles collects only the information needed to operate
            the site, respond to inquiries, and manage newsletter subscriptions.
          </p>
          <p>
            Personal information is not sold. Third-party providers may process
            analytics, email delivery, media storage, or infrastructure logs on
            behalf of the site.
          </p>
          <p>
            If you need data access, correction, or deletion, contact
            hello@summitchronicles.com.
          </p>
        </div>
      </section>
    </main>
  );
}
