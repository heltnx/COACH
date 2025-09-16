
import React from 'react';
import { SunIcon } from './Icons';

interface HeaderProps {
    name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10 p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div >
            <h1 className="text-2xl font-bold text-brand-primary">{getGreeting()}, {name} !</h1>
            <p className="text-brand-light-text text-lg">Prêt pour votre séance ?</p>
        </div>
        <SunIcon className="h-10 w-10 text-yellow-500" />
      </div>
    </header>
  );
};

export default Header;
