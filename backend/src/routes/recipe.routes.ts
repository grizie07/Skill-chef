import { Router, Response } from 'express';
import { Recipe } from '../models/recipe.model';
import { Comment, Like } from '../models/social.model';
import { User } from '../models/user.model';
import { authenticateJWT, AuthenticatedRequest } from '../middlewares/auth';
import { SocketService } from '../services/socketService';

const router = Router();

// LIST RECIPES & ADVANCED SEARCH/FILTER
router.get('/', async (req, res, next) => {
  try {
    const { q, category, difficulty, tag, isPremium } = req.query;
    const filter: any = { status: 'published' };

    // Search query
    if (q) {
      filter.$text = { $search: q as string };
    }

    // Filters
    if (category) {
      filter.category = category as string;
    }
    if (difficulty) {
      filter.difficulty = difficulty as string;
    }
    if (tag) {
      filter.tags = tag as string;
    }
    if (isPremium !== undefined) {
      filter.isPremium = isPremium === 'true';
    }

    const recipes = await Recipe.find(filter)
      .populate('chefId', 'name avatarUrl isVerified')
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

// TRENDING RECIPES
router.get('/trending', async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ status: 'published' })
      .populate('chefId', 'name avatarUrl isVerified')
      .sort({ averageRating: -1, reviewsCount: -1 })
      .limit(10);
    res.json(recipes);
  } catch (err) {
    next(err);
  }
});

// GET SINGLE RECIPE
router.get('/:id', async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('chefId', 'name avatarUrl bio isVerified badges');
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// CREATE RECIPE
router.post('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const chefId = req.user?.id;
    const recipeData = req.body;

    const newRecipe = new Recipe({
      ...recipeData,
      chefId
    });

    await newRecipe.save();

    // Award XP to user for creating a recipe
    const user = await User.findById(chefId);
    if (user) {
      user.xp += 100; // 100 XP for posting a recipe!
      user.level = Math.floor(user.xp / 500) + 1; // simple level formula
      await user.save();
    }

    res.status(201).json(newRecipe);
  } catch (err) {
    next(err);
  }
});

// UPDATE RECIPE
router.put('/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Verify ownership
    if (recipe.chefId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to edit this recipe' });
    }

    Object.assign(recipe, req.body);
    await recipe.save();

    res.json(recipe);
  } catch (err) {
    next(err);
  }
});

// DELETE RECIPE
router.delete('/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    if (recipe.chefId.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this recipe' });
    }

    await Recipe.deleteOne({ _id: req.params.id });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET COMMENTS
router.get('/:id/comments', async (req, res, next) => {
  try {
    const comments = await Comment.find({ recipeId: req.params.id })
      .populate('userId', 'name avatarUrl')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

// CREATE COMMENT
router.post('/:id/comment', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    const { content, parentId } = req.body;
    const recipeId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const newComment = new Comment({
      recipeId,
      userId,
      userName: user.name,
      userAvatar: user.avatarUrl,
      content,
      parentId: parentId || null
    });

    await newComment.save();

    // Notify room of new comment
    SocketService.broadcastComment(recipeId, newComment);

    // Award minor XP for engaging
    user.xp += 10;
    user.level = Math.floor(user.xp / 500) + 1;
    await user.save();

    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
});

// TOGGLE LIKE
router.post('/:id/like', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    const recipeId = req.params.id;

    const existingLike = await Like.findOne({ recipeId, userId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      res.json({ liked: false });
    } else {
      const newLike = new Like({ recipeId, userId });
      await newLike.save();

      // Award XP to liker
      const user = await User.findById(userId);
      if (user) {
        user.xp += 5;
        user.level = Math.floor(user.xp / 500) + 1;
        await user.save();
      }

      res.json({ liked: true });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
