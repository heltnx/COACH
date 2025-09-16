import React, { useState } from 'react';
import { WeeklyProgram, UserProfile, HistoryItem, Activity } from '../../types';
import Card from '../ui/Card';
import SessionDetail from '../program/SessionDetail';
import { CheckCircleIcon } from '../ui/Icons';

interface DashboardHomeProps {
  profile: UserProfile;
  program: WeeklyProgram;
  history: HistoryItem[];
  onSessionComplete: (sessionTitle: string) => void;
  onUpdateActivity: (day: string, activityId: string, newActivity: Activity) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ profile, program, onSessionComplete, history, onUpdateActivity }) => {
  const [showSessionDetail, setShowSessionDetail] = useState(false);

  const dayIndex = new Date().getDay(); // Sunday = 0, Monday = 1...
  
  // Adjust index because my week starts on Monday in the program
  const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  const todaysPlan = program.weeklySchedule[adjustedIndex];
  const todayName = todaysPlan.day;


  const isCompleted = todaysPlan?.session && history.some(item => {
    const itemDate = new Date(item.date);
    const today = new Date();
    return item.sessionTitle === todaysPlan.session?.title &&
           itemDate.getFullYear() === today.getFullYear() &&
           itemDate.getMonth() === today.getMonth() &&
           itemDate.getDate() === today.getDate();
  });

  if (showSessionDetail && todaysPlan?.session) {
    return <SessionDetail 
              day={todayName}
              session={todaysPlan.session} 
              onBack={() => setShowSessionDetail(false)} 
              onComplete={onSessionComplete}
              isCompleted={isCompleted}
              profile={profile}
              onUpdateActivity={onUpdateActivity}
            />;
  }
  
  return (
    <div className="space-y-6">
        <Card className="bg-teal-50 border-l-4 border-brand-primary">
            <h2 className="text-xl font-bold text-brand-primary mb-2">Message de la semaine</h2>
            <p className="text-brand-text text-lg italic">"{program.motivationalMessage}"</p>
        </Card>

        <Card>
            <h2 className="text-2xl font-bold text-brand-text mb-4">
                Votre séance du jour : <span className="capitalize">{todayName}</span>
            </h2>
            {todaysPlan && todaysPlan.session ? (
                <div className="bg-brand-secondary p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-brand-primary">{todaysPlan.session.title}</h3>
                    <p className="text-brand-light-text my-2">{todaysPlan.session.description}</p>
                    {isCompleted ? (
                         <div className="mt-4 flex items-center p-3 rounded-lg bg-green-100 text-green-700">
                             <CheckCircleIcon className="h-8 w-8 mr-3"/>
                             <span className="text-lg font-semibold">Bravo, séance terminée !</span>
                         </div>
                    ) : (
                        <button 
                            onClick={() => setShowSessionDetail(true)}
                            className="mt-4 w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300 text-lg"
                        >
                            Commencer la séance
                        </button>
                    )}
                </div>
            ) : (
                <div className="text-center p-6 bg-sky-100 rounded-lg">
                    <h3 className="text-xl font-semibold text-sky-800">Jour de repos</h3>
                    <p className="text-sky-700 mt-2 text-lg">Profitez-en pour vous détendre et bien vous hydrater !</p>
                </div>
            )}
        </Card>
    </div>
  );
};

export default DashboardHome;