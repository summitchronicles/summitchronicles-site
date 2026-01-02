# Garmin Training Sync - Comprehensive Testing Plan & DevOps Integration

## 🎯 Testing Strategy Overview

**Philosophy**: Test-driven development with comprehensive coverage at every layer. Each feature must pass rigorous testing before advancing to the next implementation phase.

**Testing Pyramid**:
```
    🔺 E2E Tests (Playwright)
   🔸🔸 Integration Tests (API + UI)
  🔹🔹🔹 Unit Tests (Components + Utils)
 🔸🔸🔸🔸 Mock Tests (External APIs)
```

## 🏗️ Current Infrastructure Analysis

### ✅ Existing Testing Setup
- **Framework**: Playwright with TypeScript
- **CI/CD**: GitHub Actions with comprehensive pipeline
- **Scripts**: `npm test`, `npm run test:ui`, mobile testing variants
- **Configuration**: Multi-browser testing (Chrome, Safari, Mobile)
- **Reporting**: HTML reports with artifacts retention

### 🔧 Current DevOps Pipeline
```yaml
Quality Checks → E2E Tests → Performance → Security → Deploy
     ↓              ↓            ↓          ↓         ↓
  TypeCheck    Playwright   Lighthouse   CodeQL   Vercel
   ESLint        Mobile      Bundle      Snyk    Health
  Prettier       Tests      Analysis    Audit    Check
```

## 🚀 Feature-by-Feature Testing Protocol

### **PHASE 1: Enhanced Excel Upload & Calendar UI**

#### 1.1 Excel Parser Enhancement Testing
```typescript
// tests/unit/excel-parser.spec.ts
describe('Enhanced Excel Parser', () => {
  test('parses strength workouts with sets/reps/RPE', async () => {
    const mockExcel = createMockStrengthWorkout();
    const result = await parseExcelToWeeklyPlans(mockExcel);

    expect(result[0].activities[0]).toMatchObject({
      title: 'BB Bench Press',
      type: 'strength',
      exercises: [
        { name: 'BB Bench Press', sets: 2, reps: 8, rpe: '6-7' }
      ]
    });
  });

  test('handles mixed workout types in single week', async () => {
    // Test cardio + strength + rest combination
  });

  test('validates RPE ranges and formats', async () => {
    // Test RPE: '6-7', '8', 'moderate', etc.
  });
});
```

#### 1.2 Enhanced Calendar UI Testing
```typescript
// tests/e2e/training-calendar-enhanced.spec.ts
test.describe('Enhanced Training Calendar', () => {
  test('displays planned vs actual workout comparison', async ({ page }) => {
    await page.goto('/training/realtime');

    // Upload mock Excel file
    await uploadMockWorkoutPlan(page);

    // Verify planned workout display
    await expect(page.locator('[data-testid="planned-workout"]')).toContainText('2x8 @ RPE7');

    // Simulate completed workout
    await simulateWorkoutCompletion(page, '98%');

    // Verify actual vs planned comparison
    await expect(page.locator('[data-testid="compliance-score"]')).toContainText('98%');
    await expect(page.locator('[data-testid="status-indicator"]')).toHaveClass(/completed/);
  });

  test('handles Excel upload with validation errors', async ({ page }) => {
    await page.goto('/training/realtime');

    // Upload malformed Excel
    await uploadInvalidWorkoutPlan(page);

    // Verify error handling
    await expect(page.locator('[data-testid="upload-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid Excel format');
  });
});
```

#### 1.3 Visual Regression Testing
```typescript
// tests/visual/calendar-ui.spec.ts
test('training calendar visual consistency', async ({ page }) => {
  await page.goto('/training/realtime');
  await uploadMockWorkoutPlan(page);

  // Full page screenshot
  await expect(page).toHaveScreenshot('training-calendar-full.png');

  // Component-level screenshots
  await expect(page.locator('[data-testid="weekly-overview"]')).toHaveScreenshot('weekly-overview.png');
  await expect(page.locator('[data-testid="calendar-grid"]')).toHaveScreenshot('calendar-grid.png');
});
```

#### Phase 1 Exit Criteria ✅
- [ ] All Excel parsing unit tests pass (100% coverage)
- [ ] Enhanced calendar UI renders correctly across devices
- [ ] File upload handles errors gracefully
- [ ] Visual regression tests pass
- [ ] Performance: Calendar loads < 2 seconds
- [ ] Accessibility: WCAG 2.1 AA compliance

---

### **PHASE 2: Garmin API Integration**

#### 2.1 Garmin OAuth Flow Testing
```typescript
// tests/integration/garmin-auth.spec.ts
test.describe('Garmin Authentication', () => {
  test('complete OAuth flow', async ({ page, context }) => {
    await page.goto('/training/realtime');

    // Click connect to Garmin
    await page.click('[data-testid="connect-garmin"]');

    // Handle OAuth redirect (mock Garmin server)
    await mockGarminOAuthResponse(context);

    // Verify successful connection
    await expect(page.locator('[data-testid="garmin-status"]')).toContainText('Connected');
    await expect(page.locator('[data-testid="sync-indicator"]')).toHaveClass(/connected/);
  });

  test('handles OAuth rejection', async ({ page }) => {
    await page.goto('/training/realtime');
    await page.click('[data-testid="connect-garmin"]');

    // Mock OAuth rejection
    await mockGarminOAuthRejection();

    await expect(page.locator('[data-testid="auth-error"]')).toBeVisible();
  });

  test('token refresh mechanism', async ({ page }) => {
    await setupExpiredToken();
    await page.goto('/training/realtime');

    // Should automatically refresh token
    await expect(page.locator('[data-testid="garmin-status"]')).toContainText('Connected');
  });
});
```

#### 2.2 Workout Push API Testing
```typescript
// tests/integration/garmin-push.spec.ts
test.describe('Garmin Workout Push', () => {
  test('transforms and pushes strength workout', async ({ request }) => {
    const mockWorkout = createMockStrengthWorkout();

    const response = await request.post('/api/training/garmin-push', {
      data: mockWorkout
    });

    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result.garminWorkoutId).toBeDefined();
    expect(result.status).toBe('synced');
  });

  test('handles Garmin API failures gracefully', async ({ request }) => {
    await mockGarminAPIFailure();

    const response = await request.post('/api/training/garmin-push', {
      data: createMockWorkout()
    });

    expect(response.status()).toBe(500);
    const result = await response.json();
    expect(result.error).toContain('Garmin sync failed');
  });

  test('batch workout upload', async ({ request }) => {
    const weeklyPlan = createMockWeeklyPlan(7); // 7 workouts

    const response = await request.post('/api/training/garmin-push-batch', {
      data: weeklyPlan
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.syncedWorkouts).toHaveLength(7);
  });
});
```

#### 2.3 Activity Pull API Testing
```typescript
// tests/integration/garmin-pull.spec.ts
test.describe('Garmin Activity Sync', () => {
  test('pulls and matches completed activities', async ({ request }) => {
    // Setup: planned workout with garminWorkoutId
    await setupPlannedWorkout();

    // Mock completed activity from Garmin
    await mockGarminActivity({
      id: 'garmin-activity-123',
      workoutId: 'planned-workout-456',
      duration: 3600, // 1 hour
      heartRate: { avg: 145, max: 180 }
    });

    const response = await request.post('/api/training/garmin-sync');

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.matchedActivities).toHaveLength(1);
    expect(result.matchedActivities[0].compliance.durationMatch).toBeGreaterThan(90);
  });

  test('calculates compliance scores accurately', async ({ request }) => {
    await setupWorkoutWithTargets({
      plannedDuration: 60, // 60 minutes
      actualDuration: 58,   // 58 minutes
      plannedIntensity: 'medium',
      actualHeartRate: 145
    });

    const response = await request.post('/api/training/garmin-sync');
    const result = await response.json();

    expect(result.compliance.durationMatch).toBe(97); // 58/60 * 100
    expect(result.compliance.completed).toBe(true);
  });
});
```

#### Phase 2 Exit Criteria ✅
- [ ] OAuth flow works end-to-end
- [ ] Workout push API handles all exercise types
- [ ] Activity pull API matches workouts correctly
- [ ] Error handling for API failures
- [ ] Rate limiting compliance
- [ ] Security: Tokens encrypted and refreshed

---

### **PHASE 3: Compliance Analytics**

