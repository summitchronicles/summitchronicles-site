'use client';

import { useState, useEffect } from 'react';
import { Brain, Mountain, X, MessageCircle, Sparkles } from 'lucide-react';
import { SmartSearch } from './SmartSearch';

interface FloatingAIButtonProps {
  className?: string;
}

export function FloatingAIButton({ className = '' }: FloatingAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Show button after page loads to avoid hydration mismatch
  useEffect(() => {
    setIsVisible(true);

    // Show tooltip after 2 seconds if user hasn't interacted
    const tooltipTimer = setTimeout(() => {
      if (!hasInteracted) {
        setShowTooltip(true);
        // Auto-hide tooltip after 5 seconds
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 2000);

    return () => clearTimeout(tooltipTimer);
  }, [hasInteracted]);

  // Handle escape key to close modal and Cmd/Ctrl+K to open
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      // Cmd+K or Ctrl+K to open AI assistant
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setHasInteracted(true);
        setShowTooltip(false);
      }
    };

    document.addEventListener('keydown', handleKeyboard);

    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyboard);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleButtonClick = () => {
    setIsOpen(true);
    setHasInteracted(true);
    setShowTooltip(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Action Button with Enhanced UX */}
      <div className={`fixed bottom-8 right-8 z-40 ${className}`}>
        {/* Tooltip - Educates users on first visit */}
        {showTooltip && !isOpen && (
          <div className="absolute bottom-20 right-0 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="relative">
              <div className="bg-gradient-to-br from-glacier-600 to-alpine-blue-700 text-white px-4 py-3 rounded-xl shadow-2xl max-w-xs">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0 text-summit-gold-300" />
                  <div>
                    <p className="font-medium text-sm mb-1">Ask me anything!</p>
                    <p className="text-xs text-glacier-100 mb-2">
                      Get expert mountaineering guidance
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-glacier-200 bg-white/10 rounded px-2 py-1 w-fit">
                      <kbd className="font-mono">⌘K</kbd>
                      <span>or click here</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Arrow pointer */}
              <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-alpine-blue-700"></div>
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={handleButtonClick}
          onMouseEnter={() => !hasInteracted && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="
            relative
            w-16 h-16
            bg-gradient-to-br from-glacier-500 to-alpine-blue-600
            hover:from-glacier-600 hover:to-alpine-blue-700
            rounded-2xl
            shadow-spa-elevated hover:shadow-2xl
            transition-all duration-300 ease-out
            flex items-center justify-center
            group
            active:scale-95
            ring-2 ring-white/20 hover:ring-white/40
            overflow-hidden
          "
          aria-label="Ask Sunith - Expert Mountaineering AI (Press ⌘K)"
          title="Ask Sunith (⌘K)"
        >
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Icon Container with Sophisticated Animation */}
          <div className="relative z-10 flex items-center justify-center">
            {/* AI Sparkle Effect */}
            <Sparkles className="w-4 h-4 text-summit-gold-300 absolute -top-2 -right-2 animate-pulse opacity-80" />

            {/* Mountain Icon */}
            <Mountain className="w-7 h-7 text-white transition-all duration-300 group-hover:scale-110 drop-shadow-lg" />
          </div>

          {/* Subtle Pulse Ring - Only when not hovered */}
          <div className="absolute inset-0 rounded-2xl bg-glacier-400/30 animate-ping group-hover:hidden"></div>

          {/* Keyboard Shortcut Badge */}
          <div className="absolute -top-1 -right-1 bg-summit-gold-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            ⌘K
          </div>
        </button>
      </div>

      {/* Enhanced Modal Overlay - Mobile Optimized */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in-0 duration-200">
          {/* Premium Backdrop with Blur */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-spa-charcoal/80 via-alpine-blue-900/70 to-glacier-900/80 backdrop-blur-md transition-all"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content - Mobile Responsive */}
          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-auto sm:max-h-[90vh] animate-in fade-in-0 zoom-in-95 duration-300 border border-glacier-200 flex flex-col overflow-hidden">
            {/* Premium Header - Mobile Optimized */}
            <div className="relative bg-gradient-to-r from-glacier-50 via-white to-alpine-blue-50 border-b border-glacier-200 px-4 py-4 sm:px-8 sm:py-6 flex-shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  {/* Enhanced Icon Badge - Smaller on Mobile */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-glacier-500 to-alpine-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-spa-medium ring-2 sm:ring-4 ring-glacier-100 flex-shrink-0">
                    <Mountain className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
                    <Sparkles className="w-3 h-3 text-summit-gold-300 absolute -top-1 -right-1 animate-pulse" />
                  </div>

                  {/* Title Section - Responsive */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h2 className="text-lg sm:text-2xl font-semibold text-spa-charcoal bg-gradient-to-r from-glacier-700 to-alpine-blue-700 bg-clip-text text-transparent truncate">
                        Ask Sunith
                      </h2>
                      <span className="px-2 py-0.5 bg-gradient-to-r from-summit-gold-400 to-summit-gold-500 text-white text-xs font-bold rounded-full shadow-sm flex-shrink-0">
                        AI
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-spa-slate hidden sm:flex items-center space-x-2">
                      <span>Expert mountaineering guidance & training insights</span>
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-glacier-100 text-glacier-700 rounded text-xs font-mono">
                        <kbd>ESC</kbd>
                        <span className="text-glacier-400">to close</span>
                      </span>
                    </p>
                    <p className="text-xs text-spa-slate sm:hidden">
                      Expert mountaineering guidance
                    </p>
                  </div>
                </div>

                {/* Close Button - Mobile Optimized */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-glacier-100 hover:bg-glacier-200 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group flex-shrink-0"
                  aria-label="Close AI Assistant (ESC)"
                >
                  <X className="w-5 h-5 text-glacier-700 group-hover:text-glacier-900 transition-colors" />
                </button>
              </div>
            </div>

            {/* Content - Scrollable on Both Mobile & Desktop */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-white to-glacier-50/30">
              <SmartSearch
                placeholder="Ask about mountaineering, training..."
                showExamples={true}
                className="w-full"
              />

              {/* Enhanced Expert Context Card - Mobile Optimized */}
              <div className="mt-6 sm:mt-8 bg-gradient-to-br from-glacier-50 to-alpine-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-glacier-200 shadow-spa-soft">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-glacier-500 to-alpine-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-spa-charcoal mb-2 text-sm sm:text-base">
                      About Sunith's Expertise
                    </h3>
                    <p className="text-xs sm:text-sm text-spa-slate leading-relaxed">
                      Get insights based on real mountaineering experience, systematic training methodologies,
                      and proven expedition strategies.
                    </p>

                    {/* Quick Topics - Mobile Grid */}
                    <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                      <span className="px-2 sm:px-3 py-1.5 bg-white/80 text-glacier-700 rounded-lg text-xs font-medium border border-glacier-200 hover:border-glacier-300 transition-colors cursor-default text-center">
                        🏔️ Expedition
                      </span>
                      <span className="px-2 sm:px-3 py-1.5 bg-white/80 text-glacier-700 rounded-lg text-xs font-medium border border-glacier-200 hover:border-glacier-300 transition-colors cursor-default text-center">
                        💪 Training
                      </span>
                      <span className="px-2 sm:px-3 py-1.5 bg-white/80 text-glacier-700 rounded-lg text-xs font-medium border border-glacier-200 hover:border-glacier-300 transition-colors cursor-default text-center">
                        🧗 Skills
                      </span>
                      <span className="px-2 sm:px-3 py-1.5 bg-white/80 text-glacier-700 rounded-lg text-xs font-medium border border-glacier-200 hover:border-glacier-300 transition-colors cursor-default text-center">
                        🛡️ Safety
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}