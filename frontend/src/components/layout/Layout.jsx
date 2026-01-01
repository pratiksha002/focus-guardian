import React, { useContext } from 'react';
import { Menu, X, LogOut, Award, TrendingUp } from 'lucide-react';
import { AnimatedBackground } from '../effects/AnimatedBackground';
import { BadgeNotification } from '../effects/BadgeNotification';
import { ThemeContext } from '../../context/ThemeContext';
import { GamificationContext } from '../../context/GamificationContext';
import { AuthContext } from '../../context/AuthContext';

export const Layout = ({ pages, currentPage, setCurrentPage, isSidebarOpen, setIsSidebarOpen, children }) => {
  const { theme } = useContext(ThemeContext);
  const { userStats, getProgressToNextLevel, calculateXPForNextLevel } = useContext(GamificationContext);
  const { logout, user } = useContext(AuthContext);

  const progress = getProgressToNextLevel();
  const nextLevelXP = calculateXPForNextLevel(userStats.level);
  const xpNeeded = nextLevelXP - userStats.xp;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} relative overflow-hidden`}>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Badge Notifications */}
      <BadgeNotification />
      
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-slate-950/90 backdrop-blur-xl border-r ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 z-40 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            {isSidebarOpen ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg">Focus Guardian</h1>
                    <p className="text-gray-400 text-xs">AI Monitoring</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors mx-auto"
              >
                <Menu className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Level Progress Bar - NO XP SHOWN */}
        {isSidebarOpen && (
          <div className="p-4 border-b border-purple-500/30">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">Level {userStats.level}</span>
              </div>
              {/* Only show next level indicator */}
              <span className="text-xs text-gray-400">→ {userStats.level + 1}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${theme.primary} rounded-full transition-all duration-500 relative`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
            {/* Show progress as percentage instead of XP */}
            <div className="mt-1 text-xs text-gray-400 text-center">
              {Math.round(progress)}% to next level
            </div>
          </div>
        )}

        {/* Streak Display */}
        {isSidebarOpen && userStats.streak > 0 && (
          <div className="px-4 py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-b border-orange-500/30">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div>
                <div className="text-white font-bold">{userStats.streak} Day Streak!</div>
                <div className="text-xs text-orange-300">Keep it going!</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {pages.map((page) => {
            const Icon = page.icon;
            const isActive = currentPage === page.id;

            return (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 relative group ${
                  isActive
                    ? `bg-gradient-to-r ${theme.primary} text-white`
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className={`absolute left-0 w-1 h-full bg-gradient-to-b ${theme.primary}`} />
                )}
                <Icon className={`w-5 h-5 ${isSidebarOpen ? '' : 'mx-auto'}`} />
                {isSidebarOpen && (
                  <span className="font-medium">{page.label}</span>
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                    {page.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-purple-500/30">
          {isSidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{user?.username?.[0]?.toUpperCase() || 'U'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{user?.username || 'User'}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {userStats.badges.length} badges • Lvl {userStats.level}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={logout}
              className="w-full p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mx-auto" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } transition-all duration-300 relative z-10`}
      >
        {children}
      </div>
    </div>
  );
};