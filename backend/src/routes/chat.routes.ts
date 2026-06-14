import { Router, Response } from 'express';
import { Message } from '../models/realtime.model';
import { User } from '../models/user.model';
import { authenticateJWT, AuthenticatedRequest } from '../middlewares/auth';
import { SocketService } from '../services/socketService';

const router = Router();

// GET ALL ACTIVE CHAT THREADS
router.get('/', authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const currentUserId = req.user?.id;

    // Find all messages sent or received by user
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }]
    }).sort({ createdAt: -1 });

    // Extract unique chat partner IDs
    const chatPartnerIds = new Set<string>();
    messages.forEach(msg => {
      const sId = msg.senderId.toString();
      const rId = msg.receiverId.toString();
      if (sId !== currentUserId) chatPartnerIds.add(sId);
      if (rId !== currentUserId) chatPartnerIds.add(rId);
    });

    // Populate user profile info for partners
    const partners = await User.find({ _id: { $in: Array.from(chatPartnerIds) } })
      .select('name avatarUrl isChef isVerified');

    // Attach last message to each thread
    const threads = partners.map(partner => {
      const lastMsg = messages.find(
        msg =>
          (msg.senderId.toString() === partner.id && msg.receiverId.toString() === currentUserId) ||
          (msg.senderId.toString() === currentUserId && msg.receiverId.toString() === partner.id)
      );
      return {
        partner,
        lastMessage: lastMsg?.content || '',
        isRead: lastMsg ? (lastMsg.senderId.toString() === currentUserId ? true : lastMsg.isRead) : true,
        updatedAt: lastMsg?.createdAt || new Date()
      };
    });

    res.json(threads);
  } catch (err) {
    next(err);
  }
});

// GET MESSAGES WITH A SPECIFIC USER
router.get('/:userId', authenticateJWT, async (req: AuthenticatedRequest, res, next) => {
  try {
    const currentUserId = req.user?.id;
    const partnerId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: partnerId },
        { senderId: partnerId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    // Mark messages received from partner as read
    await Message.updateMany(
      { senderId: partnerId, receiverId: currentUserId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// SEND MESSAGE TO USER
router.post('/:userId', authenticateJWT, async (req: AuthenticatedRequest, res: Response, next) => {
  try {
    const currentUserId = req.user?.id;
    const partnerId = req.params.userId;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const newMessage = new Message({
      senderId: currentUserId,
      receiverId: partnerId,
      content,
      isRead: false
    });

    await newMessage.save();

    // Push via Socket Service for real-time delivery
    SocketService.sendDirectMessage(partnerId, newMessage);

    // If chat is with a Chef Bot, trigger smart chef automation reply
    const chefUser = await User.findById(partnerId);
    if (chefUser && chefUser.isChef && chefUser.name.includes('Chef AI')) {
      // Simulate typing status
      setTimeout(() => {
        // Echo typing status
      }, 500);

      // Trigger automatic chef bot reply!
      // In a live system, this connects to GPT. For simulation, call OpenAIService.
      const conversationHistory = messagesToHistory(
        await Message.find({
          $or: [
            { senderId: currentUserId, receiverId: partnerId },
            { senderId: partnerId, receiverId: currentUserId }
          ]
        }).sort({ createdAt: -1 }).limit(10)
      );

      const botReplyContent = await require('../services/openAIService').OpenAIService.askAssistant(
        content,
        conversationHistory
      );

      const botMessage = new Message({
        senderId: partnerId,
        receiverId: currentUserId,
        content: botReplyContent,
        isRead: false
      });

      await botMessage.save();
      // Push bot reply to the user
      SocketService.sendDirectMessage(currentUserId as string, botMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    next(err);
  }
});

// Convert MongoDB messages to OpenAI message history objects
function messagesToHistory(messages: any[]): { role: 'user' | 'assistant'; content: string }[] {
  return messages.reverse().map(m => ({
    role: m.senderId.toString().startsWith('mock-bot-id') ? 'assistant' : 'user',
    content: m.content
  }));
}

export default router;
