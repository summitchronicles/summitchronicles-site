'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Icon } from '../atoms/Icon';
import { cn } from '@/lib/utils';

interface NavigationItem {
  href: string;
  label: string;
  description?: string;
}

const primaryNavigation: NavigationItem[] = [
  { href: '/blog', label: 'Stories', description: 'Field reports' },
  {
    href: '/expeditions',
    label: 'Expeditions',
    description: 'Mountain documentation',
  },
  { href: '/training', label: 'Training', description: 'Preparation insights' },
  { href: '/about', label: 'About', description: 'My story' },
];

const secondaryNavigation: NavigationItem[] = [
  {
    href: '/partnerships',
    label: 'Partnerships',
    description: 'Work with me',
  },
  { href: '/media-kit', label: 'Media Kit', description: 'Press resources' },
  { href: '/speaking', label: 'Speaking', description: 'Event bookings' },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const mobileMenuId = 'summit-mobile-navigation';

  // Handle scroll effect for header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleViewportChange = () => {
      if (mediaQuery.matches) {
        setIsMobileMenuOpen(false);
      }
    };

    mediaQuery.addEventListener('change', handleViewportChange);
    return () => mediaQuery.removeEventListener('change', handleViewportChange);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    firstMobileLinkRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const isActivePath = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[110] transition-colors duration-300',
          isScrolled || isMobileMenuOpen
            ? 'border-b border-white/10 bg-obsidian/95 backdrop-blur-xl'
            : 'border-b border-transparent bg-gradient-to-b from-black/65 to-transparent'
        )}
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
          <div className="flex h-16 w-full items-center justify-between lg:h-[68px]">
            <Link
              href="/"
              aria-label="Summit Chronicles home"
              className="group flex min-h-11 items-center gap-3"
            >
              <div className="relative h-9 w-9 shrink-0 opacity-90 transition-opacity group-hover:opacity-100 lg:h-10 lg:w-10">
                <Image
                  src="/images/logo-transparent.png"
                  alt=""
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden text-[13px] font-medium uppercase tracking-[0.14em] text-white/85 transition-colors group-hover:text-white sm:block">
                Summit Chronicles
              </span>
            </Link>

            <div className="flex items-center">
              <nav
                aria-label="Primary navigation"
                className="hidden items-center gap-1 md:flex lg:gap-3"
              >
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex min-h-11 items-center px-3 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors lg:px-4',
                      isActivePath(item.href)
                        ? 'text-white'
                        : 'text-white/58 hover:text-white'
                    )}
                  >
                    {item.label}
                    {isActivePath(item.href) && (
                      <span className="absolute inset-x-3 bottom-0 h-px bg-summit-gold lg:inset-x-4" />
                    )}
                  </Link>
                ))}
              </nav>

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex min-h-11 min-w-11 items-center justify-center text-white transition-colors hover:text-summit-gold md:hidden"
                aria-label={
                  isMobileMenuOpen
                    ? 'Close navigation menu'
                    : 'Open navigation menu'
                }
                aria-controls={mobileMenuId}
                aria-expanded={isMobileMenuOpen}
              >
                <Icon
                  name={isMobileMenuOpen ? 'X' : 'Menu'}
                  size="lg"
                  className="transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          id={mobileMenuId}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-x-0 bottom-0 top-16 z-[100] overflow-hidden bg-obsidian/98 backdrop-blur-xl md:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mobile-nav h-full overflow-y-auto border-t border-white/10 px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-7"
          >
            <div className="mb-6 text-[10px] font-mono uppercase tracking-[0.24em] text-summit-gold">
              Explore Summit Chronicles
            </div>

            <div className="border-t border-white/10">
              {primaryNavigation.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex min-h-[64px] items-center border-b border-white/10 py-3 transition-colors',
                    isActivePath(item.href)
                      ? 'text-summit-gold'
                      : 'text-white/78 hover:text-white'
                  )}
                >
                  <div className="flex w-full items-center gap-4">
                    <span className="w-6 font-mono text-[10px] text-white/35">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-oswald text-xl uppercase">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="ml-auto text-right text-xs text-white/35">
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              ))}

              <div className="pt-7">
                <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.2em] text-white/35">
                  More
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  {secondaryNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'text-sm transition-colors',
                        isActivePath(item.href)
                          ? 'text-summit-gold'
                          : 'text-white/55 hover:text-white'
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-7 border-t border-white/10 pt-6">
                <Link
                  href="/support"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex min-h-12 items-center justify-between font-oswald text-lg uppercase text-summit-gold"
                >
                  <span>Fuel the Journey</span>
                  <Icon name="ArrowUpRight" size="sm" />
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export { Header };
export type { NavigationItem };
