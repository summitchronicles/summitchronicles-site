import type { ReactNode } from 'react';
import { Header } from '../organisms/Header';
import { Footer } from '../organisms/Footer';

interface PublicLayoutProps {
  children: ReactNode;
  mainClassName?: string;
}

export function PublicLayout({
  children,
  mainClassName = '',
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-obsidian text-white">
      <a
        href="#main-content"
        className="sr-only z-[120] rounded-md bg-summit-gold px-4 py-3 font-medium text-black focus:fixed focus:left-4 focus:top-4 focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className={`min-w-0 flex-1 ${mainClassName}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
