import { z } from 'zod';
import { requireStravaCredentials } from '@/shared/env/server';
import {
  stravaTokenStore,
  type StravaConnection,
} from '@/modules/training/infrastructure/strava-token-store';

const API_BASE_URL = 'https://www.strava.com/api/v3';
const TOKEN_URL = 'https://www.strava.com/oauth/token';
const DEAUTHORIZE_URL = 'https://www.strava.com/oauth/deauthorize';
const REFRESH_WINDOW_MS = 60 * 1000;

const athleteSchema = z.object({
  id: z.union([z.number(), z.string()]),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
});

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_at: z.number().positive(),
  expires_in: z.number().positive().optional(),
  token_type: z.string().default('Bearer'),
  athlete: athleteSchema.optional(),
});

export interface StravaActivity {
  id: number | string;
  name: string;
  sport_type?: string;
  type?: string;
  start_date_local: string;
  moving_time: number;
  elapsed_time: number;
  distance: number;
  total_elevation_gain: number;
  average_heartrate?: number;
  max_heartrate?: number;
  description?: string;
}

export type StravaTokenResponse = z.infer<typeof tokenResponseSchema>;

let refreshPromise: Promise<StravaConnection> | null = null;

async function tokenRequest(body: URLSearchParams) {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `Strava token exchange failed with status ${response.status}`
    );
  }

  return tokenResponseSchema.parse(await response.json());
}

async function refreshConnection(connection: StravaConnection) {
  const env = requireStravaCredentials();
  const tokens = await tokenRequest(
    new URLSearchParams({
      client_id: env.STRAVA_CLIENT_ID,
      client_secret: env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: connection.refreshToken,
    })
  );
  const refreshed: StravaConnection = {
    ...connection,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    tokenType: tokens.token_type,
    expiresAt: new Date(tokens.expires_at * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await stravaTokenStore.write(refreshed);
  return refreshed;
}

async function getConnectionWithValidToken() {
  const connection = await stravaTokenStore.read();
  if (!connection) return null;

  if (
    new Date(connection.expiresAt).getTime() - Date.now() >
    REFRESH_WINDOW_MS
  ) {
    return connection;
  }

  if (!refreshPromise) {
    refreshPromise = refreshConnection(connection).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

export const stravaClient = {
  async exchangeAuthorizationCode(code: string) {
    const env = requireStravaCredentials();
    return tokenRequest(
      new URLSearchParams({
        client_id: env.STRAVA_CLIENT_ID,
        client_secret: env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      })
    );
  },

  async saveAuthorization(tokens: StravaTokenResponse, scopes: string[]) {
    if (!tokens.athlete) {
      throw new Error(
        'Strava authorization response did not include an athlete'
      );
    }

    const displayName = [tokens.athlete.firstname, tokens.athlete.lastname]
      .filter(Boolean)
      .join(' ');

    await stravaTokenStore.write({
      providerUserId: String(tokens.athlete.id),
      displayName: displayName || null,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenType: tokens.token_type,
      scopes,
      expiresAt: new Date(tokens.expires_at * 1000).toISOString(),
    });
  },

  async getStatus() {
    const connection = await stravaTokenStore.read();
    return connection
      ? {
          connected: true as const,
          displayName: connection.displayName,
          connectedAt: connection.connectedAt,
        }
      : { connected: false as const };
  },

  async getActivities(): Promise<StravaActivity[] | null> {
    const connection = await getConnectionWithValidToken();
    if (!connection) return null;

    const response = await fetch(
      `${API_BASE_URL}/athlete/activities?per_page=100&page=1`,
      {
        headers: { Authorization: `Bearer ${connection.accessToken}` },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(
        `Strava activities request failed with status ${response.status}`
      );
    }

    return (await response.json()) as StravaActivity[];
  },

  async disconnect() {
    const connection = await getConnectionWithValidToken();
    if (connection) {
      await fetch(DEAUTHORIZE_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${connection.accessToken}` },
        cache: 'no-store',
      }).catch(() => null);
    }

    await stravaTokenStore.delete();
  },
};
