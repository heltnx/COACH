// Implementing the SessionDetail component.
import React, { useState } from 'react';
import { Session, UserProfile, Activity } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ArrowLeftIcon, CheckCircleIcon, PencilIcon } from '../ui/Icons';
import EditActivityModal from './EditActivityModal';

interface SessionDetailProps {
  session: Session;
  day: string;
  profile: UserProfile;
  onBack: () => void;
  onComplete: (sessionTitle: string) => void;
  onUpdateActivity: (day: string, activityId: string, newActivity: Activity) => void;
  isCompleted: boolean;
}

const SessionDetail: React.FC<SessionDetailProps> = ({ session, day, profile, onBack, onComplete, onUpdateActivity, isCompleted }) => {
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const handleComplete = () => {
    if (window.confirm("Avez-vous bien terminé cette séance ?")) {
      onComplete(session.title);
    }
  };

  const handleSaveActivity = (updatedActivity: Activity) => {
    if (editingActivity) {
      onUpdateActivity(day, editingActivity.id, updatedActivity);
    }
    setEditingActivity(null);
  }
  
  return (
    <div>
      {editingActivity && (
        <EditActivityModal 
          activity={editingActivity}
          profile={profile}
          sessionType={session.type}
          onSave={handleSaveActivity}
          onCancel={() => setEditingActivity(null)}
        />
      )}
      <Button onClick={onBack} variant="secondary" className="mb-6">
        <ArrowLeftIcon className="h-6 w-6 mr-2" />
        Retour
      </Button>

      <Card>
        <h2 className="text-3xl font-bold text-brand-primary mb-2">{session.title}</h2>
        <p className="text-xl text-brand-light-text mb-6">{session.description}</p>
        
        <div className="space-y-4">
          {session.activities.map((activity) => (
            <div key={activity.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                <div className="flex justify-between items-start">
                  <div className="pr-12">
                    <h3 className="text-xl font-semibold text-brand-text">{activity.name}</h3>
                    <p className="text-brand-text my-2">{activity.description}</p>
                  </div>
                  {!isCompleted && (
                    <button onClick={() => setEditingActivity(activity)} className="absolute top-3 right-3 p-2 text-gray-500 hover:text-brand-primary rounded-full hover:bg-gray-200 transition-colors">
                      <PencilIcon className="h-6 w-6" />
                      <span className="sr-only">Modifier l'activité</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-brand-light-text">
                    {activity.duration && <span>Durée: {activity.duration}</span>}
                    {activity.reps && <span>Répétitions: {activity.reps}</span>}
                    {activity.sets && <span>Séries: {activity.sets}</span>}
                </div>
                {activity.videoSearchQuery && (
                    <a 
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activity.videoSearchQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-brand-primary hover:underline"
                    >
                        Chercher une vidéo d'exemple
                    </a>
                )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
            {isCompleted ? (
                <div className="flex items-center justify-center p-4 rounded-lg bg-green-100 text-green-700 text-xl font-semibold">
                    <CheckCircleIcon className="h-8 w-8 mr-3"/>
                    <span>Séance déjà terminée. Bravo !</span>
                </div>
            ) : (
                <Button onClick={handleComplete} variant="success">
                    <CheckCircleIcon className="h-6 w-6 mr-3" />
                    Marquer comme terminée
                </Button>
            )}
        </div>
      </Card>
    </div>
  );
};

export default SessionDetail;