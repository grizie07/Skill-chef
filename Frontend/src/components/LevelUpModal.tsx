'use client';

import React, { useEffect } from 'react';
import { useGamificationStore } from '../store/gamificationStore';
import { Award, Sparkles, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LevelUpModal() {
  const { showLevelUpModal, newLevel, closeLevelUp } = useGamificationStore();

  useEffect(() => {
    if (showLevelUpModal) {
      // Fire confetti burst!
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: NodeJS.Timeout = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [showLevelUpModal]);

  if (!showLevelUpModal) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl w-full max-w-md p-8 text-center shadow-2xl overflow-hidden animate-bounce-slow">
        
        {/* Animated ambient glow behind badge */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-500/20 blur-3xl rounded-full -z-10" />

        {/* Close Button */}
        <button
          onClick={closeLevelUp}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Award Icon & Sparkles */}
        <div className="relative inline-block mx-auto mb-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd flex items-center justify-center text-white shadow-xl shadow-brand-500/20 scale-110">
            <Award className="h-12 w-12" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 animate-pulse" />
        </div>

        {/* Level Up Headline */}
        <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
          LEVEL UP!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 font-semibold">
          You reached a new rank in the culinary world! Keep cooking to unlock premium titles.
        </p>

        {/* New Level Ring Display */}
        <div className="inline-flex items-center justify-center bg-gray-50 dark:bg-gray-800 px-6 py-3 rounded-2xl mb-8 border border-gray-200 dark:border-accent-borderDark">
          <span className="text-sm font-bold text-gray-500 mr-2">New Rank:</span>
          <span className="text-2xl font-black text-brand-500">Level {newLevel}</span>
        </div>

        {/* Interactive CTA Action */}
        <button
          onClick={closeLevelUp}
          className="w-full bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white py-4 rounded-2xl font-bold hover:opacity-95 shadow-lg shadow-brand-500/20 active:scale-95 transition-transform"
        >
          Let's Cook More!
        </button>
      </div>
    </div>
  );
}