#### 3.1 Compliance Engine Testing
```typescript
// tests/unit/compliance-engine.spec.ts
describe('Compliance Engine', () => {
  test('calculates duration compliance accurately', () => {
    const result = calculateDurationCompliance(60, 58); // planned vs actual
    expect(result).toBe(97);
  });

  test('analyzes weekly patterns', () => {
    const workouts = createMockWeekOfWorkouts();
    const insights = analyzeWeeklyPatterns(workouts);

    expect(insights).toContain('Strong consistency on weekdays');
    expect(insights).toContain('Consider morning sessions');
  });

  test('identifies missed workout patterns', () => {
    const workoutsWithMissed = createWorkoutsWithPattern('rainy_days_skipped');
    const patterns = identifyMissedPatterns(workoutsWithMissed);

    expect(patterns.weatherImpact).toBe('high');
    expect(patterns.recommendation).toContain('indoor alternatives');
  });
});
```

#### 3.2 Analytics Dashboard Testing
```typescript
// tests/e2e/compliance-dashboard.spec.ts
test.describe('Compliance Dashboard', () => {
  test('displays weekly compliance metrics', async ({ page }) => {
    await setupMockWeeklyData();
    await page.goto('/training/realtime');

    // Verify compliance score
    await expect(page.locator('[data-testid="weekly-compliance"]')).toContainText('94.2%');

    // Verify breakdown
    await expect(page.locator('[data-testid="workout-completion"]')).toContainText('6/7');
    await expect(page.locator('[data-testid="duration-accuracy"]')).toContainText('96%');
    await expect(page.locator('[data-testid="intensity-accuracy"]')).toContainText('92%');
  });

  test('shows trend analysis over time', async ({ page }) => {
    await setupMockHistoricalData();
    await page.goto('/training/realtime');

    await page.click('[data-testid="trend-analysis"]');

    // Verify trend chart
    await expect(page.locator('[data-testid="compliance-chart"]')).toBeVisible();
    await expect(page.locator('[data-testid="trend-direction"]')).toContainText('improving');
  });

  test('generates actionable insights', async ({ page }) => {
    await setupMockDataWithPatterns();
    await page.goto('/training/realtime');

    // Check insights panel
    await expect(page.locator('[data-testid="insights-panel"]')).toContainText('Strong consistency');
    await expect(page.locator('[data-testid="recommendations"]')).toContainText('+5min warmup');
  });
});
```

#### Phase 3 Exit Criteria ✅
- [ ] Compliance calculations are mathematically accurate
- [ ] Dashboard displays real-time metrics correctly
- [ ] Pattern recognition identifies meaningful trends
- [ ] Insights are actionable and specific
- [ ] Performance: Analytics load < 1 second

---

### **PHASE 4: AI Integration & RAG Pipeline**

#### 4.1 AI Training Context Testing
```typescript
// tests/integration/ai-rag-pipeline.spec.ts
test.describe('AI Training Context', () => {
  test('builds comprehensive training context', async ({ request }) => {
    await setupRichTrainingHistory();

    const response = await request.post('/api/rag/training-context');
    const context = await response.json();

    expect(context.recentCompliance).toBeDefined();
    expect(context.workoutPatterns.preferredTimes).toContain('06:00-08:00');
    expect(context.physicalMetrics.heartRateZones).toBeDefined();
  });

  test('generates personalized insights', async ({ request }) => {
    await setupUserProfile('everest_preparation');

    const response = await request.post('/api/training/ai-insights', {
      data: createTrainingContext()
    });

    const insights = await response.json();
    expect(insights).toHaveLength(3);
    expect(insights[0]).toContain('altitude preparation');
  });

  test('integrates with Ollama model', async ({ request }) => {
    await mockOllamaResponse();

    const response = await request.post('/api/ai/generate-insights', {
      data: createTrainingPrompt()
    });

    expect(response.status()).toBe(200);
    const result = await response.json();
    expect(result.insights).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0.8);
  });
});
```

#### 4.2 End-to-End AI Workflow Testing
```typescript
// tests/e2e/ai-complete-workflow.spec.ts
test.describe('Complete AI Workflow', () => {
  test('Excel → Garmin → Compliance → AI Insights', async ({ page }) => {
    // Step 1: Upload Excel
    await page.goto('/training/realtime');
    await uploadMockWorkoutPlan(page);

    // Step 2: Verify Garmin sync
    await expect(page.locator('[data-testid="sync-status"]')).toContainText('Synced');

    // Step 3: Simulate workout completion
    await simulateWorkoutCompletion(page);

    // Step 4: Wait for compliance calculation
    await page.waitForSelector('[data-testid="compliance-score"]');

    // Step 5: Trigger AI analysis
    await page.click('[data-testid="generate-insights"]');

    // Step 6: Verify AI insights
    await expect(page.locator('[data-testid="ai-insights"]')).toBeVisible();
    await expect(page.locator('[data-testid="insight-1"]')).toContainText('training recommendation');
  });
});
```

