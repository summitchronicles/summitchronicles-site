/**
 * Garmin OAuth 1.0a Integration
 * Garmin uses OAuth 1.0a, not OAuth 2.0
 */

import OAuth from 'oauth-1.0a';
import crypto from 'crypto-js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Garmin OAuth 1.0a endpoints
const GARMIN_REQUEST_TOKEN_URL = 'https://connectapi.garmin.com/oauth-service/oauth/request_token';
const GARMIN_AUTHORIZE_URL = 'https://connect.garmin.com/oauthConfirm';
const GARMIN_ACCESS_TOKEN_URL = 'https://connectapi.garmin.com/oauth-service/oauth/access_token';

export interface GarminTokens {
  oauth_token: string;
  oauth_token_secret: string;
  expires_at: string;
}

/**
 * Initialize OAuth 1.0a client
 */
function getOAuthClient() {
  const oauth = new OAuth({
    consumer: {
      key: process.env.GARMIN_CLIENT_ID!,
      secret: process.env.GARMIN_CLIENT_SECRET!
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return crypto.HmacSHA1(base_string, key).toString(crypto.enc.Base64);
    }
  });

  return oauth;
}

/**
 * Step 1: Get request token from Garmin
 */
export async function getRequestToken(callbackUrl: string): Promise<{
  oauth_token: string;
  oauth_token_secret: string;
}> {
  const oauth = getOAuthClient();

  const requestData = {
    url: GARMIN_REQUEST_TOKEN_URL,
    method: 'POST',
    data: { oauth_callback: callbackUrl }
  };

  const headers = oauth.toHeader(oauth.authorize(requestData));

  const response = await fetch(GARMIN_REQUEST_TOKEN_URL, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ oauth_callback: callbackUrl }).toString()
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get request token: ${error}`);
  }

  const responseText = await response.text();
  const params = new URLSearchParams(responseText);

  const oauth_token = params.get('oauth_token');
  const oauth_token_secret = params.get('oauth_token_secret');

  if (!oauth_token || !oauth_token_secret) {
    throw new Error('Invalid request token response');
  }

  return { oauth_token, oauth_token_secret };
}

/**
 * Step 2: Generate authorization URL for user
 */
export function getAuthorizationUrl(oauth_token: string): string {
  return `${GARMIN_AUTHORIZE_URL}?oauth_token=${oauth_token}`;
}

/**
 * Step 3: Exchange oauth_token + oauth_verifier for access token
 */
export async function getAccessToken(
  oauth_token: string,
  oauth_token_secret: string,
  oauth_verifier: string
): Promise<GarminTokens> {
  const oauth = getOAuthClient();

  const requestData = {
    url: GARMIN_ACCESS_TOKEN_URL,
    method: 'POST'
  };

  const token = {
    key: oauth_token,
    secret: oauth_token_secret
  };

  const headers = oauth.toHeader(oauth.authorize(requestData, token));

  const response = await fetch(GARMIN_ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({ oauth_verifier }).toString()
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const responseText = await response.text();
  const params = new URLSearchParams(responseText);

  const access_token = params.get('oauth_token');
  const access_token_secret = params.get('oauth_token_secret');

  if (!access_token || !access_token_secret) {
    throw new Error('Invalid access token response');
  }

  // OAuth 1.0a tokens don't typically expire, but we'll set a far future date
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 10); // 10 years

  return {
    oauth_token: access_token,
    oauth_token_secret: access_token_secret,
    expires_at: expiresAt.toISOString()
  };
}

/**
 * Store OAuth 1.0a tokens in Supabase
 */
export async function storeGarminTokens(
  userId: string,
  tokens: GarminTokens
): Promise<void> {
  const { error } = await supabase
    .from('garmin_tokens')
    .upsert({
      user_id: userId,
      access_token: tokens.oauth_token,
      refresh_token: tokens.oauth_token_secret, // Store secret as "refresh_token"
      token_type: 'OAuth1.0a',
      expires_at: tokens.expires_at,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    throw new Error(`Failed to store tokens: ${error.message}`);
  }
}

/**
 * Get stored OAuth 1.0a tokens from Supabase
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

  return {
    oauth_token: data.access_token,
    oauth_token_secret: data.refresh_token, // Secret stored as "refresh_token"
    expires_at: data.expires_at
  };
}

/**
 * Make authenticated request to Garmin API
 */
export async function makeGarminRequest(
  url: string,
  method: 'GET' | 'POST' = 'GET',
  userId: string
): Promise<Response> {
  const tokens = await getGarminTokens(userId);

  if (!tokens) {
    throw new Error('No Garmin tokens found. Please connect your account.');
  }

  const oauth = getOAuthClient();

  const requestData = {
    url,
    method
  };

  const token = {
    key: tokens.oauth_token,
    secret: tokens.oauth_token_secret
  };

  const headers = oauth.toHeader(oauth.authorize(requestData, token));

  return fetch(url, {
    method,
    headers: {
      ...headers
    }
  });
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

/**
 * Store temporary request token (for OAuth flow)
 * Stores by oauth_token so we can retrieve it in the callback
 */
export async function storeRequestToken(
  state: string,
  oauth_token: string,
  oauth_token_secret: string
): Promise<void> {
  // Store in a temporary table or cache
  // For now, we'll use a simple in-memory Map (in production, use Redis or DB)
  if (typeof window === 'undefined') {
    global.garminRequestTokens = global.garminRequestTokens || new Map();
    // Store by oauth_token (not state) because Garmin returns oauth_token in callback
    global.garminRequestTokens.set(oauth_token, {
      oauth_token,
      oauth_token_secret,
      created_at: Date.now()
    });
  }
}

/**
 * Get temporary request token by oauth_token
 */
export function getRequestTokenFromState(oauth_token: string): {
  oauth_token: string;
  oauth_token_secret: string;
} | null {
  if (typeof window === 'undefined') {
    global.garminRequestTokens = global.garminRequestTokens || new Map();
    const data = global.garminRequestTokens.get(oauth_token);

    if (!data) return null;

    // Clean up old tokens (> 10 minutes)
    if (Date.now() - data.created_at > 10 * 60 * 1000) {
      global.garminRequestTokens.delete(oauth_token);
      return null;
    }

    return {
      oauth_token: data.oauth_token,
      oauth_token_secret: data.oauth_token_secret
    };
  }
  return null;
}

// Type for global namespace
declare global {
  // eslint-disable-next-line no-var
  var garminRequestTokens: Map<string, {
    oauth_token: string;
    oauth_token_secret: string;
    created_at: number;
  }>;
}
