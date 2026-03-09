import { IntervalsActivity, IntervalsWellness } from '@/types/intervals';
import { intervalsClient } from '@/modules/training/infrastructure/intervals-client';

export class IntervalsService {
  static async getWellness(
    startDate?: string,
    endDate?: string
  ): Promise<IntervalsWellness[]> {
    try {
      return await intervalsClient.getWellness(startDate, endDate);
    } catch (error) {
      console.error('Error fetching wellness:', error);
      return [];
    }
  }

  static async getActivities(limit = 10): Promise<IntervalsActivity[]> {
    try {
      return await intervalsClient.getActivities(limit);
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  static getLatestMetric(
    wellnessData: IntervalsWellness[],
    key: keyof IntervalsWellness
  ): number | null {
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
