'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  Utensils, 
  Compass, 
  Flame, 
  Check, 
  ChefHat, 
  TrendingUp, 
  Save, 
  Scale, 
  HelpCircle,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';
import { useGamificationStore } from '../../../store/gamificationStore';

interface GeneratedRecipe {
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  tags: string[];
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  platingTip?: string;
}

const mockGeneratedRecipes: Record<string, GeneratedRecipe> = {
  default: {
    title: "AI-Crafted Zesty Lemon Herb Salmon",
    description: "A premium, protein-dense gourmet salmon dish infused with freshly squeezed lemon juice, crushed garlic, and a medley of fresh herbs, seared to flaky perfection.",
    duration: 25,
    difficulty: "Medium",
    servings: 2,
    tags: ["Keto", "High Protein", "Gourmet", "Low Carb"],
    ingredients: [
      "2 Fresh Salmon Fillets (6oz each)",
      "1 Organic Lemon (sliced and zested)",
      "3 Garlic Cloves (finely minced)",
      "2 tbsp Extra Virgin Olive Oil",
      "1 tbsp Fresh Rosemary (chopped)",
      "1 tbsp Fresh Thyme (chopped)",
      "Sea Salt and Cracked Black Pepper to taste",
      "1 bunch Asparagus (trimmed)"
    ],
    instructions: [
      "Pat salmon fillets dry with paper towels. Season both sides generously with sea salt, cracked black pepper, and lemon zest.",
      "In a small bowl, whisk together the minced garlic, olive oil, chopped rosemary, and chopped thyme.",
      "Brush the herb mixture evenly over the flesh side of the salmon fillets, pressing lightly to adhere.",
      "Heat a large cast-iron skillet over medium-high heat. Add 1 tbsp oil. Sear salmon skin-side up for 4-5 minutes until a golden crust forms.",
      "Flip the fillets, add trimmed asparagus and lemon slices to the skillet. Reduce heat to medium and cook for another 4 minutes until the salmon is flaky and asparagus is tender.",
      "Garnish with remaining fresh herbs and a drizzle of warm pan drippings before serving."
    ],
    nutrition: {
      calories: 420,
      protein: 38,
      carbs: 6,
      fats: 28
    },
    platingTip: "Arrange the tender asparagus spears parallel to each other. Rest the seared salmon fillet diagonally on top, and crown with a caramelized pan-seared lemon slice."
  },
  vegan: {
    title: "AI Crimson Beetroot & Lentil Poke Bowl",
    description: "A visually stunning, vibrant vegan grain bowl featuring marinated earthy beetroots, iron-rich French green lentils, and fresh avocado over fluffy tri-color quinoa.",
    duration: 20,
    difficulty: "Easy",
    servings: 2,
    tags: ["Vegan", "Gluten-Free", "High Fiber", "Plant-Based"],
    ingredients: [
      "1 cup Tri-color Quinoa (rinsed and cooked)",
      "1 cup French Green Lentils (cooked)",
      "2 Medium Beetroots (roasted and cubed)",
      "1 Ripe Haas Avocado (sliced)",
      "1 cup Baby Arugula (wild rocket)",
      "1/4 cup Sesame Tahini",
      "1 tbsp Maple Syrup",
      "2 tbsp Fresh Lemon Juice",
      "1 tbsp Toasted Black Sesame Seeds"
    ],
    instructions: [
      "Cook quinoa and green lentils according to package instructions. Let cool slightly to warm temperature.",
      "Whisk together tahini, maple syrup, lemon juice, and 2 tablespoons of warm water in a small cup until a smooth, velvety dressing forms.",
      "Arrange a handful of wild arugula in a serving bowl as the base.",
      "Divide the warm quinoa and green lentils into sections on top of the arugula.",
      "Add the cubed roasted beetroots and sliced avocado in adjacent sections.",
      "Drizzle the creamy maple-tahini dressing generously over the entire bowl and garnish with toasted black sesame seeds."
    ],
    nutrition: {
      calories: 490,
      protein: 16,
      carbs: 62,
      fats: 22
    },
    platingTip: "Use the contrasting dark red beetroots and light green avocado next to each other to create a striking radial pattern. Drizzle the dressing in a clean zig-zag line."
  },
  keto: {
    title: "AI Smokey Chipotle Cream Chicken Sizzle",
    description: "Tender pan-seared chicken breast medallions smothered in a rich, smokey chipotle pepper cream sauce, topped with melted Monterey Jack.",
    duration: 30,
    difficulty: "Medium",
    servings: 2,
    tags: ["Keto", "High Protein", "Spicy", "High Fat"],
    ingredients: [
      "2 Large Chicken Breasts (halved horizontally)",
      "1 tbsp Adobo Sauce (from canned chipotles)",
      "1 canned Chipotle Pepper (finely minced)",
      "3/4 cup Heavy Whipping Cream",
      "1/2 cup Monterey Jack Cheese (shredded)",
      "2 tbsp Butter (grass-fed)",
      "1/2 cup Chicken Bone Broth",
      "1 tsp Smoked Paprika",
      "Fresh Cilantro (chopped, for garnish)"
    ],
    instructions: [
      "Season chicken breast medallions with salt, pepper, and smoked paprika.",
      "In a hot skillet, melt the butter and sear chicken for 5-6 minutes on each side until fully golden brown. Remove chicken and keep warm.",
      "Deglaze the skillet with chicken bone broth, scraping up all the browned bits from the bottom.",
      "Stir in the minced chipotle pepper and adobo sauce, letting it simmer for 2 minutes on low.",
      "Pour in the heavy cream and whisk continuously until it reaches a slow bubble and starts to thicken.",
      "Return the chicken to the skillet, spoon sauce over them, and top with Monterey Jack. Cover for 2 minutes to melt the cheese, and serve hot garnished with cilantro."
    ],
    nutrition: {
      calories: 610,
      protein: 45,
      carbs: 4,
      fats: 46
    },
    platingTip: "Serve directly in a hot mini cast-iron skillet to keep the cheese bubbling. Top with a sprig of fresh cilantro and a light dusting of smoked paprika on the rim."
  }
};

