'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
          ? 'bg-white/95 backdrop-blur-sm shadow-spa-soft border-b border-spa-cloud/50'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between min-h-[64px] h-16 mobile-padding">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-3 group brand min-h-[44px] py-2">
            <div className="flex items-center justify-center w-12 h-12 bg-alpine-blue rounded-md group-hover:bg-blue-800 transition-colors duration-300">
              <Icon name="Mountain" className="text-white" size="md" />
            </div>
            <H3 className="hidden sm:block text-spa-charcoal group-hover:text-alpine-blue transition-colors duration-300">
              Summit Chronicles
            </H3>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {primaryNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-3 text-base font-medium transition-all duration-300 group min-h-[44px] flex items-center',
                  isActivePath(item.href)
                    ? 'text-alpine-blue'
                    : 'text-spa-slate hover:text-alpine-blue'
                )}
              >
                {item.label}
                {isActivePath(item.href) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-alpine-blue rounded-full" />
                )}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-alpine-blue transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Support CTA - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/newsletter">Newsletter</Link>
              </Button>
              <Button variant="summit" size="sm" asChild>
                <Link href="/support">
                  <Icon name="Heart" size="sm" />
                  Support Journey
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 text-spa-slate hover:text-alpine-blue transition-colors duration-300 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-md hover:bg-spa-stone"
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
            'lg:hidden overflow-hidden transition-all duration-400 ease-in-out mobile-safe',
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="py-6 border-t border-spa-cloud bg-white backdrop-blur-sm rounded-b-lg shadow-spa-medium mobile-nav">
            <nav className="space-y-1">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block px-6 py-4 text-base font-medium transition-all duration-300 min-h-[48px] flex items-center',
                    isActivePath(item.href)
                      ? 'text-alpine-blue bg-spa-stone border-l-4 border-alpine-blue'
                      : 'text-spa-charcoal hover:text-alpine-blue hover:bg-spa-stone'
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base">{item.label}</span>
                    {item.description && (
                      <span className="text-sm text-spa-slate">
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              ))}

              {/* Secondary Navigation in Mobile */}
              <div className="pt-4 mt-4 border-t border-spa-cloud">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-6 py-3 text-base text-spa-charcoal hover:text-alpine-blue transition-colors duration-300 min-h-[44px] flex items-center"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="px-4 pt-4 space-y-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  asChild
                >
                  <Link href="/newsletter">
                    <Icon name="Mail" size="sm" />
                    Newsletter Updates
                  </Link>
                </Button>
                <Button variant="summit" size="sm" className="w-full" asChild>
                  <Link href="/support">
                    <Icon name="Heart" size="sm" />
                    Support My Journey
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
