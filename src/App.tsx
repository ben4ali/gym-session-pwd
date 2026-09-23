import React, { useState } from 'react';
import { GymProvider } from './context/GymContext';
import { AppLayout, AppView } from './components/layout/AppLayout';
import { TodayView } from './views/TodayView';
import { ActiveSessionView } from './views/ActiveSessionView';
import { CalendarView } from './views/CalendarView';
import { DashboardView } from './views/DashboardView';
import { ExercisesView } from './views/ExercisesView';
import { SettingsView } from './views/SettingsView';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('today');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'today':
        return <TodayView onNavigateToActive={() => setCurrentView('active')} />;
      case 'active':
        return (
          <ActiveSessionView
            onSessionFinished={() => setCurrentView('dashboard')}
          />
        );
      case 'calendar':
        return <CalendarView />;
      case 'dashboard':
        return <DashboardView />;
      case 'exercises':
        return <ExercisesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TodayView onNavigateToActive={() => setCurrentView('active')} />;
    }
  };

  return (
    <AppLayout currentView={currentView} onNavigate={setCurrentView}>
      {renderCurrentView()}
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <GymProvider>
      <AppContent />
    </GymProvider>
  );
};

export default App;
