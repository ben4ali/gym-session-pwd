import React, { useState } from 'react';
import { Routine, RoutineExercise } from '../../types/gym';
import { EXERCISE_DATABASE, MUSCLE_LABEL_MAP } from '../../data/exercises';

const DAYS_OF_WEEK = [
  { index: 1, name: 'Monday' },
  { index: 2, name: 'Tuesday' },
  { index: 3, name: 'Wednesday' },
  { index: 4, name: 'Thursday' },
  { index: 5, name: 'Friday' },
  { index: 6, name: 'Saturday' },
  { index: 0, name: 'Sunday' }
];

interface RoutineEditorModalProps {
  initialRoutine?: Routine | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (routine: Routine) => void;
  onDelete?: (routineId: string) => void;
}

export const RoutineEditorModal: React.FC<RoutineEditorModalProps> = ({
  initialRoutine,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState<string>(initialRoutine?.name || '');
  const [dayOfWeek, setDayOfWeek] = useState<number>(initialRoutine?.dayOfWeek ?? 1);
  const [exercises, setExercises] = useState<RoutineExercise[]>(
    initialRoutine?.exercises || []
  );

  // Exercise picker state
  const [isPickingExercise, setIsPickingExercise] = useState<boolean>(false);
  const [exerciseSearch, setExerciseSearch] = useState<string>('');

  if (!isOpen) return null;

  const handleAddExercise = (exerciseId: string) => {
    const def = EXERCISE_DATABASE.find(e => e.id === exerciseId);
    if (!def) return;

    const newEx: RoutineExercise = {
      id: 're-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      exerciseId,
      targetSets: def.defaultSets,
      targetReps: def.defaultReps,
      targetWeightKg: 20,
      restSeconds: def.defaultRestSeconds
    };

    setExercises(prev => [...prev, newEx]);
    setIsPickingExercise(false);
    setExerciseSearch('');
  };

  const handleRemoveExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateExerciseParam = (
    id: string,
    field: 'targetSets' | 'targetReps' | 'targetWeightKg' | 'restSeconds',
    value: number
  ) => {
    setExercises(prev =>
      prev.map(e => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= exercises.length) return;
    const copy = [...exercises];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    setExercises(copy);
  };

  const handleSave = () => {
    const routineId = initialRoutine?.id || 'routine-' + Date.now();
    const routineTitle = name.trim() || 'Custom Routine';

    const savedRoutine: Routine = {
      id: routineId,
      name: routineTitle,
      dayOfWeek,
      exercises
    };

    onSave(savedRoutine);
    onClose();
  };

  // Filtered exercises for picker
  const filteredCatalog = EXERCISE_DATABASE.filter(ex => {
    const q = exerciseSearch.toLowerCase();
    return (
      ex.name.toLowerCase().includes(q) ||
      ex.category.toLowerCase().includes(q) ||
      ex.primaryMuscles.some(m => m.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-[500px] max-h-[90vh] flex flex-col rounded-3xl bg-surface-1 dark:bg-surface-1-dark border border-hairline-light dark:border-hairline-dark shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-hairline-light/50 dark:border-hairline-dark/50 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
              Schedule Builder
            </span>
            <h2 className="text-[20px] font-semibold text-ink dark:text-ink-dark">
              {initialRoutine ? 'Edit Workout Routine' : 'Create Workout Routine'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-2 dark:bg-surface-2-dark text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Routine Name */}
          <div>
            <label className="text-[12px] font-medium text-ink-muted dark:text-ink-dark-muted uppercase tracking-wider block mb-1.5">
              Routine Title
            </label>
            <input
              type="text"
              placeholder="e.g. Push (Chest & Shoulders)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-[15px] font-medium rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/60 dark:border-hairline-dark/60 text-ink dark:text-ink-dark focus:outline-none focus:border-action"
            />
          </div>

          {/* Day of Week Selector */}
          <div>
            <label className="text-[12px] font-medium text-ink-muted dark:text-ink-dark-muted uppercase tracking-wider block mb-1.5">
              Day of the Week
            </label>
            <div className="grid grid-cols-7 gap-1">
              {DAYS_OF_WEEK.map(d => {
                const isSelected = dayOfWeek === d.index;
                return (
                  <button
                    key={d.index}
                    type="button"
                    onClick={() => setDayOfWeek(d.index)}
                    className={`py-2 rounded-xl text-[12px] font-medium transition-colors ${
                      isSelected
                        ? 'bg-action dark:bg-action-dark text-white'
                        : 'bg-surface-2 dark:bg-surface-2-dark text-ink dark:text-ink-dark border border-hairline-light/50 dark:border-hairline-dark/50'
                    }`}
                  >
                    {d.name.substring(0, 3)}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted mt-1.5">
              Scheduled for {DAYS_OF_WEEK.find(d => d.index === dayOfWeek)?.name}
            </p>
          </div>

          {/* Exercise Lineup in Routine */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-[12px] font-medium text-ink-muted dark:text-ink-dark-muted uppercase tracking-wider">
                Exercises ({exercises.length})
              </label>
              <button
                type="button"
                onClick={() => setIsPickingExercise(true)}
                className="text-[13px] text-action dark:text-action-dark hover:opacity-80 font-medium"
              >
                + Add Exercise
              </button>
            </div>

            {exercises.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-hairline-light dark:border-hairline-dark rounded-2xl">
                <p className="text-[14px] text-ink-muted dark:text-ink-dark-muted">
                  No exercises added to this routine yet.
                </p>
                <button
                  type="button"
                  onClick={() => setIsPickingExercise(true)}
                  className="mt-2 text-[13px] text-action dark:text-action-dark font-medium"
                >
                  Pick from exercise library ›
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {exercises.map((re, idx) => {
                  const def = EXERCISE_DATABASE.find(e => e.id === re.exerciseId);
                  if (!def) return null;

                  return (
                    <div
                      key={re.id}
                      className="p-3.5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 space-y-3"
                    >
                      {/* Title & Reorder/Remove */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-surface-1 dark:bg-surface-card-dark text-[11px] font-medium flex items-center justify-center text-ink-muted">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-[14px] font-semibold text-ink dark:text-ink-dark leading-tight">
                              {def.name}
                            </p>
                            <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted">
                              {def.category} · {def.primaryMuscles.map(m => MUSCLE_LABEL_MAP[m] || m).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveExercise(idx, 'up')}
                            className="w-6 h-6 rounded flex items-center justify-center text-[12px] text-ink-muted hover:text-ink disabled:opacity-20"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === exercises.length - 1}
                            onClick={() => handleMoveExercise(idx, 'down')}
                            className="w-6 h-6 rounded flex items-center justify-center text-[12px] text-ink-muted hover:text-ink disabled:opacity-20"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExercise(re.id)}
                            className="text-[12px] text-red-500 hover:text-red-700 ml-1 px-1.5"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Parameters: Sets, Reps, Weight, Rest */}
                      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-hairline-light/40 dark:border-hairline-dark/40 text-center">
                        <div>
                          <label className="text-[10px] text-ink-muted dark:text-ink-dark-muted uppercase block">
                            Sets
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={re.targetSets}
                            onChange={e =>
                              handleUpdateExerciseParam(
                                re.id,
                                'targetSets',
                                parseInt(e.target.value, 10) || 1
                              )
                            }
                            className="w-full mt-0.5 py-1 text-center text-[13px] font-medium rounded-lg bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 text-ink dark:text-ink-dark"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-ink-muted dark:text-ink-dark-muted uppercase block">
                            Reps
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={re.targetReps}
                            onChange={e =>
                              handleUpdateExerciseParam(
                                re.id,
                                'targetReps',
                                parseInt(e.target.value, 10) || 1
                              )
                            }
                            className="w-full mt-0.5 py-1 text-center text-[13px] font-medium rounded-lg bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 text-ink dark:text-ink-dark"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-ink-muted dark:text-ink-dark-muted uppercase block">
                            Weight (kg)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="2.5"
                            value={re.targetWeightKg}
                            onChange={e =>
                              handleUpdateExerciseParam(
                                re.id,
                                'targetWeightKg',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full mt-0.5 py-1 text-center text-[13px] font-medium rounded-lg bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 text-ink dark:text-ink-dark"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-ink-muted dark:text-ink-dark-muted uppercase block">
                            Rest (sec)
                          </label>
                          <input
                            type="number"
                            min="15"
                            step="15"
                            value={re.restSeconds}
                            onChange={e =>
                              handleUpdateExerciseParam(
                                re.id,
                                'restSeconds',
                                parseInt(e.target.value, 10) || 60
                              )
                            }
                            className="w-full mt-0.5 py-1 text-center text-[13px] font-medium rounded-lg bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 text-ink dark:text-ink-dark"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-hairline-light/50 dark:border-hairline-dark/50 flex items-center justify-between gap-2">
          {initialRoutine && onDelete && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this routine?')) {
                  onDelete(initialRoutine.id);
                  onClose();
                }
              }}
              className="py-3 px-4 text-[13px] font-medium text-red-600 hover:text-red-700"
            >
              Delete Routine
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-[14px] rounded-full border border-hairline-light dark:border-hairline-dark text-ink dark:text-ink-dark"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-2.5 px-6 rounded-full bg-action dark:bg-action-dark text-white text-[14px] font-normal shadow-sm"
            >
              Save Routine
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Library Picker Submodal */}
      {isPickingExercise && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-[460px] max-h-[85vh] flex flex-col rounded-3xl bg-surface-1 dark:bg-surface-1-dark border border-hairline-light dark:border-hairline-dark shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-hairline-light/50 dark:border-hairline-dark/50 flex items-center justify-between">
              <h3 className="text-[17px] font-semibold text-ink dark:text-ink-dark">
                Choose an Exercise
              </h3>
              <button
                type="button"
                onClick={() => setIsPickingExercise(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-surface-2 dark:bg-surface-2-dark text-ink-muted"
              >
                ✕
              </button>
            </div>

            <div className="p-3 border-b border-hairline-light/40 dark:border-hairline-dark/40">
              <input
                type="text"
                placeholder="Search catalog by name or muscle..."
                value={exerciseSearch}
                onChange={e => setExerciseSearch(e.target.value)}
                className="w-full px-3 py-2 text-[14px] rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/60 dark:border-hairline-dark/60 text-ink dark:text-ink-dark focus:outline-none focus:border-action"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {filteredCatalog.map(ex => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleAddExercise(ex.id)}
                  className="w-full p-3 text-left rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/40 dark:border-hairline-dark/40 hover:bg-surface-1 dark:hover:bg-surface-1-dark flex items-center justify-between transition-colors"
                >
                  <div>
                    <p className="text-[14px] font-semibold text-ink dark:text-ink-dark">
                      {ex.name}
                    </p>
                    <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted">
                      {ex.category} · {ex.primaryMuscles.map(m => MUSCLE_LABEL_MAP[m] || m).join(', ')}
                    </p>
                  </div>
                  <span className="text-[12px] text-action dark:text-action-dark font-medium">
                    + Add
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
