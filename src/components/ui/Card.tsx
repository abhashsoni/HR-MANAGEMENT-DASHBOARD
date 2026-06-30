import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`glass-card rounded-2xl p-6 transition-all duration-300 ${
        hoverable ? 'hover:-translate-y-1 hover:shadow-xl hover:bg-white/50 dark:hover:bg-slate-900/55' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
