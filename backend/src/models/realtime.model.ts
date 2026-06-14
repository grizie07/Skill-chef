import { Schema, model, Document } from 'mongoose';

// Message Model
export interface IMessage extends Document {
  senderId: Schema.Types.ObjectId | string;
  receiverId: Schema.Types.ObjectId | string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Message = model<IMessage>('Message', MessageSchema);

// Notification Model
export interface INotification extends Document {
  receiverId: Schema.Types.ObjectId | string;
  senderId?: Schema.Types.ObjectId | string;
  type: 'like' | 'comment' | 'follow' | 'save' | 'challenge' | 'mention';
  message: string;
  targetId?: string; // Recipe ID, Video ID, etc.
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    type: {
      type: String,
      enum: ['like', 'comment', 'follow', 'save', 'challenge', 'mention'],
      required: true
    },
    message: { type: String, required: true },
    targetId: { type: String },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Notification = model<INotification>('Notification', NotificationSchema);
