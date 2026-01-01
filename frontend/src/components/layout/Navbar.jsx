import React from 'react';

export const Navbar = ({ currentPage, pages }) => {
  return (
    <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 px-8 py-4">
      <h2 className="text-2xl font-bold text-white">{pages.find(p => p.id === currentPage)?.label}</h2>
    </div>
  );
};