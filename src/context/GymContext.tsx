import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  ActiveSession,
  CompletedSessionLog,
  Routine,
  UserSettings
} from '../types/gym';
import { EXERCISE_DATABASE } from '../data/exercises';

interface GymContextType {
  settings: UserSettings;
  routines: Routine[];
  activeSession: ActiveSession | null;
  history: CompletedSessionLog[];
  isDark: boolean;
  toggleGymDay: (dayIndex: number) => void;
  updateSettings: (partial: Partial<UserSettings>) => void;
  createOrUpdateRoutine: (routine: Routine) => void;
  deleteRoutine: (routineId: string) => void;
  addExerciseToRoutine: (routineId: string, exerciseId: string) => void;
  removeExerciseFromRoutine: (routineId: string, routineExerciseId: string) => void;
  startSession: (routineId: string) => void;
  completeSet: (exerciseIndex: number, setIndex: number, completed: boolean) => void;
  updateSetValues: (exerciseIndex: number, setIndex: number, weightKg: number, reps: number) => void;
  setCurrentExerciseIndex: (index: number) => void;
  finishSession: () => void;
  cancelSession: () => void;
  toggleTheme: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  resetAllData: () => void;
}

// Clean empty defaults per user request: empty unless the user configures them
const DEFAULT_SETTINGS: UserSettings = {
  gymDays: [], // Empty default
  theme: 'light',
  defaultRestSeconds: 75,
  soundEnabled: true,
  dailyCreatineGrams: 5,
  dailyCalories: 2500
};

const DEFAULT_ROUTINES: Routine[] = [];

const GymContext = createContext<GymContextType | null>(null);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // LocalStorage quota or disabled
  }
}

