import React from 'react';
import { Header } from '../../components/organisms/Header';
import { Footer } from '../../components/organisms/Footer';
import { ContentEditor } from '../../components/organisms/ContentEditor';

export default function EditorPage() {
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
        <div className="py-8">
          <ContentEditor />
        </div>
      </main>

      <Footer />
    </div>
  );
}