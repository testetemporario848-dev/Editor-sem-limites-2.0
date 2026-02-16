
import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const variants = {
    primary: 'accent-gradient text-white hover:opacity-90',
    secondary: 'bg-white/10 text-white hover:bg-white/20',
    danger: 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
  };

  return (
    <button 
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`glass rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-12">
    <div className="w-12 h-12 border-4 border-white/10 rounded-full loader"></div>
    {message && <p className="text-sm text-gray-400 animate-pulse">{message}</p>}
  </div>
);
