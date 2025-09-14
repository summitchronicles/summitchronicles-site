// components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-[var(--muted)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Summit Chronicles</p>
          <nav className="flex gap-4">
            <Link className="hover:underline" href="/about">About</Link>
            <Link className="hover:underline" href="/search">Ask</Link>
            <a className="hover:underline" href="mailto:hello@summitchronicles.com">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}