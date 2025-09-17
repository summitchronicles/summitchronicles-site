'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Icon } from '../atoms/Icon';
import { H3, H4, Body, Small, Caption } from '../atoms/Typography';
import { StatusBadge } from '../molecules/StatusBadge';

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

const footerSections = {
  journey: {
    title: 'The Journey',
    links: [
      { href: '/about', label: 'My Story' },
      { href: '/training', label: 'Training Progress' },
      { href: '/blog', label: 'Updates & Insights' },
      { href: '/expeditions', label: 'Expedition Plans' },
    ],
  },
  community: {
    title: 'Community',
    links: [
      { href: '/newsletter', label: 'Newsletter' },
      { href: '/support', label: 'Support Journey' },
      { href: '/sponsorship', label: 'Partnership' },
      { href: '/speaking', label: 'Speaking Events' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { href: '/media-kit', label: 'Media Kit' },
      { href: '/gear', label: 'Gear Reviews' },
      { href: '/training-plans', label: 'Training Plans' },
      { href: '/contact', label: 'Contact' },
    ],
  },
};

const socialLinks = [
  {
    href: 'https://instagram.com/summitchronicles',
    label: 'Instagram',
    icon: 'Instagram' as const,
  },
  {
    href: 'https://twitter.com/summitchronicles',
    label: 'Twitter',
    icon: 'Twitter' as const,
  },
  {
    href: 'https://youtube.com/summitchronicles',
    label: 'YouTube',
    icon: 'Youtube' as const,
  },
  {
    href: 'https://strava.com/athletes/29642479',
    label: 'Strava',
    icon: 'Activity' as const,
  },
];

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscriptionStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscriptionStatus('success');
        setEmail('');
      } else {
        setSubscriptionStatus('error');
      }
    } catch (error) {
      setSubscriptionStatus('error');
    }

    // Reset status after 3 seconds
    setTimeout(() => setSubscriptionStatus('idle'), 3000);
  };

  return (
    <footer className="bg-spa-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-12 border-b border-spa-slate/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Newsletter & Brand Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-alpine-blue rounded-md">
                    <Icon name="Mountain" className="text-white" size="md" />
                  </div>
                  <H3 className="text-white">Summit Chronicles</H3>
                </div>
                <Body className="text-spa-mist max-w-md">
                  Follow my journey to the summit through systematic training,
                  expedition preparation, and the pursuit of mountaineering
                  excellence.
                </Body>
              </div>

              {/* Newsletter Signup */}
              <div className="space-y-4">
                <H4 className="text-white">Stay Connected</H4>
                <Body className="text-spa-mist">
                  Get weekly training updates, expedition insights, and
                  behind-the-scenes content.
                </Body>

                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-spa-slate/20 border-spa-slate/30 text-white placeholder:text-spa-mist"
                      required
                    />
                    <Button
                      type="submit"
                      variant="summit"
                      disabled={subscriptionStatus === 'loading'}
                      className="sm:w-auto"
                    >
                      {subscriptionStatus === 'loading' ? (
                        <>
                          <Icon
                            name="Loader2"
                            size="sm"
                            className="animate-spin"
                          />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Icon name="Mail" size="sm" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </div>

                  {subscriptionStatus === 'success' && (
                    <StatusBadge variant="success" size="sm">
                      ✓ Successfully subscribed! Check your email.
                    </StatusBadge>
                  )}

                  {subscriptionStatus === 'error' && (
                    <StatusBadge variant="error" size="sm">
                      ✗ Something went wrong. Please try again.
                    </StatusBadge>
                  )}
                </form>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <H4 className="text-white">Follow the Journey</H4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-spa-slate/20 hover:bg-alpine-blue rounded-md transition-colors duration-300 group"
                      aria-label={social.label}
                    >
                      <Icon
                        name={social.icon}
                        size="sm"
                        className="text-spa-mist group-hover:text-white transition-colors duration-300"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {Object.entries(footerSections).map(([key, section]) => (
                <div key={key} className="space-y-4">
                  <H4 className="text-white">{section.title}</H4>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-spa-mist hover:text-summit-gold transition-colors duration-300 text-sm"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="py-8 border-b border-spa-slate/20">
          <div className="text-center space-y-4">
            <Caption className="text-spa-mist uppercase tracking-wider">
              Expedition Status
            </Caption>
            <div className="flex flex-wrap justify-center gap-4">
              <StatusBadge variant="summit" size="sm">
                <Icon name="Target" size="sm" />
                Everest 2024 Training
              </StatusBadge>
              <StatusBadge variant="info" size="sm">
                <Icon name="Activity" size="sm" />
                127km This Week
              </StatusBadge>
              <StatusBadge variant="success" size="sm">
                <Icon name="Trophy" size="sm" />
                2,840m Elevation Gained
              </StatusBadge>
            </div>
            <Small className="text-spa-mist">
              Supporting the journey to summit Mt. Everest through systematic
              preparation and community backing
            </Small>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-spa-mist">
              <Link
                href="/privacy"
                className="hover:text-summit-gold transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-summit-gold transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="/media-kit"
                className="hover:text-summit-gold transition-colors duration-300"
              >
                Press Inquiries
              </Link>
              <Link
                href="/contact"
                className="hover:text-summit-gold transition-colors duration-300"
              >
                Contact
              </Link>
            </div>

            <div className="text-sm text-spa-mist text-center md:text-right">
              <p>
                © {new Date().getFullYear()} Summit Chronicles. All rights
                reserved.
              </p>
              <p className="text-xs mt-1">
                Built with passion for the mountains ⛰️
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
export type { FooterLink };
