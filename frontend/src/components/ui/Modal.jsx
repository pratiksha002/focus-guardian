import React from 'react';

export const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-slate-900 rounded-2xl p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
};