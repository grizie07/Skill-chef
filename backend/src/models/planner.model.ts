import { Schema, model, Document } from 'mongoose';

export interface IMealPlan extends Document {
  userId: Schema.Types.ObjectId | string;
  startDate: Date;
  endDate: Date;
  plan: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    meals: {
      type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
      recipeId?: Schema.Types.ObjectId | string;
      customRecipeName?: string;
      calories?: number;
    }[];
  }[];
  groceryList: string[];
  createdAt: Date;
}

const MealPlanSchema = new Schema<IMealPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    plan: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          required: true
        },
        meals: [
          {
            type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
            recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe' },
            customRecipeName: { type: String },
            calories: { type: Number, default: 0 }
          }
        ]
      }
    ],
    groceryList: [{ type: String }]
  },
  { timestamps: true }
);

export const MealPlan = model<IMealPlan>('MealPlan', MealPlanSchema);
