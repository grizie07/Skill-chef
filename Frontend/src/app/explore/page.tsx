'use client';

import React, { useState } from 'react';
import RecipeCard from '../../components/RecipeCard';
import { Search, SlidersHorizontal, AlertCircle, ChefHat } from 'lucide-react';

const mockAllRecipesList = [
  {
    id: 'recipe_lava_cake',
    title: 'Chocolate Lava Cake',
    description: 'A decadent molten chocolate lava cake that oozes cocoa goodness when cut open.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
    duration: 15,
    difficulty: 'Medium' as const,
    averageRating: 4.8,
    category: 'Dessert',
    chef: { id: 'chef_ramsay', name: 'Chef Ramsay AI', avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
  },
  {
    id: 'recipe_dosa',
    title: 'Classic Masala Dosa',
    description: 'Crisp rice crepe filled with aromatic spiced potato curry.',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80',
    duration: 45,
    difficulty: 'Hard' as const,
    averageRating: 4.6,
    category: 'Breakfast',
    chef: { id: 'chef_alice', name: 'Chef Alice', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
  },
  {
    id: 'recipe_wellington',
    title: 'Beef Wellington Signature',
    description: 'Chef Ramsay\'s signature beef fillet, brushed with English mustard, wrapped in prosciutto.',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    duration: 90,
    difficulty: 'Hard' as const,
    averageRating: 4.9,
    category: 'Italian',
    isPremium: true,
    price: 9.99,
    chef: { id: 'chef_ramsay', name: 'Chef Ramsay AI', avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
  },
  {
    id: 'recipe_salad',
    title: 'Zesty Garlic Broccoli Salad',
    description: 'A crunchy, raw salad containing fresh broccoli florets in garlic lemon dressing.',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80',
    duration: 10,
    difficulty: 'Easy' as const,
    averageRating: 4.4,
    category: 'Healthy',
    chef: { id: 'chef_alice', name: 'Chef Alice', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
  },
  {
    id: 'recipe_pasta',
    title: 'Creamy Garlic Parmesan Pasta',
    description: 'Warm fettuccine noodles tossed in a rich, buttery heavy cream sauce.',
    imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80',
    duration: 20,
    difficulty: 'Easy' as const,
    averageRating: 4.7,
    category: 'Italian',
    chef: { id: 'chef_ramsay', name: 'Chef Ramsay AI', avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
  }
];

export default function ExploreSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxDuration, setMaxDuration] = useState(120);

  const categories = ['All', 'Breakfast', 'Italian', 'Dessert', 'Healthy'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Filtering calculations
  const filteredRecipes = mockAllRecipesList.filter((recipe) => {
    // 1. Text Query search (match title/description/category)
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Difficulty
    const matchesDifficulty =
      selectedDifficulty === 'All' ? true : recipe.difficulty === selectedDifficulty;

    // 3. Category
    const matchesCategory =
      selectedCategory === 'All' ? true : recipe.category === selectedCategory;

    // 4. Max Duration
    const matchesDuration = recipe.duration <= maxDuration;

    return matchesSearch && matchesDifficulty && matchesCategory && matchesDuration;
  });

  return (
    <div className="space-y-8 py-6">
      
      {/* Search Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Explore Recipes</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mt-1">
          Search the culinary universe by ingredients, cuisines, difficulty, or chef.
        </p>
      </div>

      {/* Search inputs panel */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search recipes, tags, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-accent-cardDark border border-gray-200 dark:border-accent-borderDark pl-12 pr-4 py-4 rounded-2xl text-sm font-semibold focus:outline-none focus:border-brand-500 transition-colors"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-5 py-4 rounded-2xl border text-xs font-extrabold transition-all active:scale-95 ${
            showFilters
              ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/15'
              : 'bg-white dark:bg-accent-cardDark border-gray-200 dark:border-accent-borderDark text-gray-600 dark:text-gray-300'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Advanced Filter Collapse Board */}
      {showFilters && (
        <div className="bg-white dark:bg-accent-cardDark border border-gray-200 dark:border-accent-borderDark rounded-3xl p-6 grid sm:grid-cols-3 gap-6 animate-fade-in-down">
          
          {/* Category selection */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Cuisine / Category</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-500/10 border-brand-500 text-brand-500'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-accent-borderDark text-gray-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty selection */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Difficulty Level</label>
            <div className="flex flex-wrap gap-1.5">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-brand-500/10 border-brand-500 text-brand-500'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-accent-borderDark text-gray-500'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Prep Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Max Cook Time</label>
              <span className="text-xs font-extrabold text-brand-500">{maxDuration} mins</span>
            </div>
            <input
              type="range"
              min="5"
              max="120"
              step="5"
              value={maxDuration}
              onChange={(e) => setMaxDuration(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
              <span>5 mins</span>
              <span>120 mins</span>
            </div>
          </div>

        </div>
      )}

      {/* Search Grid Results */}
      {filteredRecipes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              duration={recipe.duration}
              difficulty={recipe.difficulty}
              averageRating={recipe.averageRating}
              chef={recipe.chef}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl space-y-3">
          <ChefHat className="h-10 w-10 text-gray-400 mx-auto" />
          <h3 className="font-extrabold text-base text-gray-800 dark:text-white">No Recipes Match Your Filters</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold max-w-sm mx-auto">
            Try adjusting your search criteria, reducing ingredients, or increasing the max cook duration slider.
          </p>
        </div>
      )}
    </div>
  );
}
