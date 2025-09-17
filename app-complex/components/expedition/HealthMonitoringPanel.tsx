'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  ExclamationTriangleIcon,
  BellIcon,
  MapPinIcon,
  SignalIcon,
  Battery50Icon as BatteryIcon,
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/app/components/ui';
import {
  ParticipantData,
  HealthMetrics,
  GPSPoint,
} from '@/lib/expedition-tracker';

interface HealthAlert {
  id: string;
  participantId: string;
  participantName: string;
  type: 'critical' | 'warning' | 'info';
  metric:
    | 'heartRate'
    | 'oxygenSaturation'
    | 'temperature'
    | 'battery'
    | 'position';
  value: number;
  threshold: number;
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

interface HealthMonitoringPanelProps {
  participants: ParticipantData[];
  onEmergencyAlert?: (alert: HealthAlert) => void;
  className?: string;
}

// Health thresholds for mountaineering
const HEALTH_THRESHOLDS = {
  heartRate: {
    critical: { min: 40, max: 200 },
    warning: { min: 50, max: 180 },
  },
  oxygenSaturation: {
    critical: { min: 0, max: 85 },
    warning: { min: 85, max: 90 },
  },
  temperature: {
    critical: { min: 34, max: 40 },
    warning: { min: 35, max: 38.5 },
  },
  battery: {
    critical: { min: 0, max: 10 },
    warning: { min: 10, max: 20 },
  },
};

export default function HealthMonitoringPanel({
  participants = [],
  onEmergencyAlert,
  className = '',
}: HealthMonitoringPanelProps) {
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(
    null
  );
  const [monitoringActive, setMonitoringActive] = useState(true);

  // Monitor health metrics and generate alerts
  useEffect(() => {
    if (!monitoringActive) return;

    const checkHealthMetrics = () => {
      const newAlerts: HealthAlert[] = [];

      participants.forEach((participant) => {
        const { health } = participant;
        const now = Date.now();

        // Check heart rate
        if (health.heartRate !== undefined) {
          const hr = health.heartRate;
          if (
            hr < HEALTH_THRESHOLDS.heartRate.critical.min ||
            hr > HEALTH_THRESHOLDS.heartRate.critical.max
          ) {
            newAlerts.push({
              id: `${participant.id}-hr-${now}`,
              participantId: participant.id,
              participantName: participant.name,
              type: 'critical',
              metric: 'heartRate',
              value: hr,
              threshold:
                hr < HEALTH_THRESHOLDS.heartRate.critical.min
                  ? HEALTH_THRESHOLDS.heartRate.critical.min
                  : HEALTH_THRESHOLDS.heartRate.critical.max,
              message: `Critical heart rate: ${hr} bpm`,
              timestamp: now,
              acknowledged: false,
            });
          } else if (
            hr < HEALTH_THRESHOLDS.heartRate.warning.min ||
            hr > HEALTH_THRESHOLDS.heartRate.warning.max
          ) {
            newAlerts.push({
              id: `${participant.id}-hr-${now}`,
              participantId: participant.id,
              participantName: participant.name,
              type: 'warning',
              metric: 'heartRate',
              value: hr,
              threshold:
                hr < HEALTH_THRESHOLDS.heartRate.warning.min
                  ? HEALTH_THRESHOLDS.heartRate.warning.min
                  : HEALTH_THRESHOLDS.heartRate.warning.max,
              message: `Heart rate warning: ${hr} bpm`,
              timestamp: now,
              acknowledged: false,
            });
          }
        }

        // Check oxygen saturation
        if (health.oxygenSaturation !== undefined) {
          const o2 = health.oxygenSaturation;
          if (o2 < HEALTH_THRESHOLDS.oxygenSaturation.critical.max) {
            newAlerts.push({
              id: `${participant.id}-o2-${now}`,
              participantId: participant.id,
              participantName: participant.name,
              type: 'critical',
              metric: 'oxygenSaturation',
              value: o2,
              threshold: HEALTH_THRESHOLDS.oxygenSaturation.critical.max,
              message: `Critical oxygen saturation: ${o2}%`,
              timestamp: now,
              acknowledged: false,
            });
          } else if (o2 < HEALTH_THRESHOLDS.oxygenSaturation.warning.max) {
            newAlerts.push({
              id: `${participant.id}-o2-${now}`,
              participantId: participant.id,
              participantName: participant.name,
              type: 'warning',
              metric: 'oxygenSaturation',
              value: o2,
              threshold: HEALTH_THRESHOLDS.oxygenSaturation.warning.max,
              message: `Low oxygen saturation: ${o2}%`,
              timestamp: now,
              acknowledged: false,
            });
          }
        }

        // Check body temperature
        if (health.temperature !== undefined) {
          const temp = health.temperature;
          if (
            temp < HEALTH_THRESHOLDS.temperature.critical.min ||
            temp > HEALTH_THRESHOLDS.temperature.critical.max
          ) {
            newAlerts.push({
              id: `${participant.id}-temp-${now}`,
              participantId: participant.id,
              participantName: participant.name,
              type: 'critical',
              metric: 'temperature',
              value: temp,
              threshold:
                temp < HEALTH_THRESHOLDS.temperature.critical.min
                  ? HEALTH_THRESHOLDS.temperature.critical.min
                  : HEALTH_THRESHOLDS.temperature.critical.max,
              message: `Critical body temperature: ${temp.toFixed(1)}°C`,
              timestamp: now,
              acknowledged: false,
            });
          }
        }

        // Check battery level
        if (health.batteryLevel !== undefined) {
          const battery = health.batteryLevel;
          if (battery < HEALTH_THRESHOLDS.battery.critical.max) {
            newAlerts.push({
              id: `${participant.id}-battery-${now}`,
              participantId: participant.id,
              participantName: participant.name,
              type: 'critical',
              metric: 'battery',
              value: battery,
              threshold: HEALTH_THRESHOLDS.battery.critical.max,
              message: `Critical battery level: ${battery}%`,
              timestamp: now,
              acknowledged: false,
            });
          } else if (battery < HEALTH_THRESHOLDS.battery.warning.max) {
            newAlerts.push({
              id: `${participant.id}-battery-${now}`,
              participantId: participant.id,
              participantName: participant.name,
              type: 'warning',
              metric: 'battery',
              value: battery,
              threshold: HEALTH_THRESHOLDS.battery.warning.max,
              message: `Low battery: ${battery}%`,
              timestamp: now,
              acknowledged: false,
            });
          }
        }

        // Check position timeout (participant hasn't updated position in 10+ minutes)
        const positionAge = now - participant.lastUpdate;
        if (positionAge > 10 * 60 * 1000) {
          // 10 minutes
          newAlerts.push({
            id: `${participant.id}-position-${now}`,
            participantId: participant.id,
            participantName: participant.name,
            type: 'warning',
            metric: 'position',
            value: Math.floor(positionAge / 60000), // minutes
            threshold: 10,
            message: `Position not updated for ${Math.floor(positionAge / 60000)} minutes`,
            timestamp: now,
            acknowledged: false,
          });
        }
      });

      // Update alerts and trigger callbacks for critical alerts
      if (newAlerts.length > 0) {
        setAlerts((prevAlerts) => {
          const existingIds = new Set(prevAlerts.map((a) => a.id));
          const uniqueNewAlerts = newAlerts.filter(
            (alert) => !existingIds.has(alert.id)
          );

          // Trigger emergency callback for new critical alerts
          uniqueNewAlerts.forEach((alert) => {
            if (alert.type === 'critical' && onEmergencyAlert) {
              onEmergencyAlert(alert);
            }
          });

          return [...prevAlerts, ...uniqueNewAlerts];
        });
      }
    };

    checkHealthMetrics();
    const interval = setInterval(checkHealthMetrics, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [participants, monitoringActive, onEmergencyAlert]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const clearAlert = (alertId: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert.id !== alertId)
    );
  };

  const getHealthStatus = (
    health: HealthMetrics
  ): 'good' | 'warning' | 'critical' => {
    const alertsForParticipant = alerts.filter((a) => !a.acknowledged);
    if (alertsForParticipant.some((a) => a.type === 'critical'))
      return 'critical';
    if (alertsForParticipant.some((a) => a.type === 'warning'))
      return 'warning';
    return 'good';
  };

  const criticalAlerts = alerts.filter(
    (a) => a.type === 'critical' && !a.acknowledged
  );
  const warningAlerts = alerts.filter(
    (a) => a.type === 'warning' && !a.acknowledged
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with monitoring toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <HeartIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Health Monitoring</h2>
            <p className="text-gray-400">Real-time vitals and safety alerts</p>
          </div>
        </div>

        <motion.button
          onClick={() => setMonitoringActive(!monitoringActive)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            monitoringActive
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                monitoringActive ? 'bg-green-400' : 'bg-gray-400'
              }`}
            />
            <span>
              {monitoringActive ? 'Monitoring Active' : 'Monitoring Paused'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Alert Summary */}
      {(criticalAlerts.length > 0 || warningAlerts.length > 0) && (
        <GlassCard className="p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellIcon className="w-5 h-5 text-red-400" />
              <div>
                <h4 className="text-white font-medium">Active Alerts</h4>
                <p className="text-sm text-gray-300">
                  {criticalAlerts.length} critical, {warningAlerts.length}{' '}
                  warnings
                </p>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-red-400"
            >
              <ExclamationTriangleIcon className="w-6 h-6" />
            </motion.div>
          </div>
        </GlassCard>
      )}

      {/* Participant Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {participants.map((participant) => {
            const healthStatus = getHealthStatus(participant.health);
            const participantAlerts = alerts.filter(
              (a) => a.participantId === participant.id && !a.acknowledged
            );

            return (
              <motion.div
                key={participant.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="cursor-pointer"
                onClick={() =>
                  setSelectedParticipant(
                    selectedParticipant === participant.id
                      ? null
                      : participant.id
                  )
                }
              >
                <GlassCard
                  className={`p-4 transition-all duration-300 ${
                    healthStatus === 'critical'
                      ? 'ring-2 ring-red-500/50 bg-red-500/5'
                      : healthStatus === 'warning'
                        ? 'ring-2 ring-yellow-500/50 bg-yellow-500/5'
                        : 'hover:ring-2 hover:ring-alpineBlue/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium">
                        {participant.name}
                      </h4>
                      <p className="text-xs text-gray-400 capitalize">
                        {participant.role}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Status indicator */}
                      <div
                        className={`w-3 h-3 rounded-full ${
                          healthStatus === 'critical'
                            ? 'bg-red-500'
                            : healthStatus === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                      />

                      {/* Alert count */}
                      {participantAlerts.length > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {participantAlerts.length}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Health metrics */}
                  <div className="space-y-2 text-xs">
                    {participant.health.heartRate && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <HeartIcon className="w-3 h-3 text-red-400" />
                          <span className="text-gray-300">Heart Rate:</span>
                        </div>
                        <span className="text-white font-mono">
                          {Math.round(participant.health.heartRate)} bpm
                        </span>
                      </div>
                    )}

                    {participant.health.oxygenSaturation && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">O2 Saturation:</span>
                        <span className="text-white font-mono">
                          {Math.round(participant.health.oxygenSaturation)}%
                        </span>
                      </div>
                    )}

                    {participant.health.temperature && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Body Temp:</span>
                        <span className="text-white font-mono">
                          {participant.health.temperature.toFixed(1)}°C
                        </span>
                      </div>
                    )}

                    {participant.health.batteryLevel && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <BatteryIcon className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-300">Battery:</span>
                        </div>
                        <span
                          className={`font-mono ${
                            participant.health.batteryLevel < 20
                              ? 'text-red-400'
                              : participant.health.batteryLevel < 50
                                ? 'text-yellow-400'
                                : 'text-green-400'
                          }`}
                        >
                          {Math.round(participant.health.batteryLevel)}%
                        </span>
                      </div>
                    )}

                    {/* Last update */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                      <div className="flex items-center space-x-1">
                        <SignalIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-300">Last Update:</span>
                      </div>
                      <span className="text-gray-400 font-mono text-xs">
                        {new Date(participant.lastUpdate).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  {/* Alerts for this participant */}
                  <AnimatePresence>
                    {selectedParticipant === participant.id &&
                      participantAlerts.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 space-y-2"
                        >
                          {participantAlerts.map((alert) => (
                            <div
                              key={alert.id}
                              className={`p-2 rounded-lg text-xs ${
                                alert.type === 'critical'
                                  ? 'bg-red-500/20 border border-red-500/30'
                                  : 'bg-yellow-500/20 border border-yellow-500/30'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className={`font-medium ${
                                    alert.type === 'critical'
                                      ? 'text-red-400'
                                      : 'text-yellow-400'
                                  }`}
                                >
                                  {alert.message}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    acknowledgeAlert(alert.id);
                                  }}
                                  className="text-gray-400 hover:text-white"
                                >
                                  ✓
                                </button>
                              </div>
                              <p className="text-gray-400 mt-1">
                                {new Date(alert.timestamp).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* No participants message */}
      {participants.length === 0 && (
        <GlassCard className="p-8 text-center">
          <HeartIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No Participants Connected
          </h3>
          <p className="text-gray-400">
            Waiting for team members to connect their monitoring devices...
          </p>
        </GlassCard>
      )}
    </div>
  );
}
