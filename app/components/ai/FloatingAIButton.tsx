'use client';

import { useState, useEffect, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { Command } from 'cmdk'; // Removed as we are building custom chat UI
import { Mountain, X, Sparkles, MessageCircle, ArrowUp, Send } from 'lucide-react';

interface FloatingAIButtonProps {
  className?: string;
}

export function FloatingAIButton({ className = '' }: FloatingAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to RAG endpoint
      // In a real app, this would be: await fetch('/api/chat', { ... })
      // For now, we'll use a simulated response or call the actual API if available

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        // Fallback for demo if API isn't fully wired or errors
         setMessages(prev => [...prev, {
           role: 'assistant',
           content: "Summit Chronicles database is still populating information and blogs, you can reach out directly to Sunith for more specific answers."
         }]);
      }
    } catch (error) {
       console.error('Chat error:', error);
       setMessages(prev => [...prev, {
         role: 'assistant',
         content: "I'm having trouble connecting to the Summit Chronicles database right now. Please try again later."
       }]);
    } finally {
      setIsLoading(false);
    }
  };

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

                  {/* Chat Interface */}
                  <div className="flex flex-col h-[60vh] sm:h-[70vh]">
                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-summit-gold-400" />
                          </div>
                          <h3 className="text-lg font-medium text-slate-800 mb-2">How can I help you today?</h3>
                          <p className="text-sm max-w-md mx-auto mb-8">
                            Ask about training plans, acclimatization strategies, or gear recommendations.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                            {exampleQueries.map((query, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendMessage(query)}
                                className="text-left p-3 text-sm bg-white border border-slate-200 rounded-xl hover:border-alpine-blue-300 hover:shadow-sm transition-all"
                              >
                                {query}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        messages.map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`
                                max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                                ${msg.role === 'user'
                                  ? 'bg-alpine-blue-600 text-white rounded-br-none'
                                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                                }
                              `}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                      {isLoading && (
                         <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
                              <div className="w-2 h-2 bg-alpine-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <div className="w-2 h-2 bg-alpine-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <div className="w-2 h-2 bg-alpine-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                         </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-200">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleSendMessage(inputValue);
                        }}
                        className="relative flex items-center"
                      >
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Ask a specific question..."
                          className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-alpine-blue-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim() || isLoading}
                          className="absolute right-2 p-2 bg-alpine-blue-600 text-white rounded-lg hover:bg-alpine-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Send message"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                      </form>
                      <p className="text-center text-xs text-slate-400 mt-2">
                        AI can make mistakes. Verify important safety information.
                      </p>
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
