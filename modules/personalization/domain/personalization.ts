export interface UserProfile {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  primaryGoals: string[];
  preferredActivities: string[];
  currentPhase: 'base-building' | 'strength' | 'peak' | 'recovery';
  nextExpedition?: {
    name: string;
    date: string;
    difficulty: string;
  };
}

export interface PersonalizedDashboardContent {
  welcomeMessage: string;
  priorityActions: Array<{
    type: 'training' | 'planning' | 'safety' | 'gear';
    title: string;
    description: string;
    urgency: 'high' | 'medium' | 'low';
  }>;
  recommendedContent: Array<{
    type: 'article' | 'training' | 'video' | 'route';
    title: string;
    category: string;
    difficulty: string;
    estimatedTime: string;
    relevanceScore: number;
  }>;
  weeklyFocus: {
    title: string;
    description: string;
    goals: string[];
  };
  progressMetrics: {
    currentWeek: {
      activitiesCompleted: number;
      totalHours: number;
      elevationGained: number;
    };
    trends: {
      endurance: 'improving' | 'stable' | 'declining';
      strength: 'improving' | 'stable' | 'declining';
      consistency: 'improving' | 'stable' | 'declining';
    };
  };
}
