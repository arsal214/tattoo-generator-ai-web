import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

const paymentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    /** Plan key ("creator" | "pro"), snapshot at purchase time. */
    planId: { type: String, required: true },
    /** Minor units (cents). Always set server-side from the Plan, never from the client. */
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "usd" },
    creditsToGrant: { type: Number, required: true },
    provider: { type: String, required: true },
    providerTransactionId: { type: String },
    status: { type: String, enum: ["pending", "succeeded", "failed", "canceled"], default: "pending", required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

paymentSchema.index({ provider: 1, providerTransactionId: 1 }, { unique: true, partialFilterExpression: { providerTransactionId: { $type: "string" } } });
paymentSchema.index({ userId: 1, createdAt: -1 });

export type PaymentDoc = InferSchemaType<typeof paymentSchema> & { _id: Types.ObjectId; createdAt: Date };
export const Payment = (models.Payment as Model<PaymentDoc>) || model<PaymentDoc>("Payment", paymentSchema);
