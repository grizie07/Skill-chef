'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Plus, Trash2, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, CloudUpload } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export default function CreateRecipePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Form Steps
  const [currentStep, setCurrentStep] = useState(1);
  const [autosaveStatus, setAutosaveStatus] = useState('Saved as draft');

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [duration, setDuration] = useState<number>(30);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fats, setFats] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from localdraft if exists
  useEffect(() => {
    const cached = localStorage.getItem('sc_recipe_draft');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setTitle(parsed.title || '');
        setDescription(parsed.description || '');
        setCategory(parsed.category || 'Breakfast');
        setDifficulty(parsed.difficulty || 'Medium');
        setDuration(parsed.duration || 30);
        setIngredients(parsed.ingredients || ['']);
        setSteps(parsed.steps || ['']);
        setCalories(parsed.calories || 0);
        setProtein(parsed.protein || 0);
        setCarbs(parsed.carbs || 0);
        setFats(parsed.fats || 0);
      } catch (err) {
        console.error('Failed to parse cached draft', err);
      }
    }
  }, []);

  // Autosave triggers when form data changes
  useEffect(() => {
    if (!title && !description) return;
    setAutosaveStatus('Saving...');
    const timer = setTimeout(() => {
      const data = { title, description, category, difficulty, duration, ingredients, steps, calories, protein, carbs, fats };
      localStorage.setItem('sc_recipe_draft', JSON.stringify(data));
      setAutosaveStatus('Draft autosaved');
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, description, category, difficulty, duration, ingredients, steps, calories, protein, carbs, fats]);

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (index: number) => {
    if (ingredients.length === 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  const updateIngredient = (index: number, val: string) => {
    const copy = [...ingredients];
    copy[index] = val;
    setIngredients(copy);
  };

  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index: number) => {
    if (steps.length === 1) return;
    setSteps(steps.filter((_, i) => i !== index));
  };
  const updateStep = (index: number, val: string) => {
    const copy = [...steps];
    copy[index] = val;
    setSteps(copy);
  };

  const handleAISuggestNutrition = () => {
    // Call mock API for fast parse
    const count = ingredients.filter(i => i !== '').length;
    setCalories(count * 95 + 80);
    setProtein(Math.max(3, Math.floor(count * 2.8)));
    setCarbs(Math.max(10, Math.floor(count * 8.5)));
    setFats(Math.max(2, Math.floor(count * 3.2)));
    setAutosaveStatus('AI Suggestion applied!');
  };

  const handlePublish = () => {
    if (!title) return alert('Recipe title is required');
    setIsSubmitting(true);
    
    // Simulate API upload
    setTimeout(() => {
      setIsSubmitting(false);
      localStorage.removeItem('sc_recipe_draft'); // Clear cache on publish

      // Award XP globally
      if (user) {
        // Increase user XP
        const currentXP = user.xp + 100;
        const currentLvl = Math.floor(currentXP / 500) + 1;
        useAuthStore.getState().updateXP(currentXP, currentLvl);
      }

      alert('Recipe published successfully! +100 XP gained.');
      router.push('/feed');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-8">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Create Recipe</h1>
          <p className="text-xs text-gray-500 mt-1">Share your kitchen hacks and creations with the world.</p>
        </div>
        <div className="text-right text-xs font-bold text-gray-400">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
          {autosaveStatus}
        </div>
      </div>

      {/* Steps Visual Progress Tracker */}
      <div className="flex items-center justify-between bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-2xl p-4">
        {[1, 2, 3].map((stepNum) => (
          <div key={stepNum} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep === stepNum
                ? 'bg-brand-500 text-white shadow'
                : currentStep > stepNum
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}>
              {currentStep > stepNum ? '✓' : stepNum}
            </div>
            <span className={`text-xs font-bold ${
              currentStep === stepNum ? 'text-gray-800 dark:text-white' : 'text-gray-400'
            }`}>
              {stepNum === 1 ? 'Details' : stepNum === 2 ? 'Directions' : 'Macros & Media'}
            </span>
          </div>
        ))}
      </div>

      {/* FORM WINDOW */}
      <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 sm:p-8 shadow-sm">
        
        {/* STEP 1: BASIC DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Recipe Title</label>
              <input
                type="text"
                placeholder="e.g. Grandma's Famous Lemon Tart"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Description</label>
              <textarea
                rows={3}
                placeholder="Describe what makes this dish delicious, texture notes, or serving tips..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark p-4 rounded-2xl text-xs font-semibold focus:outline-none focus:border-brand-500 leading-relaxed"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-brand-500"
                >
                  <option>Breakfast</option>
                  <option>Italian</option>
                  <option>Dessert</option>
                  <option>Healthy</option>
                  <option>Appetizers</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-brand-500"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Duration (mins)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark p-4 rounded-2xl text-xs font-bold focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: INGREDIENTS & STEPS */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fade-in">
            {/* Ingredients builder */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Ingredients Checklist</label>
                <button onClick={addIngredient} className="text-xs font-extrabold text-brand-500 flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 2 eggs, 50g granulated sugar"
                      value={ing}
                      onChange={(e) => updateIngredient(i, e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark px-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                    />
                    <button onClick={() => removeIngredient(i)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cooking steps builder */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Cooking Directions</label>
                <button onClick={addStep} className="text-xs font-extrabold text-brand-500 flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Describe this cooking instruction detail..."
                      value={step}
                      onChange={(e) => updateStep(i, e.target.value)}
                      className="flex-1 bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark px-4 py-3 rounded-2xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                    />
                    <button onClick={() => removeStep(i)} className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: NUTRITIONAL MACROS & UPLOAD MOCK */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fade-in">
            
            {/* AI Nutrition Tag Assist */}
            <div className="bg-gradient-to-r from-brand-gradientStart/5 to-brand-gradientEnd/5 border border-brand-500/10 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-extrabold text-brand-500 flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  AI Nutrition Estimator
                </h4>
                <p className="text-[10px] text-gray-400 font-bold mt-0.5">Parse macros based on ingredients list</p>
              </div>
              <button
                onClick={handleAISuggestNutrition}
                className="bg-brand-500 hover:opacity-95 text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform"
              >
                Estimate
              </button>
            </div>

            {/* Macros Inputs */}
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Calories</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark p-3.5 rounded-xl text-xs font-bold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Protein (g)</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark p-3.5 rounded-xl text-xs font-bold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Carbs (g)</label>
                <input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark p-3.5 rounded-xl text-xs font-bold focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400">Fats (g)</label>
                <input
                  type="number"
                  value={fats}
                  onChange={(e) => setFats(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-accent-borderDark p-3.5 rounded-xl text-xs font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Media Upload Container */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 tracking-wider">Upload Cover Media</label>
              <div className="border-2 border-dashed border-gray-200 dark:border-accent-borderDark hover:border-brand-500 rounded-3xl p-8 text-center bg-gray-50 dark:bg-[#0f0f11] cursor-pointer transition-colors space-y-2">
                <CloudUpload className="h-10 w-10 text-gray-400 mx-auto" />
                <p className="text-xs font-extrabold text-gray-700 dark:text-gray-300">Drag & Drop Cover Image/Video</p>
                <p className="text-[10px] text-gray-400 font-bold">PNG, JPG, or MP4 formats up to 25MB (Auto compressed)</p>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION ACTIONS */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-accent-borderDark mt-8 pt-6">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 dark:border-accent-borderDark rounded-2xl text-xs font-bold text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {currentStep < 3 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd text-white px-6 py-3.5 rounded-2xl text-xs font-bold active:scale-95 transition-transform"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-2xl text-xs font-bold active:scale-95 transition-transform shadow"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
