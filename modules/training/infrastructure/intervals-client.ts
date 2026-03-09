import { format } from 'date-fns';
import { IntervalsActivity, IntervalsWellness } from '@/types/intervals';
import { requireIntervalsCredentials } from '@/shared/env/server';

const BASE_URL = 'https://intervals.icu/api/v1';

function getHeaders() {
  const env = requireIntervalsCredentials();
  const authString = Buffer.from(
    `API_KEY:${env.INTERVALS_ICU_API_KEY}`
  ).toString('base64');

  return {
    Authorization: `Basic ${authString}`,
    'Content-Type': 'application/json',
    athleteId: env.INTERVALS_ICU_ATHLETE_ID,
  };
}

function getAthletePathId(athleteId: string) {
  return athleteId.startsWith('i') ? '0' : athleteId;
}

export const intervalsClient = {
  async getWellness(
    startDate?: string,
    endDate?: string
  ): Promise<IntervalsWellness[]> {
    const end = endDate || format(new Date(), 'yyyy-MM-dd');
    const start =
      startDate ||
      format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
    const headers = getHeaders();
    const athletePathId = getAthletePathId(headers.athleteId);
    const url = `${BASE_URL}/athlete/${athletePathId}/wellness?oldest=${start}&newest=${end}`;

    const response = await fetch(url, {
      headers: {
        Authorization: headers.Authorization,
        'Content-Type': headers['Content-Type'],
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Intervals API Error: ${response.statusText}`);
    }

    return response.json();
  },

  async getActivities(limit = 10): Promise<IntervalsActivity[]> {
    const headers = getHeaders();
    const athletePathId = getAthletePathId(headers.athleteId);
    const today = format(new Date(), 'yyyy-MM-dd');
    const start = format(
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      'yyyy-MM-dd'
    );
    const url = `${BASE_URL}/athlete/${athletePathId}/activities?oldest=${start}&newest=${today}`;

    const response = await fetch(url, {
      headers: {
        Authorization: headers.Authorization,
        'Content-Type': headers['Content-Type'],
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Intervals API Error: ${response.statusText}`);
    }

    const activities: IntervalsActivity[] = await response.json();
    return activities.slice(0, limit);
  },
};
