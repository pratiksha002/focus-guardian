import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { saveGamificationData, loadGamificationData } from '../utils/StorageManager';
import { AuthContext } from './AuthContext';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const GamificationContext = createContext();

const badges = {
  firstSession: { id: 'firstSession', name: 'First Steps', emoji: '👶', description: 'Complete your first focus session' },
  focused10: { id: 'focused10', name: 'Focused Mind', emoji: '🎯', description: 'Achieve 10 focused detections' },
  focused50: { id: 'focused50', name: 'Concentration Master', emoji: '🧠', description: 'Achieve 50 focused detections' },
  focused100: { id: 'focused100', name: 'Focus Guru', emoji: '🏆', description: 'Achieve 100 focused detections' },
  streak3: { id: 'streak3', name: 'Getting Started', emoji: '🔥', description: '3 day focus streak' },
  streak7: { id: 'streak7', name: 'Week Warrior', emoji: '⚡', description: '7 day focus streak' },
  streak30: { id: 'streak30', name: 'Monthly Master', emoji: '👑', description: '30 day focus streak' },
  perfectSession: { id: 'perfectSession', name: 'Perfect Focus', emoji: '💎', description: 'Complete a session with 100% focus' },
  nightOwl: { id: 'nightOwl', name: 'Night Owl', emoji: '🦉', description: 'Focus session after midnight' },
  earlyBird: { id: 'earlyBird', name: 'Early Bird', emoji: '🐦', description: 'Focus session before 6 AM' },
  marathon: { id: 'marathon', name: 'Marathon Runner', emoji: '🏃', description: 'Focus for 2 hours continuously' },
  sessions10: { id: 'sessions10', name: 'Dedicated', emoji: '💪', description: 'Complete 10 sessions' },
  sessions50: { id: 'sessions50', name: 'Committed', emoji: '🎖️', description: 'Complete 50 sessions' },
  sessions100: { id: 'sessions100', name: 'Legendary', emoji: '⭐', description: 'Complete 100 sessions' },
  centurion: { id: 'centurion', name: 'Centurion', emoji: '💯', description: 'Reach level 100' },
};

const calculateLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 250)) + 1;
};

const calculateXPForNextLevel = (level) => {
  return (level * level) * 250;
};

const getDefaultStats = () => ({
  xp: 0,
  level: 1,
  badges: [],
  streak: 0,
  lastSessionDate: null,
  totalFocusTime: 0,
  totalSessions: 0,
  sessionsHistory: [],
  achievements: []
});

