import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Summit Chronicles",
  description: "Documenting the Seven Summits journey – training, expeditions, and reflections.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-[var(--color-light-gray)] text-[var(--color-charcoal)]`}
      >
        {/* NAVBAR */}
        <header className="w-full bg-[var(--color-alpine-blue)] text-white shadow">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg tracking-wide">
              Summit Chronicles
            </Link>
            <div className="flex gap-6 text-sm font-medium">
              <Link
                href="/expeditions"
                className="hover:text-[var(--color-summit-gold)] transition"
              >
                Expeditions
              </Link>
              <Link
                href="/training"
                className="hover:text-[var(--color-summit-gold)] transition"
              >
                Training
              </Link>
              <Link
                href="/gear"
                className="hover:text-[var(--color-summit-gold)] transition"
              >
                Gear
              </Link>
              <Link
                href="/blog"
                className="hover:text-[var(--color-summit-gold)] transition"
              >
                Blog
              </Link>
              <Link
                href="/ask"
                className="hover:text-[var(--color-summit-gold)] transition"
              >
                Ask the Site
              </Link>
            </div>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main className="min-h-screen">{children}</main>

        {/* FOOTER */}
        <footer className="footer">
          © {new Date().getFullYear()} Summit Chronicles · About · Contact ·
          Social Links
        </footer>
      </body>
    </html>
  );
}