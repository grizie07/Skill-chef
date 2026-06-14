import { Router } from 'express';
import authRoutes from './auth.routes';
import recipeRoutes from './recipe.routes';
import userRoutes from './user.routes';
import aiRoutes from './ai.routes';
import chatRoutes from './chat.routes';
import gamificationRoutes from './gamification.routes';
import paymentRoutes from './payments.routes';
import adminRoutes from './admin.routes';
import reelsRoutes from './reels.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/recipes', recipeRoutes);
router.use('/users', userRoutes);
router.use('/ai', aiRoutes);
router.use('/chat', chatRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);
router.use('/reels', reelsRoutes);

export default router;