export const GymProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadStorage<UserSettings>('gym_settings', DEFAULT_SETTINGS)
  );

  const [routines, setRoutines] = useState<Routine[]>(() =>
    loadStorage<Routine[]>('gym_routines', DEFAULT_ROUTINES)
  );

  const [activeSession, setActiveSession] = useState<ActiveSession | null>(() =>
    loadStorage<ActiveSession | null>('gym_active_session', null)
  );

  const [history, setHistory] = useState<CompletedSessionLog[]>(() =>
    loadStorage<CompletedSessionLog[]>('gym_history', [])
  );

  // Sync to localStorage
  useEffect(() => {
    saveStorage('gym_settings', settings);
  }, [settings]);

  useEffect(() => {
    saveStorage('gym_routines', routines);
  }, [routines]);

  useEffect(() => {
    saveStorage('gym_active_session', activeSession);
  }, [activeSession]);

  useEffect(() => {
    saveStorage('gym_history', history);
  }, [history]);

  // Apply dark class to root document element
  const isDark = settings.theme === 'dark';
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleGymDay = useCallback((dayIndex: number) => {
    setSettings(prev => {
      const exists = prev.gymDays.includes(dayIndex);
      const updated = exists
        ? prev.gymDays.filter(d => d !== dayIndex)
        : [...prev.gymDays, dayIndex].sort((a, b) => a - b);
      return { ...prev, gymDays: updated };
    });
  }, []);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  const createOrUpdateRoutine = useCallback((routine: Routine) => {
    setRoutines(prev => {
      const exists = prev.some(r => r.id === routine.id);
      if (exists) {
        return prev.map(r => (r.id === routine.id ? routine : r));
      } else {
        return [...prev, routine];
      }
    });
    // Ensure the routine's day is marked in gymDays
    setSettings(prev => {
      if (!prev.gymDays.includes(routine.dayOfWeek)) {
        return { ...prev, gymDays: [...prev.gymDays, routine.dayOfWeek].sort((a, b) => a - b) };
      }
      return prev;
    });
  }, []);

  const deleteRoutine = useCallback((routineId: string) => {
    setRoutines(prev => prev.filter(r => r.id !== routineId));
  }, []);

  const addExerciseToRoutine = useCallback((routineId: string, exerciseId: string) => {
    const exerciseDef = EXERCISE_DATABASE.find(e => e.id === exerciseId);
    if (!exerciseDef) return;

    setRoutines(prev =>
      prev.map(r => {
        if (r.id !== routineId) return r;
        const newRoutineEx = {
          id: 're-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
          exerciseId,
          targetSets: exerciseDef.defaultSets,
          targetReps: exerciseDef.defaultReps,
          targetWeightKg: 20,
          restSeconds: exerciseDef.defaultRestSeconds
        };
        return { ...r, exercises: [...r.exercises, newRoutineEx] };
      })
    );
  }, []);

  const removeExerciseFromRoutine = useCallback((routineId: string, routineExerciseId: string) => {
    setRoutines(prev =>
      prev.map(r => {
        if (r.id !== routineId) return r;
        return {
          ...r,
          exercises: r.exercises.filter(e => e.id !== routineExerciseId)
        };
      })
    );
  }, []);

  const startSession = useCallback((routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (!routine || routine.exercises.length === 0) return;

    const exerciseProgress = routine.exercises.map(re => ({
      exerciseId: re.exerciseId,
      routineExerciseId: re.id,
      sets: Array.from({ length: re.targetSets }, (_, i) => ({
        setNumber: i + 1,
        targetReps: re.targetReps,
        weightKg: re.targetWeightKg,
        completed: false
      })),
      isCompleted: false
    }));

    const session: ActiveSession = {
      sessionId: 'session-' + Date.now(),
      routineId: routine.id,
      routineName: routine.name,
      startedAt: new Date().toISOString(),
      currentExerciseIndex: 0,
      exerciseProgress
    };

    setActiveSession(session);
  }, [routines]);

  const completeSet = useCallback((exerciseIndex: number, setIndex: number, completed: boolean) => {
    setActiveSession(prev => {
      if (!prev) return null;
      const exList = [...prev.exerciseProgress];
      const targetEx = { ...exList[exerciseIndex] };
      if (!targetEx) return prev;

      const sets = [...targetEx.sets];
      sets[setIndex] = {
        ...sets[setIndex],
        completed,
        completedAt: completed ? new Date().toISOString() : undefined
      };

      const allSetsDone = sets.every(s => s.completed);
      targetEx.sets = sets;
      targetEx.isCompleted = allSetsDone;
      exList[exerciseIndex] = targetEx;

      return {
        ...prev,
        exerciseProgress: exList
      };
    });
  }, []);

  const updateSetValues = useCallback((exerciseIndex: number, setIndex: number, weightKg: number, reps: number) => {
    setActiveSession(prev => {
      if (!prev) return null;
      const exList = [...prev.exerciseProgress];
      const targetEx = { ...exList[exerciseIndex] };
      if (!targetEx) return prev;

      const sets = [...targetEx.sets];
      sets[setIndex] = {
        ...sets[setIndex],
        weightKg,
        targetReps: reps
      };
      targetEx.sets = sets;
      exList[exerciseIndex] = targetEx;

      return {
        ...prev,
        exerciseProgress: exList
      };
    });
  }, []);

  const setCurrentExerciseIndex = useCallback((index: number) => {
    setActiveSession(prev => {
      if (!prev) return null;
      const safeIndex = Math.max(0, Math.min(index, prev.exerciseProgress.length - 1));
      return { ...prev, currentExerciseIndex: safeIndex };
    });
  }, []);

  const finishSession = useCallback(() => {
    if (!activeSession) return;
    const now = new Date();
    const start = new Date(activeSession.startedAt);
    const durationMinutes = Math.max(1, Math.round((now.getTime() - start.getTime()) / (1000 * 60)));

    let totalSets = 0;
    const exercisesCompleted = activeSession.exerciseProgress.map(ep => {
      const def = EXERCISE_DATABASE.find(e => e.id === ep.exerciseId);
      const setsDone = ep.sets.filter(s => s.completed).length;
      totalSets += setsDone;
      return {
        exerciseId: ep.exerciseId,
        exerciseName: def?.name || 'Exercise',
        setsCompleted: setsDone,
        primaryMuscles: def?.primaryMuscles || []
      };
    });

    const todayStr = now.toISOString().split('T')[0];

    const log: CompletedSessionLog = {
      id: activeSession.sessionId,
      routineId: activeSession.routineId,
      routineName: activeSession.routineName,
      date: todayStr,
      startedAt: activeSession.startedAt,
      completedAt: now.toISOString(),
      durationMinutes,
      totalSetsCompleted: totalSets,
      exercisesCompleted
    };

    setHistory(prev => [log, ...prev]);
    setActiveSession(null);
  }, [activeSession]);

  const cancelSession = useCallback(() => {
    setActiveSession(null);
  }, []);

  const exportData = useCallback((): string => {
    return JSON.stringify(
      {
        settings,
        routines,
        history,
        exportedAt: new Date().toISOString()
      },
      null,
      2
    );
  }, [settings, routines, history]);

  const importData = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.settings) setSettings(parsed.settings);
      if (Array.isArray(parsed.routines)) setRoutines(parsed.routines);
      if (Array.isArray(parsed.history)) setHistory(parsed.history);
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetAllData = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setRoutines(DEFAULT_ROUTINES);
    setActiveSession(null);
    setHistory([]);
    localStorage.clear();
  }, []);

  return (
    <GymContext.Provider
      value={{
        settings,
        routines,
        activeSession,
        history,
        isDark,
        toggleGymDay,
        updateSettings,
        createOrUpdateRoutine,
        deleteRoutine,
        addExerciseToRoutine,
        removeExerciseFromRoutine,
        startSession,
        completeSet,
        updateSetValues,
        setCurrentExerciseIndex,
        finishSession,
        cancelSession,
        toggleTheme,
        exportData,
        importData,
        resetAllData
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export function useGym(): GymContextType {
  const ctx = useContext(GymContext);
  if (!ctx) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return ctx;
}
