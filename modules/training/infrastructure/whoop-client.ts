import { z } from 'zod';
import { requireWhoopCredentials } from '@/shared/env/server';
import {
  whoopTokenStore,
  type WhoopConnection,
} from '@/modules/training/infrastructure/whoop-token-store';

const API_BASE_URL = 'https://api.prod.whoop.com/developer/v2';
const TOKEN_URL = 'https://api.prod.whoop.com/oauth/oauth2/token';
const REFRESH_WINDOW_MS = 60 * 1000;

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number().positive(),
  token_type: z.string().default('bearer'),
  scope: z.string().default(''),
});

const profileSchema = z.object({
  user_id: z.union([z.number(), z.string()]),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

export type WhoopTokenResponse = z.infer<typeof tokenResponseSchema>;

export interface WhoopRecovery {
  updated_at: string;
  score_state: string;
  score?: {
    recovery_score?: number;
    resting_heart_rate?: number;
    hrv_rmssd_milli?: number;
    spo2_percentage?: number;
    skin_temp_celsius?: number;
  };
}

export interface WhoopCycle {
  updated_at: string;
  score_state: string;
  score?: { strain?: number };
}

export interface WhoopSleep {
  updated_at: string;
  nap: boolean;
  score_state: string;
  score?: { sleep_performance_percentage?: number };
}

export interface WhoopWorkout {
  id: string;
  start: string;
  end: string;
  sport_name?: string;
  score_state: string;
  score?: {
    strain?: number;
    average_heart_rate?: number;
    max_heart_rate?: number;
    distance_meter?: number;
    altitude_gain_meter?: number;
  };
}

export interface WhoopSnapshot {
  recovery: WhoopRecovery | null;
  cycle: WhoopCycle | null;
  sleep: WhoopSleep | null;
  workouts: WhoopWorkout[];
  fetchedAt: string;
}

let refreshPromise: Promise<WhoopConnection> | null = null;

function tokenRequest(body: URLSearchParams) {
  return fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
}

async function parseTokenResponse(response: Response) {
  if (!response.ok) {
    throw new Error(
      `WHOOP token exchange failed with status ${response.status}`
    );
  }

  return tokenResponseSchema.parse(await response.json());
}

function expiresAt(expiresIn: number) {
  return new Date(Date.now() + expiresIn * 1000).toISOString();
}

async function fetchWithToken<T>(
  path: string,
  accessToken: string
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`WHOOP API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function refreshConnection(connection: WhoopConnection) {
  const env = requireWhoopCredentials();
  const response = await tokenRequest(
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: connection.refreshToken,
      client_id: env.WHOOP_CLIENT_ID,
      client_secret: env.WHOOP_CLIENT_SECRET,
      scope: 'offline',
    })
  );
  const tokens = await parseTokenResponse(response);
  const refreshed: WhoopConnection = {
    ...connection,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    tokenType: tokens.token_type,
    scopes: tokens.scope.split(/\s+/).filter(Boolean),
    expiresAt: expiresAt(tokens.expires_in),
    updatedAt: new Date().toISOString(),
  };

  await whoopTokenStore.write(refreshed);
  return refreshed;
}

async function getConnectionWithValidToken() {
  const connection = await whoopTokenStore.read();
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

export const whoopClient = {
  async exchangeAuthorizationCode(code: string) {
    const env = requireWhoopCredentials();
    const response = await tokenRequest(
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: env.WHOOP_CLIENT_ID,
        client_secret: env.WHOOP_CLIENT_SECRET,
        redirect_uri: env.WHOOP_REDIRECT_URI,
      })
    );
    return parseTokenResponse(response);
  },

  async saveAuthorization(tokens: WhoopTokenResponse) {
    const profile = profileSchema.parse(
      await fetchWithToken<unknown>('/user/profile/basic', tokens.access_token)
    );
    const displayName = [profile.first_name, profile.last_name]
      .filter(Boolean)
      .join(' ');

    await whoopTokenStore.write({
      providerUserId: String(profile.user_id),
      displayName: displayName || null,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      tokenType: tokens.token_type,
      scopes: tokens.scope.split(/\s+/).filter(Boolean),
      expiresAt: expiresAt(tokens.expires_in),
    });
  },

  async getStatus() {
    const connection = await whoopTokenStore.read();
    return connection
      ? {
          connected: true as const,
          displayName: connection.displayName,
          connectedAt: connection.connectedAt,
        }
      : { connected: false as const };
  },

  async getSnapshot(): Promise<WhoopSnapshot | null> {
    const connection = await getConnectionWithValidToken();
    if (!connection) return null;

    const [recoveries, cycles, sleeps, workouts] = await Promise.all([
      fetchWithToken<{ records: WhoopRecovery[] }>(
        '/recovery?limit=10',
        connection.accessToken
      ),
      fetchWithToken<{ records: WhoopCycle[] }>(
        '/cycle?limit=10',
        connection.accessToken
      ),
      fetchWithToken<{ records: WhoopSleep[] }>(
        '/activity/sleep?limit=10',
        connection.accessToken
      ),
      fetchWithToken<{ records: WhoopWorkout[] }>(
        '/activity/workout?limit=25',
        connection.accessToken
      ),
    ]);

    return {
      recovery:
        recoveries.records.find((item) => item.score_state === 'SCORED') ??
        null,
      cycle:
        cycles.records.find((item) => item.score_state === 'SCORED') ?? null,
      sleep:
        sleeps.records.find(
          (item) => !item.nap && item.score_state === 'SCORED'
        ) ?? null,
      workouts: workouts.records,
      fetchedAt: new Date().toISOString(),
    };
  },

  async disconnect() {
    const connection = await getConnectionWithValidToken();
    if (connection) {
      await fetch(`${API_BASE_URL}/user/access`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${connection.accessToken}` },
        cache: 'no-store',
      }).catch(() => null);
    }

    await whoopTokenStore.delete();
  },
};
