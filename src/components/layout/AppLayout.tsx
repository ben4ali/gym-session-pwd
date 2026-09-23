import React from 'react';
import {
  CalendarDays,
  Dumbbell,
  LayoutDashboard,
  Library,
  Settings,
  Calendar
} from 'lucide-react';
import { useGym } from '../../context/GymContext';

export type AppView = 'today' | 'active' | 'calendar' | 'dashboard' | 'exercises' | 'settings';

interface AppLayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentView,
  onNavigate,
  children
}) => {
  const { activeSession } = useGym();

  const navItems = [
    { id: 'today' as AppView, label: 'Today', icon: CalendarDays },
    {
      id: 'active' as AppView,
      label: 'Workout',
      icon: Dumbbell,
      badge: activeSession ? 'Active' : undefined
    },
    { id: 'calendar' as AppView, label: 'Calendar', icon: Calendar },
    { id: 'dashboard' as AppView, label: 'Overview', icon: LayoutDashboard },
    { id: 'exercises' as AppView, label: 'Exercises', icon: Library },
    { id: 'settings' as AppView, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-surface-1 dark:bg-surface-1-dark text-ink dark:text-ink-dark flex flex-col justify-between selection:bg-action/20">
      {/* Main Content Area */}
      <main className="flex-1 w-full pt-[env(safe-area-inset-top)]">{children}</main>

      {/* Mobile-First Bottom Tab Bar (58px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-1/90 dark:bg-surface-1-dark/90 backdrop-blur-md border-t border-hairline-light/60 dark:border-hairline-dark/60 pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-[500px] mx-auto px-2 h-14 flex items-center justify-around">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`relative flex-1 py-1 flex flex-col items-center justify-center transition-colors duration-150 ${
                  isActive
                    ? 'text-action dark:text-action-dark'
                    : 'text-ink-muted dark:text-ink-dark-muted hover:text-ink dark:hover:text-ink-dark'
                }`}
              >
                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.7}
                    className="transition-transform duration-150 active:scale-95"
                  />
                  {item.badge && !isActive && (
                    <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-action dark:bg-action-dark animate-pulse" />
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-tight mt-1 transition-all ${
                    isActive ? 'font-medium' : 'font-normal'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
