import { intervalsClient } from '@/modules/training/infrastructure/intervals-client';
import { loadTrainingSourceSnapshot } from '@/modules/training/application/training-snapshot-service';
import type { TrainingInsight } from '@/modules/training/domain/training-dashboard';
import type { TrainingSnapshotStore } from '@/modules/training/infrastructure/training-snapshot-store';

interface TrainingInsightsRepositoryOptions {
  store?: TrainingSnapshotStore;
}

export class TrainingInsightsRepository {
  private readonly store?: TrainingSnapshotStore;

  constructor(options: TrainingInsightsRepositoryOptions = {}) {
    this.store = options.store;
  }

  async listInsights(): Promise<TrainingInsight[]> {
    const snapshot = await loadTrainingSourceSnapshot(intervalsClient, {
      store: this.store,
    });

    return snapshot.missionLogs;
  }
}

