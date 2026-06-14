'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  Award, 
  Flame, 
  ChefHat, 
  Bookmark, 
  Grid, 
  Compass, 
  Mail, 
  UserPlus, 
  Check, 
  Info,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RecipeCard from '../../../components/RecipeCard';
import { useAuthStore } from '../../../store/authStore';

interface ProfileData {
  id: string;
  name: string;
  avatarUrl: string;
  bio: string;
  level: number;
  xp: number;
  dailyStreak: number;
  isChef: boolean;
  isVerified: boolean;
  badges: { id: string; name: string; badgeUrl: string }[];
  recipes: any[];
}

const mockProfiles: Record<string, ProfileData> = {
  chef_ramsay: {
    id: 'chef_ramsay',
    name: 'Chef Ramsay AI',
    avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'The ultimate culinary neural network. I critique dishes in real-time and formulate premium gourmet meals. Season your pans properly, do not serve me trash!',
    level: 12,
    xp: 4800,
    dailyStreak: 45,
    isChef: true,
    isVerified: true,
    badges: [
      { id: 'fresh_cook', name: 'Fresh Cook', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
      { id: 'master_chef', name: 'Master Chef', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/1865/1865269.png' }
    ],
    recipes: [
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
        chef: { id: 'chef_ramsay', name: 'Chef Ramsay AI', avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
      },
      {
        id: 'recipe_lava_cake',
        title: 'Chocolate Lava Cake',
        description: 'A decadent molten chocolate lava cake that oozes cocoa goodness when cut open. Simple to bake but looks ultra fancy.',
        imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
        duration: 15,
        difficulty: 'Medium' as const,
        averageRating: 4.8,
        isPremium: false,
        chef: { id: 'chef_ramsay', name: 'Chef Ramsay AI', avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
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
        chef: { id: 'chef_ramsay', name: 'Chef Ramsay AI', avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
      }
    ]
  },
  chef_alice: {
    id: 'chef_alice',
    name: 'Chef Alice',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Passionate home baker and flavor enthusiast. Creating recipes that make cooking fun, accessible, and healthy for foodies worldwide.',
    level: 8,
    xp: 2150,
    dailyStreak: 12,
    isChef: true,
    isVerified: true,
    badges: [
      { id: 'fresh_cook', name: 'Fresh Cook', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }
    ],
    recipes: [
      {
        id: 'recipe_dosa',
        title: 'Classic Masala Dosa',
        description: 'Crisp rice crepe filled with aromatic spiced potato curry. Served with coconut chutney and hot sambar.',
        imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=500&q=80',
        duration: 45,
        difficulty: 'Hard' as const,
        averageRating: 4.6,
        isPremium: false,
        chef: { id: 'chef_alice', name: 'Chef Alice', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
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
        chef: { id: 'chef_alice', name: 'Chef Alice', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }
      }
    ]
  }
};

export default function UserProfilePage() {
  const params = useParams();
  const rawUsername = params.username as string;
  
  const currentUser = useAuthStore((state) => state.user);
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'recipes' | 'bookmarks'>('recipes');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Determine profile to show
    if (rawUsername && mockProfiles[rawUsername]) {
      setProfile(mockProfiles[rawUsername]);
    } else {
      // Show default current user profile
      const defaultUser: ProfileData = {
        id: currentUser?.id || 'mock-user-123',
        name: currentUser?.name || 'Guest Chef Alice',
        avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
        bio: 'Culinary novice building skills one recipe at a time! Ready to learn from top AI and human chefs.',
        level: currentUser?.level || 1,
        xp: currentUser?.xp || 120,
        dailyStreak: currentUser?.dailyStreak || 3,
        isChef: currentUser?.isChef || false,
        isVerified: currentUser?.role === 'admin',
        badges: currentUser?.badges || [
          { id: 'fresh_cook', name: 'Fresh Cook', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }
        ],
        recipes: [] // Starts empty for new users
      };
      setProfile(defaultUser);
    }
  }, [rawUsername, currentUser]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
      </div>
    );
  }

  const isSelf = profile.id === currentUser?.id || profile.id === 'mock-user-123';

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      
      {/* Top Banner profile header */}
      <div className="relative bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm overflow-hidden">
        
        {/* Background Accent Gradients */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-brand-gradientStart/10 to-brand-gradientEnd/10 rounded-full blur-2xl pointer-events-none" />

        {/* User Large Avatar */}
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-brand-500/10 shrink-0"
        />

        {/* Meta Info */}
        <div className="flex-1 space-y-4 text-center md:text-left min-w-0">
          
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white flex flex-wrap items-center justify-center md:justify-start gap-2">
              {profile.name}
              {profile.isVerified && (
                <Award className="h-5 w-5 text-blue-500 fill-blue-500" />
              )}
              {profile.isChef && (
                <span className="bg-brand-500/10 text-brand-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Academy Chef
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-400 font-semibold max-w-lg leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Quick Metrics display */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="bg-gray-50 dark:bg-accent-slateDark px-4 py-2 rounded-2xl border border-gray-100 dark:border-accent-borderDark flex items-center gap-2">
              <ChefHat className="h-4.5 w-4.5 text-brand-500" />
              <span className="text-xs font-black text-gray-800 dark:text-white">Level {profile.level}</span>
            </div>
            
            <div className="bg-gray-50 dark:bg-accent-slateDark px-4 py-2 rounded-2xl border border-gray-100 dark:border-accent-borderDark flex items-center gap-2">
              <Flame className="h-4.5 w-4.5 text-amber-500 fill-amber-500/10" />
              <span className="text-xs font-black text-gray-800 dark:text-white">{profile.dailyStreak} Day Streak</span>
            </div>
          </div>
        </div>

        {/* Actions Button (Follow / Message / Edit Settings) */}
        {!isSelf ? (
          <div className="flex gap-2 w-full md:w-auto shrink-0 md:mt-2">
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                isFollowing
                  ? 'bg-gray-100 dark:bg-accent-slateDark text-gray-500 hover:bg-gray-200 border border-gray-100 dark:border-accent-borderDark'
                  : 'bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/10'
              }`}
            >
              {isFollowing ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Follow Chef</span>
                </>
              )}
            </button>

            <button className="p-3 bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark rounded-2xl hover:bg-gray-100 text-gray-500 transition-colors">
              <Mail className="h-4.5 w-4.5" />
            </button>
          </div>
        ) : (
          <div className="w-full md:w-auto shrink-0 md:mt-2">
            <Link
              href="/settings"
              className="block text-center px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider bg-gray-50 dark:bg-accent-slateDark hover:bg-gray-100 border border-gray-100 dark:border-accent-borderDark text-gray-600 dark:text-white transition-all"
            >
              Configure Settings
            </Link>
          </div>
        )}
      </div>

      {/* Main grids: left tabs content, right achievements list */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Recipe Feed tabs */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tab toggles */}
          <div className="flex border-b border-gray-100 dark:border-accent-borderDark">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex items-center gap-2 pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-4 transition-all ${
                activeTab === 'recipes'
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="h-4 w-4" />
              <span>Published Dishes ({profile.recipes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-2 pb-3 text-xs font-black uppercase tracking-wider border-b-2 px-4 transition-all ${
                activeTab === 'bookmarks'
                  ? 'border-brand-500 text-brand-500'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span>Saved Bookmarks</span>
            </button>
          </div>

          {/* Grid display */}
          <div className="pt-2">
            {activeTab === 'recipes' ? (
              profile.recipes.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {profile.recipes.map((recipe) => (
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
                <div className="text-center py-20 bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl space-y-3 text-gray-400">
                  <ChefHat className="h-10 w-10 mx-auto text-gray-300" />
                  <p className="text-xs font-black">No Dishes Published Yet</p>
                  {isSelf && (
                    <Link
                      href="/recipe/create"
                      className="inline-block text-brand-500 font-black text-xs hover:underline"
                    >
                      Create your first recipe draft &rarr;
                    </Link>
                  )}
                </div>
              )
            ) : (
              // Saved Bookmarks tab (show simulated saved bookmarks)
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Seed a default saved item if it's the first time */}
                <RecipeCard
                  id="recipe_lava_cake"
                  title="Chocolate Lava Cake"
                  description="A decadent molten chocolate lava cake that oozes cocoa goodness when cut open. Simple to bake but looks ultra fancy."
                  imageUrl="https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80"
                  duration={15}
                  difficulty="Medium"
                  averageRating={4.8}
                  chef={{ id: 'chef_ramsay', name: 'Chef Ramsay AI', avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }}
                />
                
                {profile.id === 'chef_ramsay' && (
                  <RecipeCard
                    id="recipe_wellington"
                    title="Beef Wellington Signature"
                    description="Chef Ramsay's signature beef fillet wrapped in prosciutto, mushroom duxelles, and gold puff pastry."
                    imageUrl="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80"
                    duration={90}
                    difficulty="Hard"
                    averageRating={4.9}
                    isPremium={true}
                    price={9.99}
                    chef={{ id: 'chef_ramsay', name: 'Chef Ramsay AI', avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80', isVerified: true }}
                  />
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Unlocked Badges list */}
        <div className="lg:col-span-4">
          
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-3">
              <Award className="h-4.5 w-4.5 text-brand-500" />
              Unlocked Badges
            </h3>

            <div className="space-y-4">
              {profile.badges.map((badge) => (
                <div 
                  key={badge.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-accent-slateDark border border-gray-100/50 dark:border-accent-borderDark/40 rounded-2xl"
                >
                  <img
                    src={badge.badgeUrl}
                    alt={badge.name}
                    className="h-10 w-10 object-contain shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-black text-gray-800 dark:text-white">{badge.name}</h4>
                    <span className="text-[9px] text-gray-400 font-bold block">Unlocked Academy Badge</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
