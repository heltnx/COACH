import React, { useState, useEffect } from 'react';
import { Activity, UserProfile, SessionType } from '../../types';
import { generateReplacementActivity } from '../../services/geminiService';
import { SparklesIcon, XMarkIcon } from '../ui/Icons';
import Button from '../ui/Button';
import Loader from '../ui/Loader';

interface EditActivityModalProps {
  activity: Activity;
  profile: UserProfile;
  sessionType: SessionType;
  onSave: (updatedActivity: Activity) => void;
  onCancel: () => void;
}

const EditActivityModal: React.FC<EditActivityModalProps> = ({ activity, profile, sessionType, onSave, onCancel }) => {
  const [editedActivity, setEditedActivity] = useState<Omit<Activity, 'id'>>({ ...activity });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset form if the activity prop changes
    setEditedActivity({ ...activity });
  }, [activity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedActivity(prev => ({ ...prev, [name]: value }));
  };

  const handleReplaceWithAI = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const replacement = await generateReplacementActivity(profile, activity, sessionType);
      setEditedActivity(replacement);
    } catch (err) {
      setError("Erreur lors de la suggestion de l'IA. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...editedActivity, id: activity.id });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 relative">
          <h2 className="text-2xl font-bold text-brand-text mb-4">Modifier l'activité</h2>
          <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
            <XMarkIcon className="h-7 w-7" />
          </button>

          {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
          
          {isLoading ? <Loader message="L'IA réfléchit à une alternative..." /> : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-brand-light-text mb-1">Nom</label>
                <input type="text" name="name" id="name" value={editedActivity.name} onChange={handleChange} className="w-full p-3 text-lg border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label htmlFor="description" className="block text-lg font-medium text-brand-light-text mb-1">Description</label>
                <textarea name="description" id="description" value={editedActivity.description} onChange={handleChange} rows={4} className="w-full p-3 text-lg border border-gray-300 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="duration" className="block text-lg font-medium text-brand-light-text mb-1">Durée</label>
                    <input type="text" name="duration" id="duration" value={editedActivity.duration || ''} onChange={handleChange} className="w-full p-3 text-lg border border-gray-300 rounded-lg" />
                </div>
                 <div>
                    <label htmlFor="reps" className="block text-lg font-medium text-brand-light-text mb-1">Répétitions</label>
                    <input type="text" name="reps" id="reps" value={editedActivity.reps || ''} onChange={handleChange} className="w-full p-3 text-lg border border-gray-300 rounded-lg" />
                </div>
                 <div>
                    <label htmlFor="sets" className="block text-lg font-medium text-brand-light-text mb-1">Séries</label>
                    <input type="text" name="sets" id="sets" value={editedActivity.sets || ''} onChange={handleChange} className="w-full p-3 text-lg border border-gray-300 rounded-lg" />
                </div>
              </div>

               <div className="pt-4 space-y-3">
                  <Button type="button" onClick={handleReplaceWithAI} variant="secondary" className="w-full">
                    <SparklesIcon className="h-6 w-6 mr-3" />
                    Remplacer par une suggestion de l'IA
                  </Button>
                   <Button type="submit" variant="primary" className="w-full">
                    Enregistrer les modifications
                  </Button>
               </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditActivityModal;