"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BriefcaseIcon,
  ClockIcon,
  FireIcon,
  ScaleIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ManualDataEntryProps {
  selectedDate: string;
}

interface ManualTrainingData {
  id?: string;
  date: string;
  activity_type: string;
  duration_minutes?: number;
  distance_km?: number;
  elevation_gain_m?: number;
  backpack_weight_kg?: number;
  perceived_effort?: number;
  notes?: string;
  location?: string;
}

const ACTIVITY_TYPES = [
  { value: 'hiking', label: 'Hiking', icon: '🥾' },
  { value: 'mountaineering', label: 'Mountaineering', icon: '⛰️' },
  { value: 'climbing', label: 'Rock Climbing', icon: '🧗' },
  { value: 'recovery', label: 'Recovery Walk', icon: '🚶' },
  { value: 'other', label: 'Other', icon: '🏃' }
];

export default function ManualDataEntry({ selectedDate }: ManualDataEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const [existingData, setExistingData] = useState<ManualTrainingData[]>([]);
  const [newEntry, setNewEntry] = useState<ManualTrainingData>({
    date: selectedDate,
    activity_type: '',
    duration_minutes: undefined,
    distance_km: undefined,
    elevation_gain_m: undefined,
    backpack_weight_kg: undefined,
    perceived_effort: undefined,
    notes: '',
    location: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setNewEntry(prev => ({ ...prev, date: selectedDate }));
    fetchManualData();
  }, [selectedDate]);

  const fetchManualData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/training/manual?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setExistingData(data.entries || []);
      }
    } catch (error) {
      console.error('Error fetching manual data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newEntry.activity_type) return;

    setSaving(true);
    try {
      const response = await fetch('/api/training/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      });

      if (response.ok) {
        await fetchManualData();
        // Reset form
        setNewEntry({
          date: selectedDate,
          activity_type: '',
          duration_minutes: undefined,
          distance_km: undefined,
          elevation_gain_m: undefined,
          backpack_weight_kg: undefined,
          perceived_effort: undefined,
          notes: '',
          location: ''
        });
        setExpanded(false);
      }
    } catch (error) {
      console.error('Error saving manual data:', error);
    } finally {
      setSaving(false);
    }
  };

  const selectedActivityType = ACTIVITY_TYPES.find(type => type.value === newEntry.activity_type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden"
    >
      {/* Header */}
      <div 
        className="p-6 cursor-pointer flex items-center justify-between hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
            <BriefcaseIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Manual Training Data</h3>
            <p className="text-white/60 text-sm">
              Log non-Strava activities and metrics
              {existingData.length > 0 && (
                <span className="ml-2 text-blue-400">
                  ({existingData.length} entries today)
                </span>
              )}
            </p>
          </div>
        </div>
        
        <div className="text-white/40">
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10"
          >
            {/* Existing Entries */}
            {existingData.length > 0 && (
              <div className="p-6 border-b border-white/10">
                <h4 className="text-white font-semibold mb-4">Today&apos;s Entries</h4>
                <div className="space-y-3">
                  {existingData.map((entry, index) => {
                    const activityType = ACTIVITY_TYPES.find(type => type.value === entry.activity_type);
                    return (
                      <div key={entry.id || index} className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{activityType?.icon}</span>
                            <span className="text-white font-medium">{activityType?.label}</span>
                          </div>
                          {entry.perceived_effort && (
                            <span className="text-summitGold text-sm">
                              RPE {entry.perceived_effort}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                          {entry.duration_minutes && (
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-4 h-4" />
                              {entry.duration_minutes}min
                            </div>
                          )}
                          {entry.backpack_weight_kg && (
                            <div className="flex items-center gap-1">
                              <BriefcaseIcon className="w-4 h-4" />
                              {entry.backpack_weight_kg}kg
                            </div>
                          )}
                          {entry.distance_km && (
                            <div className="flex items-center gap-1">
                              <MapPinIcon className="w-4 h-4" />
                              {entry.distance_km}km
                            </div>
                          )}
                          {entry.elevation_gain_m && (
                            <div className="flex items-center gap-1">
                              <span className="text-summitGold">↗</span>
                              {entry.elevation_gain_m}m
                            </div>
                          )}
                        </div>
                        
                        {entry.location && (
                          <p className="text-white/60 text-sm mt-2">📍 {entry.location}</p>
                        )}
                        
                        {entry.notes && (
                          <p className="text-white/50 text-sm mt-2">{entry.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* New Entry Form */}
            <div className="p-6">
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                Add New Entry
              </h4>

              {/* Activity Type */}
              <div className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Activity Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {ACTIVITY_TYPES.map(type => (
                    <button
                      key={type.value}
                      onClick={() => setNewEntry({...newEntry, activity_type: type.value})}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        newEntry.activity_type === type.value
                          ? 'border-summitGold bg-summitGold/10 text-summitGold'
                          : 'border-white/20 bg-white/5 text-white/70 hover:border-white/30'
                      }`}
                    >
                      <div className="text-lg mb-1">{type.icon}</div>
                      <div className="text-xs font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newEntry.duration_minutes || ''}
                    onChange={(e) => setNewEntry({
                      ...newEntry, 
                      duration_minutes: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50"
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newEntry.distance_km || ''}
                    onChange={(e) => setNewEntry({
                      ...newEntry, 
                      distance_km: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50"
                    placeholder="5.0"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Elevation Gain (m)
                  </label>
                  <input
                    type="number"
                    value={newEntry.elevation_gain_m || ''}
                    onChange={(e) => setNewEntry({
                      ...newEntry, 
                      elevation_gain_m: e.target.value ? parseInt(e.target.value) : undefined
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Backpack Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newEntry.backpack_weight_kg || ''}
                    onChange={(e) => setNewEntry({
                      ...newEntry, 
                      backpack_weight_kg: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50"
                    placeholder="15.0"
                  />
                </div>
              </div>

              {/* RPE and Location */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Perceived Effort (RPE 1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={newEntry.perceived_effort || ''}
                    onChange={(e) => setNewEntry({
                      ...newEntry, 
                      perceived_effort: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50"
                    placeholder="7"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newEntry.location || ''}
                    onChange={(e) => setNewEntry({...newEntry, location: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50"
                    placeholder="Trail name or area"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Notes
                </label>
                <textarea
                  value={newEntry.notes || ''}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50 resize-none"
                  placeholder="How did the session feel? Any observations..."
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={!newEntry.activity_type || saving}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="w-5 h-5" />
                    Save Entry
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}