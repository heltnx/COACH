
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowLeftIcon, ArrowRightIcon } from './ui/Icons';
import Button from './ui/Button';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const MOBILITY_LEVELS = ["Très mobile", "Marche avec aide", "Principalement sédentaire"];
const GOALS = ["Gagner en souplesse", "Renforcer le cœur", "Améliorer l'équilibre", "Rester actif", "Stimulation mentale"];
const EQUIPMENT = ["Vélo d'appartement", "Marcheur", "Bandes de résistance", "Haltères légers (1-2kg)", "Tapis de yoga"];
const HOBBIES = ["Jeux de société", "Jeux de cartes", "Sudoku/Mots croisés", "Lecture", "Jardinage"];
const DISABILITIES = ["Arthrose", "Problèmes de dos", "Diabète", "Hypertension", "Difficultés auditives", "Difficultés visuelles"];


const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: 65,
    mobility: MOBILITY_LEVELS[0],
    disabilities: [],
    surgeries: '',
    goals: [],
    equipment: [],
    hobbies: [],
  });
  const [customDisability, setCustomDisability] = useState('');

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMultiCheckbox = (e: React.ChangeEvent<HTMLInputElement>, field: keyof UserProfile) => {
    const { value, checked } = e.target;
    setProfile(prev => {
        const currentValues = prev[field] as string[];
        if (checked) {
            return { ...prev, [field]: [...currentValues, value] };
        } else {
            return { ...prev, [field]: currentValues.filter(item => item !== value) };
        }
    });
  };

  const handleSubmit = () => {
    const finalProfile = { ...profile };
    if (customDisability.trim() !== '') {
        finalProfile.disabilities.push(customDisability.trim());
    }
    onComplete(finalProfile);
  };
  
  const totalSteps = 5;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-brand-text">Informations personnelles</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-brand-light-text mb-1">Quel est votre prénom ?</label>
                <input type="text" name="name" id="name" value={profile.name} onChange={handleChange} className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary" placeholder="Ex: Jean" />
              </div>
              <div>
                <label htmlFor="age" className="block text-lg font-medium text-brand-light-text mb-1">Quel est votre âge ?</label>
                <input type="number" name="age" id="age" value={profile.age} onChange={handleChange} className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary" />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
            <div>
                <h2 className="text-2xl font-bold mb-6 text-brand-text">Santé et Mobilité</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-lg font-medium text-brand-light-text mb-2">Avez-vous des conditions particulières ?</label>
                        {DISABILITIES.map(item => (
                            <div key={item} className="flex items-center mb-2">
                                <input id={`disability-${item}`} type="checkbox" value={item} checked={profile.disabilities.includes(item)} onChange={(e) => handleMultiCheckbox(e, 'disabilities')} className="h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" />
                                <label htmlFor={`disability-${item}`} className="ml-3 text-lg text-brand-text">{item}</label>
                            </div>
                        ))}
                        <input type="text" value={customDisability} onChange={(e) => setCustomDisability(e.target.value)} placeholder="Autre (préciser)" className="mt-2 w-full p-3 text-lg border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                     <div>
                        <label htmlFor="surgeries" className="block text-lg font-medium text-brand-light-text mb-1">Avez-vous eu des opérations récentes ? (Ex: prothèse de hanche)</label>
                        <textarea name="surgeries" id="surgeries" value={profile.surgeries} onChange={handleChange} rows={2} className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                     <div>
                        <label htmlFor="mobility" className="block text-lg font-medium text-brand-light-text mb-1">Comment décririez-vous votre mobilité ?</label>
                        <select name="mobility" id="mobility" value={profile.mobility} onChange={handleChange} className="w-full p-3 text-lg border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary">
                            {MOBILITY_LEVELS.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-brand-text">Vos Objectifs</h2>
            <p className="text-lg text-brand-light-text mb-4">Qu'aimeriez-vous améliorer ? (Plusieurs choix possibles)</p>
            <div className="space-y-2">
                {GOALS.map(goal => (
                    <div key={goal} className="flex items-center">
                        <input id={`goal-${goal}`} type="checkbox" value={goal} checked={profile.goals.includes(goal)} onChange={(e) => handleMultiCheckbox(e, 'goals')} className="h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" />
                        <label htmlFor={`goal-${goal}`} className="ml-3 text-lg text-brand-text">{goal}</label>
                    </div>
                ))}
            </div>
          </div>
        );
      case 4:
         return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-brand-text">Équipement et Loisirs</h2>
            <div className="space-y-6">
                <div>
                    <p className="text-lg font-medium text-brand-light-text mb-2">De quel équipement disposez-vous ?</p>
                    {EQUIPMENT.map(item => (
                        <div key={item} className="flex items-center mb-2">
                            <input id={`equipment-${item}`} type="checkbox" value={item} checked={profile.equipment.includes(item)} onChange={(e) => handleMultiCheckbox(e, 'equipment')} className="h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" />
                            <label htmlFor={`equipment-${item}`} className="ml-3 text-lg text-brand-text">{item}</label>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        );
    case 5:
        return (
            <div>
                <h2 className="text-2xl font-bold mb-6 text-brand-text">Vos Loisirs</h2>
                <div className="space-y-6">
                    <div>
                        <p className="text-lg font-medium text-brand-light-text mb-2">Quels sont vos loisirs préférés ?</p>
                        {HOBBIES.map(item => (
                            <div key={item} className="flex items-center mb-2">
                                <input id={`hobby-${item}`} type="checkbox" value={item} checked={profile.hobbies.includes(item)} onChange={(e) => handleMultiCheckbox(e, 'hobbies')} className="h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded" />
                                <label htmlFor={`hobby-${item}`} className="ml-3 text-lg text-brand-text">{item}</label>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4">
                        <p className="text-xl text-center font-semibold text-brand-text">Vous y êtes presque !</p>
                        <p className="text-center text-brand-light-text">Cliquez sur "Terminer" pour générer votre programme personnalisé.</p>
                    </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
      if(step === 1 && (!profile.name.trim() || profile.age <= 0)) return true;
      return false;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-center text-brand-primary mb-2">Mon Coach Bien-Être</h1>
            <p className="text-center text-brand-light-text text-xl mb-8">Créons votre profil personnalisé</p>

            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
            </div>
            
            <div className="min-h-[350px]">
                {renderStep()}
            </div>
            
            <div className="flex justify-between items-center mt-8">
              <Button onClick={prevStep} disabled={step === 1} variant="secondary">
                <ArrowLeftIcon className="h-6 w-6 mr-2" />
                Précédent
              </Button>
              {step < totalSteps ? (
                <Button onClick={nextStep} disabled={isNextDisabled()}>
                  Suivant
                  <ArrowRightIcon className="h-6 w-6 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Terminer et créer mon programme
                </Button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
