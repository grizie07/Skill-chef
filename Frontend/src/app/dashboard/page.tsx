'use client';

import React, { useEffect, useState } from 'react';
import { 
  Flame, 
  Award, 
  Trophy, 
  Zap, 
  Check, 
  Lock, 
  ChevronRight,
  TrendingUp,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuthStore } from '../../store/authStore';
import { useGamificationStore, ChallengeItem } from '../../store/gamificationStore';

const mockChallenges: ChallengeItem[] = [
  {
    _id: 'ch_1',
    title: 'AI Consultation',
    description: 'Ask Chef Ramsay AI to critique a cooking step in the chat portal.',
    xpReward: 15,
    type: 'daily',
    active: true,
    status: 'completed'
  },
  {
    _id: 'ch_2',
    title: 'Formulate AI Gourmet',
    description: 'Use the AI Gourmet Generator to create a customized recipe plan.',
    xpReward: 20,
    type: 'daily',
    active: true,
    status: 'started'
  },
  {
    _id: 'ch_3',
    title: 'Weekly Batch Meal Prep',
    description: 'Schedule three distinct meals in your Smart Meal Planner.',
    xpReward: 50,
    type: 'weekly',
    active: true,
    status: 'not_started'
  }
];

const mockLeaderboardData = [
  { id: 'chef_ramsay', name: 'Chef Ramsay AI', avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80', xp: 4800, level: 12 },
  { id: 'chef_alice', name: 'Chef Alice', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', xp: 2150, level: 8 },
  { id: 'mock-user-123', name: 'Guest Chef Alice (You)', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', xp: 120, level: 1 },
  { id: 'user_4', name: 'Culinary Master', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80', xp: 85, level: 1 },
  { id: 'user_5', name: 'Sourdough King', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80', xp: 60, level: 1 }
];

const allAvailableBadges = [
  { id: 'fresh_cook', name: 'Fresh Cook', description: 'Assigned automatically when joining Skill Chef.', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', unlocked: true },
  { id: 'ai_wizard', name: 'AI Explorer', description: 'Used AI features five times.', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png', unlocked: false },
  { id: 'video_star', name: 'Reels Creator', description: 'Uploaded first cooking reel.', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/1077/1077038.png', unlocked: false },
  { id: 'master_chef', name: 'Master Chef', description: 'Reached user level 10.', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/1865/1865269.png', unlocked: false }
];

export default function GamificationDashboard() {
  const user = useAuthStore((state) => state.user);
  const updateXP = useAuthStore((state) => state.updateXP);
  
  const { 
    challenges, 
    leaderboard, 
    setChallenges, 
    setLeaderboard, 
    updateChallengeStatus,
    triggerLevelUp
  } = useGamificationStore();

  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    // Sync local simulation values
    if (challenges.length === 0) {
      setChallenges(mockChallenges);
    }
    if (leaderboard.length === 0) {
      setLeaderboard(mockLeaderboardData);
    }
  }, []);

  const handleClaimReward = (challengeId: string, xpReward: number) => {
    setClaimingId(challengeId);
    
    // Confetti effect trigger
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#ff4f38', '#ff3366', '#ffc107', '#10b981']
    });

    setTimeout(() => {
      // update state
      updateChallengeStatus(challengeId, 'completed');
      setChallenges(challenges.map(c => c._id === challengeId ? { ...c, status: 'completed' } : c));
      
      // Update User XP
      if (user) {
        const nextXp = user.xp + xpReward;
        let nextLevel = user.level;
        if (nextXp >= 150) {
          nextLevel = user.level + 1;
          triggerLevelUp(nextLevel);
        }
        updateXP(nextXp, nextLevel);
        
        // Sync user in leaderboard
        setLeaderboard(
          leaderboard.map((item) =>
            item.id === user.id ? { ...item, xp: nextXp, level: nextLevel } : item
          ).sort((a, b) => b.xp - a.xp)
        );
      }
      setClaimingId(null);
    }, 1000);
  };

  // Safe variables check
  const level = user?.level || 1;
  const xp = user?.xp || 120;
  const streak = user?.dailyStreak || 3;
  const userBadges = user?.badges || [];

  // Calculate percentage of level completion (standard 150 XP per level target)
  const xpInCurrentLevel = xp % 150;
  const percentComplete = Math.min(100, Math.round((xpInCurrentLevel / 150) * 100));

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gradientStart/10 to-brand-gradientEnd/10 text-brand-500 border border-brand-500/10 px-3.5 py-1.5 rounded-full text-xs font-black mb-2">
          <Trophy className="h-4 w-4" />
          <span>Gamified Kitchen Performance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd bg-clip-text text-transparent">
          Cooking Academy Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mt-1">
          Complete daily challenges, level up your chef status, and unlock exclusive badges.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Stats and Challenges */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main User Stat Cards */}
          <div className="grid sm:grid-cols-3 gap-6">
            
            {/* Level Radial Card */}
            <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Chef Rank</span>
                <h3 className="text-xl font-black text-gray-800 dark:text-white">Level {level}</h3>
                <span className="text-[10px] text-brand-500 font-bold block">{xp} Total XP</span>
              </div>
              
              {/* Radial Dial Indicator */}
              <div className="relative h-16 w-16 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-gray-100 dark:stroke-gray-800 fill-none"
                    strokeWidth="5"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    className="stroke-brand-500 fill-none transition-all duration-500"
                    strokeWidth="5"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - percentComplete / 100)}
                  />
                </svg>
                <span className="text-xs font-black text-brand-500">{percentComplete}%</span>
              </div>
            </div>

            {/* Daily Streak Card */}
            <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Active Streak</span>
                <h3 className="text-xl font-black text-gray-800 dark:text-white">{streak} Day{streak > 1 ? 's' : ''}</h3>
                <span className="text-[10px] text-gray-400 font-bold block">Keep cooking daily!</span>
              </div>
              <div className="h-12 w-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center animate-pulse">
                <Flame className="h-7 w-7 fill-amber-500" />
              </div>
            </div>

            {/* Badges unlocked count */}
            <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Achievements</span>
                <h3 className="text-xl font-black text-gray-800 dark:text-white">
                  {userBadges.length} / {allAvailableBadges.length}
                </h3>
                <span className="text-[10px] text-gray-400 font-bold block">Exclusive Badges</span>
              </div>
              <div className="h-12 w-12 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center">
                <Award className="h-7 w-7 fill-brand-500/10" />
              </div>
            </div>

          </div>

          {/* Active Challenges Box */}
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-4">
              <Zap className="h-4.5 w-4.5 text-brand-500" />
              Active Academy Assignments
            </h3>

            <div className="space-y-4">
              {challenges.map((chal) => {
                const isClaimable = chal.status === 'started' || chal.status === 'not_started';
                const isCompleted = chal.status === 'completed';

                return (
                  <div 
                    key={chal._id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-accent-slateDark border border-gray-100/50 dark:border-accent-borderDark/40 rounded-2xl gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          chal.type === 'daily' 
                            ? 'bg-amber-500/10 text-amber-500' 
                            : 'bg-brand-500/10 text-brand-500'
                        }`}>
                          {chal.type}
                        </span>
                        <span className="text-xs text-emerald-500 font-bold flex items-center gap-0.5">
                          +{chal.xpReward} XP
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-gray-800 dark:text-white">{chal.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                        {chal.description}
                      </p>
                    </div>

                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-emerald-500 text-xs font-black bg-emerald-500/10 px-3.5 py-2 rounded-2xl">
                        <Check className="h-4 w-4" />
                        <span>XP Claimed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimReward(chal._id, chal.xpReward)}
                        disabled={claimingId === chal._id}
                        className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-brand-500/15"
                      >
                        {claimingId === chal._id ? 'Verifying...' : 'Claim XP'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Cabinet */}
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-6 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-4">
              <Award className="h-4.5 w-4.5 text-brand-500" />
              Chef Badge Cabinet
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {allAvailableBadges.map((badge) => {
                const unlocked = userBadges.some(b => b.id === badge.id) || badge.unlocked;
                return (
                  <div 
                    key={badge.id}
                    className={`p-4 border rounded-2xl text-center space-y-3 flex flex-col items-center justify-between ${
                      unlocked
                        ? 'bg-white dark:bg-accent-slateDark border-gray-100 dark:border-accent-borderDark shadow-sm'
                        : 'bg-gray-50/50 dark:bg-accent-slateDark/30 border-dashed border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={badge.badgeUrl}
                        alt={badge.name}
                        className={`h-12 w-12 object-contain transition-all duration-300 ${
                          unlocked ? 'grayscale-0 scale-100' : 'grayscale opacity-30 scale-95'
                        }`}
                      />
                      {!unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <Lock className="h-4.5 w-4.5" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className={`text-xs font-black ${unlocked ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>
                        {badge.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold line-clamp-2 leading-relaxed mt-1">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Leaderboard Rankings */}
        <div className="lg:col-span-4">
          
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-3">
              <Trophy className="h-4.5 w-4.5 text-brand-500" />
              Weekly Leaderboard
            </h3>

            <div className="space-y-3">
              {leaderboard.map((item, i) => {
                const isCurrentUser = item.id === user?.id || item.id === 'mock-user-123';
                const rankColor = 
                  i === 0 ? 'bg-yellow-400 text-black shadow-md' :
                  i === 1 ? 'bg-gray-300 text-black shadow-sm' :
                  i === 2 ? 'bg-amber-600 text-white shadow-sm' :
                  'bg-gray-100 dark:bg-accent-slateDark text-gray-400';

                return (
                  <div 
                    key={item.id}
                    className={`flex items-center gap-3 p-2.5 rounded-2xl transition-all border ${
                      isCurrentUser 
                        ? 'bg-brand-500/10 border-brand-500/20 shadow-sm' 
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-accent-slateDark'
                    }`}
                  >
                    {/* Rank Number */}
                    <span className={`h-6 w-6 rounded-full font-black text-[10px] flex items-center justify-center shrink-0 ${rankColor}`}>
                      {i + 1}
                    </span>

                    {/* Avatar */}
                    <img
                      src={item.avatarUrl}
                      alt={item.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-100 dark:ring-gray-800"
                    />

                    {/* Username & level */}
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-black truncate block ${
                        isCurrentUser ? 'text-brand-500' : 'text-gray-800 dark:text-white'
                      }`}>
                        {item.name}
                      </span>
                      <span className="text-[9px] text-gray-400 font-bold block">Level {item.level}</span>
                    </div>

                    {/* Score */}
                    <span className="text-xs font-black text-gray-600 dark:text-gray-300 shrink-0">
                      {item.xp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
