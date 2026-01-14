'use client';

import { useState } from 'react';
import {
  Mail,
  CheckCircle,
  Loader2,
  Mountain,
  Gift,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { cn } from '@/lib/utils';

interface NewsletterSubscriptionFormProps {
  variant?: 'hero' | 'cta' | 'inline' | 'sidebar';
  className?: string; // Additional classes
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
          : 'Transmission failed. Please retry.'
      );
    }
  };

  // Modernized benefits
  const benefits: SubscriptionBenefit[] = [
    { icon: Mountain, text: 'Expedition Dispatches' },
    { icon: Gift, text: 'Gear Drop Alerts' },
    { icon: checkGold, text: 'Training Protocols' },
  ];

  if (status === 'success') {
    return (
      <div
        className={cn(
          'text-center space-y-4 border border-summit-gold/30 bg-summit-gold/5 p-8 rounded-lg backdrop-blur-sm',
          className
        )}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-summit-gold/10 rounded-full mx-auto border border-summit-gold/20">
          <CheckCircle className="w-6 h-6 text-summit-gold" />
        </div>
        <div>
          <h3 className="font-oswald text-xl text-white mb-2 uppercase tracking-wide">
            Welcome to the Mission
          </h3>
          <p className="text-sm text-gray-400 font-light">
            {message} Stand by for your first briefing.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStatus('idle')}
          className="text-summit-gold hover:text-summit-gold-300 font-mono text-xs uppercase tracking-widest"
        >
          Reset Comms
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Benefits (Optimized for modern layout) */}
      {(variant === 'hero' || variant === 'cta') && (
        <div className="flex flex-wrap gap-4 mb-6">
          {benefits.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-summit-gold/30 transition-colors">
                <Icon className="w-3 h-3 text-gray-400 group-hover:text-summit-gold transition-colors" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-500 group-hover:text-gray-300 transition-colors">
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
            'flex gap-0 relative group',
            (variant === 'hero' || variant === 'cta') && 'flex-col sm:flex-row'
          )}
        >
          <div className="flex-1 relative">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ENTER EMAIL COORDINATES"
              required
              disabled={status === 'loading'}
              className="w-full bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-summit-gold/50 focus:ring-summit-gold/20 font-mono text-sm tracking-wide h-12"
            />
          </div>

          <Button
            type="submit"
            disabled={status === 'loading' || !email}
            className="h-12 px-8 bg-summit-gold hover:bg-summit-gold-600 text-black font-oswald font-bold uppercase tracking-widest transition-all duration-300 hover:scale-105"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                JOIN <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>

        {/* Error message */}
        {status === 'error' && (
          <p className="text-xs text-red-500 font-mono mt-2">⚠ {message}</p>
        )}

        {/* Privacy note */}
        <p className="text-[10px] text-gray-600 font-sans leading-relaxed max-w-md">
          Join 2,000+ climbers. Weekly dispatches only. No spam, just altitude.
        </p>
      </form>
    </div>
  );
}

// Small helper for the custom check icon
function checkGold(props: { className?: string }) {
  return (
    <CheckCircle
      {...props}
      className={cn('text-summit-gold', props.className)}
    />
  );
}
