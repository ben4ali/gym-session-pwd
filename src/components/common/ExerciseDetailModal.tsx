import React from 'react';
import { Exercise } from '../../types/gym';
import { MUSCLE_LABEL_MAP } from '../../data/exercises';
import { MuscleDiagram } from './MuscleDiagram';
import { useGym } from '../../context/GymContext';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (exerciseId: string) => void;
  isAdded?: boolean;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onAdd,
  isAdded = false
}) => {
  const { isDark } = useGym();

  if (!isOpen || !exercise) return null;

  const primarySummary = exercise.primaryMuscles
    .map(m => MUSCLE_LABEL_MAP[m] || m)
    .join(', ');

  const secondarySummary = exercise.secondaryMuscles
    .map(m => MUSCLE_LABEL_MAP[m] || m)
    .join(', ');

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-surface-1 dark:bg-surface-1-dark border border-hairline-light dark:border-hairline-dark p-6 shadow-2xl">
        {/* Mobile drag handle */}
        <div className="w-12 h-1 bg-hairline-light dark:bg-hairline-dark rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
              {exercise.category} · {exercise.equipment}
            </span>
            <h2 className="text-[24px] font-semibold text-ink dark:text-ink-dark mt-0.5 tracking-tight leading-snug">
              {exercise.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2 dark:bg-surface-2-dark text-ink-muted hover:text-ink shrink-0 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Recommended Protocol */}
        <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 text-center">
          <div>
            <span className="text-[11px] text-ink-muted dark:text-ink-dark-muted block">Sets</span>
            <span className="text-[16px] font-semibold text-ink dark:text-ink-dark">{exercise.defaultSets}</span>
          </div>
          <div>
            <span className="text-[11px] text-ink-muted dark:text-ink-dark-muted block">Reps</span>
            <span className="text-[16px] font-semibold text-ink dark:text-ink-dark">{exercise.defaultReps}</span>
          </div>
          <div>
            <span className="text-[11px] text-ink-muted dark:text-ink-dark-muted block">Rest</span>
            <span className="text-[16px] font-semibold text-ink dark:text-ink-dark">{exercise.defaultRestSeconds}s</span>
          </div>
        </div>

        {/* Visual Muscle Impact Section */}
        <div className="mb-6 p-4 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
              Targeted Anatomy
            </p>
            <p className="text-[14px] font-medium text-ink dark:text-ink-dark mt-0.5">
              Primary: <span className="text-action dark:text-action-dark">{primarySummary}</span>
            </p>
            {exercise.secondaryMuscles.length > 0 && (
              <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mt-0.5">
                Synergists: {secondarySummary}
              </p>
            )}
          </div>

          <div className="pt-3 flex justify-center border-t border-hairline-light/40 dark:border-hairline-dark/40">
            <MuscleDiagram
              primaryMuscles={exercise.primaryMuscles}
              secondaryMuscles={exercise.secondaryMuscles}
              isDark={isDark}
              size="md"
            />
          </div>
        </div>

        {/* Execution Instructions */}
        <div className="mb-6">
          <h3 className="text-[14px] font-semibold text-ink dark:text-ink-dark mb-2">
            Execution Instructions
          </h3>
          <div className="space-y-2 text-[13px] text-ink dark:text-ink-dark">
            {exercise.instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-semibold text-ink-muted dark:text-ink-dark-muted">
                  {idx + 1}.
                </span>
                <p className="leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {onAdd ? (
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-full border border-hairline-light dark:border-hairline-dark text-ink dark:text-ink-dark text-[15px] font-medium transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onAdd(exercise.id);
                onClose();
              }}
              className="flex-1 py-3.5 rounded-full bg-action dark:bg-action-dark text-white text-[15px] font-medium shadow-sm transition-all active:scale-[0.98]"
            >
              {isAdded ? 'Add Another Set' : '+ Add to Routine'}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 rounded-full bg-action dark:bg-action-dark text-white text-[15px] font-normal transition-colors"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};
