import { Router, Response } from 'express';
import { Like } from '../models/social.model';
import { User } from '../models/user.model';
import { authenticateJWT, AuthenticatedRequest } from '../middlewares/auth';
import { CloudinaryService } from '../services/cloudinaryService';

const router = Router();

// Mock static reels DB for starter feeds
const mockReels = [
  {
    id: 'reel_1',
    title: 'The Perfect Fluffy Pancake Flipping Technique!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-kitchen-chef-preparing-a-salad-41716-large.mp4',
    chef: {
      name: 'Gordon Ramsay Bot',
      avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    },
    likesCount: 1540,
    commentsCount: 220,
    recipeId: 'mock-pancake-recipe-id'
  },
  {
    id: 'reel_2',
    title: 'Spicy Garlic Broccoli Stir-Fry in under 5 minutes!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-sauce-on-a-meal-41723-large.mp4',
    chef: {
      name: 'Chef Alice',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: false
    },
    likesCount: 880,
    commentsCount: 120,
    recipeId: 'mock-broccoli-recipe-id'
  },
  {
    id: 'reel_3',
    title: 'How to make a decadent molten chocolate lava cake!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-chopping-vegetables-in-a-kitchen-41718-large.mp4',
    chef: {
      name: 'Bake Master Ben',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    },
    likesCount: 3200,
    commentsCount: 540,
    recipeId: 'mock-lava-cake-id'
  }
];

// LIST REELS
router.get('/', async (req, res) => {
  res.json(mockReels);
});

// UPLOAD REEL
router.post('/', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    const { title, videoBase64, recipeId } = req.body;

    if (!title || !videoBase64) {
      return res.status(400).json({ error: 'Title and video data are required' });
    }

    // Call Cloudinary
    const videoUrl = await CloudinaryService.uploadVideo(videoBase64);

    const user = await User.findById(userId);

    const newReel = {
      id: `reel_${Math.random().toString(36).substring(7)}`,
      title,
      videoUrl,
      chef: {
        name: user?.name || 'Chef',
        avatarUrl: user?.avatarUrl || '',
        isVerified: user?.isVerified || false
      },
      likesCount: 0,
      commentsCount: 0,
      recipeId: recipeId || ''
    };

    // Award XP for creating content
    if (user) {
      user.xp += 50;
      user.level = Math.floor(user.xp / 500) + 1;
      await user.save();
    }

    res.status(201).json(newReel);
  } catch (err) {
    next(err);
  }
});

// LIKE REEL
router.post('/:id/like', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    const reelId = req.params.id;

    const existingLike = await Like.findOne({ videoId: reelId, userId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      res.json({ liked: false });
    } else {
      const newLike = new Like({ videoId: reelId, userId });
      await newLike.save();
      res.json({ liked: true });
    }
  } catch (err) {
    next(err);
  }
});

export default router;
