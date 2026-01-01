import React from 'react';

export const Card = ({ children, className = '', hover = false }) => {
  return (
    <div className={`bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl ${hover ? 'hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
};