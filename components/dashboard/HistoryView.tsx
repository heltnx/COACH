
import React from 'react';
import { HistoryItem } from '../../types';
import Card from '../ui/Card';
import { CheckCircleIcon } from '../ui/Icons';

interface HistoryViewProps {
  history: HistoryItem[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
        <h2 className="text-3xl font-bold text-brand-text mb-6">Historique des séances</h2>
        {sortedHistory.length > 0 ? (
            <div className="space-y-4">
            {sortedHistory.map(item => (
                <Card key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                        <CheckCircleIcon className="h-10 w-10 text-green-500 mr-4"/>
                        <div>
                            <p className="text-xl font-semibold text-brand-text">{item.sessionTitle}</p>
                            <p className="text-brand-light-text text-md">
                                {new Date(item.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </Card>
            ))}
            </div>
        ) : (
            <Card className="text-center">
                <p className="text-xl text-brand-light-text">Vous n'avez pas encore terminé de séance.</p>
                <p className="text-lg text-brand-light-text mt-2">Votre historique apparaîtra ici une fois que vous aurez complété une activité.</p>
            </Card>
        )}
    </div>
  );
};

export default HistoryView;
