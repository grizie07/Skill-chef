import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/user.model';
import { Recipe } from './models/recipe.model';
import { Challenge } from './models/gamification.model';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillchef';

const chefsData = [
  {
    _id: new mongoose.Types.ObjectId('6c10e8a1-49fc-4c97-a5e4-7f958d1fe60c'), // mock chef Ramsay AI ID
    name: 'Chef Ramsay AI',
    email: 'cheframsay@skillchef.com',
    avatarUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Gordon Ramsay AI bot. I will critique your cooking, teach you the ultimate techniques, and help you level up! Ask me anything.',
    xp: 9999,
    level: 20,
    dailyStreak: 30,
    badges: [{ id: 'master_chef', name: 'Master Chef', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png' }],
    isChef: true,
    isVerified: true,
    role: 'user'
  },
  {
    _id: new mongoose.Types.ObjectId('75617221-4721-4caa-b1b5-63c2d855986f'), // mock chef Alice ID
    name: 'Chef Alice',
    email: 'chefalice@skillchef.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    bio: 'Specialist in healthy eating and modern Gen-Z diet creations.',
    xp: 5000,
    level: 11,
    dailyStreak: 12,
    badges: [{ id: 'healthy_cook', name: 'Healthy Cook', badgeUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }],
    isChef: true,
    isVerified: true,
    role: 'user'
  }
];

const recipesData = [
  {
    title: 'Chocolate Lava Cake',
    description: 'A decadent molten chocolate lava cake that oozes cocoa goodness when cut open. A staple dessert.',
    chefId: new mongoose.Types.ObjectId('6c10e8a1-49fc-4c97-a5e4-7f958d1fe60c'),
    category: 'Dessert',
    difficulty: 'Medium',
    duration: 15,
    tags: ['chocolate', 'dessert', 'sweet', 'baked'],
    ingredients: ['Dark Chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour'],
    steps: [
      'Preheat oven to 400°F (200°C) and grease ramekins.',
      'Melt dark chocolate and butter together until smooth.',
      'Whisk eggs and sugar in a separate bowl until thick, then fold in melted chocolate.',
      'Sift in flour gently. Pour into ramekins and bake for 12 minutes until edges are firm but center is jiggly.',
      'Invert onto plate, dust with powdered sugar, and serve immediately.'
    ],
    nutrition: { calories: 450, protein: 6, carbs: 42, fats: 28 },
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isPremium: false,
    averageRating: 4.8,
    reviewsCount: 142
  },
  {
    title: 'Classic Masala Dosa',
    description: 'Crisp crepe made of fermented rice-lentil batter filled with dry spiced potato curry. Served with coconut chutney.',
    chefId: new mongoose.Types.ObjectId('75617221-4721-4caa-b1b5-63c2d855986f'),
    category: 'Breakfast',
    difficulty: 'Hard',
    duration: 45,
    tags: ['spicy', 'south indian', 'vegan', 'breakfast'],
    ingredients: ['Rice', 'Urad Dal', 'Potato', 'Onion', 'Mustard Seeds', 'Turmeric', 'Green Chilies'],
    steps: [
      'Soak and grind rice and dal, ferment batter overnight.',
      'Boil potatoes. Sauté mustard seeds, curry leaves, onions, green chilies, and turmeric. Mix in potatoes.',
      'Spread thin batter on hot tawa, drizzle oil, cook until golden crisp.',
      'Place potato filling in center, fold, and serve hot.'
    ],
    nutrition: { calories: 350, protein: 8, carbs: 65, fats: 9 },
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isPremium: false,
    averageRating: 4.6,
    reviewsCount: 98
  },
  {
    title: 'Chef Ramsay Signature Beef Wellington',
    description: 'Tender beef fillet wrapped in rich puff pastry with mushroom duxelles and prosciutto. True Master Class recipe.',
    chefId: new mongoose.Types.ObjectId('6c10e8a1-49fc-4c97-a5e4-7f958d1fe60c'),
    category: 'Italian',
    difficulty: 'Hard',
    duration: 90,
    tags: ['signature', 'beef', 'puff pastry', 'premium', 'chef ramsey'],
    ingredients: ['Beef Tenderloin', 'Puff Pastry', 'Mushroom Duxelles', 'Prosciutto', 'English Mustard', 'Egg Wash'],
    steps: [
      'Sear beef tenderloin on all sides, brush with English mustard.',
      'Sauté mushrooms, garlic, and thyme until dry to make duxelles.',
      'Layer prosciutto on clingfilm, spread duxelles, wrap beef tightly. Chill for 20 mins.',
      'Roll out puff pastry, wrap beef roll, score pastry, brush with egg wash, and bake at 400°F for 30 minutes.'
    ],
    nutrition: { calories: 850, protein: 55, carbs: 30, fats: 58 },
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    status: 'published',
    isPremium: true,
    price: 9.99,
    averageRating: 4.9,
    reviewsCount: 320
  }
];

const challengesData = [
  {
    title: 'The Pancake Flip Challenge',
    description: 'Post a recipe or upload a video flipping a pancake. Awarded upon cooking completion.',
    xpReward: 100,
    type: 'daily',
    targetCategory: 'Breakfast',
    durationDays: 1,
    active: true
  },
  {
    title: 'Italian Master Chef Week',
    description: 'Cook three Italian recipes within seven days to claim this master badge.',
    xpReward: 350,
    type: 'weekly',
    targetCategory: 'Italian',
    durationDays: 7,
    active: true
  }
];

const seedDB = async () => {
  try {
    console.log('Seeding connection to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected. Clearing collection databases...');

    // Clear existing
    await User.deleteMany({ email: { $in: ['cheframsay@skillchef.com', 'chefalice@skillchef.com'] } });
    await Recipe.deleteMany({ title: { $in: ['Chocolate Lava Cake', 'Classic Masala Dosa', 'Chef Ramsay Signature Beef Wellington'] } });
    await Challenge.deleteMany({});

    // Seed User Chefs
    console.log('Seeding user chefs...');
    const chefs = await User.insertMany(chefsData);
    console.log(`Seeded ${chefs.length} chefs.`);

    // Seed Recipes
    console.log('Seeding recipes...');
    const recipes = await Recipe.insertMany(recipesData);
    console.log(`Seeded ${recipes.length} recipes.`);

    // Seed Challenges
    console.log('Seeding challenges...');
    const challenges = await Challenge.insertMany(challengesData);
    console.log(`Seeded ${challenges.length} challenges.`);

    console.log('Database seeding successfully finished!');
    process.exit(0);
  } catch (err: any) {
    console.error('Seeding Error:', err.message);
    process.exit(1);
  }
};

seedDB();
