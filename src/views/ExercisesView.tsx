import React, { useState, useEffect } from 'react';
import { EXERCISE_DATABASE, MUSCLE_LABEL_MAP } from '../data/exercises';
import { Exercise, MajorCategory } from '../types/gym';
import { MuscleDiagram } from '../components/common/MuscleDiagram';
import { ExerciseDetailModal } from '../components/common/ExerciseDetailModal';
import { useGym } from '../context/GymContext';

const CATEGORIES: ('All' | MajorCategory)[] = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core'
];

const ITEMS_PER_PAGE = 10;

export const ExercisesView: React.FC = () => {
  const { isDark } = useGym();
  const [selectedCategory, setSelectedCategory] = useState<'All' | MajorCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  // Filter exercises
  const filteredExercises = EXERCISE_DATABASE.filter(ex => {
    const matchesCategory =
      selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.primaryMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredExercises.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedExercises = filteredExercises.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-6 pb-28">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
          Exercise Catalog
        </p>
        <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink dark:text-ink-dark mt-1">
          Exercises
        </h1>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search 70+ exercises by name, muscle, or equipment"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 text-[15px] rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 text-ink dark:text-ink-dark placeholder:text-ink-muted/60 dark:placeholder:text-ink-dark-muted/60 focus:outline-none focus:border-action transition-colors"
        />
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-4 -mx-1 px-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-ink text-white dark:bg-ink-dark dark:text-black shadow-sm'
                : 'bg-surface-2 dark:bg-surface-2-dark text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark border border-hairline-light/40 dark:border-hairline-dark/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Count and Pagination Summary */}
      <div className="mb-3 flex items-center justify-between text-[12px] text-ink-muted dark:text-ink-dark-muted">
        <span>
          Showing {paginatedExercises.length} of {filteredExercises.length} exercises
        </span>
        <span>
          Page {safePage} of {totalPages}
        </span>
      </div>

      {/* Phone-friendly Single Exercise Per Row List */}
      <div className="space-y-2.5">
        {paginatedExercises.map(ex => {
          const primarySummary = ex.primaryMuscles
            .map(m => MUSCLE_LABEL_MAP[m] || m)
            .join(', ');

          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => setActiveExercise(ex)}
              className="w-full text-left p-3 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50 hover:bg-surface-1 dark:hover:bg-surface-card-dark transition-all duration-150 active:scale-[0.99] flex items-center gap-3.5 group shadow-sm"
            >
              {/* Muscle Group Visual (Compact anatomical thumbnail) */}
              <div className="w-[52px] h-[84px] shrink-0 rounded-xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/40 dark:border-hairline-dark/40 flex items-center justify-center p-1">
                <MuscleDiagram
                  primaryMuscles={ex.primaryMuscles}
                  secondaryMuscles={ex.secondaryMuscles}
                  isDark={isDark}
                  size="xs"
                  compact={true}
                />
              </div>

              {/* Exercise Details */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-ink-muted dark:text-ink-dark-muted">
                    {ex.category}
                  </span>
                  <span className="text-[10px] text-ink-muted/80 dark:text-ink-dark-muted/80 bg-surface-1 dark:bg-surface-card-dark px-1.5 py-0.5 rounded border border-hairline-light/40 dark:border-hairline-dark/40">
                    {ex.equipment}
                  </span>
                </div>

                <h3 className="text-[15px] font-semibold text-ink dark:text-ink-dark leading-tight truncate">
                  {ex.name}
                </h3>

                <p className="text-[12px] font-medium text-action dark:text-action-dark truncate mt-0.5">
                  {primarySummary}
                </p>

                <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted truncate mt-0.5">
                  {ex.defaultSets} sets · {ex.defaultReps} reps · {ex.defaultRestSeconds}s rest
                </p>
              </div>

              {/* Right Chevron Indicator */}
              <div className="shrink-0 text-ink-muted/40 dark:text-ink-dark-muted/40 group-hover:text-ink dark:group-hover:text-ink-dark transition-colors pr-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-3.5 py-2 text-[13px] font-medium rounded-full border border-hairline-light dark:border-hairline-dark text-ink dark:text-ink-dark disabled:opacity-30 disabled:pointer-events-none hover:bg-surface-2 dark:hover:bg-surface-2-dark transition-colors"
          >
            ‹ Previous
          </button>

          {/* Numbered pagination pills */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              // Show only nearby pages if many
              if (
                totalPages > 6 &&
                Math.abs(pageNum - safePage) > 2 &&
                pageNum !== 1 &&
                pageNum !== totalPages
              ) {
                return null;
              }

              const isCurrent = pageNum === safePage;

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-full text-[13px] font-medium transition-all ${
                    isCurrent
                      ? 'bg-action dark:bg-action-dark text-white shadow-sm'
                      : 'text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-3.5 py-2 text-[13px] font-medium rounded-full border border-hairline-light dark:border-hairline-dark text-ink dark:text-ink-dark disabled:opacity-30 disabled:pointer-events-none hover:bg-surface-2 dark:hover:bg-surface-2-dark transition-colors"
          >
            Next ›
          </button>
        </div>
      )}

      {/* Detail Modal with Interactive Muscle Visualizer */}
      <ExerciseDetailModal
        exercise={activeExercise}
        isOpen={!!activeExercise}
        onClose={() => setActiveExercise(null)}
      />
    </div>
  );
};
