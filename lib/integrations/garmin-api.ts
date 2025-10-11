/**
 * Garmin Connect API Client
 * Fetches activity data from Garmin Connect
 */

import { getGarminTokens } from './garmin-oauth';

const GARMIN_API_BASE = 'https://apis.garmin.com/wellness-api/rest';
const GARMIN_CONNECT_BASE = 'https://connect.garmin.com/modern/proxy';

export interface GarminActivity {
  activityId: number;
  activityName: string;
  activityType: {
    typeKey: string;
    typeId: number;
  };
  startTimeGMT: string;
  startTimeLocal: string;
  duration: number; // seconds
  distance: number; // meters
  elevationGain: number; // meters
  elevationLoss: number; // meters
  avgSpeed: number; // m/s
  maxSpeed: number; // m/s
  avgHR: number; // bpm
  maxHR: number; // bpm
  calories: number;
  averagePower?: number; // watts
  normalizedPower?: number; // watts
  trainingStressScore?: number;
  deviceName: string;
}

export interface GarminActivitiesResponse {
  activities: GarminActivity[];
  total: number;
}

/**
 * Fetch activities from Garmin Connect API
 */
export async function fetchGarminActivities(
  userId: string,
  options: {
    limit?: number;
    start?: number;
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<GarminActivitiesResponse> {
  const tokens = await getGarminTokens(userId);

  if (!tokens) {
    throw new Error('No valid Garmin tokens found. Please reconnect your Garmin account.');
  }

  const { limit = 20, start = 0 } = options;

  // Garmin Connect uses different API endpoints
  // Activities list endpoint
  const url = `${GARMIN_CONNECT_BASE}/activitylist-service/activities/search/activities`;

  const params = new URLSearchParams({
    start: start.toString(),
    limit: limit.toString()
  });

  const response = await fetch(`${url}?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `${tokens.token_type} ${tokens.access_token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch Garmin activities: ${response.status} ${error}`);
  }

  const data = await response.json();

  return {
    activities: data || [],
    total: data.length || 0
  };
}

/**
 * Fetch a single activity with full details
 */
export async function fetchGarminActivityDetails(
  userId: string,
  activityId: number
): Promise<GarminActivity> {
  const tokens = await getGarminTokens(userId);

  if (!tokens) {
    throw new Error('No valid Garmin tokens found');
  }

  const url = `${GARMIN_CONNECT_BASE}/activity-service/activity/${activityId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `${tokens.token_type} ${tokens.access_token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch activity details: ${response.status}`);
  }

  return await response.json();
}

/**
 * Transform Garmin activity to our database schema
 */
export function transformGarminActivity(activity: any): {
  garmin_activity_id: number;
  date: string;
  activity_type: string;
  duration: number;
  distance: number | null;
  elevation_gain: number | null;
  avg_heart_rate: number | null;
  max_heart_rate: number | null;
  calories: number | null;
  avg_speed: number | null;
  max_speed: number | null;
  training_stress_score: number | null;
  normalized_power: number | null;
  activity_name: string;
  description: string | null;
  start_time: string;
  end_time: string;
} {
  const startTime = new Date(activity.startTimeGMT || activity.startTimeLocal);
  const endTime = new Date(startTime.getTime() + (activity.duration || 0) * 1000);

  return {
    garmin_activity_id: activity.activityId,
    date: startTime.toISOString().split('T')[0],
    activity_type: activity.activityType?.typeKey || activity.activityType || 'unknown',
    duration: activity.duration || 0,
    distance: activity.distance || null,
    elevation_gain: activity.elevationGain || activity.totalAscent || null,
    avg_heart_rate: activity.avgHR || activity.averageHR || null,
    max_heart_rate: activity.maxHR || activity.maxHR || null,
    calories: activity.calories || null,
    avg_speed: activity.avgSpeed || activity.averageSpeed || null,
    max_speed: activity.maxSpeed || null,
    training_stress_score: activity.trainingStressScore || activity.tss || null,
    normalized_power: activity.normalizedPower || null,
    activity_name: activity.activityName || 'Untitled Activity',
    description: activity.description || null,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString()
  };
}
