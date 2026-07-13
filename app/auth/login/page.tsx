'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, KeyRound, Loader2, Mountain } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || 'Unable to sign in');
        return;
      }

      const requestedPath = new URLSearchParams(window.location.search).get(
        'next'
      );
      const destination =
        requestedPath &&
        requestedPath.startsWith('/') &&
        !requestedPath.startsWith('//')
          ? requestedPath
          : '/dashboard/content';
      if (destination.startsWith('/api/')) {
        window.location.assign(destination);
        return;
      }
      router.replace(destination);
      router.refresh();
    } catch (requestError) {
      console.error('Admin login failed:', requestError);
      setError('Unable to reach the authentication service');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-5 py-16 text-white">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Summit Chronicles
        </Link>

        <div className="border-y border-white/10 py-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-summit-gold text-black">
            <Mountain className="h-6 w-6" />
          </div>
          <div className="mt-8 text-xs font-mono uppercase text-summit-gold-300">
            Mission Control
          </div>
          <h1 className="mt-3 font-oswald text-4xl font-bold uppercase text-white">
            Author access
          </h1>
          <p className="mt-4 leading-7 text-zinc-400">
            Sign in to write, upload, publish, and index Summit Chronicles
            stories.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="access-key"
                className="mb-2 block text-sm font-medium text-zinc-300"
              >
                Internal access key
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
                <input
                  id="access-key"
                  type="password"
                  value={key}
                  onChange={(event) => setKey(event.target.value)}
                  autoComplete="current-password"
                  className="min-h-12 w-full rounded-md border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-white outline-none transition-colors focus:border-summit-gold/60 focus:ring-2 focus:ring-summit-gold/20"
                  placeholder="Enter access key"
                />
              </div>
            </div>

            {error ? (
              <p className="text-sm text-red-300" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-md bg-summit-gold px-5 py-3 text-sm font-bold uppercase text-black transition-colors hover:bg-summit-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              {submitting ? 'Signing in' : 'Open authoring tools'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
