'use client';

import { useState, useEffect, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Mountain, X, Sparkles, ArrowUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingAIButtonProps {
  className?: string;
}

export function FloatingAIButton({ className = '' }: FloatingAIButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user' as const, content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate delay for effect
    setTimeout(() => {
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: "The Summit Chronicles database is fully operational. I can assist with training protocols, expedition logistics, or historical data from the archives."
        }]);
        setIsLoading(false);
    }, 1500);
  };

  const exampleQueries = [
    'How do I train for altitude?',
    'What gear is essential for Manaslu?',
    'Explain the "Train Low, Sleep High" protocol.',
  ];

  return (
    <>
      <div className={`fixed bottom-8 right-8 z-40 ${className}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="
            group relative flex items-center justify-center
            w-14 h-14 bg-black/80 backdrop-blur-md
            border border-white/10 hover:border-summit-gold/50
            rounded-full shadow-2xl transition-all duration-300
            hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]
          "
          aria-label="Ask Summit AI"
        >
            <div className="absolute inset-0 bg-summit-gold-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles className="w-6 h-6 text-white group-hover:text-summit-gold-400 transition-colors duration-300" />

            {/* Notification Dot */}
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-summit-gold-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-summit-gold-500"></span>
            </span>
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl transition-all">
                  {/* Header */}
                  <div className="relative px-6 py-4 border-b border-white/10 flex items-center justify-between bg-obsidian">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                            <Mountain className="w-5 h-5 text-summit-gold-400" />
                        </div>
                        <div>
                            <Dialog.Title className="text-lg font-light tracking-wide text-white">
                                SUMMIT AI
                            </Dialog.Title>
                            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Based on Expedition Archives</p>
                        </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 text-gray-500 hover:text-white transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Chat Area */}
                  <div className="h-[500px] flex flex-col bg-black">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                <Zap className="w-12 h-12 text-gray-700 mb-4" />
                                <p className="text-gray-400 font-light mb-8 max-w-xs">
                                    Access archived knowledge from 11 years of high-altitude mountaineering.
                                </p>
                                <div className="grid gap-3 w-full max-w-md">
                                    {exampleQueries.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSendMessage(q)}
                                            className="text-sm p-4 bg-white/5 border border-white/5 rounded-lg hover:border-summit-gold/30 hover:bg-white/10 transition-all text-left text-gray-300 hover:text-summit-gold-100"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed ${
                                        msg.role === 'user'
                                        ? 'bg-summit-gold-900/40 text-summit-gold-100 border border-summit-gold-500/20'
                                        : 'bg-white/5 text-gray-300 border border-white/5'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex space-x-1 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="w-2 h-2 bg-summit-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-summit-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-summit-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10 bg-obsidian">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage(inputValue);
                            }}
                            className="relative"
                        >
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Query the archives..."
                                className="w-full bg-black border border-white/10 rounded-lg pl-4 pr-12 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-summit-gold/50 transition-colors font-mono text-sm"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-white/10 hover:bg-summit-gold hover:text-black text-gray-400 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </form>
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
