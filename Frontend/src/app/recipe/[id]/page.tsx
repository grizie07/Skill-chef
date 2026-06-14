'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Heart,
  Clock,
  Star,
  Award,
  Bookmark,
  Share2,
  CheckCircle,
  Play,
  Volume2,
  Calendar,
  AlertTriangle,
  PlayCircle,
  Check
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

const mockRecipesDb = {
  recipe_lava_cake: {
    id: 'recipe_lava_cake',
    title: 'Chocolate Lava Cake',
    description: 'A decadent molten chocolate lava cake that oozes warm cocoa goodness. Easy to prepare but creates a high-fidelity fine dining presentation.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1000&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-kitchen-chef-preparing-a-salad-41716-large.mp4',
    duration: 15,
    difficulty: 'Medium',
    category: 'Dessert',
    tags: ['dessert', 'chocolate', 'sweet', 'baked'],
    ingredients: ['Dark Chocolate (120g)', 'Butter (60g)', '2 Eggs', 'Sugar (50g)', 'All-Purpose Flour (30g)'],
    steps: [
      'Preheat the oven to 400°F (200°C) and grease 2 small oven-safe ramekins with butter.',
      'In a heat-safe bowl, microwave the dark chocolate and butter together in 30-second bursts until melted and velvety.',
      'In a separate bowl, whisk together the eggs and sugar vigorously until slightly pale and frothy.',
      'Gently fold the melted chocolate mixture into the whisked eggs. Sift in the flour and fold until just combined.',
      'Divide the batter between the ramekins. Bake for exactly 12 minutes (edges should be set, but the center will remain soft and jiggly).',
      'Let cool for 1 minute. Invert onto a plate, dust with powdered sugar, and serve hot.'
    ],
    nutrition: { calories: 450, protein: 6, carbs: 42, fats: 28 },
    chef: { id: 'chef_ramsay', name: 'Chef Ramsay AI', avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true, bio: 'Gordon Ramsay AI bot. I critique cooking and push you to improve!' }
  },
  recipe_dosa: {
    id: 'recipe_dosa',
    title: 'Classic Masala Dosa',
    description: 'Crisp crepe made of fermented rice-lentil batter filled with spiced dry potato curry. Served with fresh coconut chutney.',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1000&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-sauce-on-a-meal-41723-large.mp4',
    duration: 45,
    difficulty: 'Hard',
    category: 'Breakfast',
    tags: ['spicy', 'south indian', 'vegan', 'breakfast'],
    ingredients: ['Rice (3 cups)', 'Urad Dal (1 cup)', 'Potatoes (3, boiled)', 'Onions (1, sliced)', 'Mustard seeds & Turmeric'],
    steps: [
      'Soak rice and urad dal separately for 6 hours, grind into a smooth paste, and ferment overnight.',
      'For potato filling: Sauté mustard seeds, curry leaves, and onions. Add turmeric, salt, and mashed potatoes.',
      'Heat a flat cast-iron griddle, ladle batter in the center, and spread in a circular spiral.',
      'Drizzle oil around the edges and cook on medium-high until golden brown and crispy.',
      'Place potato masala in the center, fold, and serve immediately with sambar.'
    ],
    nutrition: { calories: 350, protein: 8, carbs: 65, fats: 9 },
    chef: { id: 'chef_alice', name: 'Chef Alice', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
  }
};

export default function RecipeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const user = useAuthStore((state) => state.user);

  // Retrieve matching recipe or default to lava cake
  const recipe = mockRecipesDb[id as keyof typeof mockRecipesDb] || mockRecipesDb.recipe_lava_cake;

  // Checklist state
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(recipe.duration * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [likes, setLikes] = useState(42);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSeconds]);

  const toggleIngredient = (ing: string) => {
    if (checkedIngredients.includes(ing)) {
      setCheckedIngredients(checkedIngredients.filter((i) => i !== ing));
    } else {
      setCheckedIngredients([...checkedIngredients, ing]);
    }
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* 1. MEDIA BANNER HERO */}
      <div className="relative h-[320px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg">
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Banner Quick Actions (Top Right) */}
        <div className="absolute top-6 right-6 flex items-center gap-3">
          <button onClick={handleLike} className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:scale-105 active:scale-95 transition-all">
            <Heart className={`h-5 w-5 ${hasLiked ? 'fill-brand-500 text-brand-500' : ''}`} />
          </button>
          <button className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:scale-105 active:scale-95 transition-all">
            <Bookmark className="h-5 w-5" />
          </button>
          <button className="p-3 rounded-full bg-black/50 backdrop-blur-md text-white hover:scale-105 active:scale-95 transition-all">
            <Share2 className="h-5 w-5" />
          </button>
        </div>

        {/* Title Details (Bottom Left) */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3 text-white">
          <div className="flex flex-wrap gap-2.5">
            <span className="bg-brand-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {recipe.category}
            </span>
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              {recipe.difficulty}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">{recipe.title}</h1>
          <p className="text-gray-200 text-xs sm:text-sm font-semibold max-w-2xl leading-relaxed">{recipe.description}</p>
        </div>
      </div>

      {/* 2. CHEF METADATA & TIMER CARD */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Ingredients & Steps */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Ingredients section */}
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black tracking-tight flex items-center gap-1.5">
                Ingredients Checklist
              </h2>
              <span className="text-xs font-bold text-gray-400">
                {checkedIngredients.length}/{recipe.ingredients.length} checked
              </span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3.5">
              {recipe.ingredients.map((ing) => {
                const isChecked = checkedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => toggleIngredient(ing)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left text-xs font-bold transition-all ${
                      isChecked
                        ? 'bg-brand-500/5 border-brand-500/30 text-gray-400 line-through'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-accent-borderDark text-gray-700 dark:text-gray-300 hover:border-gray-300'
                    }`}
                  >
                    <div className={`h-5 w-5 rounded-md border flex items-center justify-center shrink-0 ${
                      isChecked ? 'bg-brand-500 border-brand-500 text-white' : 'border-gray-300'
                    }`}>
                      {isChecked && <Check className="h-3.5 w-3.5" />}
                    </div>
                    <span>{ing}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Steps directions */}
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <h2 className="text-lg font-black tracking-tight">Step-by-step Guide</h2>
            <div className="space-y-6">
              {recipe.steps.map((step, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="h-8 w-8 rounded-full bg-brand-500/10 text-brand-500 font-extrabold flex items-center justify-center shrink-0 text-sm">
                    {index + 1}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Nutrition macro facts, chef bio & Interactive Timer */}
        <div className="space-y-8">
          
          {/* Active cooking timer */}
          <div className="bg-gradient-to-br from-brand-gradientStart to-brand-gradientEnd text-white rounded-3xl p-6 text-center shadow-xl shadow-brand-500/20">
            <h3 className="text-xs font-black uppercase tracking-wider opacity-80 flex items-center justify-center gap-1.5">
              <Clock className="h-4 w-4" />
              Interactive Kitchen Timer
            </h3>
            
            <div className="text-5xl font-black tracking-tighter my-4 animate-pulse-slow">
              {formatTime(timerSeconds)}
            </div>

            <div className="flex gap-2 justify-center text-xs">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="bg-white text-brand-500 px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-gray-50 active:scale-95 transition-transform"
              >
                {timerActive ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => { setTimerActive(false); setTimerSeconds(recipe.duration * 60); }}
                className="bg-black/30 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-black/40 active:scale-95 transition-transform"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Nutrition Macro circular bars */}
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Nutrition Estimations</h3>
            
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <span className="text-base font-black text-brand-500">{recipe.nutrition.calories}</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">kcal</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <span className="text-base font-black text-emerald-500">{recipe.nutrition.protein}g</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Prot</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <span className="text-base font-black text-blue-500">{recipe.nutrition.carbs}g</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Carb</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl">
                <span className="text-base font-black text-yellow-500">{recipe.nutrition.fats}g</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Fat</p>
              </div>
            </div>
          </div>

          {/* Chef Metadata Profile Card */}
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">About the Chef</h3>
            
            <div className="flex items-center gap-3">
              <img
                src={recipe.chef.avatarUrl}
                alt={recipe.chef.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-500/20"
              />
              <div>
                <h4 className="font-extrabold text-sm flex items-center gap-1">
                  {recipe.chef.name}
                  {recipe.chef.isVerified && <Award className="h-4 w-4 text-blue-500 fill-blue-500" />}
                </h4>
                <p className="text-[11px] text-gray-400 font-bold">Creator Guild Partner</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
              {recipe.chef.bio || 'Professional creator uploading daily cooking guides and plating suggestions.'}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
