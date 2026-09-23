import { Muscle } from 'react-body-highlighter';

export type MajorCategory = 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Legs' | 'Core';

export type MuscleToken = Muscle;

export interface Exercise {
  id: string;
  name: string;
  category: MajorCategory;
  primaryMuscles: MuscleToken[];
  secondaryMuscles: MuscleToken[];
  equipment: 'Barbell' | 'Dumbbell' | 'Machine' | 'Cable' | 'Bodyweight';
  instructions: string[];
  defaultSets: number;
  defaultReps: number;
  defaultRestSeconds: number;
}

export interface RoutineExercise {
  id: string;
  exerciseId: string;
  targetSets: number;
  targetReps: number;
  targetWeightKg: number;
  restSeconds: number;
}

export interface Routine {
  id: string;
  name: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  exercises: RoutineExercise[];
}

export interface SetProgress {
  setNumber: number;
  targetReps: number;
  weightKg: number;
  completed: boolean;
  completedAt?: string;
}

export interface ActiveExerciseProgress {
  exerciseId: string;
  routineExerciseId: string;
  sets: SetProgress[];
  isCompleted: boolean;
}

export interface ActiveSession {
  sessionId: string;
  routineId: string;
  routineName: string;
  startedAt: string;
  currentExerciseIndex: number;
  exerciseProgress: ActiveExerciseProgress[];
}

export interface CompletedSessionLog {
  id: string;
  routineId: string;
  routineName: string;
  date: string; // YYYY-MM-DD
  startedAt: string;
  completedAt: string;
  durationMinutes: number;
  totalSetsCompleted: number;
  exercisesCompleted: {
    exerciseId: string;
    exerciseName: string;
    setsCompleted: number;
    primaryMuscles: MuscleToken[];
  }[];
}

export interface UserSettings {
  gymDays: number[]; // e.g. [1, 3, 5] for Mon, Wed, Fri
  theme: 'light' | 'dark';
  defaultRestSeconds: number;
  soundEnabled: boolean;
  dailyCreatineGrams: number;
  dailyCalories: number;
}
