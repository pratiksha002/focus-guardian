import React, { useContext, useMemo } from 'react';
import { TrendingUp, Calendar, Clock, Zap, Brain, Award } from 'lucide-react';
import { GamificationContext } from '../../context/GamificationContext';
import { ThemeContext } from '../../context/ThemeContext';

export const AnalyticsPage = () => {
  const { userStats, getRecentSessions } = useContext(GamificationContext);
  const { theme } = useContext(ThemeContext);
  const sessions = getRecentSessions(30);

  // Calculate analytics
  const analytics = useMemo(() => {
    if (sessions.length === 0) return null;

    // Group sessions by date
    const sessionsByDate = sessions.reduce((acc, session) => {
      const date = new Date(session.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { focused: 0, distracted: 0, drowsy: 0, count: 0 };
      }
      acc[date].focused += session.stats?.totalFocused || 0;
      acc[date].distracted += session.stats?.totalDistracted || 0;
      acc[date].drowsy += session.stats?.totalDrowsy || 0;
      acc[date].count += 1;
      return acc;
    }, {});

    // Calculate trends
    const dates = Object.keys(sessionsByDate).slice(-7); // Last 7 days
    const focusTrend = dates.map(date => sessionsByDate[date].focused);
    const avgTrend = focusTrend.reduce((a, b) => a + b, 0) / focusTrend.length;

    // Best time of day
    const hourlyData = sessions.reduce((acc, session) => {
      const hour = new Date(session.timestamp).getHours();
      if (!acc[hour]) acc[hour] = { focused: 0, total: 0 };
      acc[hour].focused += session.stats?.totalFocused || 0;
      acc[hour].total += (session.stats?.totalFocused || 0) + 
                         (session.stats?.totalDistracted || 0) + 
                         (session.stats?.totalDrowsy || 0);
      return acc;
    }, {});

    const bestHour = Object.entries(hourlyData).reduce((best, [hour, data]) => {
      const percentage = data.total > 0 ? (data.focused / data.total) * 100 : 0;
      return percentage > best.percentage ? { hour: parseInt(hour), percentage } : best;
    }, { hour: 14, percentage: 0 });

    return {
      sessionsByDate,
      dates,
      focusTrend,
      avgTrend,
      bestHour,
      totalDays: Object.keys(sessionsByDate).length
    };
  }, [sessions]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const maxFocus = analytics ? Math.max(...analytics.focusTrend, 1) : 1;

  if (!analytics || sessions.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Analytics</h1>
            <p className="text-gray-400">Insights into your focus patterns</p>
          </div>
          <div className="text-center py-16 bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Data Yet</h3>
            <p className="text-gray-400">Complete some focus sessions to see your analytics</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-gray-400">Deep insights into your focus patterns</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Average Focus */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-purple-300 text-sm">Avg Focus</span>
            </div>
            <div className="text-3xl font-bold text-white">{Math.round(analytics.avgTrend)}</div>
            <div className="text-xs text-gray-400 mt-1">detections/day</div>
          </div>

          {/* Best Hour */}
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-green-300 text-sm">Best Hour</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {analytics.bestHour.hour}:00
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {Math.round(analytics.bestHour.percentage)}% focused
            </div>
          </div>

          {/* Active Days */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-blue-300 text-sm">Active Days</span>
            </div>
            <div className="text-3xl font-bold text-white">{analytics.totalDays}</div>
            <div className="text-xs text-gray-400 mt-1">Last 30 days</div>
          </div>

          {/* Current Level */}
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-yellow-300 text-sm">Level</span>
            </div>
            <div className="text-3xl font-bold text-white">{userStats.level}</div>
            <div className="text-xs text-gray-400 mt-1">{userStats.xp} total XP</div>
          </div>
        </div>

        {/* Focus Trend Chart */}
        <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">7-Day Focus Trend</h2>
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>

          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.focusTrend.map((value, index) => {
              const height = (value / maxFocus) * 100;
              const date = new Date(analytics.dates[index]);
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col justify-end items-center" style={{ height: '200px' }}>
                    <div className="text-xs text-white font-bold mb-1">{value}</div>
                    <div 
                      className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all duration-500 hover:from-purple-400 hover:to-pink-400 cursor-pointer relative group"
                      style={{ height: `${height}%`, minHeight: value > 0 ? '8px' : '0' }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {value} focused
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">{dayName}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 font-medium">
                {analytics.avgTrend > 20 ? "You're on fire! 🔥" : 
                 analytics.avgTrend > 10 ? "Great progress! 👍" : 
                 "Keep building your streak! 💪"}
              </span>
            </div>
          </div>
        </div>

        {/* Focus Distribution Heatmap */}
        <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Daily Activity Heatmap</h2>
          
          <div className="grid grid-cols-7 gap-2">
            {analytics.dates.map((date, index) => {
              const data = analytics.sessionsByDate[date];
              const total = data.focused + data.distracted + data.drowsy;
              const intensity = total > 0 ? Math.min((data.focused / 30) * 100, 100) : 0;
              
              return (
                <div key={date} className="group relative">
                  <div 
                    className={`aspect-square rounded-lg transition-all duration-300 cursor-pointer hover:scale-110 ${
                      intensity === 0 ? 'bg-slate-800' :
                      intensity < 25 ? 'bg-green-500/20' :
                      intensity < 50 ? 'bg-green-500/40' :
                      intensity < 75 ? 'bg-green-500/60' :
                      'bg-green-500/80'
                    } border border-white/10`}
                  >
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      <div className="font-bold mb-1">{date}</div>
                      <div className="text-green-400">{data.focused} focused</div>
                      <div className="text-yellow-400">{data.distracted} distracted</div>
                      <div className="text-red-400">{data.drowsy} drowsy</div>
                    </div>
                  </div>
                  <div className="text-center text-[10px] text-gray-500 mt-1">
                    {new Date(date).getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-slate-800 rounded"></div>
              <div className="w-4 h-4 bg-green-500/20 rounded"></div>
              <div className="w-4 h-4 bg-green-500/40 rounded"></div>
              <div className="w-4 h-4 bg-green-500/60 rounded"></div>
              <div className="w-4 h-4 bg-green-500/80 rounded"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
};