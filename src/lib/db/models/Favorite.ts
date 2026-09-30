import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const favoriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    generationId: { type: Schema.Types.ObjectId, ref: "Generation", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

favoriteSchema.index({ userId: 1, generationId: 1 }, { unique: true });
favoriteSchema.index({ userId: 1, createdAt: -1 });

export type FavoriteDoc = InferSchemaType<typeof favoriteSchema>;
export const Favorite = (models.Favorite as Model<FavoriteDoc>) || model<FavoriteDoc>("Favorite", favoriteSchema);
