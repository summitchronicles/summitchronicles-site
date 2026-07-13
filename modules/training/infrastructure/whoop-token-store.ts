import { neon } from '@neondatabase/serverless';
import { requireWhoopCredentials } from '@/shared/env/server';
import {
  decryptWhoopToken,
  encryptWhoopToken,
} from '@/modules/training/infrastructure/whoop-token-crypto';

interface WhoopConnectionRow {
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

export interface WhoopConnection {
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

export interface SaveWhoopConnectionInput
  extends Omit<WhoopConnection, 'connectedAt' | 'updatedAt'> {
  connectedAt?: string;
}

function getDatabase() {
  const env = requireWhoopCredentials();
  return neon(env.DATABASE_URL);
}

export const whoopTokenStore = {
  async read(): Promise<WhoopConnection | null> {
    const env = requireWhoopCredentials();
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
      WHERE provider = 'whoop'
      LIMIT 1
    `) as WhoopConnectionRow[];
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

  async write(connection: SaveWhoopConnectionInput): Promise<void> {
    const env = requireWhoopCredentials();
    const now = new Date().toISOString();
    const row = {
      provider: 'whoop',
      provider_user_id: connection.providerUserId,
      display_name: connection.displayName,
      access_token_encrypted: encryptWhoopToken(
        connection.accessToken,
        env.WHOOP_TOKEN_ENCRYPTION_KEY
      ),
      refresh_token_encrypted: encryptWhoopToken(
        connection.refreshToken,
        env.WHOOP_TOKEN_ENCRYPTION_KEY
      ),
      token_type: connection.tokenType,
      scopes: connection.scopes,
      expires_at: connection.expiresAt,
      connected_at: connection.connectedAt ?? now,
      updated_at: now,
    };
    const sql = getDatabase();
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
        ${row.provider},
        ${row.provider_user_id},
        ${row.display_name},
        ${row.access_token_encrypted},
        ${row.refresh_token_encrypted},
        ${row.token_type},
        ${JSON.stringify(row.scopes)}::jsonb,
        ${row.expires_at},
        ${row.connected_at},
        ${row.updated_at}
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
    await sql`DELETE FROM fitness_oauth_connections WHERE provider = 'whoop'`;
  },
};
