'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { H3, Body } from '../atoms/Typography';

interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

const footerSections: FooterSection[] = [
  {
    title: 'Journey',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Expeditions', href: '/expeditions' },
      { label: 'Training', href: '/training' },
      { label: 'Stories', href: '/blog' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Media Kit', href: '/media-kit' },
      { label: 'Speaking', href: '/speaking' },
      { label: 'Partnership', href: '/sponsorship' },
      { label: 'Newsletter', href: '/newsletter' },
    ],
  },
  {
    title: 'Follow',
    links: [
      { label: 'Instagram', href: 'https://instagram.com/summitchronicles', external: true },
      { label: 'YouTube', href: 'https://youtube.com/@summitchronicles', external: true },
      { label: 'Strava', href: 'https://strava.com/athletes/summitchronicles', external: true },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/summitchronicles', external: true },
    ],
  },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-spa-charcoal text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-alpine-blue rounded-md">
                <Icon name="Mountain" className="text-white" size="md" />
              </div>
              <H3 className="text-white">Summit Chronicles</H3>
            </div>
            <Body className="text-gray-300 mb-6 leading-relaxed">
              Following the systematic journey to conquer the Seven Summits, one mountain at a time.
              Join me as I document the preparation, challenges, and triumphs of high-altitude mountaineering.
            </Body>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/summitchronicles"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Follow on Instagram"
              >
                <Icon name="Instagram" size="sm" />
              </a>
              <a
                href="https://youtube.com/@summitchronicles"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Subscribe on YouTube"
              >
                <Icon name="Youtube" size="sm" />
              </a>
              <a
                href="https://strava.com/athletes/summitchronicles"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="Follow on Strava"
              >
                <Icon name="Activity" size="sm" />
              </a>
            </div>
          </div>

          {/* Navigation Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4 text-sm tracking-wide uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 pt-12 mb-12">
          <div className="max-w-md">
            <h4 className="font-semibold text-white mb-2">Stay Updated</h4>
            <p className="text-gray-300 text-sm mb-4">
              Get weekly updates on training, expeditions, and mountain stories.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-transparent"
              />
              <Button variant="summit" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} Summit Chronicles. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors duration-300">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors duration-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };