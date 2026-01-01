import React, { useState, useEffect } from 'react';

export const useSessionTimer = (isActive) => {
  const [sessionTime, setSessionTime] = useState(0);
  
  useEffect(() => {
    let timer;
    if (isActive) {
      timer = setInterval(() => setSessionTime(prev => prev + 1), 1000);
    } else {
      setSessionTime(0);
    }
    return () => clearInterval(timer);
  }, [isActive]);
  
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  
  return { sessionTime, formatTime };
};