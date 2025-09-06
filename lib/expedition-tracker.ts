import io, { Socket } from 'socket.io-client';

export interface GPSPoint {
  lat: number;
  lng: number;
  altitude: number;
  timestamp: number;
  accuracy: number;
  speed?: number;
  heading?: number;
}

export interface ExpeditionData {
  id: string;
  name: string;
  status: 'planning' | 'active' | 'completed' | 'emergency';
  currentPosition?: GPSPoint;
  route: GPSPoint[];
  participants: ParticipantData[];
  weather?: WeatherData;
  health?: HealthMetrics;
  startTime: number;
  estimatedEndTime: number;
  actualEndTime?: number;
}

export interface ParticipantData {
  id: string;
  name: string;
  role: 'leader' | 'guide' | 'climber';
  position?: GPSPoint;
  health: HealthMetrics;
  status: 'active' | 'resting' | 'emergency' | 'offline';
  lastUpdate: number;
}

export interface HealthMetrics {
  heartRate?: number;
  oxygenSaturation?: number;
  temperature?: number;
  elevation?: number;
  batteryLevel?: number;
  emergencyBeacon?: boolean;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  conditions: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  time: number;
  temperature: number;
  conditions: string;
  windSpeed: number;
  precipitation: number;
}

export class ExpeditionTracker {
  private socket: Socket | null = null;
  private expeditionId: string;
  private gpsBuffer: GPSPoint[] = [];
  private isTracking: boolean = false;
  private geolocationWatchId: number | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  
  // Event callbacks
  private onDataUpdate: ((data: ExpeditionData) => void) | null = null;
  private onPositionUpdate: ((position: GPSPoint) => void) | null = null;
  private onParticipantUpdate: ((participants: ParticipantData[]) => void) | null = null;
  private onWeatherUpdate: ((weather: WeatherData) => void) | null = null;
  private onEmergency: ((emergency: EmergencyAlert) => void) | null = null;
  private onConnectionChange: ((connected: boolean) => void) | null = null;

  constructor(expeditionId: string) {
    this.expeditionId = expeditionId;
  }

  // Initialize WebSocket connection
  async connect(wsUrl?: string): Promise<void> {
    const socketUrl = wsUrl || process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3002';
    
    try {
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        retries: 3
      });

      this.setupSocketListeners();
      
