import GarminAPIClient, { GarminTokens, GarminWorkout } from '../../lib/garmin-api';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GarminAPIClient', () => {
  let garminClient: GarminAPIClient;
  let mockAxiosInstance: any;

  beforeEach(() => {
    // Setup mock axios instance
    mockAxiosInstance = {
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      request: jest.fn(),
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    garminClient = new GarminAPIClient();
    jest.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should generate correct authorization URL', () => {
      const clientId = 'test-client-id';
      const redirectUri = 'http://localhost/callback';
      const url = garminClient.getAuthorizationUrl(clientId, redirectUri, 'test-state');

      expect(url).toContain('https://connect.garmin.com/oauthConfirm');
      expect(url).toContain(`client_id=${clientId}`);
      expect(url).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
      expect(url).toContain('state=test-state');
    });

    it('should exchange code for tokens', async () => {
      const mockTokens = {
        access_token: 'access-123',
        refresh_token: 'refresh-123',
        expires_in: 3600,
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockTokens });

      const tokens = await garminClient.exchangeCodeForTokens(
        'auth-code',
        'client-id',
        'client-secret',
        'redirect-uri'
      );

      expect(tokens.accessToken).toBe('access-123');
      expect(tokens.refreshToken).toBe('refresh-123');
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://connect.garmin.com/oauthConfirm',
        expect.any(URLSearchParams),
        expect.any(Object)
      );
    });
  });

  describe('Activities', () => {
    it('should fetch activities successfully', async () => {
      const mockActivities = [{ activityId: 1, activityName: 'Run' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockActivities });

      const activities = await garminClient.getActivities();

      expect(activities).toEqual(mockActivities);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        expect.stringContaining('/activities/search/activities'),
        expect.any(Object)
      );
    });

    it('should handle API errors', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Forbidden' }
        }
      };
      mockAxiosInstance.get.mockRejectedValueOnce(error);

      await expect(garminClient.getActivities()).rejects.toMatchObject({
        code: 'FORBIDDEN',
        message: 'Permission denied. Check your Garmin Connect permissions.'
      });
    });
  });

  describe('Workouts', () => {
    const mockWorkout: GarminWorkout = {
      workoutName: 'Test Workout',
      sport: { sportTypeId: 1, sportTypeKey: 'running' }
    };

    it('should create workout', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { workoutId: 100 } });

      const result = await garminClient.createWorkout(mockWorkout);

      expect(result).toEqual({ workoutId: 100 });
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/modern/proxy/workout-service/workout',
        mockWorkout
      );
    });
  });
});
