import React from 'react';
import { useGym } from '../context/GymContext';
import { MUSCLE_LABEL_MAP } from '../data/exercises';
import { MuscleToken } from '../types/gym';

export const DashboardView: React.FC = () => {
  const { history, settings } = useGym();

  // Metrics calculation
  const totalWorkouts = history.length;
  const totalSets = history.reduce((sum, h) => sum + h.totalSetsCompleted, 0);
  const totalMinutes = history.reduce((sum, h) => sum + h.durationMinutes, 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

  // Streak calculation (days with workout in last 30 days)
  const calculateStreak = () => {
    if (history.length === 0) return 0;
    // Count workouts this calendar week
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = (now.getDay() + 6) % 7; // Monday = 0
    startOfWeek.setDate(now.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const workoutsThisWeek = history.filter(h => new Date(h.date) >= startOfWeek).length;
    return workoutsThisWeek;
  };

  const workoutsThisWeek = calculateStreak();
  const scheduledPerWeek = settings.gymDays.length;

  // Muscle group frequency distribution over past sessions
  const muscleCounts: Record<string, number> = {};
  history.forEach(session => {
    session.exercisesCompleted.forEach(ex => {
      ex.primaryMuscles.forEach((muscle: MuscleToken) => {
        muscleCounts[muscle] = (muscleCounts[muscle] || 0) + ex.setsCompleted;
      });
    });
  });

  const sortedMuscles = Object.entries(muscleCounts).sort((a, b) => b[1] - a[1]);
  const maxMuscleCount = sortedMuscles[0]?.[1] || 1;

  return (
    <div className="max-w-[480px] mx-auto px-5 pt-6 pb-28">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
          Overview
        </p>
        <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink dark:text-ink-dark mt-1">
          Performance
        </h1>
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
            Weekly Rhythm
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[28px] font-semibold tracking-tight text-ink dark:text-ink-dark">
              {workoutsThisWeek}
            </span>
            <span className="text-[14px] text-ink-muted dark:text-ink-dark-muted">
              / {scheduledPerWeek} target
            </span>
          </div>
          <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted mt-1">
            {workoutsThisWeek >= scheduledPerWeek
              ? 'Target achieved this week'
              : `${scheduledPerWeek - workoutsThisWeek} sessions remaining`}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
            All-Time Sessions
          </p>
          <div className="mt-1">
            <span className="text-[28px] font-semibold tracking-tight text-ink dark:text-ink-dark">
              {totalWorkouts}
            </span>
          </div>
          <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted mt-1">
            {totalSets} total sets completed
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
            Average Time
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-[28px] font-semibold tracking-tight text-ink dark:text-ink-dark">
              {avgDuration}
            </span>
            <span className="text-[14px] text-ink-muted dark:text-ink-dark-muted">min</span>
          </div>
          <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted mt-1">
            Per completed session
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
            Active Schedule
          </p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-[28px] font-semibold tracking-tight text-ink dark:text-ink-dark">
              {scheduledPerWeek}
            </span>
            <span className="text-[14px] text-ink-muted dark:text-ink-dark-muted">days/wk</span>
          </div>
          <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted mt-1">
            Configured in Settings
          </p>
        </div>
      </div>

      {/* Muscle Focus Distribution */}
      <div className="mb-6 p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
        <h2 className="text-[15px] font-semibold text-ink dark:text-ink-dark mb-1">
          Muscle Stimulus Distribution
        </h2>
        <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mb-4">
          Volume distribution across muscle groups based on logged sets.
        </p>

        {sortedMuscles.length > 0 ? (
          <div className="space-y-3">
            {sortedMuscles.slice(0, 6).map(([muscleKey, setsCount]) => {
              const label = MUSCLE_LABEL_MAP[muscleKey] || muscleKey;
              const percentage = Math.round((setsCount / maxMuscleCount) * 100);

              return (
                <div key={muscleKey} className="space-y-1">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-ink dark:text-ink-dark font-medium">{label}</span>
                    <span className="text-ink-muted dark:text-ink-dark-muted">{setsCount} sets</span>
                  </div>
                  <div className="w-full bg-hairline-light dark:bg-hairline-dark h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-action dark:bg-action-dark h-full rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted py-4 text-center">
            Complete your first session to see your muscle volume distribution.
          </p>
        )}
      </div>

      {/* Recent Activity Log */}
      <div>
        <h2 className="text-[15px] font-semibold text-ink dark:text-ink-dark mb-3">
          Recent Activity
        </h2>
        {history.length > 0 ? (
          <div className="space-y-2.5">
            {history.slice(0, 5).map(session => (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/40 dark:border-hairline-dark/40 flex items-center justify-between"
              >
                <div>
                  <p className="text-[14px] font-semibold text-ink dark:text-ink-dark">
                    {session.routineName}
                  </p>
                  <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mt-0.5">
                    {new Date(session.date + 'T12:00:00').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}{' '}
                    · {session.totalSetsCompleted} sets
                  </p>
                </div>
                <span className="text-[13px] font-mono text-ink-muted dark:text-ink-dark-muted">
                  {session.durationMinutes}m
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/40 dark:border-hairline-dark/40 text-center">
            <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted">
              No sessions logged yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