      // Join expedition room
      this.socket.emit('join-expedition', this.expeditionId);
      
    } catch (error) {
      console.error('Failed to connect to expedition tracking server:', error);
      throw new Error('Connection failed');
    }
  }

  // Setup WebSocket event listeners
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to expedition tracking server');
      this.reconnectAttempts = 0;
      this.onConnectionChange?.(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from expedition tracking server');
      this.onConnectionChange?.(false);
    });

    this.socket.on('expedition-update', (data: ExpeditionData) => {
      this.onDataUpdate?.(data);
    });

    this.socket.on('position-update', (position: GPSPoint) => {
      this.onPositionUpdate?.(position);
    });

    this.socket.on('participants-update', (participants: ParticipantData[]) => {
      this.onParticipantUpdate?.(participants);
    });

    this.socket.on('weather-update', (weather: WeatherData) => {
      this.onWeatherUpdate?.(weather);
    });

    this.socket.on('emergency-alert', (emergency: EmergencyAlert) => {
      this.onEmergency?.(emergency);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.handleReconnection();
    });
  }

  // Start GPS tracking
  async startTracking(options?: PositionOptions): Promise<void> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
      ...options
    };

    this.isTracking = true;

    this.geolocationWatchId = navigator.geolocation.watchPosition(
      (position) => this.handlePositionUpdate(position),
      (error) => this.handlePositionError(error),
      defaultOptions
    );
  }

  // Stop GPS tracking
  stopTracking(): void {
    this.isTracking = false;
    
    if (this.geolocationWatchId !== null) {
      navigator.geolocation.clearWatch(this.geolocationWatchId);
      this.geolocationWatchId = null;
    }
  }

  // Handle GPS position updates
  private async handlePositionUpdate(position: GeolocationPosition): Promise<void> {
    const gpsPoint: GPSPoint = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      altitude: position.coords.altitude || 0,
      timestamp: Date.now(),
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || undefined,
      heading: position.coords.heading || undefined
    };

    // Add to buffer
    this.gpsBuffer.push(gpsPoint);
    
    // Keep only last 100 points in memory
    if (this.gpsBuffer.length > 100) {
      this.gpsBuffer = this.gpsBuffer.slice(-100);
    }

    // Emit position update
    this.onPositionUpdate?.(gpsPoint);

    // Send to server if connected
    if (this.socket?.connected) {
      this.socket.emit('position-update', {
        expeditionId: this.expeditionId,
        position: gpsPoint
      });
    }

    // Store locally for offline capability
    await this.storePositionOffline(gpsPoint);
  }

  // Handle GPS errors
  private handlePositionError(error: GeolocationPositionError): void {
    console.error('Geolocation error:', error);
    
    let errorMessage = 'Unknown location error';
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timeout';
        break;
    }
    
    throw new Error(errorMessage);
  }

  // Store position data offline
  private async storePositionOffline(position: GPSPoint): Promise<void> {
    try {
      if ('indexedDB' in window) {
        // Store in IndexedDB for offline capability
        const offlineData = {
          expeditionId: this.expeditionId,
          position,
          synced: false,
          timestamp: Date.now()
        };
        
        // Implementation would use IndexedDB
        localStorage.setItem(
          `expedition_position_${this.expeditionId}_${position.timestamp}`,
          JSON.stringify(offlineData)
        );
      }
    } catch (error) {
      console.warn('Failed to store position offline:', error);
    }
  }

  // Sync offline data when connection restored
  async syncOfflineData(): Promise<void> {
    try {
      const offlineKeys = Object.keys(localStorage).filter(key => 
        key.startsWith(`expedition_position_${this.expeditionId}_`)
      );

      for (const key of offlineKeys) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (!data.synced && this.socket?.connected) {
          this.socket.emit('position-update', data);
          data.synced = true;
          localStorage.setItem(key, JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }

  // Handle reconnection logic
  private handleReconnection(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        this.socket?.connect();
      }, delay);
    }
  }

  // Send emergency alert
  sendEmergencyAlert(type: 'sos' | 'medical' | 'weather' | 'equipment', message: string): void {
    const alert: EmergencyAlert = {
      type,
      message,
      timestamp: Date.now(),
      position: this.gpsBuffer[this.gpsBuffer.length - 1],
      expeditionId: this.expeditionId
    };

    if (this.socket?.connected) {
      this.socket.emit('emergency-alert', alert);
    }

    // Store emergency locally
    localStorage.setItem(`emergency_${Date.now()}`, JSON.stringify(alert));
    
    this.onEmergency?.(alert);
  }

  // Update health metrics
  updateHealthMetrics(health: HealthMetrics): void {
    if (this.socket?.connected) {
      this.socket.emit('health-update', {
        expeditionId: this.expeditionId,
        health,
        timestamp: Date.now()
      });
    }
  }

  // Event listeners
  onDataUpdated(callback: (data: ExpeditionData) => void): void {
    this.onDataUpdate = callback;
  }

  onPositionUpdated(callback: (position: GPSPoint) => void): void {
    this.onPositionUpdate = callback;
  }

  onParticipantsUpdated(callback: (participants: ParticipantData[]) => void): void {
    this.onParticipantUpdate = callback;
  }

  onWeatherUpdated(callback: (weather: WeatherData) => void): void {
    this.onWeatherUpdate = callback;
  }

  onEmergencyAlert(callback: (emergency: EmergencyAlert) => void): void {
    this.onEmergency = callback;
  }

  onConnectionChanged(callback: (connected: boolean) => void): void {
    this.onConnectionChange = callback;
  }

  // Get current expedition data
  getCurrentData(): ExpeditionData | null {
    // Return cached data or null
    const cachedData = localStorage.getItem(`expedition_${this.expeditionId}`);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  // Cleanup
  disconnect(): void {
    this.stopTracking();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export interface EmergencyAlert {
  type: 'sos' | 'medical' | 'weather' | 'equipment';
  message: string;
  timestamp: number;
  position?: GPSPoint;
  expeditionId: string;
}

// Mock WebSocket server for development
export class MockExpeditionServer {
  private expeditions: Map<string, ExpeditionData> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Create mock expedition for testing
    const mockExpedition: ExpeditionData = {
      id: 'mock-expedition-1',
      name: 'Mount Rainier Summit Attempt',
      status: 'active',
      currentPosition: {
        lat: 46.8523,
        lng: -121.7603,
        altitude: 3200,
        timestamp: Date.now(),
        accuracy: 10
      },
      route: this.generateMockRoute(),
      participants: this.generateMockParticipants(),
      weather: this.generateMockWeather(),
      startTime: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
      estimatedEndTime: Date.now() + 18 * 60 * 60 * 1000 // 18 hours from now
    };

    this.expeditions.set(mockExpedition.id, mockExpedition);
    this.startMockUpdates(mockExpedition.id);
  }

  private generateMockRoute(): GPSPoint[] {
    // Generate realistic route for Mount Rainier
    const basePoints = [
      { lat: 46.7856, lng: -121.7369, altitude: 1646 }, // Paradise
      { lat: 46.8024, lng: -121.7445, altitude: 2100 }, // Panorama Point
      { lat: 46.8156, lng: -121.7534, altitude: 2700 }, // Camp Muir
      { lat: 46.8345, lng: -121.7589, altitude: 3400 }, // Ingraham Flats
      { lat: 46.8523, lng: -121.7603, altitude: 4392 }  // Summit
    ];

    return basePoints.map((point, index) => ({
      ...point,
      timestamp: Date.now() - (basePoints.length - index) * 2 * 60 * 60 * 1000,
      accuracy: 5 + Math.random() * 10
    }));
  }

  private generateMockParticipants(): ParticipantData[] {
    return [
      {
        id: 'participant-1',
        name: 'Alex Chen',
        role: 'leader',
        health: {
          heartRate: 145 + Math.random() * 20,
          oxygenSaturation: 85 + Math.random() * 10,
          temperature: 36.2 + Math.random() * 1.5,
          elevation: 3200 + Math.random() * 100,
          batteryLevel: 75 + Math.random() * 20
        },
        status: 'active',
        lastUpdate: Date.now()
      },
      {
        id: 'participant-2',
        name: 'Sarah Wilson',
        role: 'guide',
        health: {
          heartRate: 130 + Math.random() * 25,
          oxygenSaturation: 88 + Math.random() * 8,
          temperature: 36.5 + Math.random() * 1.2,
          elevation: 3180 + Math.random() * 120,
          batteryLevel: 60 + Math.random() * 30
        },
        status: 'active',
        lastUpdate: Date.now()
      }
    ];
  }

  private generateMockWeather(): WeatherData {
    return {
      temperature: -12 + Math.random() * 8,
      humidity: 45 + Math.random() * 20,
      windSpeed: 15 + Math.random() * 25,
      windDirection: Math.random() * 360,
      pressure: 680 + Math.random() * 40,
      visibility: 2000 + Math.random() * 8000,
      conditions: ['clear', 'cloudy', 'snow', 'wind'][Math.floor(Math.random() * 4)],
      forecast: []
    };
  }

  private startMockUpdates(expeditionId: string): void {
    const interval = setInterval(() => {
      const expedition = this.expeditions.get(expeditionId);
      if (expedition) {
        // Update positions and health metrics
        expedition.participants = expedition.participants.map(p => ({
          ...p,
          health: {
            ...p.health,
            heartRate: (p.health.heartRate || 140) + (Math.random() - 0.5) * 10,
            oxygenSaturation: (p.health.oxygenSaturation || 88) + (Math.random() - 0.5) * 3,
            batteryLevel: Math.max(0, (p.health.batteryLevel || 75) - 0.1)
          },
          lastUpdate: Date.now()
        }));

        expedition.weather = this.generateMockWeather();
        this.expeditions.set(expeditionId, expedition);
      }
    }, 30000); // Update every 30 seconds

    this.intervals.set(expeditionId, interval);
  }

  stopMockUpdates(expeditionId: string): void {
    const interval = this.intervals.get(expeditionId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(expeditionId);
    }
  }

  getExpedition(id: string): ExpeditionData | undefined {
    return this.expeditions.get(id);
  }
}