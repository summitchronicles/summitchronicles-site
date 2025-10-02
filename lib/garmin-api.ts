import axios, { AxiosInstance, AxiosError } from 'axios';

// Garmin Connect API configuration
const GARMIN_CONNECT_BASE_URL = 'https://connect.garmin.com';
const GARMIN_OAUTH_BASE_URL = 'https://connect.garmin.com/oauthConfirm';

export interface GarminTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

export interface GarminActivity {
  activityId: number;
  activityName: string;
  description?: string;
  startTimeGMT: string;
  distance?: number;
  duration?: number;
  movingDuration?: number;
  elevationGain?: number;
  elevationLoss?: number;
  averageHR?: number;
  maxHR?: number;
  calories?: number;
  averageSpeed?: number;
  maxSpeed?: number;
  activityType: {
    typeId: number;
    typeKey: string;
    parentTypeId?: number;
  };
  eventType: {
    typeId: number;
    typeKey: string;
  };
}

export interface GarminWorkout {
  workoutId?: number;
  workoutName: string;
  description?: string;
  sport: {
    sportTypeId: number;
    sportTypeKey: string;
  };
  estimatedDurationInSecs?: number;
  estimatedDistanceInMeters?: number;
  workoutSegments?: GarminWorkoutSegment[];
}

export interface GarminWorkoutSegment {
  segmentOrder: number;
  sportType: {
    sportTypeId: number;
    sportTypeKey: string;
  };
  workoutSteps: GarminWorkoutStep[];
}

export interface GarminWorkoutStep {
  stepId?: number;
  stepOrder: number;
  stepType: {
    stepTypeId: number;
    stepTypeKey: string; // 'interval', 'rest', 'warmup', 'cooldown', 'recovery'
  };
  endCondition: {
    conditionTypeId: number;
    conditionTypeKey: string; // 'time', 'distance', 'repetition'
  };
  endConditionValue?: number;
  targetType?: {
    workoutTargetTypeId: number;
    workoutTargetTypeKey: string; // 'power', 'heart.rate', 'pace', 'cadence'
  };
  targetValue?: {
    min?: number;
    max?: number;
    value?: number;
  };
  description?: string;
}

export interface GarminError {
  code: string;
  message: string;
  details?: any;
}

