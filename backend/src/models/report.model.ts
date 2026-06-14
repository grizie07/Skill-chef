import { Schema, model, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId: Schema.Types.ObjectId | string;
  targetId: string; // Recipe ID, Comment ID, or User ID
  targetType: 'recipe' | 'comment' | 'user';
  reason: string;
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetId: { type: String, required: true, index: true },
    targetType: { type: String, enum: ['recipe', 'comment', 'user'], required: true },
    reason: { type: String, required: true },
    details: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' }
  },
  { timestamps: true }
);

export const Report = model<IReport>('Report', ReportSchema);
