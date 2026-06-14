import { Router, Response } from 'express';
import { User } from '../models/user.model';
import { Follower } from '../models/social.model';
import { Notification } from '../models/realtime.model';
import { authenticateJWT, AuthenticatedRequest } from '../middlewares/auth';
import { SocketService } from '../services/socketService';

const router = Router();

// GET USER PROFILE
router.get('/profile/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followersCount = await Follower.countDocuments({ followingId: req.params.id });
    const followingCount = await Follower.countDocuments({ followerId: req.params.id });

    res.json({
      user,
      followersCount,
      followingCount
    });
  } catch (err) {
    next(err);
  }
});

// TOGGLE FOLLOW
router.post('/follow/:id', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const currentUserId = req.user?.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    const existingFollow = await Follower.findOne({
      followerId: currentUserId,
      followingId: targetUserId
    });

    if (existingFollow) {
      await Follower.deleteOne({ _id: existingFollow._id });
      res.json({ followed: false });
    } else {
      const newFollow = new Follower({
        followerId: currentUserId,
        followingId: targetUserId
      });
      await newFollow.save();

      // Send Realtime Notification
      const followerUser = await User.findById(currentUserId);
      const notification = new Notification({
        receiverId: targetUserId,
        senderId: currentUserId,
        type: 'follow',
        message: `${followerUser?.name || 'Someone'} started following you!`,
        targetId: currentUserId
      });
      await notification.save();

      SocketService.sendNotification(targetUserId, notification);

      res.json({ followed: true });
    }
  } catch (err) {
    next(err);
  }
});

// GET NOTIFICATIONS
router.get('/notifications', authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user?.id;
    const notifications = await Notification.find({ receiverId: userId })
      .populate('senderId', 'name avatarUrl')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
});

// MARK NOTIFICATION AS READ
router.put('/notifications/:id/read', authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    if (notification.receiverId.toString() !== req.user?.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (err) {
    next(err);
  }
});

export default router;
