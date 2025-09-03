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
      <body className={`${inter.className} bg-black text-white`}>
        {/* MODERN NAVBAR */}
        <header className="fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 z-50">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-wide text-white hover:text-summitGold transition-colors duration-300">
              Summit Chronicles
            </Link>
            <div className="flex gap-8 text-sm font-medium">
              <Link
                href="/expeditions"
                className="text-white/80 hover:text-summitGold transition-colors duration-300 relative group"
              >
                Expeditions
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/training"
                className="text-white/80 hover:text-summitGold transition-colors duration-300 relative group"
              >
                Training
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/gear"
                className="text-white/80 hover:text-summitGold transition-colors duration-300 relative group"
              >
                Gear
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/blog"
                className="text-white/80 hover:text-summitGold transition-colors duration-300 relative group"
              >
                Blog
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-summitGold group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/ask"
                className="px-4 py-2 bg-summitGold text-black rounded-full font-semibold hover:bg-yellow-400 transition-colors duration-300"
              >
                Ask AI
              </Link>
            </div>
          </nav>
        </header>

        {/* MAIN CONTENT */}
        <main className="pt-20">{children}</main>

        {/* MODERN FOOTER */}
        <footer className="bg-black border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="text-2xl font-bold text-white mb-4">Summit Chronicles</div>
            <div className="text-white/60 mb-6">
              © {new Date().getFullYear()} · Documenting the Seven Summits Journey
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-white/40">
              <span>About</span>
              <span>Contact</span>
              <span>Privacy</span>
              <span>Follow the Journey</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}