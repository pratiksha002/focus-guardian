import React, { useContext, useState } from 'react';
import { Palette, Sparkles, Bell, Shield, Volume2, VolumeX, Zap, Sliders, Eye } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { GamificationContext } from '../../context/GamificationContext';
import { PetCustomization } from '../features/PetCustomization';

export const SettingsPage = () => {
  const { theme, currentTheme, themes, changeTheme, particlesEnabled, toggleParticles } = useContext(ThemeContext);
  const { userStats } = useContext(GamificationContext);
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [showPetCustomization, setShowPetCustomization] = useState(false);
  const [sensitivity, setSensitivity] = useState(() => {
    return localStorage.getItem('detection-sensitivity') || 'medium';
  });

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotifications(permission === 'granted');
    }
  };

  const handleSensitivityChange = (value) => {
    setSensitivity(value);
    localStorage.setItem('detection-sensitivity', value);
  };

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Customize your Focus Guardian experience</p>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Theme</h2>
                <p className="text-sm text-gray-400">Choose your favorite color scheme</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(themes).map(([key, themeData]) => (
                <button
                  key={key}
                  onClick={() => changeTheme(key)}
                  className={`relative group overflow-hidden rounded-xl p-4 border-2 transition-all duration-300 ${
                    currentTheme === key
                      ? 'border-white shadow-lg scale-105'
                      : 'border-gray-700 hover:border-gray-500'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${themeData.background} opacity-50`}></div>
                  <div className="relative z-10">
                    <div className="text-3xl mb-2">{themeData.emoji}</div>
                    <div className="text-white font-semibold text-sm">{themeData.name}</div>
                    {currentTheme === key && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Visual Effects */}
          <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Visual Effects</h2>
                <p className="text-sm text-gray-400">Enhance your experience with animations</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Particles Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Particle Effects</div>
                    <div className="text-sm text-gray-400">Animated background particles</div>
                  </div>
                </div>
                <button
                  onClick={toggleParticles}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                    particlesEnabled ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                      particlesEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Detection Settings */}
          <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Eye className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Detection Settings</h2>
                <p className="text-sm text-gray-400">Adjust focus detection sensitivity</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Sensitivity Slider */}
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Sliders className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">Detection Sensitivity</div>
                      <div className="text-sm text-gray-400">
                        How strict should focus detection be?
                      </div>
                    </div>
                  </div>
                  <span className="text-purple-400 font-bold capitalize">{sensitivity}</span>
                </div>

                {/* Sensitivity Options */}
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'medium', 'high'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleSensitivityChange(level)}
                      className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                        sensitivity === level
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                          : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                      }`}
                    >
                      <div className="capitalize">{level}</div>
                      <div className="text-xs opacity-70">
                        {level === 'low' && 'Relaxed'}
                        {level === 'medium' && 'Balanced'}
                        {level === 'high' && 'Strict'}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-300">
                  💡 <strong>Tip:</strong> {
                    sensitivity === 'low' ? 'More forgiving - counts slight distractions as focused' :
                    sensitivity === 'medium' ? 'Recommended for most users - balanced detection' :
                    'Very strict - only perfect focus counts'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Pet Customization */}
          <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <span className="text-2xl">🐾</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Pet Customization</h2>
                <p className="text-sm text-gray-400">Choose your companion style</p>
              </div>
            </div>

            <button
              onClick={() => setShowPetCustomization(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Customize Pet
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Notifications</h2>
                <p className="text-sm text-gray-400">Manage alerts and reminders</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Browser Notifications</div>
                    <div className="text-sm text-gray-400">Get alerts for achievements</div>
                  </div>
                </div>
                <button
                  onClick={requestNotificationPermission}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                    notifications ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                      notifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  {sounds ? <Volume2 className="w-5 h-5 text-purple-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                  <div>
                    <div className="text-white font-medium">Sound Effects</div>
                    <div className="text-sm text-gray-400">Play sounds for events</div>
                  </div>
                </div>
                <button
                  onClick={() => setSounds(!sounds)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                    sounds ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                      sounds ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Profile & Stats */}
          <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Your Progress</h2>
                <p className="text-sm text-gray-400">Gamification stats</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">{userStats.level}</div>
                <div className="text-sm text-purple-300">Level</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">{userStats.streak}</div>
                <div className="text-sm text-orange-300">Streak</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">{userStats.badges.length}</div>
                <div className="text-sm text-blue-300">Badges</div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-slate-900/50 backdrop-blur border border-purple-500/30 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">Focus Guardian</h3>
            <p className="text-gray-400 text-sm mb-4">AI-Powered Focus Tracking System</p>
            <div className="text-xs text-gray-500">Version 2.5.0 • Phase 2 Complete</div>
          </div>
        </div>
      </div>

      {/* Pet Customization Modal */}
      {showPetCustomization && (
        <PetCustomization onClose={() => setShowPetCustomization(false)} />
      )}
    </div>
  );
};