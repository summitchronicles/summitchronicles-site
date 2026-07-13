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
  const stravaConfigured = Boolean(
    env.STRAVA_CLIENT_ID && env.STRAVA_CLIENT_SECRET
  );
  const stravaConnected = Boolean(env.STRAVA_REFRESH_TOKEN);
  const whoopConfigured = Boolean(
    env.WHOOP_CLIENT_ID && env.WHOOP_CLIENT_SECRET
  );
  const whoopConnected = Boolean(env.WHOOP_REFRESH_TOKEN);

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
      state: whoopConnected
        ? 'connected'
        : whoopConfigured
          ? 'setup-required'
          : 'not-configured',
    },
    {
      id: 'strava',
      label: 'Strava',
      role: 'Activities, distance, elevation and routes',
      state: stravaConnected
        ? 'connected'
        : stravaConfigured
          ? 'setup-required'
          : 'not-configured',
    },
    {
      id: 'garmin',
      label: 'Garmin',
      role: 'Device source paused',
      state: 'paused',
    },
  ];
}
