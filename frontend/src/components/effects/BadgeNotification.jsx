import React, { useContext } from 'react';
import { GamificationContext } from '../../context/GamificationContext';

export const BadgeNotification = () => {
  const { newBadges } = useContext(GamificationContext);

  if (newBadges.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-50 space-y-4">
      {newBadges.map((badge, index) => (
        <div
          key={badge.id}
          className="bg-gradient-to-r from-purple-600 to-pink-600 border-2 border-white/30 rounded-2xl p-4 shadow-2xl animate-bounce-in backdrop-blur-xl"
          style={{
            animation: 'bounceIn 0.6s ease-out, slideOut 0.6s ease-in 4.4s forwards'
          }}
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl">{badge.emoji}</div>
            <div>
              <div className="text-white font-bold text-lg mb-1">🏆 Badge Unlocked!</div>
              <div className="text-white font-semibold">{badge.name}</div>
              <div className="text-white/80 text-sm">{badge.description}</div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: translateX(100%) scale(0.5);
          }
          50% {
            transform: translateX(-10%) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        @keyframes slideOut {
          to {
            opacity: 0;
            transform: translateX(120%);
          }
        }
      `}</style>
    </div>
  );
};