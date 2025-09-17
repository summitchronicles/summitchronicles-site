'use client';

import { useState } from 'react';
import { Mail, CheckCircle, Loader2, Mountain, Gift } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { cn } from '@/lib/utils';

interface NewsletterSubscriptionFormProps {
  variant?: 'hero' | 'cta' | 'inline' | 'sidebar';
  className?: string;
}

interface SubscriptionBenefit {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

export function NewsletterSubscriptionForm({
  variant = 'inline',
  className,
}: NewsletterSubscriptionFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          referrer: window.location.pathname,
          source: `newsletter_${variant}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to subscribe');
      }

      const result = await response.json();
      setStatus('success');
      setMessage(result.message || 'Successfully subscribed!');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    }
  };

  const benefits: SubscriptionBenefit[] = [
    { icon: Mountain, text: 'Weekly training updates' },
    { icon: Gift, text: 'Exclusive behind-the-scenes content' },
    { icon: CheckCircle, text: 'Community milestone celebrations' },
  ];

  if (status === 'success') {
    return (
      <div
        className={cn(
          'text-center space-y-4',
          variant === 'hero' && 'py-8',
          variant === 'cta' && 'py-6',
          className
        )}
      >
        <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mx-auto">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h3
            className={cn(
              'font-medium text-spa-charcoal mb-2',
              variant === 'hero' && 'text-xl',
              variant === 'cta' && 'text-lg text-white'
            )}
          >
            Welcome to the Journey!
          </h3>
          <p
            className={cn(
              'text-sm',
              variant === 'cta' ? 'text-white/80' : 'text-spa-charcoal/70'
            )}
          >
            {message} Check your inbox for a welcome message.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStatus('idle')}
          className={cn(variant === 'cta' && 'text-white hover:text-white/80')}
        >
          Subscribe another email
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Benefits (shown for hero and cta variants) */}
      {(variant === 'hero' || variant === 'cta') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {benefits.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  variant === 'cta'
                    ? 'bg-white/20 text-white'
                    : 'bg-alpine-blue/10 text-alpine-blue'
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={cn(
                  'text-sm',
                  variant === 'cta' ? 'text-white/90' : 'text-spa-charcoal/80'
                )}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Subscription Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={cn(
            'flex gap-3',
            (variant === 'hero' || variant === 'cta') && 'flex-col sm:flex-row'
          )}
        >
          <div className="flex-1">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={status === 'loading'}
              className={cn(
                'w-full',
                variant === 'cta' &&
                  'bg-white/10 border-white/30 text-white placeholder:text-white/60'
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={status === 'loading' || !email}
            variant={variant === 'cta' ? 'secondary' : 'summit'}
            size={variant === 'sidebar' ? 'sm' : 'md'}
            className={cn(
              'flex items-center gap-2',
              variant === 'cta' &&
                'bg-white text-spa-charcoal hover:bg-white/90'
            )}
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mail className="w-4 h-4" />
            )}
            {status === 'loading' ? 'Subscribing...' : 'Join the Journey'}
          </Button>
        </div>

        {/* Error message */}
        {status === 'error' && (
          <p
            className={cn(
              'text-sm text-red-600',
              variant === 'cta' && 'text-red-200'
            )}
          >
            {message}
          </p>
        )}

        {/* Privacy note */}
        <p
          className={cn(
            'text-xs leading-relaxed',
            variant === 'cta' ? 'text-white/60' : 'text-spa-charcoal/60'
          )}
        >
          By subscribing, you agree to receive weekly expedition updates and
          training insights. Unsubscribe anytime. We respect your privacy and
          never share your email.
        </p>
      </form>

      {/* Additional benefits for sidebar variant */}
      {variant === 'sidebar' && (
        <div className="pt-4 border-t border-spa-stone/20">
          <h4 className="text-sm font-medium text-spa-charcoal mb-3">
            What you'll get:
          </h4>
          <ul className="space-y-2">
            {benefits.map(({ text }) => (
              <li
                key={text}
                className="flex items-start gap-2 text-xs text-spa-charcoal/70"
              >
                <CheckCircle className="w-3 h-3 text-emerald-600 mt-0.5 flex-shrink-0" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
