export interface IntervalsWellness {
  id: string;
  date: string;
  bodyBattery?: number;
  restingHR?: number;
  hrv?: number; // rmssd
  spO2?: number;
  stressScore?: number; // Often custom field or derived
  sleepSecs?: number;
  vo2max?: number;
  comments?: string;
  [key: string]: any;
}

export interface IntervalsActivity {
  id: string;
  start_date_local: string;
  name: string;
  type: string;
  moving_time: number;
  distance: number;
  total_elevation_gain: number;
  average_heartrate?: number;
  icu_intensity?: number;
  source: 'GARMIN' | 'STRAVA' | 'OTHER';
}