class GarminAPIClient {
  private client: AxiosInstance;
  private tokens: GarminTokens | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: GARMIN_CONNECT_BASE_URL,
      timeout: 30000,
      headers: {
        'User-Agent': 'Summit Chronicles Training App/1.0',
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      if (this.tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${this.tokens.accessToken}`;
      }
      return config;
    });

    // Add response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401 && this.tokens?.refreshToken) {
          try {
            await this.refreshTokens();
            // Retry the original request
            if (error.config) {
              error.config.headers.Authorization = `Bearer ${this.tokens?.accessToken}`;
              return this.client.request(error.config);
            }
          } catch (refreshError) {
            // Token refresh failed, user needs to re-authenticate
            this.tokens = null;
            throw new Error('Authentication expired. Please reconnect to Garmin.');
          }
        }
        throw error;
      }
    );
  }

  // OAuth Authentication Methods
  getAuthorizationUrl(clientId: string, redirectUri: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: 'ACTIVITY_WRITE,WORKOUT_WRITE,WELLNESS_READ',
      state: state || Math.random().toString(36).substring(7),
    });

    return `${GARMIN_OAUTH_BASE_URL}?${params.toString()}`;
  }

  async exchangeCodeForTokens(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<GarminTokens> {
    try {
      const response = await axios.post(
        'https://connect.garmin.com/oauthConfirm',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const tokens: GarminTokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: Date.now() + (response.data.expires_in * 1000),
        tokenType: 'Bearer',
      };

      this.tokens = tokens;
      return tokens;
    } catch (error) {
      console.error('Garmin token exchange error:', error);
      throw new Error('Failed to exchange authorization code for tokens');
    }
  }

  async refreshTokens(): Promise<GarminTokens> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post(
        'https://connect.garmin.com/oauthConfirm',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.tokens.refreshToken,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const newTokens: GarminTokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token || this.tokens.refreshToken,
        expiresAt: Date.now() + (response.data.expires_in * 1000),
        tokenType: 'Bearer',
      };

      this.tokens = newTokens;
      return newTokens;
    } catch (error) {
      console.error('Garmin token refresh error:', error);
      throw new Error('Failed to refresh tokens');
    }
  }

  setTokens(tokens: GarminTokens): void {
    this.tokens = tokens;
  }

  getTokens(): GarminTokens | null {
    return this.tokens;
  }

  isAuthenticated(): boolean {
    return !!(this.tokens?.accessToken && this.tokens.expiresAt > Date.now());
  }

  // Workout Management Methods
  async createWorkout(workout: GarminWorkout): Promise<{ workoutId: number }> {
    try {
      const response = await this.client.post('/modern/proxy/workout-service/workout', workout);
      return { workoutId: response.data.workoutId };
    } catch (error) {
      console.error('Create workout error:', error);
      throw this.handleApiError(error as AxiosError, 'Failed to create workout');
    }
  }

  async updateWorkout(workoutId: number, workout: Partial<GarminWorkout>): Promise<void> {
    try {
      await this.client.put(`/modern/proxy/workout-service/workout/${workoutId}`, workout);
    } catch (error) {
      console.error('Update workout error:', error);
      throw this.handleApiError(error as AxiosError, 'Failed to update workout');
    }
  }

  async deleteWorkout(workoutId: number): Promise<void> {
    try {
      await this.client.delete(`/modern/proxy/workout-service/workout/${workoutId}`);
    } catch (error) {
      console.error('Delete workout error:', error);
      throw this.handleApiError(error as AxiosError, 'Failed to delete workout');
    }
  }

  async getWorkouts(limit: number = 100): Promise<GarminWorkout[]> {
    try {
      const response = await this.client.get('/modern/proxy/workout-service/workouts', {
        params: { limit },
      });
      return response.data.workouts || [];
    } catch (error) {
      console.error('Get workouts error:', error);
      throw this.handleApiError(error as AxiosError, 'Failed to fetch workouts');
    }
  }

  // Activity Management Methods
  async getActivities(limit: number = 100, start: number = 0): Promise<GarminActivity[]> {
    try {
      const response = await this.client.get('/modern/proxy/activitylist-service/activities/search/activities', {
        params: { limit, start },
      });
      return response.data || [];
    } catch (error) {
      console.error('Get activities error:', error);
      throw this.handleApiError(error as AxiosError, 'Failed to fetch activities');
    }
  }

  async getActivity(activityId: number): Promise<GarminActivity> {
    try {
      const response = await this.client.get(`/modern/proxy/activity-service/activity/${activityId}`);
      return response.data;
    } catch (error) {
      console.error('Get activity error:', error);
      throw this.handleApiError(error as AxiosError, 'Failed to fetch activity');
    }
  }

  async getActivityDetails(activityId: number): Promise<any> {
    try {
      const response = await this.client.get(`/modern/proxy/activity-service/activity/${activityId}/details`);
      return response.data;
    } catch (error) {
      console.error('Get activity details error:', error);
      throw this.handleApiError(error as AxiosError, 'Failed to fetch activity details');
    }
  }

  // Calendar Integration Methods
  async scheduleWorkout(workoutId: number, scheduledDate: string): Promise<void> {
    try {
      await this.client.post('/modern/proxy/workout-service/schedule', {
        workoutId,
        date: scheduledDate, // Format: YYYY-MM-DD
      });
    } catch (error) {
      console.error('Schedule workout error:', error);
      throw this.handleApiError(error as AxiosError, 'Failed to schedule workout');
    }
  }

  async unscheduleWorkout(workoutId: number, scheduledDate: string): Promise<void> {
    try {
      await this.client.delete('/modern/proxy/workout-service/schedule', {
        data: { workoutId, date: scheduledDate },
      });
    } catch (error) {
      console.error('Unschedule workout error:', error);
      throw this.handleApiError(error as AxiosError, 'Failed to unschedule workout');
    }
  }

  // Utility Methods
  private handleApiError(error: AxiosError, defaultMessage: string): GarminError {
    const status = error.response?.status;
    const data = error.response?.data as any;

    let message = defaultMessage;
    let code = 'UNKNOWN_ERROR';

    if (status === 401) {
      message = 'Authentication required. Please reconnect to Garmin.';
      code = 'UNAUTHORIZED';
    } else if (status === 403) {
      message = 'Permission denied. Check your Garmin Connect permissions.';
      code = 'FORBIDDEN';
    } else if (status === 429) {
      message = 'Rate limit exceeded. Please try again later.';
      code = 'RATE_LIMITED';
    } else if (status === 500) {
      message = 'Garmin service temporarily unavailable.';
      code = 'SERVER_ERROR';
    } else if (data?.message) {
      message = data.message;
      code = data.code || 'API_ERROR';
    }

    return {
      code,
      message,
      details: data,
    };
  }

  // Convert training activities to Garmin workouts
  static convertToGarminWorkout(activity: any): GarminWorkout {
    const sportMapping: Record<string, { sportTypeId: number; sportTypeKey: string }> = {
      'cardio': { sportTypeId: 1, sportTypeKey: 'running' },
      'strength': { sportTypeId: 13, sportTypeKey: 'strength_training' },
      'technical': { sportTypeId: 15, sportTypeKey: 'rock_climbing' },
      'expedition': { sportTypeId: 16, sportTypeKey: 'mountaineering' },
    };

    const sport = sportMapping[activity.type] || { sportTypeId: 1, sportTypeKey: 'running' };

    const workout: GarminWorkout = {
      workoutName: activity.title,
      description: activity.notes,
      sport,
      estimatedDurationInSecs: activity.duration * 60,
    };

    // Add workout segments for strength training
    if (activity.type === 'strength' && activity.exercises?.length > 0) {
      workout.workoutSegments = [
        {
          segmentOrder: 1,
          sportType: sport,
          workoutSteps: activity.exercises.map((exercise: any, index: number) => ({
            stepOrder: index + 1,
            stepType: { stepTypeId: 6, stepTypeKey: 'interval' },
            endCondition: { conditionTypeId: 3, conditionTypeKey: 'repetition' },
            endConditionValue: exercise.sets,
            description: `${exercise.name}: ${exercise.sets} × ${exercise.reps} @ RPE ${exercise.rpe}`,
          })),
        },
      ];
    }

    return workout;
  }
}

export default GarminAPIClient;