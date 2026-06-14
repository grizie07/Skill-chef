import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'skill_chef_super_secret_key_change_me_in_production';

// SIGNUP
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      xp: 50, // Starter XP!
      badges: [{ id: 'fresh_cook', name: 'Fresh Cook', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }]
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatarUrl: newUser.avatarUrl,
        xp: newUser.xp,
        level: newUser.level,
        badges: newUser.badges,
        dailyStreak: newUser.dailyStreak,
        isChef: newUser.isChef,
        role: newUser.role
      }
    });
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if password exists (OAuth users might not have password)
    if (!user.password) {
      return res.status(400).json({ error: 'Login with OAuth instead' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Trigger daily streak check
    const today = new Date();
    const lastLogin = user.lastLoginDate;
    if (lastLogin) {
      const diffTime = Math.abs(today.getTime() - lastLogin.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.dailyStreak += 1;
        user.xp += 10; // 10 XP for daily streak
      } else if (diffDays > 1) {
        user.dailyStreak = 1; // reset streak
      }
    } else {
      user.dailyStreak = 1;
    }
    user.lastLoginDate = today;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
        dailyStreak: user.dailyStreak,
        isChef: user.isChef,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  res.json({ message: `Password reset email sent to ${email} (Simulation)` });
});

// VERIFY EMAIL
router.post('/verify-email', async (req, res) => {
  const { token } = req.body;
  res.json({ message: 'Email verified successfully (Simulation)' });
});

export default router;
