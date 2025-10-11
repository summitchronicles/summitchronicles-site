/**
 * Garmin OAuth 2.0 Integration
 * Handles authentication and token management for Garmin Connect API
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Garmin OAuth configuration
const GARMIN_OAUTH_BASE = 'https://connect.garmin.com/oauthConfirm';
const GARMIN_TOKEN_URL = 'https://connectapi.garmin.com/oauth-service/oauth/access_token';
const GARMIN_REQUEST_TOKEN_URL = 'https://connectapi.garmin.com/oauth-service/oauth/request_token';

export interface GarminTokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_at: string;
  scope?: string;
}

/**
 * Generate Garmin OAuth authorization URL
 */
export function getGarminAuthUrl(callbackUrl: string): string {
  const clientId = process.env.GARMIN_CLIENT_ID;

  if (!clientId) {
    throw new Error('GARMIN_CLIENT_ID not configured');
  }

  // Garmin uses OAuth 1.0a, which is more complex
  // For OAuth 2.0 style (if they support it), it would be:
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: callbackUrl,
    scope: 'activity:read'
  });

  return `${GARMIN_OAUTH_BASE}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<GarminTokens> {
  const clientId = process.env.GARMIN_CLIENT_ID;
  const clientSecret = process.env.GARMIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Garmin credentials not configured');
  }

  // Note: Garmin uses OAuth 1.0a, which requires request signing
  // This is a simplified OAuth 2.0 style implementation
  // You may need to use OAuth 1.0a library like 'oauth-1.0a'

  const response = await fetch(GARMIN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  const data = await response.json();

  // Calculate expiration time (usually 3600 seconds = 1 hour)
  const expiresIn = data.expires_in || 3600;
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_type: data.token_type || 'Bearer',
    expires_at: expiresAt,
    scope: data.scope
  };
}

/**
 * Store tokens in Supabase
 */
export async function storeGarminTokens(
  userId: string,
  tokens: GarminTokens
): Promise<void> {
  const { error } = await supabase
    .from('garmin_tokens')
    .upsert({
      user_id: userId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type,
      expires_at: tokens.expires_at,
      scope: tokens.scope,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    throw new Error(`Failed to store tokens: ${error.message}`);
  }
}

/**
 * Get stored tokens from Supabase
 */
export async function getGarminTokens(userId: string): Promise<GarminTokens | null> {
  const { data, error } = await supabase
    .from('garmin_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  // Check if token is expired
  const expiresAt = new Date(data.expires_at);
  if (expiresAt < new Date()) {
    // Token is expired, try to refresh
    if (data.refresh_token) {
      return await refreshGarminToken(userId, data.refresh_token);
    }
    return null;
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_type: data.token_type,
    expires_at: data.expires_at,
    scope: data.scope
  };
}

/**
 * Refresh expired access token
 */
export async function refreshGarminToken(
  userId: string,
  refreshToken: string
): Promise<GarminTokens> {
  const clientId = process.env.GARMIN_CLIENT_ID;
  const clientSecret = process.env.GARMIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Garmin credentials not configured');
  }

  const response = await fetch(GARMIN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  const data = await response.json();

  const expiresIn = data.expires_in || 3600;
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

  const tokens: GarminTokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken,
    token_type: data.token_type || 'Bearer',
    expires_at: expiresAt,
    scope: data.scope
  };

  // Store updated tokens
  await storeGarminTokens(userId, tokens);

  return tokens;
}

/**
 * Check if user has valid Garmin connection
 */
export async function isGarminConnected(userId: string): Promise<boolean> {
  const tokens = await getGarminTokens(userId);
  return tokens !== null;
}

/**
 * Revoke Garmin access (disconnect)
 */
export async function revokeGarminAccess(userId: string): Promise<void> {
  const { error } = await supabase
    .from('garmin_tokens')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to revoke access: ${error.message}`);
  }
}
