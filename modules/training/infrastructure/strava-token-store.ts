import { neon } from '@neondatabase/serverless';
import { requireStravaCredentials } from '@/shared/env/server';
import {
  decryptWhoopToken,
  encryptWhoopToken,
} from '@/modules/training/infrastructure/whoop-token-crypto';

interface StravaConnectionRow {
  provider_user_id: string;
  display_name: string | null;
  access_token_encrypted: string;
  refresh_token_encrypted: string;
  token_type: string;
  scopes: string[];
  expires_at: string;
  connected_at: string;
  updated_at: string;
}

export interface StravaConnection {
  providerUserId: string;
  displayName: string | null;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  scopes: string[];
  expiresAt: string;
  connectedAt: string;
  updatedAt: string;
}

export interface SaveStravaConnectionInput
  extends Omit<StravaConnection, 'connectedAt' | 'updatedAt'> {
  connectedAt?: string;
}

function getDatabase() {
  const env = requireStravaCredentials();
  return neon(env.DATABASE_URL);
}

export const stravaTokenStore = {
  async read(): Promise<StravaConnection | null> {
    const env = requireStravaCredentials();
    const sql = getDatabase();
    const rows = (await sql`
      SELECT
        provider_user_id,
        display_name,
        access_token_encrypted,
        refresh_token_encrypted,
        token_type,
        scopes,
        expires_at,
        connected_at,
        updated_at
      FROM fitness_oauth_connections
      WHERE provider = 'strava'
      LIMIT 1
    `) as StravaConnectionRow[];
    const data = rows[0];

    if (!data) return null;

    return {
      providerUserId: data.provider_user_id,
      displayName: data.display_name,
      accessToken: decryptWhoopToken(
        data.access_token_encrypted,
        env.WHOOP_TOKEN_ENCRYPTION_KEY
      ),
      refreshToken: decryptWhoopToken(
        data.refresh_token_encrypted,
        env.WHOOP_TOKEN_ENCRYPTION_KEY
      ),
      tokenType: data.token_type,
      scopes: data.scopes,
      expiresAt: data.expires_at,
      connectedAt: data.connected_at,
      updatedAt: data.updated_at,
    };
  },

  async write(connection: SaveStravaConnectionInput): Promise<void> {
    const env = requireStravaCredentials();
    const sql = getDatabase();
    const now = new Date().toISOString();
    const connectedAt = connection.connectedAt ?? now;
    const encryptedAccessToken = encryptWhoopToken(
      connection.accessToken,
      env.WHOOP_TOKEN_ENCRYPTION_KEY
    );
    const encryptedRefreshToken = encryptWhoopToken(
      connection.refreshToken,
      env.WHOOP_TOKEN_ENCRYPTION_KEY
    );

    await sql`
      INSERT INTO fitness_oauth_connections (
        provider,
        provider_user_id,
        display_name,
        access_token_encrypted,
        refresh_token_encrypted,
        token_type,
        scopes,
        expires_at,
        connected_at,
        updated_at
      ) VALUES (
        'strava',
        ${connection.providerUserId},
        ${connection.displayName},
        ${encryptedAccessToken},
        ${encryptedRefreshToken},
        ${connection.tokenType},
        ${JSON.stringify(connection.scopes)}::jsonb,
        ${connection.expiresAt},
        ${connectedAt},
        ${now}
      )
      ON CONFLICT (provider) DO UPDATE SET
        provider_user_id = EXCLUDED.provider_user_id,
        display_name = EXCLUDED.display_name,
        access_token_encrypted = EXCLUDED.access_token_encrypted,
        refresh_token_encrypted = EXCLUDED.refresh_token_encrypted,
        token_type = EXCLUDED.token_type,
        scopes = EXCLUDED.scopes,
        expires_at = EXCLUDED.expires_at,
        updated_at = EXCLUDED.updated_at
    `;
  },

  async delete(): Promise<void> {
    const sql = getDatabase();
    await sql`DELETE FROM fitness_oauth_connections WHERE provider = 'strava'`;
  },
};
