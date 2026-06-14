import { Schema, model, Document } from 'mongoose';

// Challenge Model
export interface IChallenge extends Document {
  title: string;
  description: string;
  xpReward: number;
  type: 'daily' | 'weekly';
  targetCategory?: string; // e.g. "Breakfast"
  targetDifficulty?: string; // e.g. "Hard"
  durationDays: number;
  active: boolean;
  createdAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    xpReward: { type: Number, default: 100 },
    type: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
    targetCategory: { type: String },
    targetDifficulty: { type: String },
    durationDays: { type: Number, default: 1 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Challenge = model<IChallenge>('Challenge', ChallengeSchema);

// UserChallengeProgress Model (tracks which users completed/are doing which challenge)
export interface IUserChallengeProgress extends Document {
  userId: Schema.Types.ObjectId | string;
  challengeId: Schema.Types.ObjectId | string;
  status: 'started' | 'completed';
  completedAt?: Date;
}

const UserChallengeProgressSchema = new Schema<IUserChallengeProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
    status: { type: String, enum: ['started', 'completed'], default: 'started' },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

UserChallengeProgressSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

export const UserChallengeProgress = model<IUserChallengeProgress>(
  'UserChallengeProgress',
  UserChallengeProgressSchema
);
