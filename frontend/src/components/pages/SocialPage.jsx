import React, { useState, useContext, useEffect } from 'react';
import { Users, Trophy, Search, TrendingUp, X } from 'lucide-react';
import { GamificationContext } from '../../context/GamificationContext';
import { AuthContext } from '../../context/AuthContext';

const API_URL = 'http://localhost:8000';

// Helper function to get pet emoji (not a hook - can be used anywhere)
const getPetEmojiForLevel = (level) => {
  const petThemes = {
    default: ['🥚', '🐣', '🐥', '🐤', '🦆', '🦢'],
    cats: ['🥚', '🐱', '😺', '😸', '🦁', '🐯'],
    dragons: ['🥚', '🦎', '🐲', '🐉', '🔥', '⚡'],
    plants: ['🌰', '🌱', '🌿', '🪴', '🌳', '🌸'],
    space: ['🥚', '⭐', '🌙', '🪐', '🚀', '🌌'],
    ocean: ['🥚', '🐠', '🐟', '🐡', '🐬', '🐳'],
    magical: ['🥚', '✨', '🔮', '🦄', '🌟', '🪄'],
    food: ['🥚', '🍪', '🍰', '🎂', '🍕', '🍔']
  };

  // Load theme from localStorage
  const savedTheme = localStorage.getItem('focus-guardian-pet-theme') || 'default';
  const theme = savedTheme.replace(/"/g, ''); // Remove quotes if any
  const stages = petThemes[theme] || petThemes.default;
  
  let stageIndex = 0;
  if (level < 3) stageIndex = 0;
  else if (level < 5) stageIndex = 1;
  else if (level < 10) stageIndex = 2;
  else if (level < 20) stageIndex = 3;
  else if (level < 50) stageIndex = 4;
  else stageIndex = 5;

  return stages[stageIndex];
};

const UserProfileModal = ({ user, onClose }) => {
  const petEmoji = getPetEmojiForLevel(user.level || 1);
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border-2 border-purple-500/50 rounded-2xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-4xl">
              {user.username[0].toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
          <p className="text-gray-400">{user.full_name}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-white">{user.level || 1}</div>
            <div className="text-xs text-gray-400">Level</div>
          </div>
          <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-white">{user.xp || 0}</div>
            <div className="text-xs text-gray-400">Total XP</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6 mb-6">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Their Focus Pet</div>
            <div className="text-6xl mb-2">{petEmoji}</div>
            <div className="text-white font-semibold">Level {user.level || 1} Companion</div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-400">
          Member since {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
            month: 'long',
            day: 'numeric',
            year: 'numeric' 
          }) : 'December 2025'}
        </div>
      </div>
    </div>
  );
};

export const SocialPage = () => {
  const { userStats } = useContext(GamificationContext);
  const { user, token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      const users = data.filter(u => u.id !== user?.id);
      setAllUsers(users);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setAllUsers([]);
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch leaderboard');

      const data = await response.json();
      const sorted = data
        .map(u => ({
          ...u,
          xp: u.xp || 0,
          level: u.level || 1
        }))
        .sort((a, b) => b.xp - a.xp)
        .map((u, idx) => ({
          rank: idx + 1,
          username: u.username,
          level: u.level,
          xp: u.xp,
          badge: idx === 0 ? '👑' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⭐',
          isCurrentUser: u.id === user?.id
        }));
      
      setLeaderboard(sorted);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      if (userStats) {
        setLeaderboard([{
          rank: 1,
          username: user?.username || 'You',
          level: userStats.level || 1,
          xp: userStats.xp || 0,
          badge: '💫',
          isCurrentUser: true
        }]);
      }
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const results = allUsers.filter(u => 
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSearchResults(results);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, allUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Social
          </h1>
          <p className="text-gray-400">Connect with other Focus Guardian users</p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'discover'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800'
            }`}
          >
            <Search className="w-5 h-5" />
            Discover Users
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Leaderboard
          </button>
        </div>

        {activeTab === 'discover' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Find Users</h3>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by username or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Search Results ({searchResults.length})</h3>
                
                <div className="space-y-3">
                  {searchResults.map((foundUser) => (
                    <div
                      key={foundUser.id}
                      onClick={() => setSelectedUser(foundUser)}
                      className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4 hover:bg-slate-800 transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative">
                            <span className="text-white font-bold text-2xl">
                              {foundUser.username[0].toUpperCase()}
                            </span>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center border-2 border-purple-500">
                              <span className="text-sm">{getPetEmojiForLevel(foundUser.level || 1)}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-white font-semibold text-lg">{foundUser.username}</div>
                            <div className="text-sm text-gray-400">{foundUser.full_name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                Level {foundUser.level || 1}
                              </span>
                              <span className="text-xs text-gray-500">
                                {foundUser.xp || 0} XP
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white transition-all duration-300 opacity-0 group-hover:opacity-100">
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">All Users ({allUsers.length})</h3>
              
              {allUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No other users found. Be the first to invite friends!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allUsers.map((otherUser) => (
                    <div
                      key={otherUser.id}
                      onClick={() => setSelectedUser(otherUser)}
                      className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-4 hover:bg-slate-800 transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {otherUser.username[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-semibold">{otherUser.username}</div>
                            <div className="text-sm text-gray-400">{otherUser.full_name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                            Lvl {otherUser.level || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-2 border-purple-500/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">💫</div>
                  <div>
                    <div className="text-white font-bold text-xl">
                      Your Rank: #{leaderboard.findIndex(u => u.isCurrentUser) + 1 || 'N/A'}
                    </div>
                    <div className="text-gray-400">Level {userStats?.level || 1}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{userStats?.xp || 0}</div>
                  <div className="text-sm text-gray-400">Total XP</div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Global Leaderboard</h3>
              </div>

              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No rankings yet. Start focusing to climb the leaderboard!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                        entry.isCurrentUser
                          ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-500/50 shadow-lg'
                          : 'bg-slate-800/50 border border-purple-500/20 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          entry.rank === 1 ? 'bg-yellow-500 text-yellow-900' :
                          entry.rank === 2 ? 'bg-gray-400 text-gray-900' :
                          entry.rank === 3 ? 'bg-orange-600 text-orange-100' :
                          'bg-slate-700 text-gray-400'
                        }`}>
                          #{entry.rank}
                        </div>
                        <div className="text-2xl">{entry.badge}</div>
                        <div>
                          <div className={`font-semibold ${entry.isCurrentUser ? 'text-purple-300' : 'text-white'}`}>
                            {entry.username}
                          </div>
                          <div className="text-sm text-gray-400">Level {entry.level}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xl font-bold text-white">{entry.xp}</div>
                          <div className="text-xs text-gray-400">XP</div>
                        </div>
                        <TrendingUp className={entry.rank <= 3 ? 'w-5 h-5 text-green-400' : 'w-5 h-5 text-gray-600'} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedUser && (
          <UserProfileModal 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
          />
        )}
      </div>
    </div>
  );
};