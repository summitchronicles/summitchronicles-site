// Mock Strava data for demonstration purposes
// This provides realistic mountaineering training data until OAuth is properly set up

export interface StravaActivity {
  id: number;
  name: string;
  sport_type: string;
  workout_type?: number;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  average_speed?: number; // m/s
  max_speed?: number; // m/s
  average_heartrate?: number;
  max_heartrate?: number;
  start_date: string; // ISO string
  location_city?: string;
  location_state?: string;
  location_country?: string;
}

export interface StravaStats {
  runs: {
    count: number;
    distance_km: number;
    moving_sec: number;
  };
  hikes: {
    count: number;
    distance_km: number;
    elevation_m: number;
    moving_sec: number;
  };
  rides: {
    count: number;
    distance_km: number;
    moving_sec: number;
  };
  overall: {
    elevation_m: number;
  };
}

export function generateMockStravaActivities(count: number = 50): StravaActivity[] {
  const activities: StravaActivity[] = [];
  const now = new Date();
  
  const sportTypes = [
    { type: 'Run', weight: 0.4 },
    { type: 'Hike', weight: 0.3 },
    { type: 'Ride', weight: 0.2 },
    { type: 'WeightTraining', weight: 0.1 }
  ];

  const locations = [
    { city: 'Boulder', state: 'Colorado', country: 'USA' },
    { city: 'Chamonix', state: 'Haute-Savoie', country: 'France' },
    { city: 'Banff', state: 'Alberta', country: 'Canada' },
    { city: 'Seattle', state: 'Washington', country: 'USA' },
    { city: 'Kathmandu', state: 'Central', country: 'Nepal' }
  ];

  for (let i = 0; i < count; i++) {
    // Generate date within last 6 months
    const daysAgo = Math.floor(Math.random() * 180);
    const activityDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    // Select sport type based on weights
    const rand = Math.random();
    let cumulativeWeight = 0;
    let sportType = 'Run';
    
    for (const sport of sportTypes) {
      cumulativeWeight += sport.weight;
      if (rand <= cumulativeWeight) {
        sportType = sport.type;
        break;
      }
    }

    const location = locations[Math.floor(Math.random() * locations.length)];
    const activity = generateActivityBySport(i + 1, sportType, activityDate, location);
    activities.push(activity);
  }

  return activities.sort((a, b) => 
    new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );
}

function generateActivityBySport(
  id: number, 
  sportType: string, 
  date: Date, 
  location: { city: string; state: string; country: string }
): StravaActivity {
  const baseActivity = {
    id: id + 1000000, // Realistic Strava ID
    sport_type: sportType,
    start_date: date.toISOString(),
    location_city: location.city,
    location_state: location.state,
    location_country: location.country,
    average_heartrate: 140 + Math.floor(Math.random() * 40),
    max_heartrate: 160 + Math.floor(Math.random() * 30)
  };

  switch (sportType) {
    case 'Run':
      return {
        ...baseActivity,
        name: getRunName(location),
        distance: 3000 + Math.floor(Math.random() * 15000), // 3-18km
        moving_time: 1200 + Math.floor(Math.random() * 5400), // 20-110 minutes
        elapsed_time: 1200 + Math.floor(Math.random() * 6000),
        total_elevation_gain: Math.floor(Math.random() * 500), // 0-500m
        average_speed: 3.5 + Math.random() * 2, // 3.5-5.5 m/s
        max_speed: 4.5 + Math.random() * 3
      };

    case 'Hike':
      return {
        ...baseActivity,
        name: getHikeName(location),
        distance: 5000 + Math.floor(Math.random() * 20000), // 5-25km
        moving_time: 3600 + Math.floor(Math.random() * 18000), // 1-6 hours
        elapsed_time: 4200 + Math.floor(Math.random() * 21600),
        total_elevation_gain: 200 + Math.floor(Math.random() * 1800), // 200-2000m
        average_speed: 1.2 + Math.random() * 0.8, // 1.2-2.0 m/s
        max_speed: 2.0 + Math.random() * 1
      };

    case 'Ride':
      return {
        ...baseActivity,
        name: getCycleName(location),
        distance: 15000 + Math.floor(Math.random() * 50000), // 15-65km
        moving_time: 2400 + Math.floor(Math.random() * 7200), // 40-160 minutes
        elapsed_time: 2700 + Math.floor(Math.random() * 8100),
        total_elevation_gain: 100 + Math.floor(Math.random() * 1200), // 100-1300m
        average_speed: 6.0 + Math.random() * 4, // 6-10 m/s
        max_speed: 12.0 + Math.random() * 6
      };

    case 'WeightTraining':
      return {
        ...baseActivity,
        name: 'Strength Training - Mountaineering Focus',
        distance: 0,
        moving_time: 2700 + Math.floor(Math.random() * 1800), // 45-75 minutes
        elapsed_time: 3000 + Math.floor(Math.random() * 2400),
        total_elevation_gain: 0,
        workout_type: 1 // Strength training
      };

    default:
      return baseActivity as StravaActivity;
  }
}

function getRunName(location: { city: string }): string {
  const runNames = [
    'Morning Trail Run',
    'Interval Training',
    'Base Building Run',
    'Hill Repeats',
    'Recovery Run',
    'Tempo Run',
    'Long Run Preparation',
    'Altitude Training Run'
  ];
  return `${runNames[Math.floor(Math.random() * runNames.length)]} - ${location.city}`;
}

function getHikeName(location: { city: string }): string {
  const hikeNames = [
    'Mountain Training Hike',
    'Weighted Pack Training',
    'Technical Terrain Practice',
    'Endurance Building Hike',
    'Acclimatization Hike',
    'Peak Bagging Training',
    'Multi-Pitch Approach',
    'Alpine Start Training'
  ];
  return `${hikeNames[Math.floor(Math.random() * hikeNames.length)]} - ${location.city}`;
}

function getCycleName(location: { city: string }): string {
  const cycleNames = [
    'Cross Training Ride',
    'Active Recovery Cycle',
    'Endurance Base Building',
    'Hill Climbing Training',
    'Cardio Cross Training',
    'Recovery Spin',
    'Mountain Bike Training'
  ];
  return `${cycleNames[Math.floor(Math.random() * cycleNames.length)]} - ${location.city}`;
}

export function generateMockStravaStats(activities: StravaActivity[]): StravaStats {
  const runs = activities.filter(a => a.sport_type === 'Run');
  const hikes = activities.filter(a => a.sport_type === 'Hike');
  const rides = activities.filter(a => a.sport_type === 'Ride');

  return {
    runs: {
      count: runs.length,
      distance_km: Math.round(runs.reduce((sum, a) => sum + a.distance, 0) / 1000),
      moving_sec: runs.reduce((sum, a) => sum + a.moving_time, 0)
    },
    hikes: {
      count: hikes.length,
      distance_km: Math.round(hikes.reduce((sum, a) => sum + a.distance, 0) / 1000),
      elevation_m: Math.round(hikes.reduce((sum, a) => sum + a.total_elevation_gain, 0)),
      moving_sec: hikes.reduce((sum, a) => sum + a.moving_time, 0)
    },
    rides: {
      count: rides.length,
      distance_km: Math.round(rides.reduce((sum, a) => sum + a.distance, 0) / 1000),
      moving_sec: rides.reduce((sum, a) => sum + a.moving_time, 0)
    },
    overall: {
      elevation_m: Math.round(activities.reduce((sum, a) => sum + a.total_elevation_gain, 0))
    }
  };
}