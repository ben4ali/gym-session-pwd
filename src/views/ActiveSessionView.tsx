import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGym } from '../context/GymContext';
import { EXERCISE_DATABASE, MUSCLE_LABEL_MAP } from '../data/exercises';
import { MuscleDiagram } from '../components/common/MuscleDiagram';
import { useRestTimer } from '../hooks/useRestTimer';
import { RoutineEditorModal } from '../components/routine/RoutineEditorModal';
import { Routine } from '../types/gym';
import { fireExerciseConfetti, fireSessionCompleteConfetti } from '../utils/confetti';

const DAYS_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface ActiveSessionViewProps {
  onSessionFinished: () => void;
}

export const ActiveSessionView: React.FC<ActiveSessionViewProps> = ({ onSessionFinished }) => {
  const {
    activeSession,
    routines,
    startSession,
    completeSet,
    updateSetValues,
    setCurrentExerciseIndex,
    finishSession,
    cancelSession,
    createOrUpdateRoutine,
    deleteRoutine,
    isDark
  } = useGym();

  const [activeTab, setActiveTab] = useState<'flow' | 'overview'>('flow');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [confirmCancel, setConfirmCancel] = useState<boolean>(false);

  // Step-by-step pipeline state: 'set' | 'rest' | 'complete'
  const [stepMode, setStepMode] = useState<'set' | 'rest' | 'complete'>('set');
  const [activeSetIndex, setActiveSetIndex] = useState<number>(0);

  // Routine editor modal state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  // Rest timer
  const {
    remainingSeconds,
    totalSeconds,
    isPaused: isTimerPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    skipTimer,
    adjustTime
  } = useRestTimer(() => {
    // When timer naturally finishes at 00:00:
    handleRestComplete();
  });

  // Elapsed workout timer
  useEffect(() => {
    if (!activeSession) return;
    const startMs = new Date(activeSession.startedAt).getTime();
    const updateElapsed = () => {
      const now = Date.now();
      setElapsedSeconds(Math.max(0, Math.floor((now - startMs) / 1000)));
    };
    updateElapsed();
    const interval = window.setInterval(updateElapsed, 1000);
    return () => window.clearInterval(interval);
  }, [activeSession]);

  // When exercise changes, sync activeSetIndex to first incomplete set
  useEffect(() => {
    if (!activeSession) return;
    const currentEx = activeSession.exerciseProgress[activeSession.currentExerciseIndex];
    if (currentEx) {
      const firstIncomplete = currentEx.sets.findIndex(s => !s.completed);
      if (firstIncomplete !== -1) {
        setActiveSetIndex(firstIncomplete);
        setStepMode('set');
      } else {
        setActiveSetIndex(currentEx.sets.length - 1);
        setStepMode('complete');
      }
    }
  }, [activeSession?.currentExerciseIndex]);

  // IDLE STATE: No workout active
  if (!activeSession) {
    return (
      <div className="max-w-[480px] mx-auto px-5 pt-8 pb-32">
        <div className="mb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
            Gym Workouts
          </p>
          <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink dark:text-ink-dark mt-1">
            Workout
          </h1>
        </div>

        {/* Schedule & Routine Builder Card */}
        <div className="p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 mb-6">
          <h2 className="text-[18px] font-semibold text-ink dark:text-ink-dark">
            Workout Schedules
          </h2>
          <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mt-1 leading-relaxed">
            Create or edit your gym day schedules, pick exercises from the library, set target sets, reps, weight, and rest durations.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingRoutine(null);
              setIsEditorOpen(true);
            }}
            className="w-full mt-4 py-3.5 px-5 rounded-full bg-action dark:bg-action-dark text-white text-[15px] font-normal transition-all active:scale-[0.98] shadow-sm"
          >
            + Create Workout Schedule
          </button>
        </div>

        {/* List of Configured Routines */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-ink dark:text-ink-dark">
              Available Routines ({routines.length})
            </h3>
          </div>

          {routines.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-hairline-light dark:border-hairline-dark">
              <p className="text-[14px] text-ink-muted dark:text-ink-dark-muted">
                No workout schedules created yet.
              </p>
              <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mt-1">
                Tap above to set up your first workout routine.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {routines.map(r => {
                const dayName = DAYS_NAMES[r.dayOfWeek];
                return (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-medium uppercase tracking-wider text-action dark:text-action-dark">
                          {dayName}
                        </span>
                        <h4 className="text-[17px] font-semibold text-ink dark:text-ink-dark mt-0.5">
                          {r.name}
                        </h4>
                        <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mt-0.5">
                          {r.exercises.length} exercises configured
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingRoutine(r);
                          setIsEditorOpen(true);
                        }}
                        className="text-[12px] text-action dark:text-action-dark font-medium px-2 py-1"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="pt-2 border-t border-hairline-light/40 dark:border-hairline-dark/40 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => startSession(r.id)}
                        className="w-full py-2.5 rounded-full bg-ink text-white dark:bg-ink-dark dark:text-black text-[13px] font-medium transition-all"
                      >
                        Start {r.name}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
  }

  // ACTIVE SESSION RUNNING
  const currentExProgress = activeSession.exerciseProgress[activeSession.currentExerciseIndex];
  const exerciseDef = EXERCISE_DATABASE.find(e => e.id === currentExProgress?.exerciseId);
  const currentRoutine = routines.find(r => r.id === activeSession.routineId);
  const currentRoutineEx = currentRoutine?.exercises.find(
    re => re.id === currentExProgress?.routineExerciseId
  );

  const defaultRest = currentRoutineEx?.restSeconds || exerciseDef?.defaultRestSeconds || 75;
  const totalExercises = activeSession.exerciseProgress.length;
  const currentExNumber = activeSession.currentExerciseIndex + 1;
  const totalSets = currentExProgress?.sets.length || 0;
  const currentSet = currentExProgress?.sets[activeSetIndex] || currentExProgress?.sets[0];

  // Complete a set and advance slide
  const handleCheckCurrentSet = () => {
    if (!currentExProgress) return;
    const isLastSet = activeSetIndex === totalSets - 1;

    // Mark current set as completed in context
    completeSet(activeSession.currentExerciseIndex, activeSetIndex, true);

    if (!isLastSet) {
      // Intermediate set: start rest timer and slide to circular timer card
      startTimer(defaultRest);
      setStepMode('rest');
    } else {
      // Last set: no rest timer! Slide directly to exercise complete card
      skipTimer();
      setStepMode('complete');
      fireExerciseConfetti();
    }
  };

  // Rest timer completed or skipped
  const handleRestComplete = () => {
    skipTimer();
    const nextSetIdx = activeSetIndex + 1;
    if (nextSetIdx < totalSets) {
      setActiveSetIndex(nextSetIdx);
      setStepMode('set');
    } else {
      setStepMode('complete');
    }
  };

  // Back step navigation
  const handleStepBack = () => {
    if (stepMode === 'rest') {
      // Cancel rest, uncomplete current set, return to current set card
      skipTimer();
      completeSet(activeSession.currentExerciseIndex, activeSetIndex, false);
      setStepMode('set');
    } else if (stepMode === 'complete') {
      // Revert from complete to the last set
      skipTimer();
      setStepMode('set');
    } else if (stepMode === 'set') {
      if (activeSetIndex > 0) {
        // Go back to previous set
        const prevSetIdx = activeSetIndex - 1;
        setActiveSetIndex(prevSetIdx);
        setStepMode('set');
      } else if (activeSession.currentExerciseIndex > 0) {
        // Go back to previous exercise
        skipTimer();
        const prevExIdx = activeSession.currentExerciseIndex - 1;
        setCurrentExerciseIndex(prevExIdx);
        const prevEx = activeSession.exerciseProgress[prevExIdx];
        setActiveSetIndex(Math.max(0, (prevEx?.sets.length || 1) - 1));
        setStepMode('set');
      }
    }
  };

  // Move to next exercise
  const handleNextExercise = () => {
    skipTimer();
    if (activeSession.currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(activeSession.currentExerciseIndex + 1);
      setActiveSetIndex(0);
      setStepMode('set');
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    skipTimer();
    fireSessionCompleteConfetti();
    finishSession();
    onSessionFinished();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Circular timer calculations (Apple Watch style)
  const timerRadius = 96;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const timerProgress = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0;
  const strokeDashoffset = timerCircumference - timerProgress * timerCircumference;

  const allExercisesCompleted = activeSession.exerciseProgress.every(ep => ep.isCompleted);

  return (
    <div className="max-w-[480px] mx-auto px-5 pt-4 pb-36">
      {/* Session Top Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-hairline-light/50 dark:border-hairline-dark/50">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
            {activeSession.routineName}
          </span>
          <p className="text-[14px] font-semibold text-ink dark:text-ink-dark mt-0.5">
            Exercise {currentExNumber} of {totalExercises}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-ink-muted dark:text-ink-dark-muted uppercase tracking-wider block">
              Time
            </span>
            <span className="text-[13px] font-mono font-medium text-ink dark:text-ink-dark">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="text-[12px] text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark px-2 py-1"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* View Switcher: Step Pipeline vs Session Progress & Schedule */}
      <div className="flex gap-1 p-1 bg-surface-2 dark:bg-surface-2-dark rounded-full my-4 border border-hairline-light/50 dark:border-hairline-dark/50">
        <button
          type="button"
          onClick={() => setActiveTab('flow')}
          className={`flex-1 py-1.5 text-[12px] font-medium rounded-full transition-all ${
            activeTab === 'flow'
              ? 'bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark shadow-sm'
              : 'text-ink-muted dark:text-ink-dark-muted'
          }`}
        >
          Active Step
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-1.5 text-[12px] font-medium rounded-full transition-all ${
            activeTab === 'overview'
              ? 'bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark shadow-sm'
              : 'text-ink-muted dark:text-ink-dark-muted'
          }`}
        >
          Session Progress & Schedule
        </button>
      </div>

      {/* Cancel Confirmation Prompt */}
      {confirmCancel && (
        <div className="my-4 p-4 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light dark:border-hairline-dark">
          <p className="text-[14px] font-medium text-ink dark:text-ink-dark">
            Cancel this workout?
          </p>
          <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mt-1">
            Progress for this session will not be saved.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                skipTimer();
                cancelSession();
                setConfirmCancel(false);
              }}
              className="px-4 py-1.5 text-[13px] rounded-full bg-red-600 text-white font-medium"
            >
              Discard Session
            </button>
            <button
              type="button"
              onClick={() => setConfirmCancel(false)}
              className="px-4 py-1.5 text-[13px] rounded-full bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark"
            >
              Keep Going
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: STEP-BY-STEP SLIDE CARD FLOW */}
      {activeTab === 'flow' && exerciseDef && currentExProgress && (
        <div className="relative min-h-[520px]">
          {/* Step Breadcrumbs / Progress Pills */}
          <div className="flex items-center justify-between mb-3 px-1 text-[11px] text-ink-muted dark:text-ink-dark-muted">
            <button
              type="button"
              onClick={handleStepBack}
              disabled={activeSession.currentExerciseIndex === 0 && activeSetIndex === 0 && stepMode === 'set'}
              className="flex items-center gap-1 font-medium hover:text-ink dark:hover:text-ink-dark disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              ‹ Back
            </button>

            <div className="flex items-center gap-1.5">
              {currentExProgress.sets.map((s, idx) => (
                <span
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeSetIndex
                      ? 'bg-action dark:bg-action-dark scale-125'
                      : s.completed
                      ? 'bg-action/50 dark:bg-action-dark/50'
                      : 'bg-hairline-light dark:bg-hairline-dark'
                  }`}
                />
              ))}
            </div>

            <span className="font-medium">
              {stepMode === 'rest'
                ? 'Rest Interval'
                : stepMode === 'complete'
                ? 'Done'
                : `Set ${activeSetIndex + 1} of ${totalSets}`}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {/* 1. SET CARD SLIDE */}
            {stepMode === 'set' && currentSet && (
              <motion.div
                key={`set-${activeSession.currentExerciseIndex}-${activeSetIndex}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4"
              >
                {/* BIG HERO CARD SHOWING MUSCLE GROUP AND EXERCISE INFO */}
                <div className="p-5 rounded-3xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
                        {exerciseDef.category} · {exerciseDef.equipment}
                      </span>
                      <h2 className="text-[24px] font-semibold text-ink dark:text-ink-dark mt-0.5 tracking-tight leading-tight">
                        {exerciseDef.name}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowInstructions(!showInstructions)}
                      className="text-[12px] text-action dark:text-action-dark font-medium px-2 py-1"
                    >
                      {showInstructions ? 'Hide Form' : 'Form Cues'}
                    </button>
                  </div>

                  {/* Form Instructions if toggled */}
                  {showInstructions && (
                    <div className="mt-3 p-3.5 rounded-xl bg-surface-1 dark:bg-surface-card-dark text-[12px] text-ink dark:text-ink-dark space-y-1.5 border border-hairline-light/40 dark:border-hairline-dark/40">
                      {exerciseDef.instructions.map((step, idx) => (
                        <p key={idx} className="leading-relaxed">
                          <span className="font-semibold text-ink-muted mr-1">{idx + 1}.</span>
                          {step}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Muscle Diagram Front and Center */}
                  <div className="mt-4 pt-3 border-t border-hairline-light/40 dark:border-hairline-dark/40 flex flex-col items-center">
                    <MuscleDiagram
                      primaryMuscles={exerciseDef.primaryMuscles}
                      secondaryMuscles={exerciseDef.secondaryMuscles}
                      isDark={isDark}
                      size="md"
                    />
                    <p className="text-[12px] font-medium text-ink-muted dark:text-ink-dark-muted mt-2 text-center">
                      Target: {exerciseDef.primaryMuscles.map(m => MUSCLE_LABEL_MAP[m] || m).join(', ')}
                    </p>
                  </div>
                </div>

                {/* ACTIVE SET CARD WITH CHECK CIRCLE */}
                <div className="p-5 rounded-3xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light dark:border-hairline-dark shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-action dark:text-action-dark">
                        {activeSetIndex === totalSets - 1 ? 'Final Set of Exercise' : 'Target Target Protocol'}
                      </span>
                      <h3 className="text-[20px] font-semibold text-ink dark:text-ink-dark mt-0.5">
                        Set {activeSetIndex + 1} of {totalSets}
                      </h3>
                    </div>

                    <span className="text-[12px] text-ink-muted dark:text-ink-dark-muted">
                      {defaultRest}s rest after
                    </span>
                  </div>

                  {/* Weight and Reps Adjustment */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 text-center">
                      <span className="text-[11px] text-ink-muted dark:text-ink-dark-muted uppercase font-medium block">
                        Weight
                      </span>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <input
                          type="number"
                          step="2.5"
                          value={currentSet.weightKg}
                          onChange={e =>
                            updateSetValues(
                              activeSession.currentExerciseIndex,
                              activeSetIndex,
                              parseFloat(e.target.value) || 0,
                              currentSet.targetReps
                            )
                          }
                          className="w-16 text-center text-[22px] font-semibold bg-transparent text-ink dark:text-ink-dark focus:outline-none"
                        />
                        <span className="text-[14px] font-medium text-ink-muted">kg</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 text-center">
                      <span className="text-[11px] text-ink-muted dark:text-ink-dark-muted uppercase font-medium block">
                        Target Reps
                      </span>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <input
                          type="number"
                          value={currentSet.targetReps}
                          onChange={e =>
                            updateSetValues(
                              activeSession.currentExerciseIndex,
                              activeSetIndex,
                              currentSet.weightKg,
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          className="w-16 text-center text-[22px] font-semibold bg-transparent text-ink dark:text-ink-dark focus:outline-none"
                        />
                        <span className="text-[14px] font-medium text-ink-muted">reps</span>
                      </div>
                    </div>
                  </div>

                  {/* BIG PROMINENT CHECK CIRCLE BUTTON */}
                  <div className="flex flex-col items-center pt-2">
                    <button
                      type="button"
                      onClick={handleCheckCurrentSet}
                      className="w-24 h-24 rounded-full border-2 border-action dark:border-action-dark bg-action/10 hover:bg-action dark:bg-action-dark/15 dark:hover:bg-action-dark text-action dark:text-action-dark hover:text-white dark:hover:text-white transition-all duration-200 active:scale-95 flex flex-col items-center justify-center shadow-sm group"
                      aria-label="Mark set done and advance"
                    >
                      <span className="text-[30px] font-semibold leading-none group-hover:scale-110 transition-transform">
                        ✓
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-wider mt-1">
                        Set Done
                      </span>
                    </button>
                    <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mt-3">
                      Tap circle once completed to log and start timer
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. CIRCULAR TIMER SLIDE CARD */}
            {stepMode === 'rest' && (
              <motion.div
                key={`rest-${activeSession.currentExerciseIndex}-${activeSetIndex}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 rounded-3xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 flex flex-col items-center text-center space-y-6"
              >
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-action dark:text-action-dark">
                    Set {activeSetIndex + 1} Finished
                  </span>
                  <h3 className="text-[22px] font-semibold text-ink dark:text-ink-dark mt-0.5">
                    Rest & Recovery
                  </h3>
                  <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mt-0.5">
                    Catch your breath before Set {activeSetIndex + 2} of {totalSets}
                  </p>
                </div>

                {/* Circular SVG Apple-Watch Style Timer */}
                <div className="relative w-56 h-56 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 220 220">
                    {/* Background ring */}
                    <circle
                      cx="110"
                      cy="110"
                      r={timerRadius}
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-hairline-light dark:text-hairline-dark"
                    />
                    {/* Active progress ring */}
                    <circle
                      cx="110"
                      cy="110"
                      r={timerRadius}
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={timerCircumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="text-action dark:text-action-dark transition-all duration-300"
                    />
                  </svg>

                  {/* Large Digital Countdown inside circle */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[44px] font-mono font-semibold text-ink dark:text-ink-dark tracking-tight leading-none">
                      {formatTime(remainingSeconds)}
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-wider text-ink-muted dark:text-ink-dark-muted mt-2">
                      Seconds Left
                    </span>
                  </div>
                </div>

                {/* Rest Controller Buttons */}
                <div className="flex items-center justify-center gap-3 w-full pt-2">
                  <button
                    type="button"
                    onClick={() => adjustTime(30)}
                    className="flex-1 py-3 px-3 rounded-full bg-surface-1 dark:bg-surface-card-dark text-[13px] font-medium text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light/30 transition-colors"
                  >
                    +30s
                  </button>

                  <button
                    type="button"
                    onClick={isTimerPaused ? resumeTimer : pauseTimer}
                    className="flex-1 py-3 px-3 rounded-full bg-surface-1 dark:bg-surface-card-dark text-[13px] font-medium text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light/30 transition-colors"
                  >
                    {isTimerPaused ? 'Resume' : 'Pause'}
                  </button>

                  <button
                    type="button"
                    onClick={handleRestComplete}
                    className="flex-1 py-3 px-4 rounded-full bg-action dark:bg-action-dark text-white text-[13px] font-medium shadow-sm transition-transform active:scale-95"
                  >
                    Skip Rest ›
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3. EXERCISE COMPLETE SLIDE CARD (After final set) */}
            {stepMode === 'complete' && (
              <motion.div
                key={`complete-${activeSession.currentExerciseIndex}`}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 rounded-3xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 text-center space-y-6"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: [0, 1.25, 1], rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-action/10 dark:bg-action-dark/15 text-action dark:text-action-dark mx-auto flex items-center justify-center text-[34px] font-semibold shadow-inner"
                >
                  ✓
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-action dark:text-action-dark">
                    All {totalSets} Sets Completed
                  </span>
                  <h3 className="text-[26px] font-semibold text-ink dark:text-ink-dark mt-1">
                    {exerciseDef.name} Done
                  </h3>
                  <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mt-1 max-w-[30ch] mx-auto">
                    Great work. Ready for the next exercise in your routine.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="pt-4 flex flex-col gap-2.5"
                >
                  {activeSession.currentExerciseIndex < totalExercises - 1 ? (
                    <button
                      type="button"
                      onClick={handleNextExercise}
                      className="w-full py-4 rounded-full bg-action dark:bg-action-dark text-white text-[16px] font-normal transition-all active:scale-[0.98] shadow-sm hover:brightness-105"
                    >
                      Next Exercise ›
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="w-full py-4 rounded-full bg-action dark:bg-action-dark text-white text-[16px] font-normal transition-all active:scale-[0.98] shadow-sm hover:brightness-105"
                    >
                      Complete Workout Session
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleStepBack}
                    className="w-full py-3 rounded-full text-[13px] text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark transition-colors"
                  >
                    ‹ Review Last Set
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* TAB 2: OVERVIEW & SCHEDULE MANAGEMENT */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Summary Progress Card */}
          <div className="p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[17px] font-semibold text-ink dark:text-ink-dark">
                Workout Overview
              </h3>
              <button
                type="button"
                onClick={() => {
                  const r = routines.find(item => item.id === activeSession.routineId);
                  if (r) {
                    setEditingRoutine(r);
                    setIsEditorOpen(true);
                  }
                }}
                className="text-[12px] text-action dark:text-action-dark font-medium"
              >
                Edit Schedule
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/50 dark:border-hairline-dark/50">
                <span className="text-[11px] text-ink-muted uppercase block">Total Elapsed</span>
                <span className="text-[18px] font-mono font-semibold text-ink dark:text-ink-dark">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/50 dark:border-hairline-dark/50">
                <span className="text-[11px] text-ink-muted uppercase block">Completed Sets</span>
                <span className="text-[18px] font-semibold text-ink dark:text-ink-dark">
                  {activeSession.exerciseProgress.reduce(
                    (sum, ep) => sum + ep.sets.filter(s => s.completed).length,
                    0
                  )}{' '}
                  /{' '}
                  {activeSession.exerciseProgress.reduce(
                    (sum, ep) => sum + ep.sets.length,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* List of all exercises in this session */}
          <div className="space-y-2">
            {activeSession.exerciseProgress.map((ep, idx) => {
              const def = EXERCISE_DATABASE.find(e => e.id === ep.exerciseId);
              const completedCount = ep.sets.filter(s => s.completed).length;
              const isCurrent = idx === activeSession.currentExerciseIndex;

              return (
                <button
                  key={ep.routineExerciseId}
                  type="button"
                  onClick={() => {
                    skipTimer();
                    setCurrentExerciseIndex(idx);
                    setActiveTab('flow');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'border-action bg-surface-1 dark:bg-surface-card-dark'
                      : 'border-hairline-light/50 dark:border-hairline-dark/50 bg-surface-2 dark:bg-surface-2-dark'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full text-[12px] font-medium flex items-center justify-center ${
                        ep.isCompleted
                          ? 'bg-action dark:bg-action-dark text-white'
                          : 'bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark border border-hairline-light'
                      }`}
                    >
                      {ep.isCompleted ? '✓' : idx + 1}
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-ink dark:text-ink-dark">
                        {def?.name || 'Exercise'}
                      </p>
                      <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted">
                        {completedCount} / {ep.sets.length} sets completed
                      </p>
                    </div>
                  </div>

                  <span className="text-[12px] text-action dark:text-action-dark font-medium">
                    {isCurrent ? 'Current' : 'Jump ›'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* End session button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleFinish}
              className={`w-full py-3.5 text-[15px] font-medium rounded-full transition-all ${
                allExercisesCompleted
                  ? 'bg-action dark:bg-action-dark text-white shadow-sm'
                  : 'text-ink-muted dark:text-ink-dark-muted border border-hairline-light dark:border-hairline-dark'
              }`}
            >
              {allExercisesCompleted ? 'Complete and Save Session' : 'End Session Early'}
            </button>
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
