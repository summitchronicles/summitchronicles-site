export default function ContactPage() {
  return (
    <section className="container py-16 max-w-2xl">
      <h1 className="text-4xl font-bold">Contact</h1>
      <p className="mt-4 text-gray-300">Speaking invites, brand partnerships, and media.</p>
      <form className="mt-8 grid gap-4">
        <input className="bg-white/5 border border-white/10 rounded-xl p-3" placeholder="Name" />
        <input className="bg-white/5 border border-white/10 rounded-xl p-3" placeholder="Email" />
        <textarea className="bg-white/5 border border-white/10 rounded-xl p-3 min-h-[120px]" placeholder="Message" />
        <button className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition w-max">Send</button>
      </form>
      <p className="mt-3 text-xs text-gray-500">Hook up to your email provider (Resend/Mailgun) later.</p>
    </section>
  )
}
