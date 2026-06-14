import { Schema, model, Document } from 'mongoose';

export interface IRecipe extends Document {
  title: string;
  description: string;
  chefId: Schema.Types.ObjectId | string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number; // minutes
  tags: string[];
  steps: string[];
  ingredients: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  imageUrl?: string;
  videoUrl?: string;
  status: 'draft' | 'published';
  isPremium: boolean;
  price: number; // in USD or cents (for monetization checkout)
  averageRating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    chefId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, default: 'General' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    duration: { type: Number, default: 30 },
    tags: [{ type: String }],
    steps: [{ type: String }],
    ingredients: [{ type: String }],
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 }
    },
    imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80' },
    videoUrl: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    isPremium: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Enable text search on recipe titles, tags, and ingredients for full-text search requirements
RecipeSchema.index({ title: 'text', tags: 'text', ingredients: 'text' });

export const Recipe = model<IRecipe>('Recipe', RecipeSchema);
