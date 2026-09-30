import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const planSchema = new Schema(
  {
    key: { type: String, required: true, unique: true }, // "free" | "creator" | "pro"
    name: { type: String, required: true },
    /** Whole USD. */
    price: { type: Number, required: true, min: 0 },
    credits: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "usd" },
    features: [String],
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type PlanDoc = InferSchemaType<typeof planSchema>;
export const Plan = (models.Plan as Model<PlanDoc>) || model<PlanDoc>("Plan", planSchema);
