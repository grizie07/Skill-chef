import { Router } from 'express';
import { authenticateJWT, AuthenticatedRequest } from '../middlewares/auth';
import { User } from '../models/user.model';

const router = Router();

// STRIPE CHECKOUT SESSION SIMULATION
router.post('/checkout/stripe', authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const { recipeId, price } = req.body;

    if (!recipeId || !price) {
      return res.status(400).json({ error: 'Recipe ID and Price are required' });
    }

    // In a live system:
    // const session = await stripe.checkout.sessions.create({ ... })
    // For now, simulate session URL redirect
    const sessionUrl = `https://checkout.stripe.com/pay/cs_test_mock_session_for_recipe_${recipeId}_user_${userId}`;

    res.json({
      url: sessionUrl,
      sessionId: `cs_test_${Math.random().toString(36).substring(7)}`
    });
  } catch (err) {
    next(err);
  }
});

// RAZORPAY ORDER SIMULATION
router.post('/checkout/razorpay', authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { price } = req.body;
    if (!price) {
      return res.status(400).json({ error: 'Price is required' });
    }

    // In a live system:
    // const order = await razorpay.orders.create({ amount: price * 100, currency: "USD", ... })
    // Simulate Razorpay order structure
    res.json({
      id: `order_${Math.random().toString(36).substring(7)}`,
      entity: 'order',
      amount: price * 100, // in cents/paise
      currency: 'USD',
      status: 'created'
    });
  } catch (err) {
    next(err);
  }
});

// PAYMENT SUCCESS STATUS (CRITICAL FOR XP REWARDS & MONETIZATION SUCCESS)
router.post('/success', authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const { recipeId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Grant user purchase items (e.g. add recipe to unlocked list or grant premium badges)
    user.xp += 150; // High XP reward for cooking purchase/support!
    user.level = Math.floor(user.xp / 500) + 1;
    
    // Add "Supporter" badge if not present
    if (!user.badges.some(b => b.id === 'supporter')) {
      user.badges.push({
        id: 'supporter',
        name: 'Supporter',
        badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png',
        awardedAt: new Date()
      });
    }

    await user.save();

    res.json({
      success: true,
      message: 'Payment processed successfully, rewards unlocked!',
      user: {
        xp: user.xp,
        level: user.level,
        badges: user.badges
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
