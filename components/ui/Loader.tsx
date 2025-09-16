
import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Chargement..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-brand-secondary">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
      <p className="mt-4 text-xl font-semibold text-brand-text">{message}</p>
    </div>
  );
};

export default Loader;
