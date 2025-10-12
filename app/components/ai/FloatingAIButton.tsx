'use client';

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Command } from 'cmdk';
import { Mountain, X, Sparkles, MessageCircle } from 'lucide-react';

interface FloatingAIButtonProps {
  className?: string;
}

export function FloatingAIButton({ className = '' }: FloatingAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [search, setSearch] = useState('');

  // Show button after page loads
  useEffect(() => {
    setIsVisible(true);

    // Show tooltip after 2 seconds if user hasn't interacted
    const tooltipTimer = setTimeout(() => {
      if (!hasInteracted) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 2000);

    return () => clearTimeout(tooltipTimer);
  }, [hasInteracted]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setHasInteracted(true);
        setShowTooltip(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setHasInteracted(true);
    setShowTooltip(false);
  };

  const exampleQueries = [
    'How should I train for high altitude acclimatization?',
    "What are Sunith's preferred techniques for ice climbing?",
    'Best practices for avalanche risk assessment on expeditions',
    'Nutrition and hydration strategies for multi-day climbs',
    'How to design a 12-week expedition training program?',
  ];

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Action Button */}
      <div className={`fixed bottom-8 right-8 z-40 ${className}`}>
        {/* Tooltip */}
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
              <div className="absolute -bottom-2 right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-alpine-blue-700"></div>
            </div>
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleOpen}
          onMouseEnter={() => !hasInteracted && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="
            relative w-16 h-16
            bg-gradient-to-br from-glacier-500 to-alpine-blue-600
            hover:from-glacier-600 hover:to-alpine-blue-700
            rounded-2xl shadow-spa-elevated hover:shadow-2xl
            transition-all duration-300 ease-out
            flex items-center justify-center group
            active:scale-95
            ring-2 ring-white/20 hover:ring-white/40
            overflow-hidden
          "
          aria-label="Ask Sunith - Expert Mountaineering AI (Press ⌘K)"
          title="Ask Sunith (⌘K)"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="relative z-10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-summit-gold-300 absolute -top-2 -right-2 animate-pulse opacity-80" />
            <Mountain className="w-7 h-7 text-white transition-all duration-300 group-hover:scale-110 drop-shadow-lg" />
          </div>

          <div className="absolute inset-0 rounded-2xl bg-glacier-400/30 animate-ping group-hover:hidden"></div>

          <div className="absolute -top-1 -right-1 bg-summit-gold-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            ⌘K
          </div>
        </button>
      </div>

      {/* Headless UI Dialog */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gradient-to-br from-spa-charcoal/80 via-alpine-blue-900/70 to-glacier-900/80 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
              {/* Modal Panel */}
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl transition-all border border-glacier-200">
                  {/* Header */}
                  <div className="relative bg-gradient-to-r from-glacier-50 via-white to-alpine-blue-50 border-b border-glacier-200 px-4 py-4 sm:px-8 sm:py-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-glacier-500 to-alpine-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-spa-medium ring-2 sm:ring-4 ring-glacier-100 flex-shrink-0">
                          <Mountain className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" />
                          <Sparkles className="w-3 h-3 text-summit-gold-300 absolute -top-1 -right-1 animate-pulse" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Dialog.Title className="text-lg sm:text-2xl font-semibold text-spa-charcoal bg-gradient-to-r from-glacier-700 to-alpine-blue-700 bg-clip-text text-transparent truncate">
                              Ask Sunith
                            </Dialog.Title>
                            <span className="px-2 py-0.5 bg-gradient-to-r from-summit-gold-400 to-summit-gold-500 text-white text-xs font-bold rounded-full shadow-sm flex-shrink-0">
                              AI
                            </span>
                          </div>
                          <Dialog.Description className="text-xs sm:text-sm text-spa-slate">
                            <span className="hidden sm:inline">Expert mountaineering guidance & training insights</span>
                            <span className="sm:hidden">Expert mountaineering guidance</span>
                          </Dialog.Description>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-glacier-100 hover:bg-glacier-200 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group flex-shrink-0"
                        aria-label="Close (ESC)"
                      >
                        <X className="w-5 h-5 text-glacier-700 group-hover:text-glacier-900 transition-colors" />
                      </button>
                    </div>
                  </div>

                  {/* cmdk Command Palette */}
                  <Command className="max-h-[70vh] sm:max-h-[60vh]">
                    <div className="p-4 sm:p-6 border-b border-glacier-100">
                      <Command.Input
                        value={search}
                        onValueChange={setSearch}
                        placeholder="Ask about mountaineering, training, expeditions..."
                        className="w-full px-4 py-3 text-base bg-glacier-50 border border-glacier-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-glacier-500 focus:border-transparent placeholder:text-glacier-400"
                      />
                    </div>

                    <Command.List className="max-h-[50vh] sm:max-h-[40vh] overflow-y-auto p-4 sm:p-6">
                      <Command.Empty className="py-12 text-center text-spa-slate">
                        <div className="mb-2 text-4xl">🤔</div>
                        <p className="font-medium">No results found</p>
                        <p className="text-sm mt-1">Try asking about training, expeditions, or gear</p>
                      </Command.Empty>

                      <Command.Group heading="Example Questions" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-glacier-600 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide">
                        {exampleQueries.map((query, idx) => (
                          <Command.Item
                            key={idx}
                            value={query}
                            onSelect={() => {
                              setSearch(query);
                              // Here you would trigger the AI search
                              console.log('Selected:', query);
                            }}
                            className="px-4 py-3 rounded-lg cursor-pointer hover:bg-glacier-50 data-[selected=true]:bg-glacier-100 transition-colors mb-1 text-sm sm:text-base text-spa-charcoal"
                          >
                            <div className="flex items-start space-x-3">
                              <MessageCircle className="w-4 h-4 text-glacier-500 mt-0.5 flex-shrink-0" />
                              <span>{query}</span>
                            </div>
                          </Command.Item>
                        ))}
                      </Command.Group>
                    </Command.List>
                  </Command>

                  {/* Footer Info */}
                  <div className="bg-glacier-50 px-4 py-3 sm:px-6 sm:py-4 border-t border-glacier-200">
                    <div className="flex items-center justify-between text-xs text-glacier-600">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <kbd className="px-2 py-1 bg-white border border-glacier-200 rounded">↑↓</kbd>
                          <span>navigate</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <kbd className="px-2 py-1 bg-white border border-glacier-200 rounded">↵</kbd>
                          <span>select</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <kbd className="px-2 py-1 bg-white border border-glacier-200 rounded">esc</kbd>
                          <span>close</span>
                        </span>
                      </div>
                      <span className="hidden sm:inline text-glacier-500">Powered by AI</span>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
