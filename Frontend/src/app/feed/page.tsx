'use client';

import React, { useState, useEffect } from 'react';
import RecipeCard from '../../components/RecipeCard';
import { Compass, Sparkles, ChefHat } from 'lucide-react';

const mockFeedRecipes = [
  {
    id: 'recipe_lava_cake',
    title: 'Chocolate Lava Cake',
    description: 'A decadent molten chocolate lava cake that oozes cocoa goodness when cut open. Simple to bake but looks ultra fancy.',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
    duration: 15,
    difficulty: 'Medium' as const,
    averageRating: 4.8,
    isPremium: false,
    chef: {
      id: 'chef_ramsay',
      name: 'Chef Ramsay AI',
      avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    }
  },
  {
    id: 'recipe_dosa',
    title: 'Classic Masala Dosa',
    description: 'Crisp rice crepe filled with aromatic spiced potato curry. Served with coconut chutney and hot sambar.',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80',
    duration: 45,
    difficulty: 'Hard' as const,
    averageRating: 4.6,
    isPremium: false,
    chef: {
      id: 'chef_alice',
      name: 'Chef Alice',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    }
  },
  {
    id: 'recipe_wellington',
    title: 'Beef Wellington Signature',
    description: 'Chef Ramsay\'s signature beef fillet, brushed with English mustard, wrapped in prosciutto, mushroom duxelles, and gold puff pastry.',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    duration: 90,
    difficulty: 'Hard' as const,
    averageRating: 4.9,
    isPremium: true,
    price: 9.99,
    chef: {
      id: 'chef_ramsay',
      name: 'Chef Ramsay AI',
      avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    }
  },
  {
    id: 'recipe_salad',
    title: 'Zesty Garlic Broccoli Salad',
    description: 'A crunchy, raw salad containing fresh broccoli florets and toasted sunflower seeds in garlic lemon dressing.',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80',
    duration: 10,
    difficulty: 'Easy' as const,
    averageRating: 4.4,
    isPremium: false,
    chef: {
      id: 'chef_alice',
      name: 'Chef Alice',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    }
  },
  {
    id: 'recipe_pasta',
    title: 'Creamy Garlic Parmesan Pasta',
    description: 'Warm fettuccine noodles tossed in a rich, buttery heavy cream sauce loaded with fresh garlic and parmesan.',
    imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=500&q=80',
    duration: 20,
    difficulty: 'Easy' as const,
    averageRating: 4.7,
    isPremium: false,
    chef: {
      id: 'chef_ramsay',
      name: 'Chef Ramsay AI',
      avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    }
  }
];

export default function HomeFeed() {
  const [recipes, setRecipes] = useState(mockFeedRecipes);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  const categories = ['All', 'Breakfast', 'Italian', 'Dessert', 'Healthy'];

  useEffect(() => {
    // In a live system, we would query the database:
    // fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes?category=${activeCategory}`)
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      if (activeCategory === 'All') {
        setRecipes(mockFeedRecipes);
      } else if (activeCategory === 'Breakfast') {
        setRecipes(mockFeedRecipes.filter(r => r.id === 'recipe_dosa'));
      } else if (activeCategory === 'Italian') {
        setRecipes(mockFeedRecipes.filter(r => r.id === 'recipe_pasta' || r.id === 'recipe_wellington'));
      } else if (activeCategory === 'Dessert') {
        setRecipes(mockFeedRecipes.filter(r => r.id === 'recipe_lava_cake'));
      } else if (activeCategory === 'Healthy') {
        setRecipes(mockFeedRecipes.filter(r => r.id === 'recipe_salad'));
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [activeCategory]);

  return (
    <div className="space-y-8 py-6">
      
      {/* Feed Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
            <Compass className="h-7 w-7 text-brand-500 fill-brand-500/10" />
            Culinary Feed
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mt-1">
            Browse trending dishes and customized creations from top community chefs.
          </p>
        </div>

        {/* AI Recommendations CTA overlay */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-brand-gradientStart/10 to-brand-gradientEnd/10 text-brand-500 border border-brand-500/10 px-4 py-2.5 rounded-2xl text-xs font-extrabold">
          <Sparkles className="h-4 w-4 text-brand-500" />
          <span>AI tailored just for you</span>
        </div>
      </div>

      {/* Category Horizontal Filter Scroller */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all shrink-0 border ${
              activeCategory === cat
                ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/15'
                : 'bg-white dark:bg-accent-cardDark border-gray-100 dark:border-accent-borderDark text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl h-80 animate-pulse-slow p-5 space-y-4">
              <div className="aspect-[4/3] w-full bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : recipes.length > 0 ? (
        // Masonry Layout Column flow (simplified grid since height is uniform, but responsive masonry columns)
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              imageUrl={recipe.imageUrl}
              duration={recipe.duration}
              difficulty={recipe.difficulty}
              averageRating={recipe.averageRating}
              isPremium={recipe.isPremium}
              price={recipe.price}
              chef={recipe.chef}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl space-y-3">
          <ChefHat className="h-10 w-10 text-gray-400 mx-auto" />
          <p className="text-sm font-semibold text-gray-500">No recipes matched this category yet</p>
        </div>
      )}
    </div>
  );
}
