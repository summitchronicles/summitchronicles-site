import './globals.css'
import type { Metadata } from 'next'
import { defaultSEO } from '@/lib/seo'
import Link from 'next/link'
import { Montserrat, Lora } from 'next/font/google'

const mont = Montserrat({ subsets:['latin'], weight:['500','800'], variable:'--font-mont' })
const lora = Lora({ subsets:['latin'], weight:['400'], variable:'--font-lora' })

export const metadata: Metadata = {
  title: defaultSEO.title,
  description: defaultSEO.description,
  icons: { icon: '/favicon.ico' }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mont.variable} ${lora.variable}`}>
      <body className="grain antialiased">
        <nav className="container py-6 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">Summit Chronicles</Link>
          <div className="flex gap-6 text-sm text-gray-300">
            <Link href="/expeditions">Expeditions</Link>
            <Link href="/stories">Stories</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="container py-12 text-sm text-gray-400">
          © {new Date().getFullYear()} Summit Chronicles — Built with Next.js
        </footer>
      </body>
    </html>
  )
}
