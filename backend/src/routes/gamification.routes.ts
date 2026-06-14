import { Router, Response } from 'express';
import { Challenge, UserChallengeProgress } from '../models/gamification.model';
import { User } from '../models/user.model';
import { authenticateJWT, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// LIST ACTIVE CHALLENGES
router.get('/challenges', async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ active: true });
    res.json(challenges);
  } catch (err) {
    next(err);
  }
});

// GET LEADERBOARD (XP-BASED COMMUNITY RANKINGS)
router.get('/leaderboard', async (req, res, next) => {
  try {
    // Sort users by XP descending
    const users = await User.find({})
      .select('name avatarUrl xp level isChef isVerified')
      .sort({ xp: -1 })
      .limit(20);
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// START A CHALLENGE
router.post('/challenges/:id/start', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    const challengeId = req.params.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const existingProgress = await UserChallengeProgress.findOne({ userId, challengeId });
    if (existingProgress) {
      return res.status(400).json({ error: 'Challenge already started or completed' });
    }

    const progress = new UserChallengeProgress({
      userId,
      challengeId,
      status: 'started'
    });

    await progress.save();
    res.json({ message: 'Challenge started successfully', progress });
  } catch (err) {
    next(err);
  }
});

// COMPLETE A CHALLENGE & CLAIM XP REWARD
router.post('/challenges/:id/complete', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    const challengeId = req.params.id;

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    let progress = await UserChallengeProgress.findOne({ userId, challengeId });
    if (!progress) {
      // Auto start and complete
      progress = new UserChallengeProgress({
        userId,
        challengeId,
        status: 'started'
      });
    }

    if (progress.status === 'completed') {
      return res.status(400).json({ error: 'Challenge already completed' });
    }

    progress.status = 'completed';
    progress.completedAt = new Date();
    await progress.save();

    // Reward XP to user
    const user = await User.findById(userId);
    if (user) {
      user.xp += challenge.xpReward;
      user.level = Math.floor(user.xp / 500) + 1; // Level up checking!
      
      // Auto award badge if they hit milestone Level 5 or XP levels
      if (user.xp >= 1000 && !user.badges.some(b => b.id === 'cooking_pro')) {
        user.badges.push({
          id: 'cooking_pro',
          name: 'Cooking Pro',
          badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135712.png',
          awardedAt: new Date()
        });
      }
      
      await user.save();
    }

    res.json({
      message: 'Challenge completed! XP rewarded.',
      xpAwarded: challenge.xpReward,
      user
    });
  } catch (err) {
    next(err);
  }
});

export default router;
