import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { EXERCISE_DATABASE } from '../data/exercises';
import { Routine } from '../types/gym';
import { RoutineEditorModal } from '../components/routine/RoutineEditorModal';

const DAYS_MAP = [
  { dayIndex: 1, label: 'Mon', full: 'Monday' },
  { dayIndex: 2, label: 'Tue', full: 'Tuesday' },
  { dayIndex: 3, label: 'Wed', full: 'Wednesday' },
  { dayIndex: 4, label: 'Thu', full: 'Thursday' },
  { dayIndex: 5, label: 'Fri', full: 'Friday' },
  { dayIndex: 6, label: 'Sat', full: 'Saturday' },
  { dayIndex: 0, label: 'Sun', full: 'Sunday' }
];

export const SettingsView: React.FC = () => {
  const {
    settings,
    routines,
    toggleGymDay,
    updateSettings,
    createOrUpdateRoutine,
    deleteRoutine,
    toggleTheme,
    exportData,
    importData,
    resetAllData,
    isDark
  } = useGym();

  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleCopyExport = () => {
    const data = exportData();
    navigator.clipboard.writeText(data);
    setStatusMessage('Data copied to clipboard.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleImportSubmit = () => {
    const success = importData(importJsonText);
    if (success) {
      setStatusMessage('Data imported successfully.');
      setShowImportDialog(false);
      setImportJsonText('');
    } else {
      setStatusMessage('Invalid data format.');
    }
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <div className="max-w-[480px] mx-auto px-5 pt-6 pb-28">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-ink-muted dark:text-ink-dark-muted">
          Preferences
        </p>
        <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink dark:text-ink-dark mt-1">
          Settings
        </h1>
      </div>

      {statusMessage && (
        <div className="mb-4 p-3 rounded-xl bg-action/10 text-action dark:text-action-dark text-[13px] text-center font-medium">
          {statusMessage}
        </div>
      )}

      {/* 1. Schedule Days of Week */}
      <div className="mb-6 p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-[17px] font-semibold text-ink dark:text-ink-dark">
            Gym Schedule
          </h2>
          <span className="text-[12px] text-ink-muted dark:text-ink-dark-muted">
            {settings.gymDays.length} days active
          </span>
        </div>
        <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mb-4">
          Select the days of the week when you go to the gym.
        </p>

        {/* 7 Days of the Week Toggle Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS_MAP.map(d => {
            const isSelected = settings.gymDays.includes(d.dayIndex);
            return (
              <button
                key={d.dayIndex}
                type="button"
                onClick={() => toggleGymDay(d.dayIndex)}
                className={`py-3 rounded-xl text-[13px] font-medium transition-all duration-150 flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'bg-action dark:bg-action-dark text-white shadow-sm'
                    : 'bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light/30'
                }`}
              >
                <span>{d.label}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Workout Routines Manager */}
      <div className="mb-6 p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-[17px] font-semibold text-ink dark:text-ink-dark">
            Workout Routines
          </h2>
          <span className="text-[12px] text-ink-muted dark:text-ink-dark-muted">
            {routines.length} routines
          </span>
        </div>
        <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mb-4">
          Configure exercises, sets, reps, target weights, and rest intervals.
        </p>

        {routines.length === 0 ? (
          <div className="py-6 text-center border border-dashed border-hairline-light dark:border-hairline-dark rounded-xl mb-3">
            <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted">
              No routines added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2 mb-3">
            {routines.map(r => (
              <div
                key={r.id}
                className="p-3.5 rounded-xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 flex items-center justify-between"
              >
                <div>
                  <p className="text-[14px] font-semibold text-ink dark:text-ink-dark">
                    {r.name}
                  </p>
                  <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted">
                    {r.exercises.length} exercises · {DAYS_MAP.find(d => d.dayIndex === r.dayOfWeek)?.full}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setEditingRoutine(r);
                    setIsEditorOpen(true);
                  }}
                  className="text-[13px] text-action dark:text-action-dark font-medium px-2 py-1"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setEditingRoutine(null);
            setIsEditorOpen(true);
          }}
          className="w-full py-2.5 rounded-xl border border-dashed border-hairline-light dark:border-hairline-dark text-[13px] font-medium text-action dark:text-action-dark hover:bg-surface-1 dark:hover:bg-surface-card-dark transition-colors"
        >
          + Create New Workout Schedule
        </button>
      </div>

      {/* 3. Daily Nutrition & Recovery Targets */}
      <div className="mb-6 p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
        <h2 className="text-[17px] font-semibold text-ink dark:text-ink-dark mb-1">
          Daily Nutrition Targets
        </h2>
        <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mb-4">
          Displayed on rest and recovery days to keep your nutrition on track.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-ink-muted dark:text-ink-dark-muted block mb-1">
              Creatine (Grams)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={settings.dailyCreatineGrams || 5}
              onChange={e =>
                updateSettings({
                  dailyCreatineGrams: parseInt(e.target.value, 10) || 0
                })
              }
              className="w-full px-3 py-2 text-[14px] font-medium rounded-xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 text-ink dark:text-ink-dark"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-ink-muted dark:text-ink-dark-muted block mb-1">
              Calories (kcal)
            </label>
            <input
              type="number"
              min="500"
              max="10000"
              step="50"
              value={settings.dailyCalories || 2500}
              onChange={e =>
                updateSettings({
                  dailyCalories: parseInt(e.target.value, 10) || 0
                })
              }
              className="w-full px-3 py-2 text-[14px] font-medium rounded-xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 text-ink dark:text-ink-dark"
            />
          </div>
        </div>
      </div>

      {/* 4. Appearance & Theme */}
      <div className="mb-6 p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
        <h2 className="text-[17px] font-semibold text-ink dark:text-ink-dark mb-1">
          Appearance
        </h2>
        <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mb-4">
          Apple minimal color scheme with light mode default.
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium text-ink dark:text-ink-dark">
              Color Theme
            </p>
            <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted">
              Current: {isDark ? 'Dark Mode (True Black)' : 'Light Mode (Default)'}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 rounded-full bg-surface-1 dark:bg-surface-card-dark text-[13px] font-medium text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light/30 transition-colors"
          >
            Switch to {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* 5. Data Management */}
      <div className="mb-6 p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
        <h2 className="text-[17px] font-semibold text-ink dark:text-ink-dark mb-1">
          Data & Storage
        </h2>
        <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mb-4">
          Stored directly in local browser storage. No external accounts required.
        </p>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleCopyExport}
            className="w-full py-2.5 text-center text-[13px] font-medium rounded-xl bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light/30"
          >
            Export Backup Data (Copy JSON)
          </button>

          <button
            type="button"
            onClick={() => setShowImportDialog(true)}
            className="w-full py-2.5 text-center text-[13px] font-medium rounded-xl bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light/30"
          >
            Import Backup Data
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all schedules, routines, and workout history to default empty state?')) {
                resetAllData();
                setStatusMessage('All data reset to empty state.');
                setTimeout(() => setStatusMessage(''), 3000);
              }
            }}
            className="w-full py-2.5 text-center text-[13px] font-medium rounded-xl text-red-600 border border-hairline-light/50 dark:border-hairline-dark/50 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            Reset All Data
          </button>
        </div>
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

      {/* Import Modal */}
      {showImportDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-[440px] rounded-3xl bg-surface-1 dark:bg-surface-1-dark border border-hairline-light dark:border-hairline-dark p-6 shadow-2xl">
            <h3 className="text-[18px] font-semibold text-ink dark:text-ink-dark mb-2">
              Import Backup Data
            </h3>
            <p className="text-[12px] text-ink-muted dark:text-ink-dark-muted mb-3">
              Paste your exported JSON backup below:
            </p>

            <textarea
              rows={6}
              value={importJsonText}
              onChange={e => setImportJsonText(e.target.value)}
              placeholder="Paste JSON here..."
              className="w-full p-3 text-[12px] font-mono rounded-xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light dark:border-hairline-dark text-ink dark:text-ink-dark focus:outline-none focus:border-action mb-4"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleImportSubmit}
                className="flex-1 py-2.5 rounded-full bg-action dark:bg-action-dark text-white text-[13px] font-medium"
              >
                Restore
              </button>
              <button
                type="button"
                onClick={() => setShowImportDialog(false)}
                className="flex-1 py-2.5 rounded-full bg-surface-2 dark:bg-surface-2-dark text-ink dark:text-ink-dark text-[13px] font-medium border border-hairline-light dark:border-hairline-dark"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
