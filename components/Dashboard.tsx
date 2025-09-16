import React, { useState } from 'react';
import { UserProfile, WeeklyProgram, HistoryItem, Activity } from '../types';
import Header from './ui/Header';
import DashboardHome from './dashboard/DashboardHome';
import ProgramView from './program/ProgramView';
import HistoryView from './dashboard/HistoryView';
import { HomeIcon, CalendarIcon, HistoryIcon, UserIcon } from './ui/Icons';
import ProfileView from './dashboard/ProfileView';

interface DashboardProps {
  profile: UserProfile;
  program: WeeklyProgram;
  history: HistoryItem[];
  onSessionComplete: (sessionTitle: string) => void;
  onReset: () => void;
  onUpdateActivity: (day: string, activityId: string, newActivity: Activity) => void;
}

type View = 'dashboard' | 'program' | 'history' | 'profile';

const Dashboard: React.FC<DashboardProps> = ({ profile, program, history, onSessionComplete, onReset, onUpdateActivity }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardHome profile={profile} program={program} onSessionComplete={onSessionComplete} history={history} onUpdateActivity={onUpdateActivity} />;
      case 'program':
        return <ProgramView program={program} onSessionComplete={onSessionComplete} history={history} profile={profile} onUpdateActivity={onUpdateActivity} />;
      case 'history':
        return <HistoryView history={history} />;
      case 'profile':
        return <ProfileView profile={profile} onReset={onReset} />;
      default:
        return <DashboardHome profile={profile} program={program} onSessionComplete={onSessionComplete} history={history} onUpdateActivity={onUpdateActivity} />;
    }
  };
  
  const NavItem: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center w-full py-2 text-sm transition-colors duration-200 ${
        currentView === view ? 'text-brand-primary' : 'text-brand-light-text hover:text-brand-primary'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-brand-secondary">
      <Header name={profile.name} />
      <main className="flex-grow p-4 md:p-6 mb-16">
        {renderView()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-t-lg border-t border-gray-200 flex justify-around">
        <NavItem view="dashboard" label="Accueil" icon={<HomeIcon className="h-7 w-7 mb-1" />} />
        <NavItem view="program" label="Programme" icon={<CalendarIcon className="h-7 w-7 mb-1" />} />
        <NavItem view="history" label="Historique" icon={<HistoryIcon className="h-7 w-7 mb-1" />} />
        <NavItem view="profile" label="Profil" icon={<UserIcon className="h-7 w-7 mb-1" />} />
      </nav>
    </div>
  );
};

export default Dashboard;