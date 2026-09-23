import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { EXERCISE_DATABASE, MUSCLE_LABEL_MAP } from '../data/exercises';
import { MuscleDiagram } from '../components/common/MuscleDiagram';
import { MuscleToken, Routine } from '../types/gym';
import { RoutineEditorModal } from '../components/routine/RoutineEditorModal';

interface TodayViewProps {
  onNavigateToActive: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ onNavigateToActive }) => {
  const {
    settings,
    routines,
    activeSession,
    startSession,
    createOrUpdateRoutine,
    deleteRoutine,
    isDark
  } = useGym();

  const [selectedRoutineOverride, setSelectedRoutineOverride] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  // Daily nutrition tracker check states stored in sessionStorage or local state for the day
  const [creatineTaken, setCreatineTaken] = useState<boolean>(() => {
    return localStorage.getItem('gym_creatine_' + new Date().toISOString().split('T')[0]) === 'true';
  });

  const handleToggleCreatine = () => {
    const next = !creatineTaken;
    setCreatineTaken(next);
    localStorage.setItem('gym_creatine_' + new Date().toISOString().split('T')[0], String(next));
  };

  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

  // Check if today has a routine assigned
  const routineForToday = routines.find(r => r.dayOfWeek === currentDayIndex);
  const isGymDay = settings.gymDays.includes(currentDayIndex) && !!routineForToday;

  const activeRoutine = selectedRoutineOverride
    ? routines.find(r => r.id === selectedRoutineOverride) || routineForToday
    : routineForToday;

  const handleStartOrResume = () => {
    if (activeSession) {
      onNavigateToActive();
    } else if (activeRoutine) {
      startSession(activeRoutine.id);
      onNavigateToActive();
    }
  };

  const routineMuscles: MuscleToken[] = activeRoutine
    ? Array.from(
        new Set(
          activeRoutine.exercises.flatMap(re => {
            const def = EXERCISE_DATABASE.find(e => e.id === re.exerciseId);
            return def ? def.primaryMuscles : [];
          })
        )
      )
    : [];

  const totalSets = activeRoutine
    ? activeRoutine.exercises.reduce((sum, e) => sum + e.targetSets, 0)
    : 0;

  const dateHeading = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="max-w-[480px] mx-auto px-5 pt-6 pb-28">
      {/* Eyebrow and Date */}
      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
          Today
        </p>
        <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink dark:text-ink-dark mt-1">
          {dateHeading}
        </h1>
      </div>

      {/* Routine Scheduled for Today */}
      {isGymDay && activeRoutine ? (
        <div className="space-y-6">
          {/* Active Routine Card */}
          <div className="py-5 px-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
                  Scheduled Workout
                </p>
                <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-ink dark:text-ink-dark mt-1">
                  {activeRoutine.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingRoutine(activeRoutine);
                  setIsEditorOpen(true);
                }}
                className="text-[12px] text-action dark:text-action-dark font-medium"
              >
                Edit
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-hairline-light/60 dark:border-hairline-dark/60">
              <div>
                <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted">Exercises</p>
                <p className="text-[20px] font-semibold text-ink dark:text-ink-dark mt-0.5">
                  {activeRoutine.exercises.length}
                </p>
              </div>
              <div>
                <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted">Total Sets</p>
                <p className="text-[20px] font-semibold text-ink dark:text-ink-dark mt-0.5">
                  {totalSets}
                </p>
              </div>
            </div>

            {/* Muscle Map Thumbnail */}
            {routineMuscles.length > 0 && (
              <div className="mt-5 pt-4 border-t border-hairline-light/60 dark:border-hairline-dark/60 flex flex-col items-center">
                <p className="text-[11px] uppercase tracking-[0.08em] font-medium text-ink-muted dark:text-ink-dark-muted mb-3 self-start">
                  Targeted Muscle Groups
                </p>
                <MuscleDiagram
                  primaryMuscles={routineMuscles}
                  isDark={isDark}
                  size="sm"
                />
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <div>
            <button
              type="button"
              onClick={handleStartOrResume}
              className="w-full py-4 px-6 rounded-full bg-action hover:bg-action-hover dark:bg-action-dark dark:hover:bg-action-dark-hover text-white text-[17px] font-normal transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            >
              {activeSession ? 'Resume Gym Session' : 'Start Gym Session'}
            </button>
            {activeSession && (
              <p className="text-center text-[12px] text-ink-muted dark:text-ink-dark-muted mt-2">
                Session in progress. Tap above to resume.
              </p>
            )}
          </div>

          {/* Checklist of planned exercises */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-ink dark:text-ink-dark">
                Exercise Checklist Lineup
              </h3>
              <span className="text-[12px] text-ink-muted dark:text-ink-dark-muted">
                {activeRoutine.exercises.length} items
              </span>
            </div>

            <div className="space-y-2.5">
              {activeRoutine.exercises.map((re, index) => {
                const def = EXERCISE_DATABASE.find(e => e.id === re.exerciseId);
                if (!def) return null;

                const primaryLabels = def.primaryMuscles
                  .map(m => MUSCLE_LABEL_MAP[m] || m)
                  .join(', ');

                return (
                  <div
                    key={re.id}
                    className="p-4 rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/40 dark:border-hairline-dark/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-surface-1 dark:bg-surface-card-dark text-[12px] font-medium flex items-center justify-center text-ink-muted border border-hairline-light/60 dark:border-hairline-dark/60">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-[15px] font-semibold text-ink dark:text-ink-dark leading-tight">
                          {def.name}
                        </p>
                        <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mt-0.5">
                          {primaryLabels}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-medium text-ink dark:text-ink-dark">
                        {re.targetSets} × {re.targetReps}
                      </p>
                      <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted">
                        {re.targetWeightKg > 0 ? `${re.targetWeightKg}kg · ` : ''}{re.restSeconds}s rest
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* No Gym Session Scheduled Today */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
              Daily Overview
            </span>
            <h2 className="text-[24px] font-semibold text-ink dark:text-ink-dark mt-1">
              No gym session today
            </h2>
            <p className="text-[14px] text-ink-muted dark:text-ink-dark-muted mt-1 leading-relaxed">
              Focus on muscular recovery. Remember to keep up with your daily creatine and calorie targets.
            </p>

            {/* Daily Nutrition & Targets Card */}
            <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-hairline-light/60 dark:border-hairline-dark/60">
              <div
                onClick={handleToggleCreatine}
                className="p-3.5 rounded-2xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 cursor-pointer active:scale-98 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted dark:text-ink-dark-muted">
                    Daily Creatine
                  </span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      creatineTaken
                        ? 'bg-action dark:bg-action-dark text-white'
                        : 'border border-hairline-light dark:border-hairline-dark'
                    }`}
                  >
                    {creatineTaken ? '✓' : ''}
                  </span>
                </div>
                <p className="text-[18px] font-semibold text-ink dark:text-ink-dark mt-1">
                  {settings.dailyCreatineGrams || 5}g
                </p>
                <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted mt-0.5">
                  {creatineTaken ? 'Logged for today' : 'Tap to mark taken'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60">
                <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted dark:text-ink-dark-muted block">
                  Daily Calories
                </span>
                <p className="text-[18px] font-semibold text-ink dark:text-ink-dark mt-1">
                  {(settings.dailyCalories || 2500).toLocaleString()} kcal
                </p>
                <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted mt-0.5">
                  Target configured in Settings
                </p>
              </div>
            </div>
          </div>

          {/* Action to create a routine or start an off-day routine */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => {
                setEditingRoutine(null);
                setIsEditorOpen(true);
              }}
              className="w-full py-3.5 px-6 rounded-full bg-action hover:bg-action-hover dark:bg-action-dark text-white text-[15px] font-normal transition-all shadow-sm"
            >
              + Create Workout Schedule
            </button>

            {routines.length > 0 && (
              <div className="pt-3">
                <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mb-2 text-center">
                  Or start another routine today:
                </p>
                <div className="flex flex-col gap-2">
                  {routines.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setSelectedRoutineOverride(r.id);
                        startSession(r.id);
                        onNavigateToActive();
                      }}
                      className="w-full p-3.5 text-left rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-[14px] font-semibold text-ink dark:text-ink-dark">
                          {r.name}
                        </p>
                        <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted">
                          {r.exercises.length} exercises
                        </p>
                      </div>
                      <span className="text-[12px] text-action dark:text-action-dark font-medium">
                        Start ›
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Routine Editor Modal */}
      <RoutineEditorModal
        isOpen={isEditorOpen}
        initialRoutine={editingRoutine}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingRoutine(null);
        }}
        onSave={createOrUpdateRoutine}
        onDelete={deleteRoutine}
      />
    </div>
  );
};
