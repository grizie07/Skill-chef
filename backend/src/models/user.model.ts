import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  bio?: string;
  address?: {
    city?: string;
    zip?: string;
  };
  wishlist: string[]; // recipe IDs
  xp: number;
  level: number;
  dailyStreak: number;
  lastLoginDate?: Date;
  badges: {
    id: string;
    name: string;
    badgeUrl: string;
    awardedAt: Date;
  }[];
  socialLinks?: {
    instagram?: string;
    pinterest?: string;
    twitter?: string;
  };
  isChef: boolean;
  isVerified: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String }, // optional for Google OAuth
    avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80' },
    bio: { type: String, default: '' },
    address: {
      city: { type: String },
      zip: { type: String }
    },
    wishlist: [{ type: Schema.Types.String }], // can store recipe UUIDs/ObjectIds
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    dailyStreak: { type: Number, default: 0 },
    lastLoginDate: { type: Date },
    badges: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        badgeUrl: { type: String, required: true },
        awardedAt: { type: Date, default: Date.now }
      }
    ],
    socialLinks: {
      instagram: { type: String, default: '' },
      pinterest: { type: String, default: '' },
      twitter: { type: String, default: '' }
    },
    isChef: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
