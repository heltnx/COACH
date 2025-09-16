
import React, { useState } from 'react';
import { WeeklyProgram, Session, HistoryItem } from '../../types';
import Card from '../ui/Card';
import { DumbbellIcon, PuzzleIcon } from '../ui/Icons';
import SessionDetail from './SessionDetail';

interface ProgramViewProps {
  program: WeeklyProgram;
  history: HistoryItem[];
  onSessionComplete: (sessionTitle: string) => void;
}

const ProgramView: React.FC<ProgramViewProps> = ({ program, history, onSessionComplete }) => {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  if (selectedSession) {
    const isCompleted = history.some(item => item.sessionTitle === selectedSession.title);
    return <SessionDetail session={selectedSession} onBack={() => setSelectedSession(null)} onComplete={onSessionComplete} isCompleted={isCompleted} />;
  }

  return (
    <div>
        <h2 className="text-3xl font-bold text-brand-text mb-6">Votre Programme de la Semaine</h2>
        <div className="space-y-4">
            {program.weeklySchedule.map(({ day, session }, index) => (
                <Card key={index} className="flex flex-col md:flex-row md:items-center">
                    <div className="w-full md:w-1/4 mb-4 md:mb-0">
                        <p className="text-2xl font-bold text-brand-primary">{day}</p>
                    </div>
                    <div className="flex-grow">
                        {session ? (
                            <div className="bg-brand-secondary p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    {session.type === 'physique' ? (
                                        <DumbbellIcon className="h-7 w-7 text-brand-primary mr-3" />
                                    ) : (
                                        <PuzzleIcon className="h-7 w-7 text-brand-primary mr-3" />
                                    )}
                                    <h3 className="text-xl font-semibold text-brand-text">{session.title}</h3>
                                </div>
                                <p className="text-brand-light-text mb-4 ml-10">{session.description}</p>
                                <button onClick={() => setSelectedSession(session)} className="w-full md:w-auto ml-10 bg-white border border-brand-primary text-brand-primary font-semibold py-2 px-5 rounded-lg hover:bg-teal-50 transition duration-300">
                                    Voir la séance
                                </button>
                            </div>
                        ) : (
                            <div className="text-center md:text-left p-4">
                                <p className="text-xl font-semibold text-brand-light-text">Jour de repos</p>
                            </div>
                        )}
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
};

export default ProgramView;
