// components/Header.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

const nav = [
  { href: '/expeditions', label: 'Expeditions' },
  { href: '/expedition-live', label: 'Live Tracking' },
  { href: '/training', label: 'Training' },
  { href: '/search', label: 'Ask' },
  { href: '/about', label: 'About' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b bg-[var(--bg)]/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-wide">
          Summit Chronicles
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-6 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--fg)]/80 hover:text-[var(--fg)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle Menu"
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-sm md:hidden"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden">
          <nav className="space-y-1 border-t px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2 text-[var(--fg)]/90 hover:bg-black/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}