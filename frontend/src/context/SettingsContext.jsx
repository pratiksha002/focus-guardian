import React, { createContext, useState } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    autoStart: false,
    sensitivity: 'medium',
    sessionGoal: 60,
    breakReminder: true,
    breakInterval: 25,
    wsUrl: 'ws://127.0.0.1:8000/ws/focus'  // Changed from localhost to 127.0.0.1
  });
  
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};