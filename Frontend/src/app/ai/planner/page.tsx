'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  PieChart, 
  ChevronRight, 
  Check, 
  Info,
  Scale,
  RefreshCw,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../../store/authStore';
import { useGamificationStore } from '../../../store/gamificationStore';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface DayPlan {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
}

const mockMeals: Record<string, Meal[]> = {
  breakfast: [
    { id: 'b1', name: 'Avocado Toast with Poached Eggs', calories: 350, protein: 18, carbs: 24, fats: 22 },
    { id: 'b2', name: 'Almond Butter & Banana Smoothie Bowl', calories: 420, protein: 12, carbs: 54, fats: 18 },
    { id: 'b3', name: 'Smoked Salmon Egg Scramble', calories: 290, protein: 24, carbs: 4, fats: 20 },
    { id: 'b4', name: 'Greek Yogurt with Mixed Berries & Honey', calories: 220, protein: 15, carbs: 28, fats: 5 }
  ],
  lunch: [
    { id: 'l1', name: 'Grilled Chicken & Quinoa Salad', calories: 480, protein: 35, carbs: 42, fats: 15 },
    { id: 'l2', name: 'Spiced Lentil & Beetroot Wrap', calories: 390, protein: 14, carbs: 58, fats: 12 },
    { id: 'l3', name: 'Seared Tuna Poke Bowl with Avocado', calories: 510, protein: 32, carbs: 45, fats: 20 },
    { id: 'l4', name: 'Zesty Garlic Broccoli & Chickpea Salad', calories: 340, protein: 11, carbs: 48, fats: 14 }
  ],
  dinner: [
    { id: 'd1', name: 'Gourmet Herb Salmon with Grilled Asparagus', calories: 420, protein: 38, carbs: 6, fats: 28 },
    { id: 'd2', name: 'Creamy Mushroom & Spinach Fettuccine', calories: 560, protein: 16, carbs: 74, fats: 24 },
    { id: 'd3', name: 'Smokey Chipotle Cream Chicken Sizzle', calories: 610, protein: 45, carbs: 4, fats: 46 },
    { id: 'd4', name: 'Beef Wellington (Mini Slice)', calories: 680, protein: 42, carbs: 32, fats: 42 }
  ]
};

