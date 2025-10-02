import { test, expect } from '@playwright/test';

/**
 * PHASE 2: Garmin API Integration Testing
 *
 * Tests the complete Garmin Connect API integration including OAuth flow,
 * workout push API, and activity pull synchronization.
 *
 * Quality Gate Requirements:
 * - OAuth flow works end-to-end with proper error handling
 * - Workout push API handles all exercise types (strength, cardio, technical)
 * - Activity pull API matches workouts correctly and calculates compliance
 * - Error handling for API failures and rate limiting
 * - Security: Tokens encrypted, refreshed, and stored securely
 * - Rate limiting compliance with Garmin API guidelines
 */

test.describe('Phase 2: Garmin API Integration', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/training/realtime');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Garmin OAuth Authentication Flow', () => {

    test('completes OAuth flow successfully', async ({ page, context }) => {
      // Initial state - not connected
      await expect(page.locator('[data-testid="garmin-status"]')).toContainText('Not Connected');
      await expect(page.locator('[data-testid="connect-garmin-button"]')).toBeVisible();

      // Mock Garmin OAuth server responses
      await setupGarminOAuthMocks(context);

      // Click connect to Garmin
      await page.click('[data-testid="connect-garmin-button"]');

      // Verify OAuth redirect
      await expect(page).toHaveURL(/garmin\.com\/oauth/);

      // Simulate successful OAuth authorization
      await simulateGarminOAuthSuccess(page);

      // Verify successful connection
      await expect(page.locator('[data-testid="garmin-status"]')).toContainText('Connected');
      await expect(page.locator('[data-testid="connection-indicator"]')).toHaveClass(/connected/);
      await expect(page.locator('[data-testid="last-sync-time"]')).toBeVisible();
    });

    test('handles OAuth rejection gracefully', async ({ page, context }) => {
      await setupGarminOAuthMocks(context, 'rejection');

      await page.click('[data-testid="connect-garmin-button"]');

      // Simulate OAuth rejection
      await simulateGarminOAuthRejection(page);

      // Verify error handling
      await expect(page.locator('[data-testid="auth-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="auth-error-message"]')).toContainText('Authorization denied');
      await expect(page.locator('[data-testid="retry-auth-button"]')).toBeVisible();
    });

    test('handles OAuth timeout', async ({ page, context }) => {
      await setupGarminOAuthMocks(context, 'timeout');

      await page.click('[data-testid="connect-garmin-button"]');

      // Wait for timeout
      await page.waitForTimeout(30000);

      // Verify timeout handling
      await expect(page.locator('[data-testid="auth-timeout"]')).toBeVisible();
      await expect(page.locator('[data-testid="timeout-message"]')).toContainText('Authorization timed out');
    });

    test('refreshes expired tokens automatically', async ({ page }) => {
      // Setup with expired token
      await setupExpiredGarminToken(page);

      // Navigate to page (should trigger token refresh)
      await page.reload();

      // Wait for automatic token refresh
      await expect(page.locator('[data-testid="token-refreshing"]')).toBeVisible();
      await expect(page.locator('[data-testid="garmin-status"]')).toContainText('Connected');

      // Verify new token is stored
      const tokenStatus = await page.evaluate(() => {
        return localStorage.getItem('garmin_token_status');
      });
      expect(tokenStatus).toBe('valid');
    });

    test('handles token refresh failures', async ({ page }) => {
      await setupFailedTokenRefresh(page);

      await page.reload();

      // Should prompt for re-authentication
      await expect(page.locator('[data-testid="reauth-required"]')).toBeVisible();
      await expect(page.locator('[data-testid="reconnect-garmin-button"]')).toBeVisible();
    });
  });

  test.describe('Workout Push API', () => {

    test.beforeEach(async ({ page }) => {
      // Setup authenticated state
      await setupAuthenticatedGarminState(page);
    });

    test('pushes strength workout with sets and reps', async ({ page }) => {
      // Upload strength workout plan
      const strengthWorkout = createMockStrengthWorkout();
      await uploadWorkoutPlan(page, strengthWorkout);

      // Mock Garmin push API response
      await mockGarminPushAPI(page, 'strength');

      // Trigger sync to Garmin
      await page.click('[data-testid="sync-to-garmin-button"]');

      // Verify sync progress
      await expect(page.locator('[data-testid="sync-progress"]')).toBeVisible();
      await expect(page.locator('[data-testid="sync-status"]')).toContainText('Pushing workouts...');

      // Wait for completion
      await expect(page.locator('[data-testid="sync-success"]')).toBeVisible();

      // Verify workout is marked as synced
      await expect(page.locator('[data-testid="workout-sync-status"]')).toContainText('Synced');
      await expect(page.locator('[data-testid="garmin-workout-id"]')).toBeVisible();
    });

    test('pushes cardio workout with duration and intensity', async ({ page }) => {
      const cardioWorkout = createMockCardioWorkout();
      await uploadWorkoutPlan(page, cardioWorkout);

      await mockGarminPushAPI(page, 'cardio');

      await page.click('[data-testid="sync-to-garmin-button"]');

      await expect(page.locator('[data-testid="sync-success"]')).toBeVisible();

      // Verify cardio-specific data was sent
      const pushedData = await page.evaluate(() => window.lastGarminPushData);
      expect(pushedData.sport).toBe('HIKING');
      expect(pushedData.estimatedDuration).toBe(7200); // 2 hours in seconds
    });

    test('handles batch workout upload for weekly plan', async ({ page }) => {
      const weeklyPlan = createMockWeeklyPlan(7); // 7 workouts
      await uploadWorkoutPlan(page, weeklyPlan);

      await mockGarminPushAPI(page, 'batch');

      await page.click('[data-testid="sync-weekly-plan"]');

      // Verify batch progress
      await expect(page.locator('[data-testid="batch-progress"]')).toBeVisible();
      await expect(page.locator('[data-testid="sync-count"]')).toContainText('7 workouts');

      await expect(page.locator('[data-testid="batch-sync-success"]')).toBeVisible();

      // Verify all workouts are synced
      const syncedWorkouts = await page.locator('[data-testid="synced-workout"]').count();
      expect(syncedWorkouts).toBe(7);
    });

    test('handles Garmin API rate limiting', async ({ page }) => {
      await uploadWorkoutPlan(page, createMockWorkout());

      // Mock rate limit response
      await mockGarminRateLimitResponse(page);

      await page.click('[data-testid="sync-to-garmin-button"]');

      // Verify rate limit handling
      await expect(page.locator('[data-testid="rate-limit-warning"]')).toBeVisible();
      await expect(page.locator('[data-testid="retry-countdown"]')).toBeVisible();

      // Wait for retry
      await page.waitForTimeout(60000); // 1 minute

      // Should retry automatically
      await expect(page.locator('[data-testid="auto-retry-started"]')).toBeVisible();
    });

    test('handles Garmin API failures gracefully', async ({ page }) => {
      await uploadWorkoutPlan(page, createMockWorkout());

      // Mock API failure
      await mockGarminAPIFailure(page);

      await page.click('[data-testid="sync-to-garmin-button"]');

      // Verify error handling
      await expect(page.locator('[data-testid="sync-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-details"]')).toContainText('Garmin API unavailable');
      await expect(page.locator('[data-testid="manual-retry-button"]')).toBeVisible();

      // Test manual retry
      await mockGarminPushAPI(page, 'success'); // Fix the API
      await page.click('[data-testid="manual-retry-button"]');

      await expect(page.locator('[data-testid="sync-success"]')).toBeVisible();
    });

    test('validates workout data before sending to Garmin', async ({ page }) => {
      // Upload invalid workout data
      const invalidWorkout = createInvalidWorkout();
      await uploadWorkoutPlan(page, invalidWorkout);

      await page.click('[data-testid="sync-to-garmin-button"]');

      // Verify validation errors
      await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="validation-details"]')).toContainText('Invalid duration');
      await expect(page.locator('[data-testid="fix-errors-button"]')).toBeVisible();
    });
  });

  test.describe('Activity Pull API & Sync', () => {

    test.beforeEach(async ({ page }) => {
      await setupAuthenticatedGarminState(page);
      await setupPlannedWorkouts(page);
    });

    test('pulls completed activities and matches to planned workouts', async ({ page }) => {
      // Mock completed activity from Garmin
      await mockGarminActivityData(page, {
        id: 'garmin-activity-123',
        workoutId: 'planned-workout-456',
        duration: 3540, // 59 minutes
        heartRate: { avg: 145, max: 180 },
        calories: 580,
        completedAt: '2025-09-23T07:30:00Z'
      });

      // Trigger activity sync
      await page.click('[data-testid="sync-activities-button"]');

      // Verify sync progress
      await expect(page.locator('[data-testid="activity-sync-progress"]')).toBeVisible();

      await expect(page.locator('[data-testid="activity-sync-success"]')).toBeVisible();

      // Verify activity matching
      await expect(page.locator('[data-testid="matched-activity"]')).toBeVisible();
      await expect(page.locator('[data-testid="activity-duration"]')).toContainText('59 min');
      await expect(page.locator('[data-testid="activity-heart-rate"]')).toContainText('145 bpm avg');
    });

    test('calculates compliance scores accurately', async ({ page }) => {
      await mockGarminActivityData(page, {
        plannedDuration: 60, // 60 minutes planned
        actualDuration: 58,   // 58 minutes actual
        plannedIntensity: 'medium',
        actualHeartRate: 145,
        exercisesPlanned: 3,
        exercisesCompleted: 3
      });

      await page.click('[data-testid="sync-activities-button"]');

      await expect(page.locator('[data-testid="activity-sync-success"]')).toBeVisible();

      // Verify compliance calculations
      await expect(page.locator('[data-testid="duration-compliance"]')).toContainText('97%'); // 58/60 * 100
      await expect(page.locator('[data-testid="completion-compliance"]')).toContainText('100%'); // 3/3 exercises
      await expect(page.locator('[data-testid="overall-compliance"]')).toContainText('98%'); // Average
    });

    test('handles unmatched activities', async ({ page }) => {
      // Mock activity that doesn't match any planned workout
      await mockGarminActivityData(page, {
        id: 'garmin-activity-999',
        workoutId: null, // No matching planned workout
        name: 'Spontaneous Hike',
        duration: 7200
      });

      await page.click('[data-testid="sync-activities-button"]');

      await expect(page.locator('[data-testid="activity-sync-success"]')).toBeVisible();

      // Verify unmatched activity handling
      await expect(page.locator('[data-testid="unmatched-activity"]')).toBeVisible();
      await expect(page.locator('[data-testid="activity-name"]')).toContainText('Spontaneous Hike');
      await expect(page.locator('[data-testid="add-to-plan-button"]')).toBeVisible();
    });

    test('syncs activities automatically on schedule', async ({ page }) => {
      // Enable auto-sync
      await page.click('[data-testid="auto-sync-toggle"]');
      await expect(page.locator('[data-testid="auto-sync-enabled"]')).toBeVisible();

      // Mock periodic sync
      await mockPeriodicActivitySync(page);

      // Wait for automatic sync to trigger
      await page.waitForTimeout(60000); // 1 minute

      // Verify automatic sync occurred
      await expect(page.locator('[data-testid="last-auto-sync"]')).toBeVisible();
      await expect(page.locator('[data-testid="auto-sync-status"]')).toContainText('Last sync: 1 minute ago');
    });

    test('handles activity sync failures gracefully', async ({ page }) => {
      // Mock Garmin activity API failure
      await mockGarminActivityAPIFailure(page);

      await page.click('[data-testid="sync-activities-button"]');

      // Verify error handling
      await expect(page.locator('[data-testid="activity-sync-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="sync-error-message"]')).toContainText('Failed to fetch activities');
      await expect(page.locator('[data-testid="retry-sync-button"]')).toBeVisible();
    });
  });

  test.describe('Sync Status & Management', () => {

    test('displays real-time sync status', async ({ page }) => {
      await setupAuthenticatedGarminState(page);

      // Verify status indicators
      await expect(page.locator('[data-testid="garmin-connection-status"]')).toContainText('Connected');
      await expect(page.locator('[data-testid="connection-indicator"]')).toHaveClass(/online/);

      // Test connection health check
      await page.click('[data-testid="test-connection-button"]');

      await expect(page.locator('[data-testid="connection-test-success"]')).toBeVisible();
      await expect(page.locator('[data-testid="api-response-time"]')).toBeVisible();
    });

    test('manages sync settings and preferences', async ({ page }) => {
      await setupAuthenticatedGarminState(page);

      // Open sync settings
      await page.click('[data-testid="sync-settings-button"]');

      // Verify settings panel
      await expect(page.locator('[data-testid="sync-settings-panel"]')).toBeVisible();

      // Test auto-sync toggle
      await page.click('[data-testid="auto-sync-toggle"]');
      await expect(page.locator('[data-testid="auto-sync-frequency"]')).toBeVisible();

      // Set sync frequency
      await page.selectOption('[data-testid="sync-frequency-select"]', '30min');
      await page.click('[data-testid="save-settings-button"]');

      await expect(page.locator('[data-testid="settings-saved"]')).toBeVisible();

      // Verify settings are persisted
      await page.reload();
      await page.click('[data-testid="sync-settings-button"]');

      const frequency = await page.locator('[data-testid="sync-frequency-select"]').inputValue();
      expect(frequency).toBe('30min');
    });

    test('handles disconnection and reconnection', async ({ page }) => {
      await setupAuthenticatedGarminState(page);

      // Test disconnect
      await page.click('[data-testid="disconnect-garmin-button"]');

      await expect(page.locator('[data-testid="disconnect-confirmation"]')).toBeVisible();
      await page.click('[data-testid="confirm-disconnect"]');

      // Verify disconnected state
      await expect(page.locator('[data-testid="garmin-status"]')).toContainText('Not Connected');
      await expect(page.locator('[data-testid="connect-garmin-button"]')).toBeVisible();

      // Test reconnection
      await setupGarminOAuthMocks(page.context());
      await page.click('[data-testid="connect-garmin-button"]');

      await simulateGarminOAuthSuccess(page);

      await expect(page.locator('[data-testid="garmin-status"]')).toContainText('Connected');
    });
  });

  test.describe('Security & Data Protection', () => {

    test('stores tokens securely', async ({ page }) => {
      await setupAuthenticatedGarminState(page);

      // Verify tokens are not accessible in localStorage
      const tokenInStorage = await page.evaluate(() => {
        return localStorage.getItem('garmin_access_token');
      });
      expect(tokenInStorage).toBeNull();

      // Verify encrypted token storage
      const encryptedData = await page.evaluate(() => {
        return localStorage.getItem('garmin_auth_encrypted');
      });
      expect(encryptedData).toBeTruthy();
      expect(encryptedData).not.toContain('access_token');
    });

    test('handles token expiration securely', async ({ page }) => {
      await setupAuthenticatedGarminState(page);

      // Simulate token expiration
      await simulateTokenExpiration(page);

      // Should automatically attempt refresh
      await expect(page.locator('[data-testid="token-refreshing"]')).toBeVisible();

      // If refresh fails, should clear all token data
      await mockTokenRefreshFailure(page);

      const authData = await page.evaluate(() => {
        return localStorage.getItem('garmin_auth_encrypted');
      });
      expect(authData).toBeNull();
    });

    test('validates API responses for security', async ({ page }) => {
      await setupAuthenticatedGarminState(page);

      // Mock malicious API response
      await mockMaliciousGarminResponse(page);

      await page.click('[data-testid="sync-activities-button"]');

      // Should reject malicious data
      await expect(page.locator('[data-testid="security-warning"]')).toBeVisible();
      await expect(page.locator('[data-testid="response-rejected"]')).toContainText('Invalid API response');
    });
  });
});

