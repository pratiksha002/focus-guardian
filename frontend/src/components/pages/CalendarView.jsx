import React, { useState, useMemo, useContext } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { GamificationContext } from '../../context/GamificationContext';

export const CalendarView = () => {
  const { userStats } = useContext(GamificationContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startDay = firstDay.getDay();
    
    // Previous month padding
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, [currentDate]);

  const getSessionsForDay = (date) => {
    if (!date) return [];
    const dateStr = date.toDateString();
    
    return (userStats.sessionsHistory || []).filter(session => {
      const sessionDate = new Date(session.timestamp).toDateString();
      return sessionDate === dateStr;
    });
  };

  const getDayIntensity = (sessions) => {
    if (sessions.length === 0) return 0;
    
    const totalFocused = sessions.reduce((sum, s) => 
      sum + (s.stats?.totalFocused || 0), 0);
    
    if (totalFocused === 0) return 1;
    if (totalFocused < 10) return 2;
    if (totalFocused < 25) return 3;
    if (totalFocused < 50) return 4;
    return 5;
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 0: return 'bg-slate-800 border-slate-700';
      case 1: return 'bg-green-500/20 border-green-500/30';
      case 2: return 'bg-green-500/40 border-green-500/40';
      case 3: return 'bg-green-500/60 border-green-500/50';
      case 4: return 'bg-green-500/80 border-green-500/60';
      case 5: return 'bg-green-500 border-green-500';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Calendar View
          </h1>
          <p className="text-gray-400">Your focus activity over time</p>
        </div>

        {/* Calendar Card */}
        <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-400" />
            </button>
            
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">{monthName}</h2>
            </div>
            
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((date, index) => {
              const sessions = getSessionsForDay(date);
              const intensity = getDayIntensity(sessions);
              const today = isToday(date);
              
              return (
                <div
                  key={index}
                  className={`group relative aspect-square rounded-lg border transition-all duration-300 ${
                    date
                      ? `${getIntensityColor(intensity)} cursor-pointer hover:scale-105 hover:shadow-lg ${
                          today ? 'ring-2 ring-purple-500' : ''
                        }`
                      : 'bg-transparent border-transparent'
                  }`}
                >
                  {date && (
                    <>
                      <div className="absolute top-1 left-1 text-xs text-white font-medium">
                        {date.getDate()}
                      </div>
                      
                      {sessions.length > 0 && (
                        <div className="absolute bottom-1 right-1 text-xs text-white bg-purple-500 rounded-full w-5 h-5 flex items-center justify-center">
                          {sessions.length}
                        </div>
                      )}

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                        <div className="bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                          <div className="font-bold mb-1">
                            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                          {sessions.length > 0 ? (
                            <>
                              <div className="text-green-400">
                                {sessions.length} session{sessions.length > 1 ? 's' : ''}
                              </div>
                              <div className="text-gray-400">
                                {sessions.reduce((sum, s) => sum + (s.stats?.totalFocused || 0), 0)} focused
                              </div>
                            </>
                          ) : (
                            <div className="text-gray-400">No sessions</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded ${getIntensityColor(i).split(' ')[0]}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Month Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-1">
              {(userStats.sessionsHistory || []).filter(s => {
                const sessionDate = new Date(s.timestamp);
                return sessionDate.getMonth() === currentDate.getMonth() &&
                       sessionDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </div>
            <div className="text-sm text-green-300">Sessions This Month</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-1">
              {userStats.streak}
            </div>
            <div className="text-sm text-purple-300">Current Streak</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6">
            <div className="text-3xl font-bold text-white mb-1">
              {userStats.totalSessions || 0}
            </div>
            <div className="text-sm text-blue-300">Total Sessions</div>
          </div>
        </div>
      </div>
    </div>
  );
};