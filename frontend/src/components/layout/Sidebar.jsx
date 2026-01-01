import React from 'react';
import { Eye, Menu, X } from 'lucide-react';

export const Sidebar = ({ pages, currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-black/40 backdrop-blur-xl border-r border-white/10 transition-all duration-300`}>
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        {isSidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-black text-lg">Focus Guardian</h1>
              <p className="text-gray-400 text-xs">AI Monitoring</p>
            </div>
          </div>
        )}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      <nav className="p-4 space-y-2">
        {pages.map(page => {
          const Icon = page.icon;
          return (
            <button key={page.id} onClick={() => setCurrentPage(page.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPage === page.id ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <Icon className="w-5 h-5" />
              {isSidebarOpen && <span className="font-semibold">{page.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};