// Helper functions for Garmin API testing

async function setupGarminOAuthMocks(context: any, scenario: string = 'success') {
  // Mock OAuth endpoints
  await context.route('**/oauth/authorize', async (route: any) => {
    if (scenario === 'success') {
      await route.fulfill({
        status: 302,
        headers: {
          'Location': 'http://localhost:3000/api/garmin-auth/callback?code=mock-auth-code'
        }
      });
    } else if (scenario === 'rejection') {
      await route.fulfill({
        status: 302,
        headers: {
          'Location': 'http://localhost:3000/api/garmin-auth/callback?error=access_denied'
        }
      });
    }
    // timeout scenario handled by not responding
  });

  await context.route('**/api/garmin-auth/callback', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000
      })
    });
  });
}

async function simulateGarminOAuthSuccess(page: any) {
  await page.goto('http://localhost:3000/api/garmin-auth/callback?code=mock-auth-code');
  await page.goto('/training/realtime');
}

async function simulateGarminOAuthRejection(page: any) {
  await page.goto('http://localhost:3000/api/garmin-auth/callback?error=access_denied');
  await page.goto('/training/realtime');
}

async function setupAuthenticatedGarminState(page: any) {
  await page.evaluate(() => {
    localStorage.setItem('garmin_auth_encrypted', 'mock-encrypted-token-data');
    localStorage.setItem('garmin_token_status', 'valid');
  });
  await page.reload();
}

