import { NextRequest } from 'next/server';
import { GarminTokens } from './garmin-api';

// Helper function to extract tokens from request (for internal API use)
export function getGarminTokensFromRequest(request: NextRequest): GarminTokens | null {
  try {
    const accessToken = request.cookies.get('garmin_access_token')?.value;
    const refreshToken = request.cookies.get('garmin_refresh_token')?.value;
    const expiresAt = request.cookies.get('garmin_token_expires')?.value;

    if (!accessToken || !refreshToken || !expiresAt) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      expiresAt: parseInt(expiresAt),
      tokenType: 'Bearer',
    };
  } catch (error) {
    console.error('Error extracting Garmin tokens:', error);
    return null;
  }
}