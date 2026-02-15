'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useDashboardStore } from '@/lib/stores/dashboardStore';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface FileCard {
  filename: string;
  title: string;
  date: string;
  wordCount: number;
  status: string;
}

function Column({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 min-w-0">
      <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${color}`}>
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function FileItem({ file, onPublish, onDelete }: {
  file: FileCard;
  onPublish?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
      <h4 className="text-sm font-medium text-white truncate">{file.title}</h4>
      <div className="flex gap-2 text-[10px] text-gray-500 mt-1 mb-2">
        <span>{file.date}</span>
        <span>{file.wordCount}w</span>
      </div>
      <div className="flex gap-1.5">
        <Link
          href={`/dashboard/edit/${encodeURIComponent(file.filename)}`}
          className="px-2 py-1 bg-gray-800 rounded text-[10px] text-gray-300 hover:bg-gray-700"
        >
          Edit
        </Link>
        {onPublish && (
          <button
            onClick={onPublish}
            className="px-2 py-1 bg-green-900/40 text-green-400 border border-green-900 rounded text-[10px] hover:bg-green-800"
          >
            Publish
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-2 py-1 bg-gray-800 rounded text-[10px] text-gray-400 hover:bg-red-900 hover:text-red-400"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default function ContentPipelineView() {
  const { data: incomingData } = useSWR('/api/content/incoming', fetcher, { refreshInterval: 10000 });
  const { data: draftsData, mutate: mutateDrafts } = useSWR('/api/drafts', fetcher, { refreshInterval: 10000 });
  const openModal = useDashboardStore(s => s.openModal);

  const incoming: FileCard[] = (incomingData?.files || []).map((f: any) => ({
    filename: f.filename,
    title: f.filename.replace(/\.(txt|md)$/, ''),
    date: f.modified || '',
    wordCount: f.wordCount || 0,
    status: 'incoming',
  }));

  const allDrafts: FileCard[] = (draftsData?.drafts || []);
  const drafts = allDrafts.filter(d => d.status !== 'published');
  const published = allDrafts.filter(d => d.status === 'published');

  const handlePublish = (filename: string, title: string) => {
    openModal('publish', { files: [filename], title });
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete "${filename}"?`)) return;
    await fetch(`/api/drafts/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    mutateDrafts();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Column title="Incoming Notes" color="text-blue-400">
        {incoming.length === 0 && <p className="text-gray-600 text-xs italic">No incoming notes.</p>}
        {incoming.map(f => <FileItem key={f.filename} file={f} />)}
      </Column>

      <Column title="Drafts" color="text-yellow-400">
        {drafts.length === 0 && <p className="text-gray-600 text-xs italic">No drafts.</p>}
        {drafts.map(f => (
          <FileItem
            key={f.filename}
            file={f}
            onPublish={() => handlePublish(f.filename, f.title)}
            onDelete={() => handleDelete(f.filename)}
          />
        ))}
      </Column>

      <Column title="Published" color="text-green-400">
        {published.length === 0 && <p className="text-gray-600 text-xs italic">No published posts.</p>}
        {published.map(f => <FileItem key={f.filename} file={f} />)}
      </Column>
    </div>
  );
}
