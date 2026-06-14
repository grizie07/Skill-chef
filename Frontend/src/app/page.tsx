'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Utensils, Award, Users, ArrowRight, Flame, Heart, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [selectedDemoIngredients, setSelectedDemoIngredients] = useState<string[]>([]);
  const [demoRecipeResult, setDemoRecipeResult] = useState<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const demoIngredients = ['Eggs', 'Tomatoes', 'Broccoli', 'Cheese', 'Garlic', 'Pasta'];

  const toggleDemoIngredient = (ingredient: string) => {
    if (selectedDemoIngredients.includes(ingredient)) {
      setSelectedDemoIngredients(selectedDemoIngredients.filter(i => i !== ingredient));
    } else {
      setSelectedDemoIngredients([...selectedDemoIngredients, ingredient]);
    }
  };

  const handleDemoGenerate = () => {
    if (selectedDemoIngredients.length === 0) return;
    setIsGenerating(true);
    setDemoRecipeResult(null);

    // Simulate AI loading
    setTimeout(() => {
      setIsGenerating(false);
      // Give a recipe based on selections
      if (selectedDemoIngredients.includes('Pasta') && selectedDemoIngredients.includes('Garlic')) {
        setDemoRecipeResult({
          title: 'Zesty Garlic Herb Pasta',
          calories: 450,
          cookTime: 15,
          steps: ['Boil pasta', 'Sauté garlic in butter', 'Toss pasta and cheese together'],
          missing: ['Butter', 'Parsley']
        });
      } else if (selectedDemoIngredients.includes('Eggs') && selectedDemoIngredients.includes('Tomatoes')) {
        setDemoRecipeResult({
          title: 'Fluffy Tomato Scramble',
          calories: 220,
          cookTime: 8,
          steps: ['Whisk eggs', 'Chop and cook tomatoes', 'Fold eggs together over low heat'],
          missing: ['Butter', 'Chives']
        });
      } else {
        setDemoRecipeResult({
          title: 'Skill Chef Farmhouse Mix',
          calories: 280,
          cookTime: 12,
          steps: ['Steam broccoli', 'Toss with chopped garlic and cheese', 'Season with salt and olive oil'],
          missing: ['Olive Oil', 'Salt']
        });
      }
    }, 1500);
  };

  return (
    <div className="space-y-24 py-8">
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col md:flex-row items-center justify-between gap-12 pt-6">
        <div className="flex-1 space-y-6 text-center md:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-brand-500/10 text-brand-500 dark:text-brand-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="h-4 w-4 text-brand-500 fill-brand-500/20" />
            AI-Powered Social Cooking
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none"
          >
            Cook Smarter.{' '}
            <span className="bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd bg-clip-text text-transparent">
              Share Chef Level
            </span>{' '}
            Creations.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 dark:text-gray-400 text-base sm:text-lg max-w-xl font-semibold leading-relaxed"
          >
            Skill Chef is the ultimate Gen-Z kitchen social app. Swipe reels, match recipe ideas from your fridge ingredients, and compete with friends for streaks and culinary badges.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start"
          >
            <Link
              href="/feed"
              className="w-full sm:w-auto bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd hover:opacity-95 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-brand-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm"
            >
              Start Exploring
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 dark:bg-accent-cardDark dark:hover:bg-gray-800 text-gray-700 dark:text-white border border-gray-200 dark:border-accent-borderDark px-8 py-4 rounded-2xl font-bold transition-colors flex items-center justify-center text-sm"
            >
              Join the Social Guild
            </Link>
          </motion.div>
        </div>

        {/* Hero Banner Image Box */}
        <div className="flex-1 relative w-full max-w-md md:max-w-none aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/10">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
            alt="Chef prep salad plate"
            className="w-full h-full object-cover"
          />
          {/* Ambient card overlays */}
          <div className="absolute bottom-6 right-6 glass p-4 rounded-2xl max-w-xs flex items-center gap-3 border border-white/10 shadow-lg">
            <div className="h-10 w-10 rounded-full bg-brand-500 flex items-center justify-center text-white">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase">Recipe of the Day</p>
              <p className="text-sm font-extrabold text-white">Volcano Lava Cake</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE AI INGREDIENT DEMO */}
      <section className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-3xl rounded-full" />
        
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Try the Fridge AI Generator
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
            Select what you have in your pantry right now and see the AI cook up custom recipe recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Pantry Selector */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Tap Pantry Ingredients</h3>
            <div className="flex flex-wrap gap-2.5">
              {demoIngredients.map((ing) => {
                const selected = selectedDemoIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => toggleDemoIngredient(ing)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all duration-200 ${
                      selected
                        ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/10 scale-95'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-accent-borderDark hover:border-gray-300'
                    }`}
                  >
                    {ing}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleDemoGenerate}
              disabled={selectedDemoIngredients.length === 0 || isGenerating}
              className="w-full bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd hover:opacity-95 disabled:opacity-50 text-white py-4 rounded-2xl font-bold transition-all shadow-md shadow-brand-500/15 text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Cooking recipe plans...' : 'Generate AI Recipe Match'}
            </button>
          </div>

          {/* AI Result Box */}
          <div className="border border-gray-100 dark:border-accent-borderDark bg-gray-50 dark:bg-[#0f0f11] rounded-3xl p-6 min-h-[220px] flex flex-col justify-center">
            {isGenerating ? (
              <div className="text-center space-y-3">
                <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-400 font-extrabold uppercase animate-pulse">Consulting Chef Bots...</p>
              </div>
            ) : demoRecipeResult ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] bg-brand-500/15 text-brand-500 px-2 py-0.5 rounded-full font-bold uppercase">
                      Recipe matched
                    </span>
                    <h4 className="text-lg font-black text-gray-800 dark:text-white mt-1">
                      {demoRecipeResult.title}
                    </h4>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-400">{demoRecipeResult.cookTime} mins</p>
                    <p className="text-xs font-extrabold text-brand-500">{demoRecipeResult.calories} kcal</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-black uppercase text-gray-400">Cooking Steps</p>
                  <ol className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pl-4 list-decimal font-semibold">
                    {demoRecipeResult.steps.map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>

                {demoRecipeResult.missing.length > 0 && (
                  <div className="pt-2 border-t border-gray-200 dark:border-accent-borderDark flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full font-bold uppercase">
                      Missing ingredients:
                    </span>
                    <span className="text-xs text-gray-400 font-bold">{demoRecipeResult.missing.join(', ')}</span>
                  </div>
                )}

                <Link
                  href="/ai/ingredients"
                  className="block text-center text-xs font-bold text-brand-500 hover:underline pt-2"
                >
                  Explore full dashboard and customize ingredients &rarr;
                </Link>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-6 space-y-2">
                <Utensils className="h-8 w-8 mx-auto text-gray-300" />
                <p className="text-sm font-semibold">Select ingredients to begin AI simulation</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. APP CORE FEATURES HIGHLIGHTS */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Flame className="h-6 w-6" />
          </div>
          <h3 className="font-extrabold text-lg">Daily Cooking Streaks</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold leading-relaxed">
            Gamify your dinners! Log in daily, complete challenges, and keep your cooking flame burning to gain multipliers.
          </p>
        </div>

        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-extrabold text-lg">Unlock Chef Badges</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold leading-relaxed">
            Earn level tiers like "Sauce Master" or "Spicy Prodigy" and display achievement verification directly on your profile.
          </p>
        </div>

        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 hover:shadow-lg transition-shadow">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="font-extrabold text-lg">Pinterest-Style Feed</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold leading-relaxed">
            Discover recipes organically through an aesthetic masonry layout. Double-tap to save and share video clips.
          </p>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="border-t border-gray-200 dark:border-accent-borderDark pt-12 pb-6 text-center text-xs text-gray-500 font-semibold space-y-4">
        <p className="font-black text-sm text-gray-800 dark:text-white">Skill Chef Inc.</p>
        <p>Production-Grade AI Culinary Workspace • Designed for Gen-Z Foodies</p>
        <p className="text-gray-400">&copy; 2026 Skill Chef. All rights reserved.</p>
      </footer>
    </div>
  );
}