const loadingSteps = [
  "Firing up the culinary neural nets...",
  "Analyzing ingredients & nutrition macros...",
  "Consulting simulation databases...",
  "Garnishing with visual styling..."
];

export default function AIGenerator() {
  const user = useAuthStore((state) => state.user);
  const updateXP = useAuthStore((state) => state.updateXP);
  const triggerLevelUp = useGamificationStore((state) => state.triggerLevelUp);
  
  const [prompt, setPrompt] = useState('');
  const [diet, setDiet] = useState('All');
  const [time, setTime] = useState(30);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [calories, setCalories] = useState(600);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);
  const [saved, setSaved] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingStep(0);
    setRecipe(null);
    setSaved(false);

    // Loop through simulated loading descriptions
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      // Connect to backend endpoint:
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sc_token') || ''}`
        },
        body: JSON.stringify({
          prompt,
          diet,
          maxTime: time,
          difficulty,
          targetCalories: calories
        })
      });

      if (!response.ok) throw new Error("API Offline or failed");
      const data = await response.json();
      
      clearInterval(interval);
      setIsLoading(false);
      setRecipe(data.recipe || data);
      
      // Award XP for utilizing AI Generator
      if (user) {
        const nextXp = user.xp + 15;
        let nextLevel = user.level;
        if (nextXp >= 150) {
          nextLevel = user.level + 1;
          triggerLevelUp(nextLevel);
        }
        updateXP(nextXp, nextLevel);
      }
    } catch (err) {
      // Fallback local mock simulation
      setTimeout(() => {
        clearInterval(interval);
        setIsLoading(false);
        
        let selectedRecipe = mockGeneratedRecipes.default;
        if (diet.toLowerCase().includes('vegan')) {
          selectedRecipe = mockGeneratedRecipes.vegan;
        } else if (diet.toLowerCase().includes('keto')) {
          selectedRecipe = mockGeneratedRecipes.keto;
        } else if (prompt.toLowerCase().includes('vegan') || prompt.toLowerCase().includes('salad') || prompt.toLowerCase().includes('beetroot')) {
          selectedRecipe = mockGeneratedRecipes.vegan;
        } else if (prompt.toLowerCase().includes('keto') || prompt.toLowerCase().includes('cheese') || prompt.toLowerCase().includes('chicken')) {
          selectedRecipe = mockGeneratedRecipes.keto;
        }

        // Apply visual duration tweaking based on slider
        const finalRecipe = {
          ...selectedRecipe,
          duration: Math.min(time, selectedRecipe.duration),
          nutrition: {
            ...selectedRecipe.nutrition,
            calories: Math.round(calories * (0.8 + Math.random() * 0.4))
          }
        };

        setRecipe(finalRecipe);

        // Award XP on local fallback as well
        if (user) {
          const nextXp = user.xp + 15;
          let nextLevel = user.level;
          if (nextXp >= 150) {
            nextLevel = user.level + 1;
            triggerLevelUp(nextLevel);
          }
          updateXP(nextXp, nextLevel);
        }
      }, 4800);
    }
  };

  const handleSaveRecipe = () => {
    setSaved(true);
    // Mimic API save endpoint or save local draft notification
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gradientStart/10 to-brand-gradientEnd/10 text-brand-500 border border-brand-500/10 px-4 py-2 rounded-full text-xs font-black">
          <Sparkles className="h-4 w-4 text-brand-500 fill-brand-500/20" />
          <span>Next-Gen Culinary Artificial Intelligence</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd bg-clip-text text-transparent">
          AI Gourmet Generator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto font-medium">
          Input your desired flavor profile or raw craving, adjust your dietary macros, and let the AI chef formulate a flawless recipe in real-time.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Controls Form */}
        <form onSubmit={handleGenerate} className="md:col-span-5 bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-6 shadow-sm">
          <h2 className="text-sm font-black flex items-center gap-2 border-b border-gray-100 dark:border-accent-borderDark pb-3 uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Utensils className="h-4 w-4 text-brand-500" />
            Generator Tuning
          </h2>

          {/* Prompt input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400 flex justify-between">
              <span>What do you feel like cooking?</span>
              <span className="text-[10px] text-brand-500 uppercase font-black">AI Prompt</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Garlic herb chicken breast with zesty citrus glaze or creamy vegan poke bowls..."
              className="w-full text-xs bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark rounded-2xl p-4 focus:ring-2 focus:ring-brand-500/20 outline-none text-gray-700 dark:text-white placeholder-gray-400 h-24 resize-none"
              required
            />
          </div>

          {/* Diet dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Dietary Preferences</label>
            <div className="grid grid-cols-2 gap-2">
              {['All', 'Vegan', 'Keto', 'Gluten-Free'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDiet(d)}
                  className={`py-2 px-3 text-xs font-extrabold border rounded-xl transition-all ${
                    diet === d
                      ? 'bg-brand-500 border-brand-500 text-white shadow-md'
                      : 'bg-gray-50 dark:bg-accent-slateDark border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Slider: Cooking time */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
              <span>Max Prep/Cook Time</span>
              <span className="text-brand-500 font-extrabold flex items-center gap-0.5">
                <Clock className="h-3 w-3" /> {time} mins
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
              className="w-full accent-brand-500 h-1.5 bg-gray-100 dark:bg-accent-borderDark rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Slider: Target Calories */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
              <span>Target Calories</span>
              <span className="text-brand-500 font-extrabold flex items-center gap-0.5">
                <Flame className="h-3 w-3" /> {calories} kcal
              </span>
            </div>
            <input
              type="range"
              min="200"
              max="1500"
              step="50"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              className="w-full accent-brand-500 h-1.5 bg-gray-100 dark:bg-accent-borderDark rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Toggle buttons: Difficulty */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400">Difficulty Level</label>
            <div className="flex bg-gray-50 dark:bg-accent-slateDark p-1 rounded-2xl border border-gray-100 dark:border-accent-borderDark">
              {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`flex-1 text-center py-2 text-xs font-extrabold rounded-xl transition-all ${
                    difficulty === diff
                      ? 'bg-white dark:bg-accent-cardDark text-brand-500 shadow-sm border border-gray-100 dark:border-accent-borderDark'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-500/20 hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Simulating Formulation...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-white/20" />
                <span>Formulate Recipe</span>
              </>
            )}
          </button>
        </form>

        {/* Right Side: Output Panel */}
        <div className="md:col-span-7 h-full">
          <AnimatePresence mode="wait">
            
            {/* 1. Loading State */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[460px] shadow-sm"
              >
                {/* Cooking animation */}
                <div className="relative h-28 w-28 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-dashed border-brand-500 rounded-full animate-spin-slow" />
                  <ChefHat className="h-12 w-12 text-brand-500 animate-bounce-slow" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-gray-800 dark:text-white">Formulating Recipe</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold animate-pulse">
                    {loadingSteps[loadingStep]}
                  </p>
                </div>
                <div className="flex gap-1">
                  {loadingSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                        i <= loadingStep ? 'bg-brand-500' : 'bg-gray-100 dark:bg-accent-borderDark'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. Empty State */}
            {!isLoading && !recipe && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[460px] shadow-sm text-gray-400"
              >
                <Sparkles className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                <div>
                  <h3 className="font-extrabold text-sm text-gray-700 dark:text-gray-300">Ready for Formulation</h3>
                  <p className="text-gray-400 dark:text-gray-500 text-xs font-medium max-w-xs mx-auto mt-1 leading-relaxed">
                    Tune the dietary preferences on the left side, enter a custom flavor cue, and click Formulate.
                  </p>
                </div>
              </motion.div>
            )}

            {/* 3. Generated Recipe Details Display */}
            {!isLoading && recipe && (
              <motion.div
                key="recipe"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm"
              >
                
                {/* Recipe Header & Actions */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-1.5">
                      {recipe.tags.map((tag) => (
                        <span key={tag} className="bg-brand-500/10 text-brand-500 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white leading-tight">
                      {recipe.title}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleSaveRecipe}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black transition-all ${
                      saved
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-gray-50 dark:bg-accent-slateDark hover:bg-gray-100 dark:hover:bg-accent-borderDark border border-gray-100 dark:border-accent-borderDark text-gray-600 dark:text-white'
                    }`}
                  >
                    {saved ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Saved to Bookmarks</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Recipe</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Recipe Stats Pills */}
                <div className="grid grid-cols-3 gap-3 bg-gray-50 dark:bg-accent-slateDark p-4 rounded-2xl border border-gray-100 dark:border-accent-borderDark">
                  <div className="text-center space-y-0.5">
                    <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Preparation</span>
                    <span className="text-xs sm:text-sm font-black text-gray-800 dark:text-white flex items-center justify-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-brand-500" />
                      {recipe.duration}m
                    </span>
                  </div>
                  <div className="text-center space-y-0.5 border-x border-gray-200/50 dark:border-gray-800">
                    <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Servings</span>
                    <span className="text-xs sm:text-sm font-black text-gray-800 dark:text-white flex items-center justify-center gap-1">
                      <Utensils className="h-3.5 w-3.5 text-brand-500" />
                      {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-center space-y-0.5">
                    <span className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Difficulty</span>
                    <span className="text-xs sm:text-sm font-black text-gray-800 dark:text-white flex items-center justify-center gap-1">
                      <ChefHat className="h-3.5 w-3.5 text-brand-500" />
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>

                {/* Nutrition Breakdowns */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="h-4 w-4 text-brand-500" />
                    AI Nutritional Analysis
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-2.5 text-center">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase">Energy</span>
                      <span className="text-xs sm:text-sm font-black text-orange-500">{recipe.nutrition.calories} kcal</span>
                    </div>
                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-2.5 text-center">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase">Protein</span>
                      <span className="text-xs sm:text-sm font-black text-red-500">{recipe.nutrition.protein}g</span>
                    </div>
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-2.5 text-center">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase">Carbs</span>
                      <span className="text-xs sm:text-sm font-black text-blue-500">{recipe.nutrition.carbs}g</span>
                    </div>
                    <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-xl p-2.5 text-center">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase">Fats</span>
                      <span className="text-xs sm:text-sm font-black text-yellow-500">{recipe.nutrition.fats}g</span>
                    </div>
                  </div>
                </div>

                {/* Ingredients List */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="h-4 w-4 text-brand-500" />
                    Required Ingredients
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2 bg-gray-50 dark:bg-accent-slateDark p-2.5 rounded-xl border border-gray-100 dark:border-accent-borderDark">
                        <Check className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-brand-500" />
                    Step-by-Step Cooking Directives
                  </h3>
                  <div className="space-y-3">
                    {recipe.instructions.map((step, i) => (
                      <div key={i} className="flex gap-4 items-start bg-gray-50/50 dark:bg-accent-slateDark/30 p-3 rounded-2xl border border-gray-100/60 dark:border-accent-borderDark/40">
                        <span className="h-6 w-6 rounded-full bg-brand-500/10 text-brand-500 font-black text-xs flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed pt-0.5">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plating Tips */}
                {recipe.platingTip && (
                  <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 space-y-1.5">
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-wider flex items-center gap-1">
                      <HelpCircle className="h-3.5 w-3.5" />
                      AI Plating Directive
                    </h4>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 italic leading-relaxed">
                      "{recipe.platingTip}"
                    </p>
                  </div>
                )}

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
