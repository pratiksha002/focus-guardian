import React, { useContext } from 'react';
import { Calendar, Clock, TrendingUp, Eye, Target, Award } from 'lucide-react';
import { GamificationContext } from '../../context/GamificationContext';
import { ThemeContext } from '../../context/ThemeContext';

export const SessionsPage = () => {
  const { userStats, getRecentSessions } = useContext(GamificationContext);
  const { theme } = useContext(ThemeContext);
  const recentSessions = getRecentSessions(50);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const calculateSessionScore = (stats) => {
    const total = stats.totalFocused + stats.totalDistracted + stats.totalDrowsy;
    if (total === 0) return 0;
    return Math.round((stats.totalFocused / total) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-green-500/20 to-emerald-500/10 border-green-500/30';
    if (score >= 60) return 'from-blue-500/20 to-cyan-500/10 border-blue-500/30';
    if (score >= 40) return 'from-yellow-500/20 to-orange-500/10 border-yellow-500/30';
    return 'from-red-500/20 to-pink-500/10 border-red-500/30';
  };

  const totalFocusTime = recentSessions.reduce((acc, session) => {
    return acc + (session.stats?.totalFocused || 0);
  }, 0);

  const averageScore = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((acc, session) => acc + calculateSessionScore(session.stats || {}), 0) / recentSessions.length)
    : 0;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Session History
          </h1>
          <p className="text-gray-400">Track your focus sessions over time</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Sessions */}
          <div className="group bg-gradient-to-br from-purple-600/20 via-purple-500/10 to-transparent border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{userStats.totalSessions}</div>
            <div className="text-sm text-purple-300 font-medium">Total Sessions</div>
          </div>

          {/* Total Focus Time */}
          <div className="group bg-gradient-to-br from-green-600/20 via-green-500/10 to-transparent border border-green-500/30 rounded-2xl p-6 hover:border-green-500/60 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl">👀</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalFocusTime}</div>
            <div className="text-sm text-green-300 font-medium">Total Focused</div>
          </div>

          {/* Average Score */}
          <div className="group bg-gradient-to-br from-blue-600/20 via-blue-500/10 to-transparent border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{averageScore}%</div>
            <div className="text-sm text-blue-300 font-medium">Avg Score</div>
          </div>

          {/* Current Streak */}
          <div className="group bg-gradient-to-br from-orange-600/20 via-orange-500/10 to-transparent border border-orange-500/30 rounded-2xl p-6 hover:border-orange-500/60 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6 text-orange-400" />
              </div>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{userStats.streak}</div>
            <div className="text-sm text-orange-300 font-medium">Day Streak</div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Sessions</h2>
            <span className="text-sm text-gray-400">{recentSessions.length} sessions</span>
          </div>

          {recentSessions.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-2">No Sessions Yet</h3>
              <p className="text-gray-400">Start your first focus session to see it here</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {recentSessions.map((session) => {
                const score = calculateSessionScore(session.stats || {});
                const stats = session.stats || {};
                
                return (
                  <div
                    key={session.id}
                    className={`bg-gradient-to-br ${getScoreBg(score)} border rounded-xl p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-xl">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">{formatDate(session.timestamp)}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {formatTime(session.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                          {score}%
                        </div>
                        <div className="text-xs text-gray-400">Score</div>
                      </div>
                    </div>

                    {/* Session Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">{stats.totalFocused || 0}</div>
                        <div className="text-xs text-green-400">Focused</div>
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">{stats.totalDistracted || 0}</div>
                        <div className="text-xs text-yellow-400">Distracted</div>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">{stats.totalDrowsy || 0}</div>
                        <div className="text-xs text-red-400">Drowsy</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.6);
        }
      `}</style>
    </div>
  );
};