#### Phase 4 Exit Criteria ✅
- [ ] RAG pipeline processes training data correctly
- [ ] AI generates relevant, personalized insights
- [ ] Ollama integration works reliably
- [ ] End-to-end workflow completes successfully
- [ ] Response times < 5 seconds for AI generation

---

## 🔧 DevOps Integration & CI/CD Enhancement

### Enhanced GitHub Actions Workflow

```yaml
# .github/workflows/garmin-sync-ci.yml
name: Garmin Sync Feature CI/CD

on:
  push:
    paths:
      - 'app/api/training/**'
      - 'app/components/training/**'
      - 'tests/training/**'
  pull_request:
    paths:
      - 'app/api/training/**'
      - 'app/components/training/**'

jobs:
  # Phase-specific testing
  phase-testing:
    strategy:
      matrix:
        phase: [excel-parsing, garmin-api, compliance, ai-integration]

    steps:
      - name: Run Phase-Specific Tests
        run: npm run test:phase:${{ matrix.phase }}

      - name: Upload Phase Results
        uses: actions/upload-artifact@v4
        with:
          name: phase-${{ matrix.phase }}-results
          path: test-results/phase-${{ matrix.phase }}/

  # Integration testing with mock Garmin API
  integration-testing:
    needs: phase-testing
    steps:
      - name: Setup Mock Garmin Server
        run: docker run -d garmin-mock-server

      - name: Run Integration Tests
        run: npm run test:integration:garmin
        env:
          GARMIN_API_URL: http://localhost:8080

  # Performance testing
  performance-testing:
    needs: integration-testing
    steps:
      - name: Load Test Training Upload
        run: |
          k6 run tests/performance/excel-upload-load.js
          k6 run tests/performance/garmin-sync-load.js

  # Security testing
  security-testing:
    steps:
      - name: API Security Scan
        run: |
          npm run test:security:api
          zap-baseline.py -t http://localhost:3000/api/training/
```

### Test Data Management

```typescript
// tests/fixtures/training-data.ts
export class TrainingDataFactory {
  static createStrengthWorkout(overrides = {}) {
    return {
      title: 'BB Bench Press Session',
      type: 'strength',
      exercises: [
        { name: 'BB Bench Press', sets: 2, reps: 8, rpe: '6-7' },
        { name: 'DB Bench Press', sets: 1, reps: 6, rpe: '8-9' }
      ],
      duration: 60,
      intensity: 'high',
      ...overrides
    };
  }

  static createWeeklyPlan(options = {}) {
    const { workoutCount = 7, phase = 'Base Building' } = options;
    return {
      weekNumber: 1,
      phase,
      activities: Array.from({ length: workoutCount }, (_, i) =>
        this.createMixedWorkout(i)
      )
    };
  }

  static createComplianceData(score = 94.2) {
    return {
      weeklyScore: score,
      workoutCompletion: 6/7 * 100,
      durationAccuracy: 96,
      intensityAccuracy: 92,
      patterns: {
        strongDays: ['Monday', 'Wednesday'],
        challengingTypes: ['strength'],
        preferredTimes: ['06:00-08:00']
      }
    };
  }
}
```

### Mock Services

```typescript
// tests/mocks/garmin-api-mock.ts
export class GarminAPIMock {
  static setupOAuthSuccess() {
    cy.intercept('POST', '/api/garmin-auth/callback', {
      statusCode: 200,
      body: {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: Date.now() + 3600000
      }
    });
  }

  static setupWorkoutPushSuccess() {
    cy.intercept('POST', '/api/training/garmin-push', {
      statusCode: 200,
      body: {
        garminWorkoutId: 'garmin-workout-123',
        status: 'synced',
        scheduledDate: '2025-09-23'
      }
    });
  }

  static setupActivityPullSuccess() {
    cy.intercept('GET', '/api/training/garmin-sync', {
      statusCode: 200,
      body: {
        activities: [
          {
            id: 'garmin-activity-456',
            workoutId: 'garmin-workout-123',
            duration: 3540, // 59 minutes
            heartRate: { avg: 145, max: 180 },
            completedAt: '2025-09-23T07:30:00Z'
          }
        ]
      }
    });
  }
}
```

