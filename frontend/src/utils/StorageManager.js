// Centralized storage manager for all app data with user-specific storage
class StorageManager {
  constructor() {
    this.prefix = 'focus-guardian-';
    this.currentUserId = null;
  }

  // Set current user ID for user-specific storage
  setUserId(userId) {
    this.currentUserId = userId;
    console.log(`🔑 Storage set to user: ${userId}`);
  }

  // Get user-specific key
  getUserKey(key) {
    if (this.currentUserId) {
      return `${this.prefix}${this.currentUserId}-${key}`;
    }
    return `${this.prefix}${key}`;
  }

  // Save data with error handling
  save(key, data) {
    try {
      const fullKey = this.getUserKey(key);
      const serialized = JSON.stringify(data);
      localStorage.setItem(fullKey, serialized);
      console.log(`✅ Saved ${key} for user ${this.currentUserId}:`, data);
      return true;
    } catch (error) {
      console.error(`❌ Failed to save ${key}:`, error);
      return false;
    }
  }

  // Load data with error handling
  load(key, defaultValue = null) {
    try {
      const fullKey = this.getUserKey(key);
      const item = localStorage.getItem(fullKey);
      
      if (item === null) {
        console.log(`ℹ️ No data found for ${key}, using default`);
        return defaultValue;
      }

      const parsed = JSON.parse(item);
      console.log(`✅ Loaded ${key} for user ${this.currentUserId}:`, parsed);
      return parsed;
    } catch (error) {
      console.error(`❌ Failed to load ${key}:`, error);
      return defaultValue;
    }
  }

  // Remove specific key
  remove(key) {
    try {
      const fullKey = this.getUserKey(key);
      localStorage.removeItem(fullKey);
      console.log(`🗑️ Removed ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to remove ${key}:`, error);
      return false;
    }
  }

  // Clear all data for current user
  clearUserData() {
    try {
      if (!this.currentUserId) return false;
      
      const keys = Object.keys(localStorage);
      const userPrefix = `${this.prefix}${this.currentUserId}-`;
      
      keys.forEach(key => {
        if (key.startsWith(userPrefix)) {
          localStorage.removeItem(key);
        }
      });
      console.log(`🗑️ Cleared all data for user ${this.currentUserId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to clear user data:', error);
      return false;
    }
  }

  // Clear all app data (all users)
  clearAll() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      console.log('🗑️ Cleared all app data');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      return false;
    }
  }

  // Check if key exists
  exists(key) {
    const fullKey = this.getUserKey(key);
    return localStorage.getItem(fullKey) !== null;
  }

  // Get all keys for current user
  getAllKeys() {
    const keys = Object.keys(localStorage);
    const userPrefix = this.getUserKey('');
    return keys
      .filter(key => key.startsWith(userPrefix))
      .map(key => key.replace(userPrefix, ''));
  }
}

export const storage = new StorageManager();

// Helper to set user context
export const setStorageUser = (userId) => {
  storage.setUserId(userId);
};

// Specific save/load functions for different data types
export const saveGamificationData = (data) => {
  return storage.save('gamification', data);
};

export const loadGamificationData = () => {
  return storage.load('gamification', {
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
};

export const savePetData = (data) => {
  return storage.save('pet', data);
};

export const loadPetData = () => {
  return storage.load('pet', {
    happiness: 100,
    hunger: 0,
    energy: 100,
    theme: 'default',
    lastFed: null,
    lastPlayed: null,
    evolution: 0,
    totalPets: 0
  });
};

export const savePetTheme = (theme) => {
  return storage.save('pet-theme', theme);
};

export const loadPetTheme = () => {
  return storage.load('pet-theme', 'default');
};

export const saveTheme = (theme) => {
  return storage.save('theme', theme);
};

export const loadTheme = () => {
  return storage.load('theme', 'midnight');
};

export const saveSettings = (settings) => {
  return storage.save('settings', settings);
};

export const loadSettings = () => {
  return storage.load('settings', {
    particles: true,
    notifications: true,
    sounds: true,
    sensitivity: 'medium'
  });
};

export const saveSessionData = (session) => {
  const sessions = loadAllSessions();
  sessions.push({
    ...session,
    id: Date.now(),
    timestamp: new Date().toISOString()
  });
  return storage.save('sessions', sessions);
};

export const loadAllSessions = () => {
  return storage.load('sessions', []);
};

export const saveUserProfile = (profile) => {
  return storage.save('user-profile', profile);
};

export const loadUserProfile = () => {
  return storage.load('user-profile', null);
};