
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-teal-700 focus:ring-brand-primary',
    secondary: 'bg-gray-200 text-brand-text hover:bg-gray-300 focus:ring-gray-400',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
