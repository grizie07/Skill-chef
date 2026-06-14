'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Volume2, 
  VolumeX, 
  ChefHat, 
  Award, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  ShoppingBag,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '../../store/authStore';
import { useGamificationStore } from '../../store/gamificationStore';

interface Reel {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  recipeId: string;
  likes: number;
  comments: number;
  saves: number;
  chef: {
    id: string;
    name: string;
    avatarUrl: string;
    isVerified: boolean;
  };
}

const mockReels: Reel[] = [
  {
    id: 'reel_1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-hot-chocolate-sauce-on-cake-41584-large.mp4',
    title: 'The Molten Chocolate Secret 🍫',
    description: 'Bake it for exactly 12 minutes at 400°F. The center stays completely liquid. Save this tip!',
    recipeId: 'recipe_lava_cake',
    likes: 1240,
    comments: 89,
    saves: 450,
    chef: {
      id: 'chef_ramsay',
      name: 'Chef Ramsay AI',
      avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    }
  },
  {
    id: 'reel_2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cooking-in-a-modern-kitchen-40540-large.mp4',
    title: 'Searing Salmon Like a Pro 🐟',
    description: 'Skin-side down first, press lightly with a spatula to prevent curling. Garlic butter basted.',
    recipeId: 'recipe_wellington',
    likes: 852,
    comments: 42,
    saves: 312,
    chef: {
      id: 'chef_alice',
      name: 'Chef Alice',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    }
  },
  {
    id: 'reel_3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fresh-vegetables-being-sliced-on-a-chopping-board-40538-large.mp4',
    title: 'Chef Ramsay Knife Skills 🔪',
    description: 'Keep your fingers tucked in a claw grip. Guide the chef knife with your knuckles. Practice makes perfect!',
    recipeId: 'recipe_salad',
    likes: 2451,
    comments: 172,
    saves: 991,
    chef: {
      id: 'chef_ramsay',
      name: 'Chef Ramsay AI',
      avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    }
  }
];

