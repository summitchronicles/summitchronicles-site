"use client";

import { lazy, Suspense } from 'react';

// Lazy load the heavy editor component
const AdvancedEditor = lazy(() => import('./AdvancedEditor'));

interface AdvancedEditorLazyProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

// Loading fallback component
function EditorFallback() {
  return (
    <div className="w-full min-h-96 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-summitGold mx-auto mb-3"></div>
        <p className="text-gray-600 font-medium">Loading Editor...</p>
        <p className="text-gray-500 text-sm mt-1">Preparing rich text editing tools</p>
      </div>
    </div>
  );
}

export default function AdvancedEditorLazy(props: AdvancedEditorLazyProps) {
  return (
    <Suspense fallback={<EditorFallback />}>
      <AdvancedEditor {...props} />
    </Suspense>
  );
}