
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { IntervalsService } from '../../lib/services/intervals';

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe('IntervalsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.INTERVALS_ICU_API_KEY = 'test-key';
    process.env.INTERVALS_ICU_ATHLETE_ID = 'test-athlete';
  });

  describe('getWellness', () => {
    it('should fetch wellness data successfully', async () => {
      const mockData = [{ id: '1', date: '2025-01-01', restingHR: 50 }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

      const result = await IntervalsService.getWellness('2025-01-01', '2025-01-01');

      expect(result).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/wellness?oldest=2025-01-01&newest=2025-01-01'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: expect.stringContaining('Basic'),
          }),
        })
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      } as unknown as Response);

      const result = await IntervalsService.getWellness();
      expect(result).toEqual([]);
    });
  });

  describe('getActivities', () => {
    it('should fetch activities successfully', async () => {
      const mockActivities = [{ id: '1', name: 'Run', type: 'Run' }];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockActivities,
      } as unknown as Response);

      const result = await IntervalsService.getActivities();
      expect(result).toEqual(mockActivities);
    });
  });
});
