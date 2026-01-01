import React from 'react';

export const Toast = ({ message, type = 'info', isVisible }) => {
  if (!isVisible) return null;
  
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };
  
  return (
    <div className={`fixed bottom-4 right-4 ${typeClasses[type]} text-white px-6 py-3 rounded-xl shadow-lg z-50`}>
      {message}
    </div>
  );
};