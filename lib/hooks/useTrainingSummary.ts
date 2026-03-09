import { useEffect, useState } from 'react';
import type { TrainingDashboardResponse } from '@/modules/training/domain/training-dashboard';

interface UseTrainingSummaryResult {
  summary: TrainingDashboardResponse['summary'] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useTrainingSummary(): UseTrainingSummaryResult {
  const [summary, setSummary] = useState<TrainingDashboardResponse['summary'] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/training/summary', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch training summary: ${response.status}`);
      }

      const data = (await response.json()) as TrainingDashboardResponse;
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSummary();
  }, []);

  return {
    summary,
    loading,
    error,
    refresh: fetchSummary,
  };
}

