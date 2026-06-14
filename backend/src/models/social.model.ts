import { Schema, model, Document } from 'mongoose';

// Comment Model
export interface IComment extends Document {
  recipeId: Schema.Types.ObjectId | string;
  userId: Schema.Types.ObjectId | string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  likedBy: string[]; // userIds
  parentId?: Schema.Types.ObjectId | string; // nested comments
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, required: true },
    userAvatar: { type: String },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }
  },
  { timestamps: true }
);

export const Comment = model<IComment>('Comment', CommentSchema);

// Like Model
export interface ILike extends Document {
  recipeId?: Schema.Types.ObjectId | string;
  videoId?: string; // for vertical Reels
  userId: Schema.Types.ObjectId | string;
}

const LikeSchema = new Schema<ILike>(
  {
    recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', index: true },
    videoId: { type: String, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  },
  { timestamps: true }
);

export const Like = model<ILike>('Like', LikeSchema);

// Follower Model
export interface IFollower extends Document {
  followerId: Schema.Types.ObjectId | string; // user who follows
  followingId: Schema.Types.ObjectId | string; // user being followed
}

const FollowerSchema = new Schema<IFollower>(
  {
    followerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    followingId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }
  },
  { timestamps: true }
);

// Prevent duplicate following
FollowerSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

export const Follower = model<IFollower>('Follower', FollowerSchema);