## 📊 Testing Metrics & Coverage

### Coverage Requirements
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: All critical user journeys
- **Visual Tests**: All UI components

### Performance Benchmarks
- **Excel Upload**: < 2 seconds for 50MB file
- **Garmin Sync**: < 5 seconds for weekly plan
- **Compliance Calculation**: < 1 second
- **AI Insights**: < 5 seconds

### Quality Gates
```typescript
// Each phase must pass before proceeding:
const qualityGates = {
  phase1: {
    unitTests: '90%',
    e2eTests: 'all_passing',
    performance: 'calendar_load < 2s',
    accessibility: 'WCAG_2.1_AA'
  },
  phase2: {
    integrationTests: 'all_passing',
    security: 'oauth_secure',
    errorHandling: 'graceful_degradation',
    rateLimit: 'compliant'
  },
  phase3: {
    accuracy: 'compliance_math_correct',
    insights: 'actionable_specific',
    performance: 'analytics < 1s'
  },
  phase4: {
    aiAccuracy: 'insights_relevant',
    endToEnd: 'complete_workflow',
    performance: 'ai_response < 5s'
  }
};
```

## 🎯 Feature Testing Commands

### Development Workflow
```bash
# Phase 1: Excel & Calendar
npm run test:phase:excel     # Unit tests for Excel parsing
npm run test:phase:calendar  # E2E tests for calendar UI
npm run test:visual:calendar # Visual regression tests

# Phase 2: Garmin Integration
npm run test:phase:garmin-auth # OAuth flow testing
npm run test:phase:garmin-api  # API integration tests
npm run test:integration:mock  # Mock Garmin server tests

# Phase 3: Compliance Analytics
npm run test:phase:compliance  # Compliance engine tests
npm run test:phase:analytics   # Dashboard E2E tests
npm run test:performance:calc  # Performance benchmarks

# Phase 4: AI Integration
npm run test:phase:ai-rag     # RAG pipeline tests
npm run test:phase:ai-e2e     # Complete workflow tests
npm run test:integration:ai   # AI service integration

# Quality Gates
npm run test:quality-gate:phase1  # All Phase 1 requirements
npm run test:quality-gate:phase2  # All Phase 2 requirements
npm run test:quality-gate:phase3  # All Phase 3 requirements
npm run test:quality-gate:phase4  # All Phase 4 requirements

# Full regression suite
npm run test:garmin-sync:full     # All tests for the feature
```

## 📋 Implementation Checklist

### Phase 1 Checklist
- [ ] Enhanced Excel parsing unit tests written
- [ ] Calendar UI E2E tests implemented
- [ ] Visual regression tests setup
- [ ] Error handling tests created
- [ ] Performance benchmarks established
- [ ] Quality gate passes

### Phase 2 Checklist
- [ ] Garmin OAuth mock service setup
- [ ] API integration tests written
- [ ] Error scenario tests implemented
- [ ] Security tests for token handling
- [ ] Rate limiting tests created
- [ ] Quality gate passes

### Phase 3 Checklist
- [ ] Compliance engine unit tests written
- [ ] Analytics dashboard E2E tests implemented
- [ ] Pattern recognition tests created
- [ ] Performance tests for calculations
- [ ] Quality gate passes

### Phase 4 Checklist
- [ ] RAG pipeline integration tests written
- [ ] AI service mock setup
- [ ] End-to-end workflow tests implemented
- [ ] Performance tests for AI responses
- [ ] Quality gate passes

---

## 🔄 Continuous Testing Strategy

**After each implementation:**
1. **Run phase-specific tests** → Must pass 100%
2. **Run integration tests** → Must pass with mocks
3. **Run performance benchmarks** → Must meet targets
4. **Run security scans** → No critical vulnerabilities
5. **Deploy to staging** → Automated via CI/CD
6. **Run E2E tests on staging** → Full user journeys
7. **Manual exploratory testing** → Edge cases & UX
8. **Quality gate review** → All criteria met
9. **Proceed to next phase** → Or iterate if needed

This comprehensive testing plan ensures each feature is bulletproof before moving forward, providing confidence in the stability and reliability of the Garmin sync system.