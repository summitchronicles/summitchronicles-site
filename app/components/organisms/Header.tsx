'use client';

import React, { useState, useEffect } from 'react';
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
  const pathname = usePathname();

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

  const isActivePath = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
        isScrolled || isMobileMenuOpen
          ? 'bg-black/90 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-3 items-center min-h-[80px] h-20 w-full">
          {/* Logo / Brand - Left Corner */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center space-x-3 group brand min-h-[44px] py-2">
              <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="Summit Chronicles Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <H3 className="hidden sm:block text-white group-hover:text-summit-gold transition-colors duration-300">
                Summit Chronicles
              </H3>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center justify-center space-x-4 lg:space-x-8">
            {primaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-3 text-base font-medium transition-all duration-300 group min-h-[44px] flex items-center',
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
          </nav>

          {/* CTA & Mobile Menu - Right Corner */}
          <div className="flex items-center justify-end space-x-2 md:space-x-4">
            {/* Support CTA - Desktop */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Button variant="ghost" size="sm" asChild className="text-white hover:text-summit-gold hover:bg-white/10">
                <Link href="/newsletter">Newsletter</Link>
              </Button>
              <Button variant="summit" size="sm" asChild className="bg-summit-gold-600 hover:bg-summit-gold-500 text-black border-none">
                <Link href="/support">
                  <Icon name="Heart" size="sm" />
                  Support Journey
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 text-white hover:text-summit-gold transition-colors duration-300 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-md hover:bg-white/10"
              aria-label="Toggle mobile menu"
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

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-400 ease-in-out mobile-safe',
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="py-6 border-t border-white/10 bg-black/95 backdrop-blur-xl rounded-b-lg shadow-2xl mobile-nav">
            <nav className="space-y-1">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block px-6 py-4 text-base font-medium transition-all duration-300 min-h-[48px] flex items-center',
                    isActivePath(item.href)
                      ? 'text-summit-gold bg-white/5 border-l-4 border-summit-gold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base">{item.label}</span>
                    {item.description && (
                      <span className="text-sm text-gray-500">
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              ))}

              {/* Secondary Navigation in Mobile */}
              <div className="pt-4 mt-4 border-t border-white/10">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-6 py-3 text-base text-gray-400 hover:text-white transition-colors duration-300 min-h-[44px] flex items-center"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile CTA - Right aligned for consistency */}
              <div className="px-4 pt-4 space-y-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-white/10 text-white hover:bg-white/20 border-white/10"
                  asChild
                >
                  <Link href="/newsletter">
                    <Icon name="Mail" size="sm" />
                    Newsletter Updates
                  </Link>
                </Button>
                <Button variant="summit" size="sm" className="w-full bg-summit-gold-600 text-black hover:bg-summit-gold-500 border-none" asChild>
                  <Link href="/support">
                    <Icon name="Heart" size="sm" />
                    Support Journey
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
export type { NavigationItem };
