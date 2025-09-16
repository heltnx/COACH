
import React from 'react';
import { Session, SessionType } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ArrowLeftIcon, DumbbellIcon, PuzzleIcon, CheckCircleIcon } from '../ui/Icons';

interface SessionDetailProps {
  session: Session;
  isCompleted: boolean;
  onBack: () => void;
  onComplete: (sessionTitle: string) => void;
}

const SessionDetail: React.FC<SessionDetailProps> = ({ session, onBack, onComplete, isCompleted }) => {
  return (
    <div>
        <button onClick={onBack} className="flex items-center text-lg font-semibold text-brand-primary hover:text-teal-700 mb-6">
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            Retour
        </button>

        <Card>
            <div className="flex items-center mb-4">
                {session.type === SessionType.PHYSICAL ? (
                    <DumbbellIcon className="h-10 w-10 text-brand-primary mr-4" />
                ) : (
                    <PuzzleIcon className="h-10 w-10 text-brand-primary mr-4" />
                )}
                <div>
                    <h2 className="text-3xl font-bold text-brand-text">{session.title}</h2>
                    <p className="text-xl text-brand-light-text">{session.description}</p>
                </div>
            </div>

            <div className="my-6 border-t border-gray-200"></div>

            <div className="space-y-6">
                {session.activities.map((activity, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-xl font-semibold text-brand-text mb-2">{activity.name}</h3>
                        {activity.sets && activity.reps && (
                             <div className="flex space-x-6 mb-2 text-lg text-brand-light-text">
                                <span><span className="font-bold text-brand-text">{activity.sets}</span></span>
                                <span><span className="font-bold text-brand-text">{activity.reps}</span></span>
                             </div>
                        )}
                         {activity.duration && (
                             <p className="mb-2 text-lg text-brand-light-text">
                                Durée: <span className="font-bold text-brand-text">{activity.duration}</span>
                             </p>
                        )}
                        <p className="text-lg text-brand-text leading-relaxed whitespace-pre-wrap">{activity.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                {isCompleted ? (
                    <div className="flex items-center justify-center p-4 rounded-lg bg-green-100 text-green-800">
                        <CheckCircleIcon className="h-8 w-8 mr-3"/>
                        <span className="text-xl font-semibold">Vous avez déjà terminé cette séance aujourd'hui. Bravo !</span>
                    </div>
                ) : (
                    <Button variant="success" onClick={() => onComplete(session.title)}>
                        <CheckCircleIcon className="h-7 w-7 mr-3" />
                        Marquer comme terminée
                    </Button>
                )}
            </div>
             <Card className="mt-8 bg-sky-50 border-l-4 border-sky-400">
                <h3 className="text-xl font-bold text-sky-800">Conseils de sécurité</h3>
                <ul className="list-disc list-inside mt-2 text-lg text-sky-700 space-y-1">
                    <li>Écoutez toujours votre corps et ne forcez pas.</li>
                    <li>Pensez à bien vous hydrater avant, pendant et après la séance.</li>
                    <li>Faites des pauses si vous en ressentez le besoin.</li>
                    <li>Assurez-vous d'avoir un espace dégagé et sûr autour de vous.</li>
                </ul>
            </Card>
        </Card>
    </div>
  );
};

export default SessionDetail;
