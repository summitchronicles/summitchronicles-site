'use client';

import { useState, useEffect } from 'react';
import { Brain, Mountain, X, MessageCircle } from 'lucide-react';
import { SmartSearch } from './SmartSearch';

interface FloatingAIButtonProps {
  className?: string;
}

export function FloatingAIButton({ className = '' }: FloatingAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Show button after page loads to avoid hydration mismatch
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 z-40
          w-16 h-16 bg-alpine-blue hover:bg-alpine-blue/90
          rounded-full shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          flex items-center justify-center
          group active:scale-95
          ${className}
        `}
        aria-label="Ask Sunith - Expert Mountaineering AI"
        title="Ask Sunith about mountaineering, training, and expeditions"
      >
        {/* Icon Container with Animation */}
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* Mountain Icon */}
          <Mountain className="w-5 h-5 text-white absolute transition-all duration-300 group-hover:scale-110" />
          {/* Brain Icon - overlayed for expert AI indication */}
          <Brain className="w-3 h-3 text-white/80 absolute top-0 right-0 transition-all duration-300 group-hover:text-white" />
        </div>

        {/* Pulse Animation Ring */}
        <div className="absolute inset-0 rounded-full bg-alpine-blue/30 animate-ping"></div>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-spa-stone rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">
            {/* Header */}
            <div className="bg-white border-b border-spa-stone/20 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-alpine-blue rounded-full flex items-center justify-center">
                  <div className="relative">
                    <Mountain className="w-6 h-6 text-white" />
                    <Brain className="w-4 h-4 text-white/90 absolute -top-1 -right-1" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-medium text-spa-charcoal">
                    Ask Sunith
                  </h2>
                  <p className="text-sm text-spa-charcoal/70">
                    Expert mountaineering guidance & training insights
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-spa-stone/20 hover:bg-spa-stone/30 flex items-center justify-center transition-colors"
                aria-label="Close AI Assistant"
              >
                <X className="w-5 h-5 text-spa-charcoal" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
              <SmartSearch
                placeholder="Ask Sunith about mountaineering, training techniques, expedition planning..."
                showExamples={true}
                className=""
              />

              {/* Expert Persona Context */}
              <div className="mt-6 bg-white/50 rounded-lg p-4 border border-white/20">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="w-5 h-5 text-alpine-blue mt-0.5" />
                  <div>
                    <h3 className="font-medium text-spa-charcoal mb-1">
                      About Sunith's Expertise
                    </h3>
                    <p className="text-sm text-spa-charcoal/70 leading-relaxed">
                      Get insights based on real mountaineering experience, systematic training methodologies,
                      and proven expedition strategies. Ask about technical skills, safety protocols,
                      training plans, gear recommendations, or route planning.
                    </p>
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