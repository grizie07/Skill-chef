import { OpenAI } from 'openai';

// Initialize OpenAI client optionally
const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// Mock database of recipes to generate realistic fallbacks when API key is missing
const mockRecipesDb = [
  {
    title: 'Creamy Garlic Parmesan Pasta',
    description: 'A rich and decadent pasta dish loaded with garlic, fresh parmesan, and a velvety cream sauce.',
    difficulty: 'Easy',
    duration: 20,
    tags: ['creamy', 'garlic', 'pasta', 'italian', 'comfort food'],
    ingredients: ['Pasta', 'Garlic', 'Heavy Cream', 'Parmesan Cheese', 'Butter', 'Parsley'],
    steps: [
      'Boil pasta in salted water until al dente.',
      'Sauté minced garlic in melted butter over medium heat for 1 minute.',
      'Stir in heavy cream and bring to a simmer. Add grated parmesan cheese until melted.',
      'Toss the drained pasta into the sauce, garnish with chopped parsley, and serve hot.'
    ],
    nutrition: { calories: 650, protein: 18, carbs: 70, fats: 32 },
    platingSuggestions: 'Serve in a shallow warm bowl, top with extra shredded parmesan, a crack of black pepper, and a fresh parsley sprig.',
    estimatedCost: '$8.50'
  },
  {
    title: 'Spicy Broccoli Rice Stir-Fry',
    description: 'A quick, healthy, and fiery vegetable stir-fry with rice, crisp broccoli florets, and a spicy soy glaze.',
    difficulty: 'Easy',
    duration: 15,
    tags: ['spicy', 'healthy', 'vegan', 'asian', 'stir-fry'],
    ingredients: ['Rice', 'Broccoli', 'Soy Sauce', 'Chili Flakes', 'Sesame Oil', 'Garlic', 'Ginger'],
    steps: [
      'Cook rice or use leftover day-old rice.',
      'Heat sesame oil in a large skillet. Add minced garlic and grated ginger, cooking for 30 seconds.',
      'Add broccoli florets and toss until bright green yet crisp.',
      'Add rice, soy sauce, and red chili flakes. Stir-fry on high heat for 3-4 minutes, then serve.'
    ],
    nutrition: { calories: 380, protein: 9, carbs: 62, fats: 10 },
    platingSuggestions: 'Garnish with toasted sesame seeds and sliced green onions. Serve in a wide stone bowl.',
    estimatedCost: '$5.20'
  },
  {
    title: 'Zesty Garlic Broccoli Salad',
    description: 'A refreshing raw broccoli salad tossed in a garlic-lemon dressing with toasted sunflower seeds.',
    difficulty: 'Easy',
    duration: 10,
    tags: ['salad', 'healthy', 'raw', 'low-carb', 'garlic'],
    ingredients: ['Broccoli', 'Garlic', 'Lemon Juice', 'Olive Oil', 'Sunflower Seeds', 'Salt'],
    steps: [
      'Cut broccoli into small bite-sized florets.',
      'Whisk minced garlic, fresh lemon juice, olive oil, and salt in a bowl.',
      'Toss broccoli florets in the dressing until fully coated.',
      'Top with toasted sunflower seeds and chill in the fridge for 20 minutes before serving.'
    ],
    nutrition: { calories: 210, protein: 6, carbs: 14, fats: 16 },
    platingSuggestions: 'Arrange on a flat platter, drizzle with extra olive oil, and garnish with thin lemon wheels.',
    estimatedCost: '$4.50'
  }
];

