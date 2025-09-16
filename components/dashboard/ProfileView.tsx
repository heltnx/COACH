
import React from 'react';
import { UserProfile } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { LogoutIcon, UserIcon } from '../ui/Icons';

interface ProfileViewProps {
  profile: UserProfile;
  onReset: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, onReset }) => {
  const ProfileDetail: React.FC<{label: string, value: string | number | string[]}> = ({label, value}) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt className="text-lg font-medium text-brand-light-text">{label}</dt>
        <dd className="mt-1 text-lg text-brand-text sm:mt-0 sm:col-span-2">
            {Array.isArray(value) ? value.join(', ') || 'Non spécifié' : value}
        </dd>
    </div>
  );

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text mb-6 flex items-center">
        <UserIcon className="h-8 w-8 mr-3"/>
        Votre Profil
      </h2>
      <Card>
        <dl className="divide-y divide-gray-200">
            <ProfileDetail label="Prénom" value={profile.name} />
            <ProfileDetail label="Âge" value={profile.age} />
            <ProfileDetail label="Mobilité" value={profile.mobility} />
            <ProfileDetail label="Objectifs" value={profile.goals} />
            <ProfileDetail label="Équipement" value={profile.equipment} />
            <ProfileDetail label="Loisirs" value={profile.hobbies} />
            <ProfileDetail label="Conditions" value={profile.disabilities} />
            <ProfileDetail label="Opérations" value={profile.surgeries || 'Aucune'} />
        </dl>
      </Card>
      <div className="mt-8">
        <Button onClick={onReset} variant="secondary">
          <LogoutIcon className="h-6 w-6 mr-3" />
          Réinitialiser le profil
        </Button>
      </div>
    </div>
  );
};

export default ProfileView;
