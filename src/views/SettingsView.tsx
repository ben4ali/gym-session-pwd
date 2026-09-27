import React, { useState, useRef } from 'react';
import { useGym } from '../context/GymContext';
import { Routine } from '../types/gym';
import { RoutineEditorModal } from '../components/routine/RoutineEditorModal';
import { SwipeToDeleteItem } from '../components/common/SwipeToDeleteItem';
import { ConfirmDeleteModal } from '../components/common/ConfirmDeleteModal';
import { NumericInput } from '../components/common/NumericInput';
import { downloadJsonFile } from '../utils/exportImport';
import { Download, Copy, Upload, Trash2, Check } from 'lucide-react';

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
  const [routineToDelete, setRoutineToDelete] = useState<Routine | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const [importJsonText, setImportJsonText] = useState<string>('');
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [pendingImportJson, setPendingImportJson] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const handleExportFile = () => {
    const data = exportData();
    const filename = `gym-backup-${new Date().toISOString().split('T')[0]}.json`;
    const success = downloadJsonFile(data, filename);
    if (success) {
      showFeedback(`Exported backup file: ${filename}`);
    } else {
      showFeedback('Could not download file. Please try copying to clipboard.');
    }
  };

  const handleCopyExport = () => {
    try {
      const data = exportData();
      navigator.clipboard.writeText(data);
      showFeedback('Backup JSON copied to clipboard.');
    } catch {
      showFeedback('Unable to access clipboard. Use Export File instead.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // Validate JSON structure before prompting confirm
        try {
          JSON.parse(content);
          setPendingImportJson(content);
        } catch {
          showFeedback('Error: Selected file is not a valid JSON backup.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    try {
      JSON.parse(importJsonText);
      setPendingImportJson(importJsonText);
      setShowImportDialog(false);
    } catch {
      showFeedback('Error: Invalid JSON format.');
    }
  };

  const handleConfirmImport = () => {
    if (!pendingImportJson) return;
    const success = importData(pendingImportJson);
    if (success) {
      showFeedback('Data restored and replaced successfully.');
      setImportJsonText('');
    } else {
      showFeedback('Error: Failed to restore backup data.');
    }
    setPendingImportJson(null);
  };

  const weightUnit = settings.weightUnit || 'lbs';

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
        <div className="mb-4 p-3.5 rounded-2xl bg-action/10 border border-action/20 text-action dark:text-action-dark text-[13px] text-center font-medium shadow-sm transition-all">
          {statusMessage}
        </div>
      )}

      {/* 1. Units of Measurement */}
      <div className="mb-6 p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
        <h2 className="text-[17px] font-semibold text-ink dark:text-ink-dark mb-1">
          Weight Units
        </h2>
        <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mb-4">
          Choose your preferred unit for tracking exercise weights (Pounds default).
        </p>

        <div className="grid grid-cols-2 gap-2 p-1 bg-surface-1 dark:bg-surface-card-dark rounded-xl border border-hairline-light dark:border-hairline-dark">
          <button
            type="button"
            onClick={() => {
              updateSettings({ weightUnit: 'lbs' });
              showFeedback('Weight unit set to Pounds (lbs)');
            }}
            className={`py-2.5 px-3 rounded-lg text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 ${
              weightUnit === 'lbs'
                ? 'bg-action dark:bg-action-dark text-white shadow-sm'
                : 'text-ink dark:text-ink-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark'
            }`}
          >
            {weightUnit === 'lbs' && <Check size={14} strokeWidth={2.5} />}
            <span>Pounds (lbs)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              updateSettings({ weightUnit: 'kg' });
              showFeedback('Weight unit set to Kilograms (kg)');
            }}
            className={`py-2.5 px-3 rounded-lg text-[13px] font-medium transition-all flex items-center justify-center gap-1.5 ${
              weightUnit === 'kg'
                ? 'bg-action dark:bg-action-dark text-white shadow-sm'
                : 'text-ink dark:text-ink-dark hover:bg-surface-2 dark:hover:bg-surface-2-dark'
            }`}
          >
            {weightUnit === 'kg' && <Check size={14} strokeWidth={2.5} />}
            <span>Kilograms (kg)</span>
          </button>
        </div>
      </div>

      {/* 2. Schedule Days of Week */}
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

      {/* 3. Workout Routines Manager */}
      <div className="mb-6 p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-[17px] font-semibold text-ink dark:text-ink-dark">
            Workout Routines
          </h2>
          <span className="text-[12px] text-ink-muted dark:text-ink-dark-muted">
            {routines.length} routines
          </span>
        </div>
        <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mb-3">
          Configure exercises, sets, reps, weights, and rest intervals. Slide left to delete.
        </p>

        {routines.length === 0 ? (
          <div className="py-6 text-center border border-dashed border-hairline-light dark:border-hairline-dark rounded-xl mb-3">
            <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted">
              No routines added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 mb-3">
            {routines.map(r => (
              <SwipeToDeleteItem
                key={r.id}
                onDeleteRequest={() => setRoutineToDelete(r)}
                deleteLabel="Delete"
              >
                <div className="p-3.5 rounded-xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-ink dark:text-ink-dark">
                      {r.name}
                    </p>
                    <p className="text-[11px] text-ink-muted dark:text-ink-dark-muted">
                      {r.exercises.length} exercises · {DAYS_MAP.find(d => d.dayIndex === r.dayOfWeek)?.full}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRoutine(r);
                        setIsEditorOpen(true);
                      }}
                      className="text-[13px] text-action dark:text-action-dark font-medium px-2.5 py-1 rounded-lg hover:bg-action/10 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoutineToDelete(r)}
                      className="text-ink-muted hover:text-red-500 transition-colors p-1"
                      aria-label="Delete routine"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </SwipeToDeleteItem>
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

      {/* 4. Daily Nutrition & Recovery Targets */}
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
            <NumericInput
              value={settings.dailyCreatineGrams || 5}
              min={0}
              max={50}
              fallback={5}
              allowDecimal={false}
              onChange={val => updateSettings({ dailyCreatineGrams: val })}
              className="w-full px-3 py-2 text-[14px] font-medium rounded-xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 text-ink dark:text-ink-dark"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wider text-ink-muted dark:text-ink-dark-muted block mb-1">
              Calories (kcal)
            </label>
            <NumericInput
              value={settings.dailyCalories || 2500}
              min={500}
              max={10000}
              step={50}
              fallback={2500}
              allowDecimal={false}
              onChange={val => updateSettings({ dailyCalories: val })}
              className="w-full px-3 py-2 text-[14px] font-medium rounded-xl bg-surface-1 dark:bg-surface-card-dark border border-hairline-light/60 dark:border-hairline-dark/60 text-ink dark:text-ink-dark"
            />
          </div>
        </div>
      </div>

      {/* 5. Appearance & Theme */}
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

      {/* 6. Data Management & Export / Import */}
      <div className="mb-6 p-5 rounded-2xl bg-surface-2 dark:bg-surface-2-dark border border-hairline-light/50 dark:border-hairline-dark/50">
        <h2 className="text-[17px] font-semibold text-ink dark:text-ink-dark mb-1">
          Data & Backup
        </h2>
        <p className="text-[13px] text-ink-muted dark:text-ink-dark-muted mb-4">
          Stored directly on your device. Export as JSON to save or transfer workouts.
        </p>

        {/* Hidden file input for direct file upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleExportFile}
            className="w-full py-3 px-4 text-[13px] font-medium rounded-xl bg-action dark:bg-action-dark text-white shadow-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 transition-all"
          >
            <Download size={16} strokeWidth={2} />
            <span>Export as JSON File</span>
          </button>

          <button
            type="button"
            onClick={handleCopyExport}
            className="w-full py-2.5 px-4 text-center text-[13px] font-medium rounded-xl bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light/30 flex items-center justify-center gap-2"
          >
            <Copy size={16} strokeWidth={1.8} />
            <span>Copy JSON Backup to Clipboard</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3 text-center text-[13px] font-medium rounded-xl bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light/30 flex items-center justify-center gap-1.5"
            >
              <Upload size={15} strokeWidth={1.8} />
              <span>Import File</span>
            </button>

            <button
              type="button"
              onClick={() => setShowImportDialog(true)}
              className="py-2.5 px-3 text-center text-[13px] font-medium rounded-xl bg-surface-1 dark:bg-surface-card-dark text-ink dark:text-ink-dark border border-hairline-light dark:border-hairline-dark hover:bg-hairline-light/30"
            >
              Paste JSON
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 mt-2 text-center text-[13px] font-medium rounded-xl text-red-600 border border-hairline-light/50 dark:border-hairline-dark/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 size={15} strokeWidth={1.8} />
            <span>Reset All Data</span>
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

      {/* Routine Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!routineToDelete}
        title="Delete Workout Routine?"
        itemName={routineToDelete?.name}
        message="Are you sure you want to delete this workout routine schedule? This cannot be undone."
        confirmText="Delete Routine"
        onConfirm={() => {
          if (routineToDelete) {
            deleteRoutine(routineToDelete.id);
            setRoutineToDelete(null);
            showFeedback('Workout routine deleted.');
          }
        }}
        onCancel={() => setRoutineToDelete(null)}
      />

      {/* Reset All Data Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showResetConfirm}
        title="Reset All Data?"
        message="This will completely clear all configured workout schedules, routines, and past workout session history. This action cannot be undone."
        confirmText="Reset Everything"
        onConfirm={() => {
          resetAllData();
          setShowResetConfirm(false);
          showFeedback('All data reset to empty state.');
        }}
        onCancel={() => setShowResetConfirm(false)}
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
                className="flex-1 py-2.5 rounded-full bg-action dark:bg-action-dark text-white text-[13px] font-medium hover:opacity-90"
              >
                Continue
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

      {/* Import & Overwrite Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!pendingImportJson}
        title="Restore & Replace All Data?"
        message="Importing this backup will overwrite and replace all your current workout routines, schedules, and past workout history with the imported backup file. Are you sure you want to proceed?"
        confirmText="Import & Overwrite"
        onConfirm={handleConfirmImport}
        onCancel={() => setPendingImportJson(null)}
      />
    </div>
  );
};
