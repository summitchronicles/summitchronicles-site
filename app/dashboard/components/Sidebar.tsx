'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: '◈' },
  { href: '/dashboard/agents', label: 'Agents', icon: '⚙' },
  { href: '/dashboard/content', label: 'Content', icon: '◧' },
  { href: '/dashboard/newsletter', label: 'Newsletter', icon: '✉' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: ollamaStatus } = useSWR('/api/agents/status?health=true', fetcher, {
    refreshInterval: 30000,
  });

  const isOllamaOnline = ollamaStatus?.ollamaAvailable === true;

  return (
    <aside className="w-60 min-h-screen bg-gray-950 border-r border-gray-800 flex flex-col">
      <div className="p-5 border-b border-gray-800">
        <Link href="/dashboard" className="block">
          <h1 className="text-lg font-bold font-oswald text-summit-gold tracking-wide">
            MISSION CONTROL
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            Summit Chronicles
          </p>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-summit-gold/10 text-summit-gold'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${isOllamaOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-gray-400">
            Ollama: {isOllamaOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </aside>
  );
}
