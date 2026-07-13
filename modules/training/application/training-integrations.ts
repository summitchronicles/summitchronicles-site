import { getServerEnv, type ServerEnv } from '@/shared/env/server';
import type {
  TrainingIntegrationStatus,
  TrainingTelemetryState,
} from '@/modules/training/domain/training-dashboard';

export function getTrainingIntegrationStatuses(
  telemetryState: TrainingTelemetryState,
  env: ServerEnv = getServerEnv()
): TrainingIntegrationStatus[] {
  const intervalsConfigured = Boolean(
    env.INTERVALS_ICU_API_KEY && env.INTERVALS_ICU_ATHLETE_ID
  );
  const whoopConfigured = Boolean(
    env.WHOOP_CLIENT_ID && env.WHOOP_CLIENT_SECRET
  );

  return [
    {
      id: 'intervals.icu',
      label: 'Intervals.icu',
      role: 'Training load and activity aggregation',
      state: !intervalsConfigured
        ? 'setup-required'
        : telemetryState === 'live'
          ? 'live'
          : telemetryState === 'cached'
            ? 'cached'
            : 'unavailable',
    },
    {
      id: 'whoop',
      label: 'WHOOP',
      role: 'Recovery, sleep, HRV and strain',
      state: whoopConfigured ? 'setup-required' : 'not-configured',
    },
  ];
}
