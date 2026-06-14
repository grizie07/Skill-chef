'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Moon, 
  Sun, 
  Bell, 
  ShieldAlert, 
  Save, 
  Check, 
  ChefHat, 
  Info,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

export default function UserSettings() {
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const token = useAuthStore((state) => state.token);
  
  const { theme, toggleTheme } = useThemeStore();

  const [name, setName] = useState(user?.name || 'Guest Chef Alice');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  );
  const [email, setEmail] = useState(user?.email || 'alice@skillchef.com');
  const [bio, setBio] = useState('Culinary novice building skills one recipe at a time! Ready to learn from top AI and human chefs.');
  
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [streakReminders, setStreakReminders] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = {
      ...user,
      name,
      email,
      avatarUrl
    };

    // Update Zustand state
    login(token || 'mock_jwt_token_xyz', updatedUser);
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      
      {/* Title Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gradientStart/10 to-brand-gradientEnd/10 text-brand-500 border border-brand-500/10 px-3.5 py-1.5 rounded-full text-xs font-black mb-2">
          <Settings className="h-4 w-4 animate-spin-slow" />
          <span>Chef Profile Configuration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd bg-clip-text text-transparent">
          Account Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mt-1">
          Adjust visual styles, edit biographical profiles, and configure notification frequencies.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-5 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-3">
            <User className="h-4.5 w-4.5 text-brand-500" />
            Biographical Details
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Chef Nickname</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark rounded-2xl px-4 py-3 text-xs text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-brand-500/20"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark rounded-2xl px-4 py-3 text-xs text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-brand-500/20"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Avatar Image URL</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark rounded-2xl px-4 py-3 text-xs text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase">Biography</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark rounded-2xl px-4 py-3 text-xs text-gray-800 dark:text-white outline-none focus:ring-1 focus:ring-brand-500/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Theme customization */}
        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-3">
            {theme === 'dark' ? <Moon className="h-4.5 w-4.5 text-brand-500" /> : <Sun className="h-4.5 w-4.5 text-brand-500" />}
            Visual Theme Control
          </h3>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="block text-xs font-extrabold text-gray-800 dark:text-white">Dark Visual Layout</span>
              <span className="block text-[10px] text-gray-400 font-semibold mt-0.5">Toggle default dark/light layouts.</span>
            </div>
            
            <button
              type="button"
              onClick={toggleTheme}
              className={`w-12 h-6.5 rounded-full p-1 transition-all ${
                theme === 'dark' ? 'bg-brand-500' : 'bg-gray-200'
              }`}
            >
              <div 
                className={`h-4.5 w-4.5 rounded-full bg-white transition-all transform ${
                  theme === 'dark' ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Notification preferences */}
        <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-white flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-3">
            <Bell className="h-4.5 w-4.5 text-brand-500" />
            Alert Profiles
          </h3>

          <div className="space-y-4">
            {/* Push Notifications */}
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-xs font-extrabold text-gray-800 dark:text-white">Push Alert Dispatch</span>
                <span className="block text-[10px] text-gray-400 font-semibold mt-0.5">Live warnings of likes, comments, and chef chats.</span>
              </div>
              <button
                type="button"
                onClick={() => setPushNotifs(!pushNotifs)}
                className={`w-12 h-6.5 rounded-full p-1 transition-all ${
                  pushNotifs ? 'bg-brand-500' : 'bg-gray-200'
                }`}
              >
                <div 
                  className={`h-4.5 w-4.5 rounded-full bg-white transition-all transform ${
                    pushNotifs ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Email Notifications */}
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-xs font-extrabold text-gray-800 dark:text-white">Weekly Newsletter Digests</span>
                <span className="block text-[10px] text-gray-400 font-semibold mt-0.5">Get trending meals and meal plans directly in email inbox.</span>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={`w-12 h-6.5 rounded-full p-1 transition-all ${
                  emailNotifs ? 'bg-brand-500' : 'bg-gray-200'
                }`}
              >
                <div 
                  className={`h-4.5 w-4.5 rounded-full bg-white transition-all transform ${
                    emailNotifs ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Streak Reminders */}
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-xs font-extrabold text-gray-800 dark:text-white">Daily Streak Flame Warnings</span>
                <span className="block text-[10px] text-gray-400 font-semibold mt-0.5">Alert before cooking streak resets at midnight.</span>
              </div>
              <button
                type="button"
                onClick={() => setStreakReminders(!streakReminders)}
                className={`w-12 h-6.5 rounded-full p-1 transition-all ${
                  streakReminders ? 'bg-brand-500' : 'bg-gray-200'
                }`}
              >
                <div 
                  className={`h-4.5 w-4.5 rounded-full bg-white transition-all transform ${
                    streakReminders ? 'translate-x-5.5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-brand-500/10 flex items-center gap-2"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                <span>Settings Saved</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Configuration</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