export const GamificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [userStats, setUserStats] = useState(getDefaultStats());
  const [newBadges, setNewBadges] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data when user changes
  useEffect(() => {
    if (user?.id) {
      console.log('📊 Loading gamification data for user:', user.id);
      const data = loadGamificationData();
      console.log('📊 Loaded data:', data);
      setUserStats(data);
      setIsLoaded(true);
    } else {
      // User logged out, reset to defaults
      console.log('📊 User logged out, resetting gamification data');
      setUserStats(getDefaultStats());
      setIsLoaded(false);
    }
  }, [user?.id]); // Re-run when user ID changes

  // Save data whenever it changes (debounced)
  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const timeoutId = setTimeout(() => {
      console.log('💾 Saving gamification data for user:', user.id);
      saveGamificationData(userStats);
      
      // Also sync XP to backend
      syncXPToBackend();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [userStats, isLoaded, user?.id]);

  // Sync XP to backend immediately (not debounced)
  const syncXPToBackendImmediate = async (xp, level) => {
    if (!user?.id) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      console.log(`🔄 Syncing XP to backend: ${xp} XP, Level ${level}`);

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/user/update-xp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ xp, level })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ XP synced successfully:', data);
      } else {
        console.error('❌ Failed to sync XP to backend');
      }
    } catch (error) {
      console.error('❌ Error syncing XP:', error);
    }
  };

  // Sync XP to backend (debounced version for periodic saves)
  const syncXPToBackend = async () => {
    if (!userStats || !user?.id) return;
    await syncXPToBackendImmediate(userStats.xp, userStats.level);
  };

  const addXP = useCallback((amount, reason = 'Focus detection') => {
    setUserStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        showNotification(`🎉 Level Up! You're now level ${newLevel}!`);
      }

      const newStats = {
        ...prev,
        xp: newXP,
        level: newLevel
      };

      // Immediately sync to backend
      syncXPToBackendImmediate(newStats.xp, newStats.level);

      return newStats;
    });
  }, []);

  const unlockBadge = useCallback((badgeId) => {
    if (!badges[badgeId]) return;
    
    setUserStats(prev => {
      if (prev.badges.includes(badgeId)) return prev;

      const newBadge = badges[badgeId];
      setNewBadges(current => [...current, newBadge]);
      
      setTimeout(() => {
        setNewBadges(current => current.filter(b => b.id !== badgeId));
      }, 5000);

      showNotification(`🏆 New Badge Unlocked: ${newBadge.emoji} ${newBadge.name}!`);

      return {
        ...prev,
        badges: [...prev.badges, badgeId],
        achievements: [
          ...prev.achievements,
          {
            type: 'badge',
            badgeId,
            timestamp: new Date().toISOString()
          }
        ]
      };
    });
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    
    setUserStats(prev => {
      const lastDate = prev.lastSessionDate ? new Date(prev.lastSessionDate).toDateString() : null;
      
      if (lastDate === today) {
        return prev;
      }

      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let newStreak = prev.streak;

      if (lastDate === yesterday) {
        newStreak += 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }

      // Check streak badges
      setTimeout(() => {
        if (newStreak >= 3 && !prev.badges.includes('streak3')) {
          unlockBadge('streak3');
        }
        if (newStreak >= 7 && !prev.badges.includes('streak7')) {
          unlockBadge('streak7');
        }
        if (newStreak >= 30 && !prev.badges.includes('streak30')) {
          unlockBadge('streak30');
        }
      }, 1000);

      return {
        ...prev,
        streak: newStreak,
        lastSessionDate: today
      };
    });
  }, [unlockBadge]);

  const checkBadges = useCallback((stats) => {
    setUserStats(prev => {
      // First session
      if (!prev.badges.includes('firstSession')) {
        setTimeout(() => unlockBadge('firstSession'), 500);
      }

      // Focus milestones
      const totalFocused = stats.total_focused || 0;
      if (totalFocused >= 10 && !prev.badges.includes('focused10')) {
        setTimeout(() => unlockBadge('focused10'), 1000);
      }
      if (totalFocused >= 50 && !prev.badges.includes('focused50')) {
        setTimeout(() => unlockBadge('focused50'), 1000);
      }
      if (totalFocused >= 100 && !prev.badges.includes('focused100')) {
        setTimeout(() => unlockBadge('focused100'), 1000);
      }

      // Session count badges
      if (prev.totalSessions >= 10 && !prev.badges.includes('sessions10')) {
        setTimeout(() => unlockBadge('sessions10'), 1000);
      }
      if (prev.totalSessions >= 50 && !prev.badges.includes('sessions50')) {
        setTimeout(() => unlockBadge('sessions50'), 1000);
      }
      if (prev.totalSessions >= 100 && !prev.badges.includes('sessions100')) {
        setTimeout(() => unlockBadge('sessions100'), 1000);
      }

      // Level badges
      if (prev.level >= 100 && !prev.badges.includes('centurion')) {
        setTimeout(() => unlockBadge('centurion'), 1000);
      }

      return prev;
    });
  }, [unlockBadge]);

  const onFocusDetection = useCallback((status) => {
    if (status === 'focused') {
      addXP(5, 'Focused detection');
    } else if (status === 'distracted') {
      addXP(1, 'Activity detected');
    }
  }, [addXP]);

  const onSessionComplete = useCallback((sessionStats) => {
    updateStreak();
    
    setUserStats(prev => {
      const newSession = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        stats: sessionStats,
        duration: 0,
      };

      const newTotalSessions = prev.totalSessions + 1;

      return {
        ...prev,
        totalSessions: newTotalSessions,
        sessionsHistory: [...prev.sessionsHistory, newSession].slice(-100)
      };
    });

    checkBadges(sessionStats);
    addXP(25, 'Session completed');

    const total = sessionStats.total_focused + sessionStats.total_distracted + sessionStats.total_drowsy;
    if (sessionStats.total_focused === total && total > 10) {
      unlockBadge('perfectSession');
      addXP(50, 'Perfect session bonus!');
    }

    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6 && !userStats.badges.includes('earlyBird')) {
      unlockBadge('earlyBird');
    }
    if (hour >= 22 && !userStats.badges.includes('nightOwl')) {
      unlockBadge('nightOwl');
    }
  }, [updateStreak, checkBadges, addXP, unlockBadge, userStats]);

  const showNotification = (message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Focus Guardian', { body: message, icon: '🎯' });
    }
  };

  const getProgressToNextLevel = useCallback(() => {
    const currentLevelXP = calculateXPForNextLevel(userStats.level - 1);
    const nextLevelXP = calculateXPForNextLevel(userStats.level);
    const progress = ((userStats.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.min(100, Math.max(0, progress));
  }, [userStats]);

  const getUnlockedBadges = useCallback(() => {
    return userStats.badges.map(id => badges[id]).filter(Boolean);
  }, [userStats.badges]);

  const getLockedBadges = useCallback(() => {
    return Object.values(badges).filter(badge => !userStats.badges.includes(badge.id));
  }, [userStats.badges]);

  const getRecentSessions = useCallback((count = 10) => {
    return userStats.sessionsHistory.slice(-count).reverse();
  }, [userStats.sessionsHistory]);

  // ALWAYS return a valid context object
  return (
    <GamificationContext.Provider value={{
      userStats,
      addXP,
      unlockBadge,
      updateStreak,
      onFocusDetection,
      onSessionComplete,
      checkBadges,
      getProgressToNextLevel,
      calculateXPForNextLevel,
      getUnlockedBadges,
      getLockedBadges,
      getRecentSessions,
      newBadges,
      allBadges: badges,
      isLoaded
    }}>
      {children}
    </GamificationContext.Provider>
  );
};