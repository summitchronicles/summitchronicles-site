import { format } from 'date-fns';
import { IntervalsActivity, IntervalsWellness } from '@/types/intervals';

const API_KEY = process.env.INTERVALS_ICU_API_KEY;
const ATHLETE_ID = process.env.INTERVALS_ICU_ATHLETE_ID;
const BASE_URL = 'https://intervals.icu/api/v1';

if (!API_KEY || !ATHLETE_ID) {
  console.warn('Intervals.icu API key or Athlete ID missing!');
}

// Basic Auth Header: base64("API_KEY_VALUE:")
// Intervals.icu uses the API key itself as the username, with empty password
const getHeaders = () => {
  if (!API_KEY) {
    throw new Error('INTERVALS_ICU_API_KEY is not configured');
  }
  // Correct format: base64(api_key_value:)
  const authString = Buffer.from(`${API_KEY}:`).toString('base64');
  return {
    Authorization: `Basic ${authString}`,
    'Content-Type': 'application/json',
  };
};

export class IntervalsService {
  /**
   * Fetch wellness data for a date range (defaults to today/yesterday)
   */
  static async getWellness(
    startDate?: string,
    endDate?: string
  ): Promise<IntervalsWellness[]> {
    try {
      // Default to last 7 days if not specified
      const end = endDate || format(new Date(), 'yyyy-MM-dd');
      const start =
        startDate ||
        format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

      const url = `${BASE_URL}/athlete/${ATHLETE_ID}/wellness?oldest=${start}&newest=${end}`;
      console.log('Fetching Intervals Wellness:', url);

      const response = await fetch(url, {
        headers: getHeaders(),
        next: { revalidate: 60 }, // Cache for 60s
      });

      if (!response.ok) {
        console.error(
          'Intervals API Error:',
          response.status,
          response.statusText
        );
        throw new Error(`Intervals API Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(
        'Intervals Wellness Data (first item):',
        data[0] ? JSON.stringify(data[0]) : 'Empty Array'
      );
      return data;
    } catch (error) {
      console.error('Error fetching wellness:', error);
      return [];
    }
  }

  /**
   * Fetch recent activities
   */
  static async getActivities(limit = 10): Promise<IntervalsActivity[]> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const monthAgo = format(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        'yyyy-MM-dd'
      );

      const url = `${BASE_URL}/athlete/${ATHLETE_ID}/activities?oldest=${monthAgo}&newest=${today}`;
      console.log('Fetching Intervals Activities:', url);

      const response = await fetch(url, {
        headers: getHeaders(),
        next: { revalidate: 300 }, // Cache for 5 mins
      });

      if (!response.ok) {
        throw new Error(`Intervals API Error: ${response.statusText}`);
      }

      const activities: IntervalsActivity[] = await response.json();

      // Sort specific logic if needed, API returns chronologically usually
      return activities.reverse().slice(0, limit);
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  /**
   * Get the most recent valid metric from a list of wellness days
   */
  static getLatestMetric(
    wellnessData: IntervalsWellness[],
    key: keyof IntervalsWellness
  ): number | null {
    // Sort desc by date just in case
    const sorted = [...wellnessData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (const day of sorted) {
      if (day[key] !== undefined && day[key] !== null) {
        return day[key] as number;
      }
    }
    return null;
  }
}
