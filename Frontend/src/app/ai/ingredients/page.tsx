'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, HelpCircle, Utensils, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AI_IngredientPage() {
  const [ingredients, setIngredients] = useState<string[]>(['Garlic', 'Broccoli', 'Pasta']);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleKeydown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleAISearch = () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    setResults(null);

    // Call mock delay. In a live system, we query `/api/ai/ingredients-recipe`
    setTimeout(() => {
      setLoading(false);
      setResults([
        {
          title: 'Zesty Garlic Broccoli Salad',
          description: 'A crunchy, refreshing raw broccoli salad tossed in lemon garlic vinaigrette topped with sunflower seeds.',
          duration: 10,
          difficulty: 'Easy',
          nutrition: { calories: 210, protein: 6, carbs: 14, fats: 16 },
          missing: ['Lemon Juice', 'Sunflower Seeds'],
          plating: 'Serve on a wide stone plate, top with a drizzle of extra virgin olive oil and a pinch of sea salt flakes.',
          cost: '$4.50'
        },
        {
          title: 'Creamy Garlic Broccoli Pasta',
          description: 'Warm fettuccine cooked with sautéed garlic and fresh broccoli florets tossed in rich parmesan sauce.',
          duration: 20,
          difficulty: 'Easy',
          nutrition: { calories: 580, protein: 15, carbs: 68, fats: 25 },
          missing: ['Heavy Cream', 'Parmesan Cheese', 'Butter'],
          plating: 'Plate in a warm shallow bowl, top with cracked black pepper, toasted pine nuts, and grated lemon zest.',
          cost: '$7.80'
        }
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-8 py-6 max-w-3xl mx-auto">
      
      {/* Page Header */}
      <div>
        <span className="text-[10px] bg-brand-500/10 text-brand-500 px-3 py-1 rounded-full font-black uppercase tracking-wider">
          AI Ingredient Lab
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-2 flex items-center gap-1.5">
          <Sparkles className="h-7 w-7 text-brand-500 fill-brand-500/10" />
          Pantry Matching Engine
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">
          Tell the AI what ingredients you have in your fridge, and we'll compute recipes you can cook instantly.
        </p>
      </div>

      {/* Ingredient Input Tag Panel */}
      <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Type Ingredients (Enter to add)</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Tomatoes, Cheddar, Chicken, Rice"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeydown}
              className="flex-1 bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark px-4 py-3.5 rounded-2xl text-xs font-semibold focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={addIngredient}
              className="bg-brand-500 hover:opacity-95 text-white px-5 rounded-2xl text-xs font-bold active:scale-95 transition-transform"
            >
              Add
            </button>
          </div>
        </div>

        {/* Tags lists */}
        {ingredients.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {ingredients.map((ing) => (
              <span
                key={ing}
                className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-accent-borderDark"
              >
                {ing}
                <button onClick={() => removeIngredient(ing)} className="hover:text-red-500 text-gray-400">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-gray-400 font-semibold border-2 border-dashed border-gray-150 dark:border-accent-borderDark rounded-2xl">
            No ingredients in pantry list. Type above to add!
          </div>
        )}

        <button
          onClick={handleAISearch}
          disabled={ingredients.length === 0 || loading}
          className="w-full bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd hover:opacity-95 disabled:opacity-50 text-white py-4 rounded-2xl font-bold transition-all shadow-md shadow-brand-500/10 text-xs flex items-center justify-center gap-1.5"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? 'Analyzing recipes possibilities...' : 'Compute AI Recipe Suggestions'}
        </button>
      </div>

      {/* AI MATCH RESULT BOX */}
      {loading && (
        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-12 text-center shadow-sm space-y-4">
          <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-400 font-extrabold uppercase animate-pulse">Running semantic recipe models...</p>
        </div>
      )}

      {results && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-lg font-black tracking-tight text-gray-700 dark:text-gray-300">
            Matched AI Culinary Recommendations
          </h2>

          <div className="space-y-6">
            {results.map((recipe, index) => (
              <div
                key={index}
                className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
              >
                
                {/* Recipe Header */}
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-800 dark:text-white hover:text-brand-500 cursor-pointer">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-accent-borderDark px-4 py-2 rounded-2xl text-xs font-bold">
                    <span className="text-brand-500">{recipe.duration} mins</span>
                    <span className="h-3 w-px bg-gray-300" />
                    <span className="text-gray-500">{recipe.difficulty}</span>
                  </div>
                </div>

                {/* Macro metrics */}
                <div className="grid grid-cols-4 gap-2.5 max-w-sm">
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs">
                    <span className="font-extrabold text-brand-500">{recipe.nutrition.calories}</span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">kcal</p>
                  </div>
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs">
                    <span className="font-extrabold text-emerald-500">{recipe.nutrition.protein}g</span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Prot</p>
                  </div>
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs">
                    <span className="font-extrabold text-blue-500">{recipe.nutrition.carbs}g</span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Carb</p>
                  </div>
                  <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-center text-xs">
                    <span className="font-extrabold text-yellow-500">{recipe.nutrition.fats}g</span>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Fat</p>
                  </div>
                </div>

                {/* Missing Ingredients Warning */}
                {recipe.missing.length > 0 && (
                  <div className="flex gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-800 dark:text-yellow-400 rounded-2xl p-4 text-xs font-bold leading-relaxed">
                    <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
                    <div>
                      <span className="uppercase text-[9px] tracking-wider font-extrabold block">Missing pantry items:</span>
                      {recipe.missing.join(', ')}
                    </div>
                  </div>
                )}

                {/* Plating Suggestion box */}
                <div className="space-y-1.5 border-t border-gray-100 dark:border-accent-borderDark pt-4">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">AI Plating & Style Suggestion</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                    {recipe.plating}
                  </p>
                </div>

                {/* View Details */}
                <Link
                  href={`/recipe/recipe_lava_cake`}
                  className="block text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-white py-3.5 rounded-2xl text-xs font-bold active:scale-95 transition-transform"
                >
                  Cook Step-by-Step with Timer
                </Link>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
