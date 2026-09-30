import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const generationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    prompt: { type: String, required: true, maxlength: 600 },
    style: { type: String, required: true },
    placement: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    imageUrl: { type: String },
    /** Storage key (not URL) so the provider/base URL can change without a data migration. */
    imageKey: { type: String },
    storageProvider: { type: String, enum: ["local"] },
    imageMeta: { mimeType: String, bytes: Number },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending", required: true },
    creditsUsed: { type: Number, default: 0 },
    refunded: { type: Boolean, default: false },
    generationProvider: { type: String, default: "gemini" },
    model: { type: String },
    errorMessage: { type: String },
    /** Client-supplied key; unique per user so a retried/duplicated request can never charge twice. */
    idempotencyKey: { type: String },
  },
  { timestamps: true },
);

generationSchema.index({ userId: 1, createdAt: -1 });
generationSchema.index({ userId: 1, status: 1, createdAt: -1 });
generationSchema.index({ userId: 1, idempotencyKey: 1 }, { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } });
generationSchema.index({ status: 1, updatedAt: 1 }); // stale-pending sweeper

export type GenerationDoc = InferSchemaType<typeof generationSchema> & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };
export const Generation = (models.Generation as Model<GenerationDoc>) || model<GenerationDoc>("Generation", generationSchema);
