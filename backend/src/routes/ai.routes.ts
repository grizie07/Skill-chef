import { Router } from 'express';
import { OpenAIService } from '../services/openAIService';
import { authenticateJWT } from '../middlewares/auth';

const router = Router();

// INGREDIENTS TO RECIPE
router.post('/ingredients-recipe', async (req, res, next) => {
  try {
    const { ingredients } = req.body; // array of strings
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients array is required' });
    }

    const recipes = await OpenAIService.suggestRecipesFromIngredients(ingredients);
    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

// AI RECIPE GENERATOR
router.post('/generate-recipe', async (req, res, next) => {
  try {
    const { cuisine, calories, budget, isVegetarian, proteinGoals, timeAvailable, mealType } = req.body;
    const recipe = await OpenAIService.generateCustomRecipe({
      cuisine,
      calories,
      budget,
      isVegetarian,
      proteinGoals,
      timeAvailable,
      mealType
    });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// AI NUTRITION CALCULATOR
router.post('/calculate-nutrition', async (req, res, next) => {
  try {
    const { ingredients } = req.body; // array of strings
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ error: 'Ingredients array is required' });
    }

    const nutrition = await OpenAIService.calculateNutrition(ingredients);
    res.json(nutrition);
  } catch (err) {
    next(err);
  }
});

// AI MEAL PLANNER
router.post('/meal-planner', async (req, res, next) => {
  try {
    const { dietType, calorieTarget, daysCount } = req.body;
    const mealPlan = await OpenAIService.generateMealPlan({
      userId: 'mock-user-id',
      dietType,
      calorieTarget,
      daysCount
    });
    res.json(mealPlan);
  } catch (err) {
    next(err);
  }
});

// CHAT ASSISTANT
router.post('/assistant', async (req, res, next) => {
  try {
    const { question, history } = req.body; // history is array of {role, content}
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const answer = await OpenAIService.askAssistant(question, history || []);
    res.json({ answer });
  } catch (err) {
    next(err);
  }
});

export default router;
