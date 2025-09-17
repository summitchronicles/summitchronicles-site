'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  PlayIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import ManualDataEntry from '@/components/training/ManualDataEntry';

interface ActualSet {
  id?: string;
  set_number: number;
  reps_completed?: number;
  weight_used?: number;
  actual_rpe?: number;
  notes?: string;
}

interface Exercise {
  id: string;
  sequence: number;
  name: string;
  planned_sets?: number;
  planned_reps: string;
  planned_rpe?: number;
  remarks?: string;
  completed: boolean;
  notes?: string;
  actual_sets?: ActualSet[];
}

interface WorkoutDay {
  id: string;
  date: string;
  day_name: string;
  session_type: string;
  exercises: Exercise[];
}

export default function WorkoutPage() {
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    fetchWorkout();
  }, [currentDate]);

  const fetchWorkout = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/training/workout?date=${currentDate}`);
      const data = await response.json();
      setWorkout(data.workout);

      // Check if workout is already started (has any actual sets)
      if (
        data.workout &&
        data.workout.exercises.some(
          (ex: Exercise) => ex.actual_sets?.length > 0
        )
      ) {
        setWorkoutStarted(true);
      }
    } catch (error) {
      console.error('Error fetching workout:', error);
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
    setStartTime(new Date());
  };

  const logSet = async (exerciseId: string, setData: Omit<ActualSet, 'id'>) => {
    try {
      const response = await fetch('/api/training/workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'logSet',
          exerciseId,
          setData,
        }),
      });

      if (response.ok) {
        // Refresh workout data
        await fetchWorkout();
      }
    } catch (error) {
      console.error('Error logging set:', error);
    }
  };

  const completeExercise = async (exerciseId: string, notes?: string) => {
    try {
      const response = await fetch('/api/training/workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'completeExercise',
          exerciseId,
          notes,
        }),
      });

      if (response.ok) {
        await fetchWorkout();
      }
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };

  const getCompletedSetsCount = (exercise: Exercise): number => {
    return exercise.actual_sets?.length || 0;
  };

  const getTotalVolume = (exercise: Exercise): number => {
    return (
      exercise.actual_sets?.reduce((total, set) => {
        return total + (set.weight_used || 0) * (set.reps_completed || 0);
      }, 0) || 0
    );
  };

  const getWorkoutProgress = (): number => {
    if (!workout || workout.exercises.length === 0) return 0;
    const completedExercises = workout.exercises.filter(
      (ex) => ex.completed
    ).length;
    return (completedExercises / workout.exercises.length) * 100;
  };

  const formatElapsedTime = (): string => {
    if (!startTime) return '00:00';
    const now = new Date();
    const elapsed = now.getTime() - startTime.getTime();
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-summitGold border-r-transparent"></div>
          <p className="mt-4 text-white/60">Loading workout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Navigation */}
        <Link
          href="/training"
          className="inline-flex items-center gap-2 text-white/70 hover:text-summitGold transition-colors duration-300 mb-8"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Training
        </Link>

        {/* Date Selector */}
        <div className="mb-8">
          <label className="block text-white/80 text-sm font-medium mb-3">
            Workout Date
          </label>
          <input
            type="date"
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50"
          />
        </div>

        {!workout ? (
          // No Workout Found
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <TrophyIcon className="w-16 h-16 text-white/40 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              No Workout Scheduled
            </h2>
            <p className="text-white/60 mb-8">
              No strength training session found for{' '}
              {new Date(currentDate).toLocaleDateString()}.
            </p>
            <Link
              href="/training/upload"
              className="px-6 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
            >
              Upload Training Plan
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Workout Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {workout.session_type}
                  </h1>
                  <p className="text-white/60">
                    {workout.day_name} •{' '}
                    {new Date(workout.date).toLocaleDateString()}
                  </p>
                </div>

                {workoutStarted && startTime && (
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-summitGold">
                      <ClockIcon className="w-5 h-5" />
                      <span className="font-mono text-lg">
                        {formatElapsedTime()}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm">Workout time</p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Progress</span>
                  <span className="text-summitGold text-sm font-medium">
                    {Math.round(getWorkoutProgress())}%
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-summitGold to-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${getWorkoutProgress()}%` }}
                  ></div>
                </div>
              </div>

              {!workoutStarted && (
                <button
                  onClick={startWorkout}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  <PlayIcon className="w-5 h-5" />
                  Start Workout
                </button>
              )}
            </motion.div>

            {/* Exercises List */}
            <div className="space-y-6 mb-8">
              {workout.exercises.map((exercise, index) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  workoutStarted={workoutStarted}
                  expanded={expandedExercise === exercise.id}
                  onToggleExpanded={() =>
                    setExpandedExercise(
                      expandedExercise === exercise.id ? null : exercise.id
                    )
                  }
                  onLogSet={(setData) => logSet(exercise.id, setData)}
                  onCompleteExercise={(notes) =>
                    completeExercise(exercise.id, notes)
                  }
                />
              ))}
            </div>

            {/* Manual Data Entry */}
            <ManualDataEntry selectedDate={currentDate} />
          </>
        )}
      </div>
    </div>
  );
}

// Individual Exercise Card Component
interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  workoutStarted: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
  onLogSet: (setData: Omit<ActualSet, 'id'>) => void;
  onCompleteExercise: (notes?: string) => void;
}

