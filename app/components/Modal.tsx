'use client';

import { useEffect, useRef, useState } from 'react';
import { X, CheckCircle, RefreshCw } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop with Swiss spa blur effect */}
      <div className="fixed inset-0 backdrop-mountain bg-slate-900/20 animate-fadeIn" />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-modalSlideIn`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <div className="mountain-card elevation-shadow max-h-full overflow-y-auto">
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
              {title && (
                <h2
                  id="modal-title"
                  className="text-xl font-semibold text-slate-900"
                >
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={title || showCloseButton ? 'p-6' : 'p-8'}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          referrer: 'modal',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setEmail('');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Follow My Everest Journey"
      size="md"
    >
      <div className="text-center space-y-6">
        {/* Hero Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 gradient-summit rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L3 21h18L12 2zm0 4.5L18.5 19H5.5L12 6.5z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Get My Training Insights
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Follow my personal journey to Mount Everest. Get weekly updates on
            my training progress, gear testing, and preparation insights
            straight from the mountains.
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">
                Welcome aboard!
              </h4>
              <p className="text-slate-600">
                You'll receive your first update soon.
              </p>
            </div>
          </div>
        ) : (
          /* Newsletter Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="btn-summit w-full justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Follow My Journey</span>
              )}
            </button>
          </form>
        )}

        {/* Trust Indicators */}
        <div className="pt-4 border-t border-slate-200/60">
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Weekly insights</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>No spam ever</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface StravaConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StravaConnectModal({
  isOpen,
  onClose,
}: StravaConnectModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect Your Strava"
      size="md"
    >
      <div className="space-y-6">
        {/* Feature List */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Unlock Advanced Training Analytics
          </h3>
          <div className="space-y-3">
            {[
              'Real-time activity tracking and analysis',
              'Elevation gain and route visualization',
              'Heart rate zones and performance metrics',
              'Training load and recovery insights',
              'Achievement badges and milestone tracking',
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <span className="text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-slate-50 rounded-xl p-4">
          <h4 className="font-medium text-slate-900 mb-2">Privacy & Data</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            We only access your activity data to provide training insights. Your
            data remains secure and is never shared with third parties.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <button className="btn-summit justify-center">
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.599h4.172L10.463 0l-7 13.828h4.916" />
            </svg>
            Connect with Strava
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </Modal>
  );
}
