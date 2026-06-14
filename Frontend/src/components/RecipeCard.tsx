'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Clock, Star, Award, Bookmark } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  averageRating: number;
  isPremium?: boolean;
  price?: number;
  chef: {
    id: string;
    name: string;
    avatarUrl?: string;
    isVerified?: boolean;
  };
}

export default function RecipeCard({
  id,
  title,
  description,
  imageUrl = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=500&q=80',
  duration,
  difficulty,
  averageRating,
  isPremium = false,
  price = 0,
  chef
}: RecipeCardProps) {
  const user = useAuthStore((state) => state.user);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(!liked);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setSaved(!saved);
  };

  return (
    <div className="group relative bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 mb-6">
      
      {/* Recipe Cover Image Link */}
      <Link href={`/recipe/${id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Premium / Pricing Overlay */}
        {isPremium && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
            Premium • ${price || '0.99'}
          </div>
        )}

        {/* Difficulty Badge (Top Right) */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {difficulty}
        </div>

        {/* Cook Time Overlay */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{duration}m</span>
        </div>
      </Link>

      {/* Details Box */}
      <div className="p-5">
        
        {/* Chef Bio Info */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <Link href={`/profile/${chef.id}`} className="flex items-center gap-2 hover:opacity-85 transition-opacity">
            <img
              src={chef.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&h=50&q=80'}
              alt={chef.name}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-brand-500/20"
            />
            <span className="font-bold text-gray-500 dark:text-gray-400 truncate max-w-[120px] flex items-center gap-0.5">
              {chef.name}
              {chef.isVerified && <Award className="h-3.5 w-3.5 text-blue-500 fill-blue-500" />}
            </span>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 text-accent-yellow font-extrabold">
            <Star className="h-3.5 w-3.5 fill-accent-yellow" />
            <span>{averageRating ? averageRating.toFixed(1) : '4.5'}</span>
          </div>
        </div>

        {/* Recipe Title & Desc */}
        <Link href={`/recipe/${id}`} className="block">
          <h3 className="font-extrabold text-base text-gray-800 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-accent-borderDark mt-4 pt-3 text-xs">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 font-bold ${
              liked ? 'text-brand-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-brand-500' : ''}`} />
            <span>{liked ? 'Liked' : 'Like'}</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-1 font-bold ${
              saved ? 'text-brand-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? 'fill-brand-500' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