export default function ReelsFeed() {
  const user = useAuthStore((state) => state.user);
  const updateXP = useAuthStore((state) => state.updateXP);
  const triggerLevelUp = useGamificationStore((state) => state.triggerLevelUp);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});
  const [showInstructions, setShowInstructions] = useState(true);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Hide instructions after 4 seconds
    const timer = setTimeout(() => {
      setShowInstructions(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Manage play/pause based on active index
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === activeIndex) {
          video.currentTime = 0;
          video.play().catch((err) => console.log('Autoplay blocked:', err));
        } else {
          video.pause();
        }
      }
    });

    // Award XP for watching reels
    if (user && activeIndex > 0) {
      const nextXp = user.xp + 10;
      let nextLevel = user.level;
      if (nextXp >= 150) {
        nextLevel = user.level + 1;
        triggerLevelUp(nextLevel);
      }
      updateXP(nextXp, nextLevel);
    }
  }, [activeIndex]);

  const handleNext = () => {
    if (activeIndex < mockReels.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleToggleLike = (reelId: string) => {
    setLikedReels((prev) => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
  };

  const handleToggleSave = (reelId: string) => {
    setSavedReels((prev) => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-130px)] md:py-4">
      
      {/* Swipe Instructions overlay */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/75 z-50 flex flex-col items-center justify-center text-white pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="flex flex-col items-center gap-3"
            >
              <ArrowDown className="h-10 w-10 text-brand-500 rotate-180" />
              <span className="font-black text-sm uppercase tracking-wider">Swipe or Tap Arrows to Scroll</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Reels Swiper Container */}
      <div className="relative w-full max-w-[420px] h-full bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-center">
        
        {/* Navigation Arrows (Desktop overlay friendly) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={`p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-opacity ${
              activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-brand-500'
            }`}
          >
            <ChevronUp className="h-5 w-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={activeIndex === mockReels.length - 1}
            className={`p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-opacity ${
              activeIndex === mockReels.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-brand-500'
            }`}
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Mute/Sound Floating Button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 z-40 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>

        {/* Video Scroller Content */}
        <div className="relative w-full h-full flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={mockReels[activeIndex].id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 150 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* HTML5 Loop Video */}
              <video
                ref={(el) => { videoRefs.current[activeIndex] = el; }}
                src={mockReels[activeIndex].videoUrl}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                autoPlay
              />

              {/* Bottom Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              {/* Sidebar Action Buttons */}
              <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 z-30">
                
                {/* Like Button */}
                <button 
                  onClick={() => handleToggleLike(mockReels[activeIndex].id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                    likedReels[mockReels[activeIndex].id]
                      ? 'bg-brand-500 border-brand-500 text-white scale-110 shadow-lg shadow-brand-500/20'
                      : 'bg-black/40 border-white/10 text-white group-hover:bg-black/60'
                  }`}>
                    <Heart className={`h-5 w-5 ${likedReels[mockReels[activeIndex].id] ? 'fill-white' : ''}`} />
                  </div>
                  <span className="text-[10px] text-white font-bold">
                    {mockReels[activeIndex].likes + (likedReels[mockReels[activeIndex].id] ? 1 : 0)}
                  </span>
                </button>

                {/* Comment Button */}
                <button className="flex flex-col items-center gap-1 group">
                  <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white group-hover:bg-black/60 transition-colors">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] text-white font-bold">{mockReels[activeIndex].comments}</span>
                </button>

                {/* Save Button */}
                <button 
                  onClick={() => handleToggleSave(mockReels[activeIndex].id)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`p-3 rounded-full backdrop-blur-md border transition-all ${
                    savedReels[mockReels[activeIndex].id]
                      ? 'bg-brand-500 border-brand-500 text-white scale-110 shadow-lg shadow-brand-500/20'
                      : 'bg-black/40 border-white/10 text-white group-hover:bg-black/60'
                  }`}>
                    <Bookmark className={`h-5 w-5 ${savedReels[mockReels[activeIndex].id] ? 'fill-white' : ''}`} />
                  </div>
                  <span className="text-[10px] text-white font-bold">
                    {mockReels[activeIndex].saves + (savedReels[mockReels[activeIndex].id] ? 1 : 0)}
                  </span>
                </button>

                {/* Share Button */}
                <button className="flex flex-col items-center gap-1 group">
                  <div className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white group-hover:bg-black/60 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] text-white font-bold">Share</span>
                </button>
              </div>

              {/* Bottom Metadata & Chef overlay */}
              <div className="absolute left-4 bottom-6 right-16 z-30 space-y-3 text-white">
                
                {/* Chef Bio Info */}
                <div className="flex items-center gap-2">
                  <img
                    src={mockReels[activeIndex].chef.avatarUrl}
                    alt={mockReels[activeIndex].chef.name}
                    className="h-9 w-9 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <div className="flex items-center gap-0.5 text-xs font-black">
                      {mockReels[activeIndex].chef.name}
                      {mockReels[activeIndex].chef.isVerified && (
                        <Award className="h-3.5 w-3.5 text-blue-400 fill-blue-400" />
                      )}
                    </div>
                    <span className="text-[9px] text-gray-300 font-semibold block">AI Creator</span>
                  </div>
                </div>

                {/* Video Info */}
                <div className="space-y-1">
                  <h3 className="text-sm font-black tracking-tight">{mockReels[activeIndex].title}</h3>
                  <p className="text-xs text-gray-200 line-clamp-2 leading-relaxed font-medium">
                    {mockReels[activeIndex].description}
                  </p>
                </div>

                {/* Quick Access Recipe Badge CTA */}
                <Link
                  href={`/recipe/${mockReels[activeIndex].recipeId}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:opacity-95 transition-opacity"
                >
                  <ChefHat className="h-4 w-4 fill-white/10 animate-pulse" />
                  <span>View Full Recipe</span>
                </Link>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