function ExerciseCard({
  exercise,
  index,
  workoutStarted,
  expanded,
  onToggleExpanded,
  onLogSet,
  onCompleteExercise,
}: ExerciseCardProps) {
  const [newSet, setNewSet] = useState<Omit<ActualSet, 'id'>>({
    set_number: 1,
    reps_completed: undefined,
    weight_used: undefined,
    actual_rpe: undefined,
    notes: '',
  });
  const [exerciseNotes, setExerciseNotes] = useState('');

  const completedSets = exercise.actual_sets?.length || 0;
  const plannedSets = exercise.planned_sets || 0;
  const totalVolume =
    exercise.actual_sets?.reduce((total, set) => {
      return total + (set.weight_used || 0) * (set.reps_completed || 0);
    }, 0) || 0;

  useEffect(() => {
    setNewSet((prev) => ({
      ...prev,
      set_number: completedSets + 1,
    }));
  }, [completedSets]);

  const handleAddSet = () => {
    if (newSet.reps_completed && newSet.weight_used && newSet.actual_rpe) {
      onLogSet(newSet);
      setNewSet({
        set_number: completedSets + 2,
        reps_completed: newSet.reps_completed, // Keep previous values for convenience
        weight_used: newSet.weight_used,
        actual_rpe: undefined,
        notes: '',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        bg-white/5 backdrop-blur-sm border rounded-3xl transition-all duration-300
        ${
          exercise.completed
            ? 'border-green-500/30 bg-green-500/5'
            : expanded
              ? 'border-summitGold/30 bg-summitGold/5'
              : 'border-white/10 hover:border-white/20'
        }
      `}
    >
      {/* Exercise Header */}
      <div className="p-6 cursor-pointer" onClick={onToggleExpanded}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${
                  exercise.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-summitGold/20 text-summitGold'
                }
              `}
              >
                {exercise.completed ? (
                  <CheckCircleIcon className="w-4 h-4" />
                ) : (
                  exercise.sequence
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">
                {exercise.name}
              </h3>
            </div>

            <div className="flex items-center gap-4 text-sm text-white/60">
              <span>
                {exercise.planned_sets} sets × {exercise.planned_reps}
              </span>
              <span>RPE {exercise.planned_rpe}</span>
              {completedSets > 0 && (
                <span className="text-summitGold">
                  {completedSets}/{plannedSets} completed
                </span>
              )}
              {totalVolume > 0 && (
                <span className="text-green-400">{totalVolume}kg total</span>
              )}
            </div>

            {exercise.remarks && (
              <p className="text-white/50 text-sm mt-2">{exercise.remarks}</p>
            )}
          </div>

          <div className="text-white/40">
            {expanded ? (
              <MinusIcon className="w-5 h-5" />
            ) : (
              <PlusIcon className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-white/10 p-6"
        >
          {/* Completed Sets */}
          {exercise.actual_sets && exercise.actual_sets.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Completed Sets</h4>
              <div className="space-y-2">
                {exercise.actual_sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className="flex items-center justify-between bg-white/5 rounded-xl p-3"
                  >
                    <span className="text-white/80">Set {set.set_number}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-white">
                        {set.reps_completed} reps
                      </span>
                      <span className="text-summitGold">
                        {set.weight_used}kg
                      </span>
                      <span className="text-white/60">
                        RPE {set.actual_rpe}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Set */}
          {workoutStarted && !exercise.completed && (
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">
                Log Set {newSet.set_number}
              </h4>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-white/60 text-xs mb-1">
                    Reps
                  </label>
                  <input
                    type="number"
                    value={newSet.reps_completed || ''}
                    onChange={(e) =>
                      setNewSet({
                        ...newSet,
                        reps_completed: parseInt(e.target.value) || undefined,
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={newSet.weight_used || ''}
                    onChange={(e) =>
                      setNewSet({
                        ...newSet,
                        weight_used: parseFloat(e.target.value) || undefined,
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1">
                    RPE
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={newSet.actual_rpe || ''}
                    onChange={(e) =>
                      setNewSet({
                        ...newSet,
                        actual_rpe: parseFloat(e.target.value) || undefined,
                      })
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-center"
                    placeholder="1-10"
                  />
                </div>
              </div>

              <input
                type="text"
                value={newSet.notes || ''}
                onChange={(e) =>
                  setNewSet({ ...newSet, notes: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm mb-4"
                placeholder="Set notes (optional)"
              />

              <button
                onClick={handleAddSet}
                disabled={
                  !newSet.reps_completed ||
                  !newSet.weight_used ||
                  !newSet.actual_rpe
                }
                className="w-full px-4 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log Set {newSet.set_number}
              </button>
            </div>
          )}

          {/* Complete Exercise */}
          {workoutStarted && !exercise.completed && completedSets > 0 && (
            <div>
              <input
                type="text"
                value={exerciseNotes}
                onChange={(e) => setExerciseNotes(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm mb-4"
                placeholder="Exercise notes (optional)"
              />
              <button
                onClick={() => onCompleteExercise(exerciseNotes)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Mark Exercise Complete
              </button>
            </div>
          )}

          {exercise.completed && exercise.notes && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-400 text-sm font-medium mb-1">
                Exercise Notes:
              </p>
              <p className="text-white/80 text-sm">{exercise.notes}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
