import { Router, Response } from 'express';
import { User } from '../models/user.model';
import { Recipe } from '../models/recipe.model';
import { Report } from '../models/report.model';
import { authenticateJWT, requireAdmin, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();

// GET PLATFORM ANALYTICS (ADMIN ONLY)
router.get('/analytics', authenticateJWT, requireAdmin, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalChefs = await User.countDocuments({ isChef: true });
    const totalReports = await Report.countDocuments({ status: 'pending' });

    // Mock usage data curves for charts
    const monthlyRegistrations = [40, 80, 120, 200, 310, 450, 600];
    const aiUsageTracking = {
      ingredientGen: 1540,
      recipeGen: 980,
      chatbotQueries: 4200,
      mealPlansCreated: 750
    };
    const revenueStats = {
      totalRevenueUSD: 1450,
      premiumUsers: 145,
      recipeSalesCount: 88
    };

    res.json({
      summary: {
        totalUsers,
        totalRecipes,
        totalChefs,
        totalReports
      },
      monthlyRegistrations,
      aiUsageTracking,
      revenueStats
    });
  } catch (err) {
    next(err);
  }
});

// LIST ALL PENDING MODERATION REPORTS
router.get('/reports', authenticateJWT, requireAdmin, async (req, res, next) => {
  try {
    const reports = await Report.find({})
      .populate('reporterId', 'name email')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    next(err);
  }
});

// SUBMIT CONTENT REPORT (PUBLIC/USER ACTION)
router.post('/reports', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const reporterId = req.user?.id;
    const { targetId, targetType, reason, details } = req.body;

    if (!targetId || !targetType || !reason) {
      return res.status(400).json({ error: 'Target details and reason are required' });
    }

    const report = new Report({
      reporterId,
      targetId,
      targetType,
      reason,
      details: details || ''
    });

    await report.save();
    res.status(201).json({ message: 'Content report submitted successfully', report });
  } catch (err) {
    next(err);
  }
});

// RESOLVE REPORT (ADMIN ACTION)
router.put('/reports/:id/resolve', authenticateJWT, requireAdmin, async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    report.status = req.body.action === 'dismiss' ? 'dismissed' : 'resolved';
    await report.save();

    res.json({ message: `Report status updated to ${report.status}`, report });
  } catch (err) {
    next(err);
  }
});

// LIST USERS (FOR ADMIN CONTROL PANEL)
router.get('/users', authenticateJWT, requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// CHANGE USER VERIFICATION / ROLE
router.put('/users/:id/role', authenticateJWT, requireAdmin, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { role, isChef, isVerified } = req.body;
    if (role) user.role = role;
    if (isChef !== undefined) user.isChef = isChef;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();
    res.json({ message: 'User settings updated successfully', user });
  } catch (err) {
    next(err);
  }
});

export default router;
