'use client'
import { useState } from 'react'

export default function SignupCard() {
  const [status, setStatus] = useState<'idle' | 'ok'>('idle')
  const username = process.env.NEXT_PUBLIC_BUTTONDOWN_USERNAME // e.g., summitchronicles

  return (
    <section className="container py-10">
      <div className="rounded-3xl border border-white/10 p-6 md:p-8 bg-white/5">
        <h3 className="text-xl md:text-2xl font-semibold">Join the Climb</h3>
        <p className="mt-2 text-gray-300">Get monthly expedition updates, gear tips, and photo stories.</p>

        {!username ? (
          <p className="mt-4 text-sm text-amber-300">
            Newsletter isn’t configured yet. Add <code>NEXT_PUBLIC_BUTTONDOWN_USERNAME</code> to your <code>.env</code> to enable the form.
          </p>
        ) : (
          <form
            action="https://buttondown.email/api/emails/subscribe"
            method="post"
            target="popupwindow"
            onSubmit={() => {
              const url = `https://buttondown.email/${username}`
              window.open(url, 'popupwindow')
              setTimeout(() => setStatus('ok'), 300)
            }}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            <input type="hidden" name="username" value={username} />
            <input
              aria-label="Email address"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-xl bg-white/10 border border-white/20 px-4 py-3 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl px-5 py-3 bg-[var(--gold,_#F2A65A)] text-black hover:bg-[var(--sunset,_#B23A48)] hover:text-white transition"
            >
              Subscribe
            </button>
          </form>
        )}

        {status === 'ok' && (
          <p className="mt-3 text-sm text-green-300">Thanks! Check your inbox to confirm.</p>
        )}
      </div>
    </section>
  )
}