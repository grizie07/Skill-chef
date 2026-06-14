'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useNotificationStore } from '../store/notificationStore';
import {
  Sparkles,
  Flame,
  MessageCircle,
  Bell,
  Sun,
  Moon,
  Search,
  User,
  Menu,
  X,
  Compass,
  Tv,
  Award,
  PlusSquare,
  Settings
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { unreadCount } = useNotificationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Feed', href: '/feed', icon: Compass },
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'Reels', href: '/reels', icon: Tv },
  ];

  const aiLinks = [
    { name: 'AI Ingredient Match', href: '/ai/ingredients' },
    { name: 'AI Custom Generator', href: '/ai/generate' },
    { name: 'AI Meal Planner', href: '/ai/planner' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-gray-200 dark:border-accent-borderDark bg-white/80 dark:bg-accent-slateDark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-full animated-gradient flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd bg-clip-text text-transparent">
                Skill Chef
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-brand-500 font-bold'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}

              {/* AI Dropdown Toggle */}
              <div className="relative">
                <button
                  onClick={() => setAiDropdownOpen(!aiDropdownOpen)}
                  onBlur={() => setTimeout(() => setAiDropdownOpen(false), 200)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  <Sparkles className="h-4 w-4 text-brand-500" />
                  AI Lab
                  <span className="text-[10px] bg-brand-500 text-white px-1.5 py-0.2 rounded font-extrabold uppercase">
                    New
                  </span>
                </button>

                {aiDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-2xl shadow-xl py-2 bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark animate-fade-in-down">
                    {aiLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Controls & Badges (Right Side) */}
          <div className="flex items-center gap-4">
            
            {/* Gamification Streak & XP Badge */}
            {user && (
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-accent-cardDark px-3 py-1.5 rounded-full border border-gray-200 dark:border-accent-borderDark text-xs font-bold">
                <div className="flex items-center gap-1 text-orange-500" title="Daily Streak">
                  <Flame className="h-4 w-4 fill-orange-500 animate-bounce-slow" />
                  <span>{user.dailyStreak}d</span>
                </div>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                <Link href="/dashboard" className="text-gray-700 dark:text-gray-300 hover:text-brand-500">
                  Lvl {user.level} • <span className="text-brand-500 font-extrabold">{user.xp} XP</span>
                </Link>
              </div>
            )}

            {/* Chat icon */}
            <Link
              href="/chat"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-accent-cardDark transition-colors text-gray-600 dark:text-gray-300"
              title="Messages"
            >
              <MessageCircle className="h-5 w-5" />
            </Link>

            {/* Notifications icon */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-accent-cardDark transition-colors text-gray-600 dark:text-gray-300"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500 animate-ping" />
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-accent-cardDark transition-colors text-gray-600 dark:text-gray-300"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Create Recipe Plus */}
            <Link
              href="/recipe/create"
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd hover:opacity-95 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md shadow-brand-500/10 active:scale-95 transition-transform"
            >
              <PlusSquare className="h-4 w-4" />
              Cook
            </Link>

            {/* User Dropdown / Profile icon */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center focus:outline-none">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-500/20 group-hover:ring-brand-500 transition-all duration-200"
                  />
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-2xl shadow-xl py-2 bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark hidden group-hover:block hover:block transition-all duration-300">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-accent-borderDark">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user.name}</p>
                  </div>
                  <Link href={`/profile/${user.id}`} className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                    My Profile
                  </Link>
                  <Link href="/dashboard" className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                    Gamification Dashboard
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                    Settings
                  </Link>
                  <Link href="/admin" className="block px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                    Admin Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 text-xs font-semibold text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-gray-600 hover:text-brand-500 dark:text-gray-300"
              >
                Log In
              </Link>
            )}

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-accent-cardDark rounded-full"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-accent-borderDark bg-white dark:bg-accent-slateDark px-4 py-4 animate-fade-in">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-base font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-500"
              >
                <link.icon className="h-5 w-5" />
                {link.name}
              </Link>
            ))}
            
            <div className="h-px bg-gray-100 dark:bg-gray-800" />
            <p className="text-xs font-extrabold uppercase tracking-widest text-brand-500">AI Kitchen Services</p>
            {aiLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block pl-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-brand-500"
              >
                {link.name}
              </Link>
            ))}

            <div className="h-px bg-gray-100 dark:bg-gray-800" />
            <Link
              href="/recipe/create"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white py-3 rounded-2xl text-sm font-bold shadow-md shadow-brand-500/10"
            >
              <PlusSquare className="h-5 w-5" />
              Create Recipe
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Instagram/Pinterest Social style) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-accent-slateDark/90 border-t border-gray-200 dark:border-accent-borderDark h-16 flex items-center justify-around z-50 backdrop-blur-md">
        <Link href="/feed" className={`flex flex-col items-center justify-center text-gray-500 ${isActive('/feed') ? 'text-brand-500' : ''}`}>
          <Compass className="h-6 w-6" />
          <span className="text-[10px] font-bold">Feed</span>
        </Link>
        <Link href="/explore" className={`flex flex-col items-center justify-center text-gray-500 ${isActive('/explore') ? 'text-brand-500' : ''}`}>
          <Search className="h-6 w-6" />
          <span className="text-[10px] font-bold">Search</span>
        </Link>
        <Link href="/recipe/create" className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white shadow-lg -translate-y-4 border-4 border-white dark:border-[#0d0d0f]">
          <PlusSquare className="h-6 w-6" />
        </Link>
        <Link href="/reels" className={`flex flex-col items-center justify-center text-gray-500 ${isActive('/reels') ? 'text-brand-500' : ''}`}>
          <Tv className="h-6 w-6" />
          <span className="text-[10px] font-bold">Reels</span>
        </Link>
        <Link href="/dashboard" className={`flex flex-col items-center justify-center text-gray-500 ${isActive('/dashboard') ? 'text-brand-500' : ''}`}>
          <Award className="h-6 w-6" />
          <span className="text-[10px] font-bold">Streaks</span>
        </Link>
      </div>
    </nav>
  );
}
