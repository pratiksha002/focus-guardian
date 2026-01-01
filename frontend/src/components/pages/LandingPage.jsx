import React, { useState, useEffect } from 'react';
import { Sparkles, Target } from 'lucide-react';

export const LandingPage = ({ onStart }) => {
  const [floatingPets, setFloatingPets] = useState([]);

  const petEmojis = ['🐦', '🐱', '🐉', '🌱', '🚀', '🐠', '✨', '🍰', '🌸', '🦋', '☀️', '🌻'];

  useEffect(() => {
    const pets = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      emoji: petEmojis[Math.floor(Math.random() * petEmojis.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
      size: 2 + Math.random() * 2
    }));
    setFloatingPets(pets);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-rose-100 to-amber-100">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/30 via-rose-200/30 to-amber-200/30 animate-pulse"></div>
      
      {/* Large background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Pets */}
      {floatingPets.map((pet) => (
        <div
          key={pet.id}
          className="absolute animate-float"
          style={{
            left: `${pet.x}%`,
            top: `${pet.y}%`,
            fontSize: `${pet.size}rem`,
            animationDuration: `${pet.duration}s`,
            animationDelay: `${pet.delay}s`,
            opacity: 0.4
          }}
        >
          {pet.emoji}
        </div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-orange-400 via-rose-400 to-amber-400 rounded-full flex items-center justify-center animate-pulse shadow-2xl shadow-orange-500/50">
                <Target className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 animate-bounce">
                <Sparkles className="w-8 h-8 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 bg-clip-text text-transparent animate-gradient leading-tight">
            Focus Guardian
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-gray-800 mb-4 font-light">
            Your AI-Powered Focus Companion
          </p>

          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto font-light">
            Stay focused, level up, and grow your digital pet while achieving your goals
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/60 backdrop-blur-lg border-2 border-orange-200 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="text-4xl mb-3">👁️</div>
              <h3 className="text-gray-800 font-bold text-lg mb-2">AI Detection</h3>
              <p className="text-gray-600 text-sm">Real-time focus monitoring with advanced AI</p>
            </div>

            <div className="bg-white/60 backdrop-blur-lg border-2 border-rose-200 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="text-gray-800 font-bold text-lg mb-2">Gamification</h3>
              <p className="text-gray-600 text-sm">Earn XP, unlock badges, and level up</p>
            </div>

            <div className="bg-white/60 backdrop-blur-lg border-2 border-amber-200 rounded-2xl p-6 hover:bg-white/80 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
              <div className="text-4xl mb-3">🐣</div>
              <h3 className="text-gray-800 font-bold text-lg mb-2">Grow Your Pet</h3>
              <p className="text-gray-600 text-sm">Your focus companion evolves with you</p>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onStart}
            className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white transition-all duration-300 ease-out transform hover:scale-110 active:scale-95"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Button content */}
            <span className="relative flex items-center gap-3">
              Start Your Journey
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            </span>
          </button>

          {/* Bottom Decorative Pets */}
          <div className="mt-16 flex justify-center gap-4 text-4xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>🥚</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🐣</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🐥</span>
            <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🐤</span>
            <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🦆</span>
            <span className="animate-bounce" style={{ animationDelay: '0.5s' }}>🦢</span>
          </div>

          <p className="mt-6 text-gray-700 text-sm font-medium">
            ✨ Join thousands of focused achievers ✨
          </p>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -30px) rotate(5deg);
          }
          50% {
            transform: translate(-20px, 20px) rotate(-5deg);
          }
          75% {
            transform: translate(40px, 10px) rotate(3deg);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-float {
          animation: float infinite ease-in-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};