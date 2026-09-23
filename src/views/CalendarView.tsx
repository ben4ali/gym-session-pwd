import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { CompletedSessionLog } from '../types/gym';

export const CalendarView: React.FC = () => {
  const { settings, history, routines } = useGym();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days in month
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Starting day index (0 = Sunday, 1 = Monday, etc. Normalize to Monday = 0)
  const startingDayIndex = (firstDayOfMonth.getDay() + 6) % 7;

  const monthLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to format date string
  const formatDateKey = (day: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Find logs for selected date
  const selectedDateLogs = history.filter(h => h.date === selectedDateStr);

  // Check if selected date is a scheduled gym day
  const selectedDateObj = new Date(selectedDateStr + 'T12:00:00');
  const selectedDayOfWeek = selectedDateObj.getDay();
  const isSelectedGymDay = settings.gymDays.includes(selectedDayOfWeek);
  const scheduledRoutine = routines.find(r => r.dayOfWeek === selectedDayOfWeek);

  const weekDayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-[480px] mx-auto px-5 pt-6 pb-28">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
          Schedule & History
        </p>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-ink dark:text-ink-dark">
            {monthLabel}
          </h1>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark"
              aria-label="Previous month"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 rounded-full flex items-center justify-center text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
        {/* Day name headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {weekDayHeaders.map(day => (
            <span
              key={day}
              className="text-[11px] font-medium text-ink-muted dark:text-ink-dark-muted uppercase tracking-wider"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before month starts */}
          {Array.from({ length: startingDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = formatDateKey(dayNum);
            const dateObj = new Date(year, month, dayNum);
            const dayOfWeek = dateObj.getDay();

            const isGymScheduled = settings.gymDays.includes(dayOfWeek);
            const isCompleted = history.some(h => h.date === dateStr);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDateStr;

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDateStr(dateStr)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-150 ${
                  isSelected
                    ? 'bg-ink text-white dark:bg-ink-dark dark:text-black font-semibold shadow-sm'
                    : isToday
                    ? 'border border-action dark:border-action-dark text-ink dark:text-ink-dark'
                    : 'hover:bg-surface-1 dark:hover:bg-surface-1-dark text-ink dark:text-ink-dark'
                }`}
              >
                <span className="text-[13px]">{dayNum}</span>

                {/* Status indicator dot */}
                <div className="h-1.5 flex items-center justify-center mt-0.5">
                  {isCompleted ? (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected
                          ? 'bg-action-dark dark:bg-action'
                          : 'bg-action dark:bg-action-dark'
                      }`}
                    />
                  ) : isGymScheduled ? (
                    <span
                      className={`w-1 h-1 rounded-full ${
                        isSelected
                          ? 'bg-hairline-dark dark:bg-hairline-light'
                          : 'bg-ink-muted/50 dark:bg-ink-dark-muted/50'
                      }`}
                    />
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-3 text-[11px] text-ink-muted dark:text-ink-dark-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-action dark:bg-action-dark" />
          Completed Session
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ink-muted/60 dark:bg-ink-dark-muted/60" />
          Scheduled Gym Day
        </span>
      </div>

      {/* Selected Day Details Card */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[15px] font-semibold text-ink dark:text-ink-dark">
            {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric'
            })}
          </h2>
          <span className="text-[12px] text-ink-muted dark:text-ink-dark-muted">
            {isSelectedGymDay ? 'Training Day' : 'Rest Day'}
          </span>
        </div>

        {selectedDateLogs.length > 0 ? (
          <div className="space-y-3">
            {selectedDateLogs.map((log: CompletedSessionLog) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[16px] font-semibold text-ink dark:text-ink-dark">
                    {log.routineName}
                  </h3>
                  <span className="text-[12px] font-mono text-ink-muted dark:text-ink-dark-muted">
                    {log.durationMinutes} min
                  </span>
                </div>

                <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mt-1">
                  {log.totalSetsCompleted} sets completed across {log.exercisesCompleted.length} exercises
                </p>

                <div className="mt-3 pt-3 border-t border-hairline-light/40 dark:border-hairline-dark/40 space-y-1.5">
                  {log.exercisesCompleted.map((ex, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[13px]">
                      <span className="text-ink dark:text-ink-dark">{ex.exerciseName}</span>
                      <span className="text-ink-muted dark:text-ink-dark-muted">
                        {ex.setsCompleted} sets
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/40 dark:border-hairline-dark/40 text-center">
            <p className="text-[14px] text-ink-muted dark:text-ink-dark-muted">
              No workout logged on this date.
            </p>
            {scheduledRoutine && (
              <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mt-1">
                Scheduled routine for this day: {scheduledRoutine.name}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