export class OpenAIService {
  /**
   * Suggest recipes based on ingredients available at home
   */
  static async suggestRecipesFromIngredients(ingredients: string[]): Promise<any> {
    const ingredientsList = ingredients.map(i => i.trim().toLowerCase());

    if (!openai) {
      // Simulate intelligent match
      const matched = mockRecipesDb.filter(recipe =>
        recipe.ingredients.some(ing => ingredientsList.some(userIng => ing.toLowerCase().includes(userIng)))
      );

      const finalRecipes = matched.length > 0 ? matched : mockRecipesDb;

      return finalRecipes.map(recipe => {
        const missing = recipe.ingredients.filter(
          ing => !ingredientsList.some(userIng => ing.toLowerCase().includes(userIng))
        );
        return {
          title: recipe.title,
          description: recipe.description,
          difficulty: recipe.difficulty,
          duration: recipe.duration,
          tags: recipe.tags,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          nutrition: recipe.nutrition,
          missingIngredients: missing,
          platingSuggestions: recipe.platingSuggestions,
          estimatedCost: recipe.estimatedCost
        };
      });
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are Skill Chef's master AI. Return a JSON object with a key "recipes" containing an array of recipes that can be made with the user's ingredients.
            Each recipe MUST have: "title", "description", "difficulty" (Easy/Medium/Hard), "duration" (number in minutes), "tags" (string[]), "ingredients" (string[]), "steps" (string[]), "nutrition" (object with calories, protein, carbs, fats), "missingIngredients" (string[]), "platingSuggestions" (string), "estimatedCost" (string).`
          },
          {
            role: 'user',
            content: `I have these ingredients at home: ${ingredients.join(', ')}. Suggest recipes I can make. Highlight missing ingredients if any.`
          }
        ]
      });

      const text = response.choices[0].message?.content || '{}';
      return JSON.parse(text).recipes || [];
    } catch (error) {
      console.error('OpenAI suggestRecipesFromIngredients Error, using fallback:', error);
      return mockRecipesDb;
    }
  }

  /**
   * Generate an entirely new custom recipe based on user preferences
   */
  static async generateCustomRecipe(filters: {
    cuisine?: string;
    calories?: number;
    budget?: string;
    isVegetarian?: boolean;
    proteinGoals?: number;
    timeAvailable?: number;
    mealType?: string;
  }): Promise<any> {
    if (!openai) {
      // Return a custom recipe modified by preferences
      const template = mockRecipesDb[Math.floor(Math.random() * mockRecipesDb.length)];
      return {
        ...template,
        title: `AI custom ${filters.cuisine || 'Global'} ${template.title}`,
        nutrition: {
          calories: filters.calories || template.nutrition.calories,
          protein: filters.proteinGoals || template.nutrition.protein,
          carbs: template.nutrition.carbs,
          fats: template.nutrition.fats
        },
        duration: filters.timeAvailable || template.duration
      };
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are a professional chef AI. Generate a single highly detailed custom recipe as JSON.
            The JSON must match this structure exactly: { "title": string, "description": string, "difficulty": "Easy"|"Medium"|"Hard", "duration": number, "tags": string[], "ingredients": string[], "steps": string[], "nutrition": { "calories": number, "protein": number, "carbs": number, "fats": number }, "platingSuggestions": string, "estimatedCost": string }`
          },
          {
            role: 'user',
            content: `Generate a recipe matching: Cuisine: ${filters.cuisine || 'Any'}, Max Calories: ${filters.calories || 'Any'}, Budget: ${filters.budget || 'Any'}, Vegetarian: ${filters.isVegetarian ? 'Yes' : 'No'}, Min Protein: ${filters.proteinGoals || 'Any'}g, Max Time: ${filters.timeAvailable || 'Any'} mins, Meal Type: ${filters.mealType || 'Any'}.`
          }
        ]
      });

      const text = response.choices[0].message?.content || '{}';
      return JSON.parse(text);
    } catch (error) {
      console.error('OpenAI generateCustomRecipe Error, using fallback:', error);
      return mockRecipesDb[0];
    }
  }

  /**
   * Chat assistant for culinary queries
   */
  static async askAssistant(question: string, history: { role: 'user' | 'assistant'; content: string }[]): Promise<string> {
    if (!openai) {
      // Smart rules for fallback responses
      const q = question.toLowerCase();
      if (q.includes('replace egg') || q.includes('egg substitute')) {
        return "You can replace eggs in baking using: 1/4 cup unsweetened applesauce, 1/2 mashed banana, 1 tablespoon ground flaxseed mixed with 3 tablespoons water (flax egg), or 1/4 cup yogurt/buttermilk. For savory dishes, silken tofu works wonders!";
      }
      if (q.includes('pasta creamier')) {
        return "To make pasta creamier without excess fat: 1) Save your starchy pasta cooking water! Emulsify it with parmesan cheese and butter. 2) Blend silken tofu or soaked cashews into your sauce. 3) Temper egg yolks into warm cream before folding in (Carbonara style).";
      }
      if (q.includes('biryani')) {
        return "Excellent side dishes for Biryani include: 1) Cucumber or Mint Raita (cools down the spices), 2) Mirchi Ka Salan (a rich peanut and chili curry), 3) Sliced red onions soaked in lemon juice, or 4) Double Ka Meetha (sweet bread pudding) as dessert!";
      }
      return `Chef AI Bot: That's a great culinary question! To best prepare that, make sure to control your heat, season with salt at every stage, and balance your acidity with fresh lemon or vinegar. (Note: Live OpenAI integration will process this dynamically!)`;
    }

    try {
      const messages = [
        {
          role: 'system' as const,
          content: 'You are Skill Chef\'s helpful, charismatic AI Assistant. Answer any food, ingredients, substitutions, plating, or kitchen science queries. Keep it punchy and clear.'
        },
        ...history,
        { role: 'user' as const, content: question }
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages
      });

      return response.choices[0].message?.content || 'Chef Bot: I am having a kitchen malfunction. Please try again!';
    } catch (error) {
      console.error('OpenAI askAssistant Error:', error);
      return 'Chef Bot: I got disconnected from the pantry. Please try again soon!';
    }
  }

  /**
   * Auto-calculates nutrition from an ingredient list
   */
  static async calculateNutrition(ingredients: string[]): Promise<any> {
    if (!openai) {
      // Fallback calculation based on length and mock values
      const count = ingredients.length;
      return {
        calories: count * 95 + 80,
        protein: Math.max(3, Math.floor(count * 2.8)),
        carbs: Math.max(10, Math.floor(count * 8.5)),
        fats: Math.max(2, Math.floor(count * 3.2))
      };
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are an AI nutritionist. Take the ingredients list and estimate total macronutrients.
            Return a JSON object exactly like: { "calories": number, "protein": number, "carbs": number, "fats": number }`
          },
          {
            role: 'user',
            content: `Estimate nutrition for these ingredients: ${ingredients.join(', ')}`
          }
        ]
      });

      const text = response.choices[0].message?.content || '{}';
      return JSON.parse(text);
    } catch (error) {
      console.error('OpenAI calculateNutrition Error:', error);
      return { calories: 350, protein: 12, carbs: 45, fats: 12 };
    }
  }

  /**
   * Generate weekly meal planner
   */
  static async generateMealPlan(preferences: {
    userId: string;
    dietType?: string;
    calorieTarget?: number;
    daysCount?: number;
  }): Promise<any> {
    if (!openai) {
      // Build a standard mock 7-day meal plan
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const plan = days.map(day => ({
        day,
        meals: [
          { type: 'breakfast', customRecipeName: 'Fruit Smoothie Bowl & Honey Oats', calories: 350 },
          { type: 'lunch', customRecipeName: 'Zesty Garlic Broccoli Salad & Chicken', calories: 520 },
          { type: 'dinner', customRecipeName: 'Creamy Garlic Parmesan Pasta', calories: 650 },
          { type: 'snack', customRecipeName: 'Almonds & Dark Chocolate Squares', calories: 180 }
        ]
      }));

      const groceryList = [
        'Broccoli',
        'Garlic',
        'Lemon',
        'Pasta',
        'Heavy Cream',
        'Parmesan Cheese',
        'Oats',
        'Bananas',
        'Mixed Berries',
        'Almonds',
        'Dark Chocolate'
      ];

      return { plan, groceryList };
    }

    try {
      const daysStr = preferences.daysCount === 3 ? '3 days' : '7 days (Monday to Sunday)';
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are an AI meal planner. Build a weekly meal plan schedule.
            Return a JSON object exactly like: { "plan": [ { "day": string, "meals": [ { "type": "breakfast"|"lunch"|"dinner"|"snack", "customRecipeName": string, "calories": number } ] } ], "groceryList": string[] }`
          },
          {
            role: 'user',
            content: `Build a ${daysStr} meal plan for a user targeting a ${preferences.dietType || 'balanced'} diet and around ${preferences.calorieTarget || 2000} calories a day.`
          }
        ]
      });

      const text = response.choices[0].message?.content || '{}';
      return JSON.parse(text);
    } catch (error) {
      console.error('OpenAI generateMealPlan Error:', error);
      return { plan: [], groceryList: [] };
    }
  }
}
