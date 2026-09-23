import React, { useState } from 'react';
import Model, { IExerciseData } from 'react-body-highlighter';
import { MuscleToken } from '../../types/gym';

const POSTERIOR_MUSCLES: MuscleToken[] = [
  'upper-back',
  'lower-back',
  'hamstring',
  'gluteal',
  'back-deltoids',
  'trapezius'
];

interface MuscleDiagramProps {
  primaryMuscles: MuscleToken[];
  secondaryMuscles?: MuscleToken[];
  isDark?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  compact?: boolean;
  side?: 'anterior' | 'posterior';
}

export const MuscleDiagram: React.FC<MuscleDiagramProps> = ({
  primaryMuscles,
  secondaryMuscles = [],
  isDark = false,
  className = '',
  size = 'md',
  compact = false,
  side
}) => {
  // If posterior muscles predominate, default to posterior view
  const autoSide = primaryMuscles.some(m => POSTERIOR_MUSCLES.includes(m))
    ? 'posterior'
    : 'anterior';

  const [view, setView] = useState<'anterior' | 'posterior'>(side || autoSide);

  // Format data for react-body-highlighter
  const primaryData: IExerciseData = {
    name: 'Primary Target',
    muscles: primaryMuscles,
  };

  const secondaryData: IExerciseData = {
    name: 'Secondary Synergist',
    muscles: secondaryMuscles,
  };

  // Apple Minimal color scheme:
  // Primary: #0071E3 (Light) / #2997FF (Dark)
  // Secondary: #60A5FA (Light) / #1E40AF (Dark)
  const primaryColor = isDark ? '#2997FF' : '#0071E3';
  const secondaryColor = isDark ? '#60A5FA' : '#93C5FD';

  const widthStyle =
    size === 'xs'
      ? '82px'
      : size === 'sm'
      ? '120px'
      : size === 'lg'
      ? '230px'
      : '160px';

  // Compact Thumbnail View for Grid Cards
  if (compact) {
    return (
      <div className={`flex flex-col items-center justify-center select-none ${className}`}>
        <div className="relative flex justify-center items-center py-1 overflow-hidden pointer-events-none">
          <Model
            data={[primaryData, secondaryData]}
            type={side || autoSide}
            style={{ width: widthStyle, height: 'auto' }}
            highlightedColors={[primaryColor, secondaryColor]}
          />
        </div>
      </div>
    );
  }

  // Full Interactive Mode
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Front / Back Toggle */}
      <div className="flex items-center gap-1 p-0.5 rounded-full bg-surface-2 dark:bg-surface-2-dark mb-3 border border-hairline-light dark:border-hairline-dark">
        <button
          type="button"
          onClick={() => setView('anterior')}
          className={`px-3 py-1 text-[12px] font-medium rounded-full transition-all duration-200 ${
            view === 'anterior'
              ? 'bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark shadow-sm'
              : 'text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark'
          }`}
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setView('posterior')}
          className={`px-3 py-1 text-[12px] font-medium rounded-full transition-all duration-200 ${
            view === 'posterior'
              ? 'bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark shadow-sm'
              : 'text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark'
          }`}
        >
          Posterior
        </button>
      </div>

      {/* Model Visual Container */}
      <div className="relative flex justify-center items-center py-2 px-3 rounded-2xl bg-surface-2/60 dark:bg-surface-2-dark/60 border border-hairline-light/60 dark:border-hairline-dark/60">
        <Model
          data={[primaryData, secondaryData]}
          type={view}
          style={{ width: widthStyle, height: 'auto' }}
          highlightedColors={[primaryColor, secondaryColor]}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[11px] text-ink-muted dark:text-ink-dark-muted">
        <span className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: primaryColor }}
          />
          Target
        </span>
        {secondaryMuscles.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: secondaryColor }}
            />
            Synergist
          </span>
        )}
      </div>
    </div>
  );
};
