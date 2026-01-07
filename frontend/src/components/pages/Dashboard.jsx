import React, { useState, useEffect, useContext } from 'react';
import { BarChart3, TrendingUp, Clock, Eye, AlertCircle, Activity, Zap, Target, Award } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const DashboardPage = () => {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total_focused: 0,
    total_distracted: 0,
    total_drowsy: 0,
    avg_score: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
      setIsLive(true);
      setTimeout(() => setIsLive(false), 500);
    }, 2000); // Update every 2 seconds for real-time feel
    return () => clearInterval(interval);
  }, [token]);

  const fetchStats = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      // ...
      const response = await fetch(`${API_URL}/api/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch stats');

      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return stats.total_focused + stats.total_distracted + stats.total_drowsy;
  };

  const calculateFocusPercentage = () => {
    const total = calculateTotal();
    if (total === 0) return 0;
    return Math.round((stats.total_focused / total) * 100);
  };

  const getPerformanceLevel = () => {
    const percentage = calculateFocusPercentage();
    if (percentage >= 80) return { label: 'Excellent', color: 'text-green-400', emoji: '🔥' };
    if (percentage >= 60) return { label: 'Good', color: 'text-blue-400', emoji: '👍' };
    if (percentage >= 40) return { label: 'Average', color: 'text-yellow-400', emoji: '⚡' };
    return { label: 'Needs Focus', color: 'text-red-400', emoji: '💪' };
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const performance = getPerformanceLevel();
  const total = calculateTotal();
  const focusPercentage = calculateFocusPercentage();

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-[1600px] mx-auto">
        {/* Header with Live Indicator */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400">Real-time focus tracking analytics</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/50 border border-purple-500/30 rounded-full px-4 py-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400' : 'bg-green-500'} ${isLive ? 'animate-ping' : 'animate-pulse'}`}></div>
            <span className="text-green-400 text-sm font-medium">Live</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 animate-pulse">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Hero Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Detections */}
          <div className="group relative bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Activity className="w-7 h-7 text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-purple-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </div>
              <div className="text-4xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">{total}</div>
              <div className="text-sm text-purple-300 font-medium">Total Detections</div>
            </div>
          </div>

          {/* Focus Rate */}
          <div className="group relative bg-gradient-to-br from-green-600/20 via-green-500/10 to-transparent border border-green-500/30 rounded-2xl p-6 hover:border-green-500/60 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-green-400" />
                </div>
                <div className="text-2xl">{performance.emoji}</div>
              </div>
              <div className="text-4xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">{focusPercentage}%</div>
              <div className="text-sm text-green-300 font-medium">Focus Rate</div>
            </div>
          </div>

          {/* Average Score */}
          <div className="group relative bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-transparent border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-7 h-7 text-blue-400" />
                </div>
                <Award className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="text-4xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">{Math.round(stats.avg_score)}</div>
              <div className="text-sm text-blue-300 font-medium">Average Score</div>
            </div>
          </div>

          {/* Focused Count */}
          <div className="group relative bg-gradient-to-br from-yellow-600/20 via-yellow-500/10 to-transparent border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-500/60 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-7 h-7 text-yellow-400" />
                </div>
                <span className="text-2xl">👀</span>
              </div>
              <div className="text-4xl font-bold text-white mb-1 group-hover:scale-105 transition-transform duration-300">{stats.total_focused}</div>
              <div className="text-sm text-yellow-300 font-medium">Focused Moments</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Focus Distribution Chart */}
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Focus Distribution</h2>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                performance.color
              } bg-slate-800/50 border border-current/30`}>
                {performance.label} {performance.emoji}
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Focused */}
              <div className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <span className="text-xl">👀</span>
                    </div>
                    <div>
                      <div className="text-green-400 font-semibold">Focused</div>
                      <div className="text-xs text-gray-500">Optimal performance state</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">{stats.total_focused}</div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-400 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{ width: `${total > 0 ? (stats.total_focused / total) * 100 : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">
                  {total > 0 ? Math.round((stats.total_focused / total) * 100) : 0}%
                </div>
              </div>

              {/* Distracted */}
              <div className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <span className="text-xl">😵</span>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-semibold">Distracted</div>
                      <div className="text-xs text-gray-500">Loss of attention detected</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">{stats.total_distracted}</div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-400 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{ width: `${total > 0 ? (stats.total_distracted / total) * 100 : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">
                  {total > 0 ? Math.round((stats.total_distracted / total) * 100) : 0}%
                </div>
              </div>

              {/* Drowsy */}
              <div className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <span className="text-xl">😴</span>
                    </div>
                    <div>
                      <div className="text-red-400 font-semibold">Drowsy</div>
                      <div className="text-xs text-gray-500">Signs of fatigue</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-300">{stats.total_drowsy}</div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-500 via-pink-500 to-red-400 h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{ width: `${total > 0 ? (stats.total_drowsy / total) * 100 : 0}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400 mt-1">
                  {total > 0 ? Math.round((stats.total_drowsy / total) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>

          {/* Performance Circle */}
          <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-8">Performance</h2>
            
            <div className="flex flex-col items-center justify-center">
              {/* Circular Progress */}
              <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-slate-800"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - focusPercentage / 100)}`}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-white mb-1">{focusPercentage}%</div>
                  <div className="text-sm text-gray-400">Focus Rate</div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="w-full space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <span className="text-sm text-green-400 font-medium">Focused</span>
                  <span className="text-lg font-bold text-white">{stats.total_focused}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <span className="text-sm text-yellow-400 font-medium">Distracted</span>
                  <span className="text-lg font-bold text-white">{stats.total_distracted}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                  <span className="text-sm text-red-400 font-medium">Drowsy</span>
                  <span className="text-lg font-bold text-white">{stats.total_drowsy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips & Insights */}
        {total > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance Insight */}
            {focusPercentage >= 70 ? (
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <Award className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Excellent Focus! 🎉</h3>
                    <p className="text-gray-300 text-sm">
                      You're maintaining great focus. Keep up the excellent work and remember to take regular breaks.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/50 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Focus Tips 💡</h3>
                    <p className="text-gray-300 text-sm">
                      Try the Pomodoro technique: 25 minutes of focus, then a 5-minute break. Minimize distractions and ensure good lighting.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Session Info */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Session Summary</h3>
                  <p className="text-gray-300 text-sm">
                    {total} total detections with an average score of {Math.round(stats.avg_score)}. 
                    {stats.total_drowsy > 5 && " Consider taking a break if feeling tired."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {total === 0 && (
          <div className="mt-8 text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Data Yet</h3>
            <p className="text-gray-400 mb-6">Start a focus session to see your analytics here</p>
            <button 
              onClick={() => window.location.href = '#focus'}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300"
            >
              Start Focus Session
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};