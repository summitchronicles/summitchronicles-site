'use client';

import ContentPipelineView from '../components/ContentPipelineView';

export default function ContentPage() {
  return (
    <div className="max-w-6xl">
      <h2 className="text-2xl font-bold font-oswald text-white mb-6">Content Pipeline</h2>
      <ContentPipelineView />
    </div>
  );
}
