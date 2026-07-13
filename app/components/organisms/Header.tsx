'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { H3 } from '../atoms/Typography';
import { cn } from '@/lib/utils';

interface NavigationItem {
  href: string;
  label: string;
  description?: string;
}

const primaryNavigation: NavigationItem[] = [
  { href: '/', label: 'Home', description: 'Journey overview' },
  { href: '/about', label: 'About', description: 'My story' },
  {
    href: '/expeditions',
    label: 'Expeditions',
    description: 'Mountain documentation',
  },
  { href: '/training', label: 'Training', description: 'Preparation insights' },
  { href: '/blog', label: 'Stories', description: 'Field reports' },
];

const secondaryNavigation: NavigationItem[] = [
  { href: '/media-kit', label: 'Media Kit', description: 'Press resources' },
  { href: '/speaking', label: 'Speaking', description: 'Event bookings' },
  {
    href: '/sponsorship',
    label: 'Partnership',
    description: 'Sponsor opportunities',
  },
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
          'fixed top-0 left-0 right-0 z-[110] transition-all duration-400',
          isScrolled || isMobileMenuOpen
            ? 'bg-black/90 backdrop-blur-md shadow-lg border-b border-white/10'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between min-h-[80px] h-20 w-full">
            {/* Logo - Left */}
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo-transparent.png"
                  alt="Summit Chronicles Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <H3 className="hidden xl:block text-white group-hover:text-summit-gold transition-colors duration-300">
                Summit Chronicles
              </H3>
            </Link>

            {/* Navigation + CTA Buttons - Right */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-4 lg:gap-8">
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative px-3 py-2 text-sm lg:text-base font-medium transition-all duration-300 group min-h-[44px] flex items-center',
                      isActivePath(item.href)
                        ? 'text-summit-gold'
                        : 'text-gray-300 hover:text-white'
                    )}
                  >
                    {item.label}
                    {isActivePath(item.href) && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-summit-gold rounded-full" />
                    )}
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-summit-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
                {/* Partnerships Link - High Value */}
                <Link
                  href="/partnerships"
                  className={cn(
                    'relative px-3 py-2 text-sm lg:text-base font-medium transition-all duration-300 group min-h-[44px] flex items-center',
                    isActivePath('/partnerships')
                      ? 'text-summit-gold'
                      : 'text-gray-300 hover:text-summit-gold'
                  )}
                >
                  Partnerships
                </Link>
              </nav>

              {/* CTA Buttons - Desktop */}
              <div className="hidden lg:flex items-center gap-4">
                <Button
                  variant="summit"
                  size="sm"
                  asChild
                  className="bg-summit-gold-600 hover:bg-summit-gold-500 text-black border-none"
                >
                  <Link href="/support">
                    <Icon name="Heart" size="sm" />
                    Fuel the Journey
                  </Link>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-3 text-white hover:text-summit-gold transition-colors duration-300 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-md hover:bg-white/10"
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
          className="fixed inset-x-0 bottom-0 top-20 z-[100] overflow-hidden bg-black md:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mobile-nav h-full overflow-y-auto border-t border-white/10 px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-5"
          >
            <div className="mb-5 border-b border-white/10 pb-5">
              <div className="font-oswald text-2xl uppercase leading-none text-white">
                Summit Chronicles
              </div>
              <div className="mt-2 text-sm uppercase text-summit-gold">
                Project 7 Summits
              </div>
            </div>

            <div className="space-y-2">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={item.href === '/' ? firstMobileLinkRef : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'rounded-md border border-white/10 bg-white/[0.03] px-4 py-4 text-base font-medium transition-colors duration-300 min-h-[56px] flex items-center',
                    isActivePath(item.href)
                      ? 'text-summit-gold border-summit-gold/60 bg-summit-gold/10'
                      : 'text-gray-200 hover:border-white/25 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <div className="flex w-full items-center justify-between gap-4">
                    <span className="text-base font-semibold">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="text-right text-sm text-gray-500">
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              ))}

              {/* Mobile Partnerships */}
              <Link
                href="/partnerships"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'rounded-md border border-white/10 bg-white/[0.03] px-4 py-4 text-base font-medium transition-colors duration-300 min-h-[56px] flex items-center',
                  isActivePath('/partnerships')
                    ? 'text-summit-gold border-summit-gold/60 bg-summit-gold/10'
                    : 'text-gray-200 hover:border-white/25 hover:bg-white/10 hover:text-summit-gold'
                )}
              >
                <div className="flex w-full items-center justify-between gap-4">
                  <span className="text-base font-semibold">Partnerships</span>
                  <span className="text-right text-sm text-gray-500">
                    Work with me
                  </span>
                </div>
              </Link>

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="mb-3 text-sm uppercase text-white/55">More</div>
                <div className="space-y-2">
                  {secondaryNavigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'rounded-md border border-white/10 px-4 py-3 text-base font-medium transition-colors duration-300 min-h-[52px] flex items-center',
                        isActivePath(item.href)
                          ? 'text-summit-gold border-summit-gold/60 bg-summit-gold/10'
                          : 'text-gray-300 hover:border-white/25 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <div className="flex w-full items-center justify-between gap-4">
                        <span>{item.label}</span>
                        {item.description && (
                          <span className="text-right text-sm text-gray-500">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-5">
                <Button
                  variant="summit"
                  size="sm"
                  className="w-full border-none bg-summit-gold-600 text-black hover:bg-summit-gold-500"
                  asChild
                >
                  <Link
                    href="/support"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon name="Heart" size="sm" />
                    Fuel the Journey
                  </Link>
                </Button>
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