const initialGroceryList = [
  { item: "Fresh Atlantic Salmon Fillets", category: "Produce/Meat", checked: false },
  { item: "Organic Hass Avocados", category: "Produce/Meat", checked: false },
  { item: "Tri-color Quinoa", category: "Pantry", checked: false },
  { item: "Organic Baby Arugula", category: "Produce/Meat", checked: true },
  { item: "Greek Yogurt (Non-fat)", category: "Dairy", checked: false },
  { item: "Fresh Strawberries & Blueberries", category: "Produce/Meat", checked: false },
  { item: "Garlic Cloves & Lemons", category: "Produce/Meat", checked: false }
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanner() {
  const user = useAuthStore((state) => state.user);
  const updateXP = useAuthStore((state) => state.updateXP);
  const triggerLevelUp = useGamificationStore((state) => state.triggerLevelUp);

  const [diet, setDiet] = useState('All');
  const [caloriesTarget, setCaloriesTarget] = useState(1800);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<Record<string, DayPlan>>({
    Monday: { breakfast: mockMeals.breakfast[0], lunch: mockMeals.lunch[0], dinner: mockMeals.dinner[0] },
    Tuesday: { breakfast: mockMeals.breakfast[1], lunch: mockMeals.lunch[1], dinner: mockMeals.dinner[1] },
    Wednesday: { breakfast: mockMeals.breakfast[2], lunch: mockMeals.lunch[2], dinner: mockMeals.dinner[2] },
    Thursday: { breakfast: null, lunch: null, dinner: null },
    Friday: { breakfast: null, lunch: null, dinner: null },
    Saturday: { breakfast: null, lunch: null, dinner: null },
    Sunday: { breakfast: null, lunch: null, dinner: null }
  });
  
  const [activeDay, setActiveDay] = useState('Monday');
  const [groceryList, setGroceryList] = useState(initialGroceryList);
  const [newGroceryItem, setNewGroceryItem] = useState('');

  const calculateDayTotals = (day: string) => {
    const dayPlan = plan[day];
    let calories = 0, protein = 0, carbs = 0, fats = 0;
    
    ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
      const meal = dayPlan[mealType as keyof DayPlan];
      if (meal) {
        calories += meal.calories;
        protein += meal.protein;
        carbs += meal.carbs;
        fats += meal.fats;
      }
    });

    return { calories, protein, carbs, fats };
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/planner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sc_token') || ''}`
        },
        body: JSON.stringify({ diet, caloriesTarget })
      });

      if (!response.ok) throw new Error("Plan api offline");
      const data = await response.json();
      setPlan(data.plan);
      if (data.groceryList) {
        setGroceryList(data.groceryList.map((item: string) => ({ item, category: "Pantry", checked: false })));
      }
      setIsLoading(false);
    } catch (err) {
      // Local mock simulation
      setTimeout(() => {
        const generated: Record<string, DayPlan> = {};
        daysOfWeek.forEach((day) => {
          // select random meals based on indices
          const bIndex = Math.floor(Math.random() * mockMeals.breakfast.length);
          const lIndex = Math.floor(Math.random() * mockMeals.lunch.length);
          const dIndex = Math.floor(Math.random() * mockMeals.dinner.length);
          
          generated[day] = {
            breakfast: mockMeals.breakfast[bIndex],
            lunch: mockMeals.lunch[lIndex],
            dinner: mockMeals.dinner[dIndex]
          };
        });

        setPlan(generated);
        setGroceryList([
          { item: "Organic Bananas & Almond Butter", category: "Pantry", checked: false },
          { item: "French Green Lentils & Spinach", category: "Produce/Meat", checked: false },
          { item: "Chipotle Peppers in Adobo", category: "Pantry", checked: false },
          ...initialGroceryList
        ]);
        
        setIsLoading(false);

        // Award XP for planning meals
        if (user) {
          const nextXp = user.xp + 20;
          let nextLevel = user.level;
          if (nextXp >= 150) {
            nextLevel = user.level + 1;
            triggerLevelUp(nextLevel);
          }
          updateXP(nextXp, nextLevel);
        }
      }, 2000);
    }
  };

  const handleToggleGrocery = (index: number) => {
    setGroceryList(
      groceryList.map((g, i) => i === index ? { ...g, checked: !g.checked } : g)
    );
  };

  const handleAddGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroceryItem.trim()) return;
    setGroceryList([
      ...groceryList,
      { item: newGroceryItem, category: "Pantry", checked: false }
    ]);
    setNewGroceryItem('');
  };

  const handleClearMeal = (day: string, type: 'breakfast' | 'lunch' | 'dinner') => {
    setPlan({
      ...plan,
      [day]: {
        ...plan[day],
        [type]: null
      }
    });
  };

  const totals = calculateDayTotals(activeDay);

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gradientStart/10 to-brand-gradientEnd/10 text-brand-500 border border-brand-500/10 px-3.5 py-1.5 rounded-full text-xs font-black mb-2">
            <Calendar className="h-4 w-4" />
            <span>AI Automated Dietetics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-brand-gradientStart to-brand-gradientEnd bg-clip-text text-transparent">
            Smart Meal Planner
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold mt-1">
            Formulate whole-week customized recipes and let the engine compile your shopping checklist.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-2xl p-1 text-xs">
            {['All', 'Vegan', 'Keto'].map((d) => (
              <button
                key={d}
                onClick={() => setDiet(d)}
                className={`px-4 py-2 font-black rounded-xl transition-all ${
                  diet === d 
                    ? 'bg-brand-500 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            onClick={handleGeneratePlan}
            disabled={isLoading}
            className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-md shadow-brand-500/15 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating Week...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-white/20" />
                <span>AI Autofill Week</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Weekly Grid Selector & Focus View */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Day Horizontal Scroller tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {daysOfWeek.map((day) => {
              const active = activeDay === day;
              const { calories } = calculateDayTotals(day);
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-5 py-3.5 rounded-2xl text-left border transition-all shrink-0 min-w-[110px] space-y-1 ${
                    active
                      ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/15'
                      : 'bg-white dark:bg-accent-cardDark border-gray-100 dark:border-accent-borderDark text-gray-500 hover:text-gray-700 dark:hover:bg-accent-slateDark'
                  }`}
                >
                  <span className="block text-[10px] uppercase font-black tracking-wider opacity-60">
                    {day.substring(0, 3)}
                  </span>
                  <span className="block text-xs font-black">
                    {calories > 0 ? `${calories} kcal` : 'Empty'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Day Planner Card */}
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-accent-borderDark pb-4">
              <h2 className="text-base font-black text-gray-800 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-brand-500" />
                {activeDay} Schedule
              </h2>
              <span className="text-[10px] text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full font-black uppercase">
                {diet} Diet
              </span>
            </div>

            {/* Meal Items (Breakfast, Lunch, Dinner) */}
            <div className="space-y-4">
              {(['breakfast', 'lunch', 'dinner'] as const).map((mealType) => {
                const meal = plan[activeDay][mealType];
                return (
                  <div 
                    key={mealType}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-accent-slateDark border border-gray-100/50 dark:border-accent-borderDark/40 rounded-2xl gap-4 hover:shadow-md transition-all group"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest block">
                        {mealType}
                      </span>
                      {meal ? (
                        <h4 className="text-xs sm:text-sm font-extrabold text-gray-800 dark:text-white">
                          {meal.name}
                        </h4>
                      ) : (
                        <p className="text-xs font-semibold text-gray-400">No meal planned yet.</p>
                      )}
                    </div>

                    {meal ? (
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Calories info */}
                        <div className="text-right text-xs">
                          <span className="font-black text-gray-700 dark:text-gray-200">{meal.calories} kcal</span>
                          <span className="block text-[9px] text-gray-400 font-semibold">
                            P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fats}g
                          </span>
                        </div>
                        
                        {/* Action buttons */}
                        <button
                          onClick={() => handleClearMeal(activeDay, mealType)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleGeneratePlan}
                        className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 font-extrabold"
                      >
                        <Plus className="h-4 w-4" /> Add recipe
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Side: Nutrition Analysis & Grocery Shopping Checklist */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Nutrition targets dial */}
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5 border-b border-gray-100 dark:border-accent-borderDark pb-3">
              <PieChart className="h-4 w-4 text-brand-500" />
              Day Nutrition Metrics
            </h3>

            {/* Circular simulated rings */}
            <div className="space-y-4">
              {/* Calories */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400">
                  <span>Calories target</span>
                  <span>{totals.calories} / {caloriesTarget} kcal</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-accent-borderDark h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (totals.calories / caloriesTarget) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Macros summary row */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="bg-gray-50 dark:bg-accent-slateDark p-2.5 rounded-xl border border-gray-100 dark:border-accent-borderDark">
                  <span className="block text-[8px] font-black text-gray-400 uppercase">Protein</span>
                  <span className="text-xs font-black text-gray-700 dark:text-gray-200">{totals.protein}g</span>
                </div>
                <div className="bg-gray-50 dark:bg-accent-slateDark p-2.5 rounded-xl border border-gray-100 dark:border-accent-borderDark">
                  <span className="block text-[8px] font-black text-gray-400 uppercase">Carbs</span>
                  <span className="text-xs font-black text-gray-700 dark:text-gray-200">{totals.carbs}g</span>
                </div>
                <div className="bg-gray-50 dark:bg-accent-slateDark p-2.5 rounded-xl border border-gray-100 dark:border-accent-borderDark">
                  <span className="block text-[8px] font-black text-gray-400 uppercase">Fats</span>
                  <span className="text-xs font-black text-gray-700 dark:text-gray-200">{totals.fats}g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grocery shopping list checklist */}
          <div className="bg-white dark:bg-accent-cardDark border border-gray-100 dark:border-accent-borderDark rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center justify-between border-b border-gray-100 dark:border-accent-borderDark pb-3">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-brand-500" />
                Grocery Checklist
              </span>
              <span className="text-[10px] text-gray-400 font-bold">
                {groceryList.filter(g => g.checked).length}/{groceryList.length} Checked
              </span>
            </h3>

            {/* Input field to add items */}
            <form onSubmit={handleAddGrocery} className="flex gap-2">
              <input
                type="text"
                placeholder="Add shopping item..."
                value={newGroceryItem}
                onChange={(e) => setNewGroceryItem(e.target.value)}
                className="flex-1 bg-gray-50 dark:bg-accent-slateDark border border-gray-100 dark:border-accent-borderDark rounded-xl px-3 py-2 text-xs text-gray-700 dark:text-white outline-none focus:ring-1 focus:ring-brand-500/20"
              />
              <button
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Add
              </button>
            </form>

            {/* Checklist elements scrollbar */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {groceryList.map((g, i) => (
                <div 
                  key={i} 
                  onClick={() => handleToggleGrocery(i)}
                  className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-accent-slateDark transition-all cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-accent-borderDark group"
                >
                  <div className={`h-4.5 w-4.5 border rounded-md flex items-center justify-center transition-all ${
                    g.checked 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-gray-200 dark:border-accent-borderDark'
                  }`}>
                    {g.checked && <Check className="h-3 w-3" />}
                  </div>
                  <span className={`text-xs font-semibold flex-1 ${
                    g.checked ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-200'
                  }`}>
                    {g.item}
                  </span>
                  <span className="text-[9px] bg-gray-100 dark:bg-accent-borderDark text-gray-400 group-hover:text-gray-500 px-2 py-0.5 rounded-full font-bold">
                    {g.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
