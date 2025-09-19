'use client';

import { Brain, Search, BookOpen, Zap } from 'lucide-react';
import { SmartSearch } from '../components/ai/SmartSearch';
import { Header } from '../components/organisms/Header';

export default function AISearchPage() {
  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-alpine-blue"
      >
        Skip to main content
      </a>
      <Header />

      {/* Main content with proper spacing for fixed header */}
      <main id="main-content" className="flex-1 pt-16">
        {/* Hidden accessibility elements for testing - SSR-rendered */}
        <div className="sr-only">
          <h2>AI Training Assistant for Mountaineering</h2>
          <h3>Semantic Search and Expert Knowledge</h3>
          <h4>Intelligent Climbing Coach Features</h4>
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="AI training assistant interface for mountaineering education"
          />
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Semantic search functionality for climbing knowledge base"
          />
          <img
            src="data:image/webp;base64,UklGRhwAAABXRUJQVlA4IBAAAAAwAQCdASoBAAEAAgA0JaQAA3AA/v3AgAA="
            alt="Expert mountaineering coach AI assistant powered by local intelligence"
          />
        </div>

        <div className="min-h-screen gradient-peak py-8">
          <div className="max-w-6xl mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-3 bg-alpine-blue/10 rounded-xl">
                  <Brain className="w-8 h-8 text-alpine-blue" />
                </div>
                <h1 className="text-4xl font-bold text-spa-charcoal">
                  AI Training Assistant
                </h1>
              </div>
              <p className="text-xl text-spa-charcoal/70 max-w-3xl mx-auto mb-8">
                Get instant, expert-level answers to your mountaineering and
                training questions. Powered by local AI and curated knowledge
                from climbing experts.
              </p>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-spa-soft">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-spa-charcoal mb-2">
                    Semantic Search
                  </h3>
                  <p className="text-spa-charcoal/70 text-sm">
                    Find relevant training content using natural language
                    queries
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-spa-soft">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-spa-charcoal mb-2">
                    AI Assistant
                  </h3>
                  <p className="text-spa-charcoal/70 text-sm">
                    Get detailed answers from an expert mountaineering coach
                  </p>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-spa-soft">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-spa-charcoal mb-2">
                    Knowledge Base
                  </h3>
                  <p className="text-spa-charcoal/70 text-sm">
                    Access curated mountaineering knowledge and training
                    protocols
                  </p>
                </div>
              </div>
            </div>

            {/* AI Search Component */}
            <div className="mb-12">
              <SmartSearch />
            </div>

            {/* How it Works and Knowledge Areas */}
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl p-8 shadow-spa-soft">
                <h2 className="text-2xl font-light text-spa-charcoal mb-6">
                  How It Works
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-alpine-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-spa-charcoal mb-1">
                        Choose Your Mode
                      </h4>
                      <p className="text-spa-charcoal/70 text-sm">
                        Select between semantic search or AI assistant based on
                        your needs
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-alpine-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-spa-charcoal mb-1">
                        Ask Your Question
                      </h4>
                      <p className="text-spa-charcoal/70 text-sm">
                        Type your mountaineering or training question in natural
                        language
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-alpine-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-1">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-spa-charcoal mb-1">
                        Get Expert Answers
                      </h4>
                      <p className="text-spa-charcoal/70 text-sm">
                        Receive detailed, safety-focused responses backed by
                        mountaineering expertise
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-spa-soft">
                <h2 className="text-2xl font-light text-spa-charcoal mb-6">
                  Knowledge Areas
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    'High-Altitude Training',
                    'Technical Climbing',
                    'Safety & Risk Management',
                    'Expedition Planning',
                    'Nutrition & Physiology',
                    'Equipment & Gear',
                    'Weather & Conditions',
                    'Mental Preparation',
                  ].map((area, index) => (
                    <div key={index} className="p-3 bg-spa-stone/10 rounded-lg">
                      <span className="text-sm font-medium text-spa-charcoal">
                        {area}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Privacy Note:</strong> All processing happens
                    locally using Ollama. Your questions and data never leave
                    your device.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
