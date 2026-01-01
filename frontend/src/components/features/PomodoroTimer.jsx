import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';

export const PomodoroTimer = ({ isTracking }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'break'
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef(null);

  // Timer settings
  const FOCUS_TIME = 25 * 60; // 25 minutes
  const SHORT_BREAK = 5 * 60; // 5 minutes
  const LONG_BREAK = 15 * 60; // 15 minutes

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play notification sound
    playNotificationSound();
    
    if (mode === 'focus') {
      setCompletedPomodoros(prev => prev + 1);
      const newCount = completedPomodoros + 1;
      
      // After 4 pomodoros, take a long break
      if (newCount % 4 === 0) {
        setMode('break');
        setTimeLeft(LONG_BREAK);
        showNotification('Great work! Time for a long break 🎉');
      } else {
        setMode('break');
        setTimeLeft(SHORT_BREAK);
        showNotification('Pomodoro complete! Time for a short break ☕');
      }
    } else {
      setMode('focus');
      setTimeLeft(FOCUS_TIME);
      showNotification('Break over! Ready to focus? 🎯');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setTimeLeft(FOCUS_TIME);
    } else {
      setTimeLeft(SHORT_BREAK);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'focus') {
      setTimeLeft(FOCUS_TIME);
    } else {
      setTimeLeft(SHORT_BREAK);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = mode === 'focus' ? FOCUS_TIME : SHORT_BREAK;
    return ((total - timeLeft) / total) * 100;
  };

  const playNotificationSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTO...');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore errors
  };

  const showNotification = (message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', { 
        body: message, 
        icon: mode === 'focus' ? '🎯' : '☕' 
      });
    }
  };

  return (
    <div className={`bg-gradient-to-br ${
      mode === 'focus' 
        ? 'from-purple-500/20 to-pink-500/10 border-purple-500/30' 
        : 'from-green-500/20 to-emerald-500/10 border-green-500/30'
    } border rounded-2xl p-6 backdrop-blur-sm`}>
      {/* Mode Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchMode('focus')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            mode === 'focus'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Target className="w-4 h-4" />
            Focus
          </div>
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
            mode === 'break'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Coffee className="w-4 h-4" />
            Break
          </div>
        </button>
      </div>

      {/* Circular Progress */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-white/10"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            className={mode === 'focus' ? 'text-purple-500' : 'text-green-500'}
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - getProgress() / 100)}`}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-white mb-1">
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-gray-400 capitalize">{mode} Time</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={toggleTimer}
          disabled={!isTracking}
          className={`p-4 rounded-full transition-all duration-300 ${
            isTracking
              ? mode === 'focus'
                ? 'bg-purple-500 hover:bg-purple-600 shadow-lg hover:shadow-purple-500/50'
                : 'bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-green-500/50'
              : 'bg-gray-600 cursor-not-allowed'
          }`}
        >
          {isRunning ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
        
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
        >
          <RotateCcw className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-400">
          Completed Today
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: completedPomodoros }).map((_, i) => (
            <div key={i} className="w-2 h-2 bg-purple-500 rounded-full"></div>
          ))}
          <span className="text-white font-bold ml-2">{completedPomodoros}</span>
        </div>
      </div>

      {!isTracking && (
        <div className="mt-4 text-center text-xs text-yellow-400">
          Start tracking to enable timer
        </div>
      )}
    </div>
  );
};