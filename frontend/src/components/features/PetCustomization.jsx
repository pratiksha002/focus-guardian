import React, { useState, useEffect } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { savePetTheme, loadPetTheme } from '../../utils/StorageManager';

export const PetCustomization = ({ onClose }) => {
  const [selectedTheme, setSelectedTheme] = useState('default');

  // Pet themes with evolution paths
  const petThemes = {
    default: {
      name: 'Classic Birds',
      emoji: '🐦',
      stages: ['🥚', '🐣', '🐥', '🐤', '🦆', '🦢']
    },
    cats: {
      name: 'Cute Cats',
      emoji: '🐱',
      stages: ['🥚', '🐱', '😺', '😸', '🦁', '🐯']
    },
    dragons: {
      name: 'Dragons',
      emoji: '🐉',
      stages: ['🥚', '🦎', '🐲', '🐉', '🔥', '⚡']
    },
    plants: {
      name: 'Growing Plants',
      emoji: '🌱',
      stages: ['🌰', '🌱', '🌿', '🪴', '🌳', '🌸']
    },
    space: {
      name: 'Space Explorer',
      emoji: '🚀',
      stages: ['🥚', '⭐', '🌙', '🪐', '🚀', '🌌']
    },
    ocean: {
      name: 'Ocean Creatures',
      emoji: '🐠',
      stages: ['🥚', '🐠', '🐟', '🐡', '🐬', '🐳']
    },
    magical: {
      name: 'Magical Beings',
      emoji: '✨',
      stages: ['🥚', '✨', '🔮', '🦄', '🌟', '🪄']
    },
    food: {
      name: 'Yummy Foods',
      emoji: '🍰',
      stages: ['🥚', '🍪', '🍰', '🎂', '🍕', '🍔']
    }
  };

  useEffect(() => {
    const saved = loadPetTheme();
    if (saved && petThemes[saved]) {
      setSelectedTheme(saved);
      console.log('✅ Loaded pet theme:', saved);
    }
  }, []);

  const handleSelect = (themeKey) => {
    setSelectedTheme(themeKey);
  };

  const handleSave = () => {
    savePetTheme(selectedTheme);
    console.log('💾 Saved pet theme:', selectedTheme);
    
    // Trigger storage event for same-tab updates
    window.dispatchEvent(new Event('storage'));
    
    if (onClose) {
      onClose(selectedTheme);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Customize Your Pet</h2>
            <p className="text-sm text-gray-400">Choose your favorite companion style</p>
          </div>
        </div>

        {/* Pet Theme Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(petThemes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedTheme === key
                  ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                  : 'border-purple-500/30 bg-slate-800/50 hover:border-purple-500/50 hover:bg-slate-800'
              }`}
            >
              {/* Selected Check */}
              {selectedTheme === key && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              {/* Theme Icon */}
              <div className="text-4xl mb-3 text-center">{theme.emoji}</div>
              
              {/* Theme Name */}
              <div className="text-white font-semibold text-sm text-center mb-3">
                {theme.name}
              </div>

              {/* Evolution Preview */}
              <div className="flex justify-center gap-1">
                {theme.stages.slice(0, 6).map((emoji, idx) => (
                  <span key={idx} className="text-lg opacity-70">
                    {emoji}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <div className="mt-6 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Evolution Preview</div>
            <div className="flex items-center justify-center gap-4">
              {petThemes[selectedTheme].stages.map((emoji, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl mb-1">{emoji}</div>
                  <div className="text-xs text-gray-500">Lvl {idx === 0 ? 1 : idx * 10}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div className="text-sm text-blue-300">
            💡 <strong>Tip:</strong> Your pet will evolve through these stages as you level up!
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
        >
          Save & Apply Theme
        </button>
      </div>
    </div>
  );
};

// Hook to get current pet emoji based on level and theme
export const usePetEmoji = (level) => {
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    const saved = loadPetTheme();
    setTheme(saved);

    // Listen for theme changes
    const handleStorageChange = () => {
      const newTheme = loadPetTheme();
      setTheme(newTheme);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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