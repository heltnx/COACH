import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, WeeklyProgram, HistoryItem, Activity } from './types';
import { generateWeeklyProgram } from './services/geminiService';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Loader from './components/ui/Loader';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [program, setProgram] = useState<WeeklyProgram | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const savedProgram = localStorage.getItem('userProgram');
      const savedHistory = localStorage.getItem('sessionHistory');
      
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      if (savedProgram) setProgram(JSON.parse(savedProgram));
      if (savedHistory) setHistory(JSON.parse(savedHistory));

    } catch (err) {
      console.error("Failed to load data from localStorage", err);
      // Clear corrupted storage
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOnboardingComplete = useCallback(async (newProfile: UserProfile) => {
    setIsLoading(true);
    setError(null);
    try {
      const newProgram = await generateWeeklyProgram(newProfile);
      // Add unique IDs to each activity
      newProgram.weeklySchedule.forEach(plan => {
        if (plan.session) {
          plan.session.activities.forEach(activity => {
            activity.id = crypto.randomUUID();
          });
        }
      });
      
      setProfile(newProfile);
      setProgram(newProgram);
      setHistory([]); // Reset history for new profile
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      localStorage.setItem('userProgram', JSON.stringify(newProgram));
      localStorage.setItem('sessionHistory', JSON.stringify([]));
    } catch (err) {
      console.error(err);
      setError("Désolé, une erreur est survenue lors de la création de votre programme. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser votre profil et votre programme ?")) {
      setIsLoading(true);
      localStorage.clear();
      setProfile(null);
      setProgram(null);
      setHistory([]);
      setIsLoading(false);
    }
  }, []);

  const handleSessionComplete = useCallback((sessionTitle: string) => {
    const newHistoryItem: HistoryItem = {
      id: Date.now(),
      date: new Date().toISOString(),
      sessionTitle,
    };
    setHistory(prevHistory => {
      const updatedHistory = [...prevHistory, newHistoryItem];
      localStorage.setItem('sessionHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  }, []);

  const handleUpdateActivity = useCallback((day: string, activityId: string, newActivity: Activity) => {
    if (!program) return;

    const updatedSchedule = program.weeklySchedule.map(dailyPlan => {
      if (dailyPlan.day === day && dailyPlan.session) {
        const updatedActivities = dailyPlan.session.activities.map(act => 
          act.id === activityId ? { ...newActivity, id: act.id } : act
        );
        return {
          ...dailyPlan,
          session: {
            ...dailyPlan.session,
            activities: updatedActivities,
          },
        };
      }
      return dailyPlan;
    });

    const updatedProgram = { ...program, weeklySchedule: updatedSchedule };
    setProgram(updatedProgram);
    localStorage.setItem('userProgram', JSON.stringify(updatedProgram));
  }, [program]);


  if (isLoading) {
    return <Loader message="Chargement de votre coach personnel..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-700 p-4">
        <h2 className="text-2xl font-bold mb-4">Erreur</h2>
        <p className="text-center mb-6">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setIsLoading(false);
            if (!profile) handleReset();
          }}
          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
        >
          Retour
        </button>
      </div>
    );
  }

  if (!profile || !program) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return <Dashboard 
            profile={profile} 
            program={program} 
            history={history}
            onSessionComplete={handleSessionComplete}
            onReset={handleReset} 
            onUpdateActivity={handleUpdateActivity}
          />;
};

export default App;