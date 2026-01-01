import React, { useContext, useState, useEffect } from 'react';
import { Heart, Star, Sparkles } from 'lucide-react';
import { GamificationContext } from '../../context/GamificationContext';
import { savePetData, loadPetData, savePetTheme, loadPetTheme } from '../../utils/StorageManager';

export const FocusPet = ({ compact = false }) => {
  const { userStats } = useContext(GamificationContext);
  const [isHappy, setIsHappy] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const [petState, setPetState] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('default');

  // Pet themes with evolution paths
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

  // Load pet data and theme on mount
  useEffect(() => {
    const savedPet = loadPetData();
    const savedTheme = loadPetTheme();
    setPetState(savedPet);
    setCurrentTheme(savedTheme);
    console.log('✅ Loaded pet data:', savedPet, 'Theme:', savedTheme);
  }, []);

  // Save pet data whenever it changes
  useEffect(() => {
    if (petState) {
      savePetData(petState);
    }
  }, [petState]);

  // Update pet state when user stats change
  useEffect(() => {
    if (userStats) {
      const level = userStats.level;
      const happiness = Math.min(100, (userStats.streak * 10) + (level * 2));
      const growth = Math.min(100, level * 5);
      
      setPetState(prev => ({
        ...prev,
        level,
        happiness,
        growth,
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [userStats]);

  // Listen for theme changes from PetCustomization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'focus-guardian-pet-theme' || e.key?.includes('pet-theme')) {
        const newTheme = loadPetTheme();
        setCurrentTheme(newTheme);
        console.log('🎨 Theme changed to:', newTheme);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for theme changes (for same-tab updates)
    const interval = setInterval(() => {
      const newTheme = loadPetTheme();
      if (newTheme !== currentTheme) {
        setCurrentTheme(newTheme);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentTheme]);

  // Calculate pet stats based on user progress
  const level = userStats?.level || 1;
  const happiness = Math.min(100, (userStats?.streak * 10) + (level * 2));
  const growth = Math.min(100, level * 5);

  // Get pet emoji based on current theme and level
  const getPetEmoji = () => {
    const stages = petThemes[currentTheme] || petThemes.default;
    
    let stageIndex = 0;
    if (level < 3) stageIndex = 0;
    else if (level < 5) stageIndex = 1;
    else if (level < 10) stageIndex = 2;
    else if (level < 20) stageIndex = 3;
    else if (level < 50) stageIndex = 4;
    else stageIndex = 5;

    return stages[stageIndex];
  };

  // Pet evolution stages for current theme
  const getPetStage = () => {
    const emoji = getPetEmoji();
    
    if (level < 3) return { name: 'Egg', emoji, size: 'small' };
    if (level < 5) return { name: 'Baby', emoji, size: 'small' };
    if (level < 10) return { name: 'Child', emoji, size: 'medium' };
    if (level < 20) return { name: 'Teen', emoji, size: 'medium' };
    if (level < 50) return { name: 'Adult', emoji, size: 'large' };
    return { name: 'Legendary', emoji, size: 'large' };
  };

  const pet = getPetStage();

  const handlePetClick = () => {
    setIsHappy(true);
    setShowHearts(true);
    
    setPetState(prev => ({
      ...prev,
      lastPlayed: new Date().toISOString(),
      totalPets: (prev?.totalPets || 0) + 1
    }));
    
    setTimeout(() => {
      setIsHappy(false);
      setShowHearts(false);
    }, 2000);
  };

  const getSizeClass = () => {
    switch (pet.size) {
      case 'small': return compact ? 'text-4xl' : 'text-6xl';
      case 'medium': return compact ? 'text-5xl' : 'text-7xl';
      case 'large': return compact ? 'text-6xl' : 'text-8xl';
      default: return 'text-6xl';
    }
  };

  if (compact) {
    return (
      <div className="relative group cursor-pointer" onClick={handlePetClick}>
        <div className={`${getSizeClass()} transition-transform duration-300 ${isHappy ? 'scale-125' : 'group-hover:scale-110'}`}>
          {pet.emoji}
        </div>
        {showHearts && (
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Heart className="w-4 h-4 text-red-400 fill-red-400" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
      {/* Sparkle Effect */}
      {showHearts && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Your Focus Pet</h3>
            <p className="text-sm text-gray-400">Level {level} • {pet.name}</p>
          </div>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>

        {/* Pet Display */}
        <div 
          className="text-center py-8 cursor-pointer"
          onClick={handlePetClick}
        >
          <div className={`${getSizeClass()} mb-4 transition-all duration-300 ${
            isHappy ? 'scale-125 animate-bounce' : 'hover:scale-110'
          }`}>
            {pet.emoji}
          </div>
          <div className="text-white font-semibold">{pet.name} Pet</div>
          <div className="text-xs text-gray-400 mt-1">Click to pet!</div>
          {petState?.totalPets > 0 && (
            <div className="text-xs text-purple-300 mt-1">
              Petted {petState.totalPets} times 💕
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {/* Happiness */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                Happiness
              </span>
              <span className="text-sm font-bold text-white">{happiness}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${happiness}%` }}
              ></div>
            </div>
          </div>

          {/* Growth */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                Growth
              </span>
              <span className="text-sm font-bold text-white">{growth}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${growth}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Evolution Stages */}
        <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
          <div className="text-xs text-gray-400 mb-2">Evolution Path</div>
          <div className="flex items-center justify-between text-2xl">
            {petThemes[currentTheme].map((emoji, idx) => (
              <span 
                key={idx}
                className={
                  (level >= 1 && idx === 0) ||
                  (level >= 3 && idx === 1) ||
                  (level >= 5 && idx === 2) ||
                  (level >= 10 && idx === 3) ||
                  (level >= 20 && idx === 4) ||
                  (level >= 50 && idx === 5)
                    ? 'opacity-100' 
                    : 'opacity-30'
                }
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>

        {/* Next Evolution */}
        {level < 50 && (
          <div className="mt-3 text-center">
            <div className="text-xs text-purple-300">
              {level < 3 ? '2 more levels to hatch!' :
               level < 5 ? 'Almost a child!' :
               level < 10 ? 'Growing fast!' :
               level < 20 ? 'Becoming a teen!' :
               level < 50 ? 'Almost fully grown!' :
               'Maximum evolution!'}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-30px) translateX(10px);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-60px) translateX(-10px);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};