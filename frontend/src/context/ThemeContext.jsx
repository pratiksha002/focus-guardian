import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const themes = {
  midnight: {
    name: 'Midnight Purple',
    primary: 'from-purple-600 to-pink-600',
    secondary: 'from-purple-500 to-pink-500',
    accent: 'purple-500',
    background: 'from-slate-950 via-purple-950 to-slate-950',
    card: 'slate-900/50',
    border: 'purple-500/30',
    text: 'white',
    emoji: '🌙'
  },
  ocean: {
    name: 'Ocean Blue',
    primary: 'from-blue-600 to-cyan-600',
    secondary: 'from-blue-500 to-cyan-500',
    accent: 'blue-500',
    background: 'from-slate-950 via-blue-950 to-slate-950',
    card: 'slate-900/50',
    border: 'blue-500/30',
    text: 'white',
    emoji: '🌊'
  },
  forest: {
    name: 'Forest Green',
    primary: 'from-green-600 to-emerald-600',
    secondary: 'from-green-500 to-emerald-500',
    accent: 'green-500',
    background: 'from-slate-950 via-green-950 to-slate-950',
    card: 'slate-900/50',
    border: 'green-500/30',
    text: 'white',
    emoji: '🌲'
  },
  sunset: {
    name: 'Sunset Orange',
    primary: 'from-orange-600 to-red-600',
    secondary: 'from-orange-500 to-red-500',
    accent: 'orange-500',
    background: 'from-slate-950 via-orange-950 to-slate-950',
    card: 'slate-900/50',
    border: 'orange-500/30',
    text: 'white',
    emoji: '🌅'
  },
  sakura: {
    name: 'Sakura Pink',
    primary: 'from-pink-600 to-rose-600',
    secondary: 'from-pink-500 to-rose-500',
    accent: 'pink-500',
    background: 'from-slate-950 via-pink-950 to-slate-950',
    card: 'slate-900/50',
    border: 'pink-500/30',
    text: 'white',
    emoji: '🌸'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    primary: 'from-fuchsia-600 to-purple-600',
    secondary: 'from-fuchsia-500 to-purple-500',
    accent: 'fuchsia-500',
    background: 'from-slate-950 via-fuchsia-950 to-slate-950',
    card: 'slate-900/50',
    border: 'fuchsia-500/30',
    text: 'white',
    emoji: '🤖'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('midnight');
  const [particlesEnabled, setParticlesEnabled] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('focus-theme');
    const savedParticles = localStorage.getItem('focus-particles');
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    
    if (savedParticles !== null) {
      setParticlesEnabled(savedParticles === 'true');
    }
  }, []);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      localStorage.setItem('focus-theme', themeName);
    }
  };

  const toggleParticles = () => {
    const newValue = !particlesEnabled;
    setParticlesEnabled(newValue);
    localStorage.setItem('focus-particles', newValue.toString());
  };

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{
      theme,
      currentTheme,
      themes,
      changeTheme,
      particlesEnabled,
      toggleParticles
    }}>
      {children}
    </ThemeContext.Provider>
  );
};