async function setupExpiredGarminToken(page: any) {
  await page.evaluate(() => {
    localStorage.setItem('garmin_auth_encrypted', 'mock-expired-token-data');
    localStorage.setItem('garmin_token_status', 'expired');
  });
}

async function mockGarminPushAPI(page: any, workoutType: string) {
  await page.route('/api/training/garmin-push', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        garminWorkoutId: `garmin-workout-${Date.now()}`,
        status: 'synced',
        workoutType
      })
    });
  });
}

async function mockGarminActivityData(page: any, activityData: any) {
  await page.route('/api/training/garmin-sync', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        activities: [activityData],
        matched: 1,
        unmatched: 0
      })
    });
  });
}

function createMockStrengthWorkout() {
  return {
    title: 'BB Bench Press Session',
    type: 'strength',
    duration: 60,
    exercises: [
      { name: 'BB Bench Press', sets: 2, reps: 8, rpe: '6-7' },
      { name: 'DB Bench Press', sets: 1, reps: 6, rpe: '8-9' }
    ]
  };
}

function createMockCardioWorkout() {
  return {
    title: 'Morning Hike',
    type: 'cardio',
    duration: 120,
    intensity: 'medium',
    location: 'Mount Tamalpais'
  };
}

function createMockWeeklyPlan(workoutCount: number) {
  return Array.from({ length: workoutCount }, (_, i) => ({
    id: `workout-${i}`,
    title: `Workout ${i + 1}`,
    type: i % 3 === 0 ? 'strength' : 'cardio',
    duration: 60,
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString()
  }));
}

function createInvalidWorkout() {
  return {
    title: '',
    type: 'invalid',
    duration: -1,
    exercises: []
  };
}

async function uploadWorkoutPlan(page: any, workout: any) {
  await page.route('/api/training/upload', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        plans: Array.isArray(workout) ? workout : [workout]
      })
    });
  });

  // Simulate file upload
  await page.evaluate((data) => {
    window.dispatchEvent(new CustomEvent('workoutPlanUploaded', { detail: data }));
  }, workout);
}