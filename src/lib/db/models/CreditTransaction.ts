import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";

/** Append-only credit ledger. The unique (type, referenceId) index is the idempotency gate for every credit mutation. */
const creditTransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["signup_bonus", "generation", "refund", "purchase", "admin_adjustment"], required: true },
    amount: { type: Number, required: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    referenceId: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

creditTransactionSchema.index({ type: 1, referenceId: 1 }, { unique: true });
creditTransactionSchema.index({ userId: 1, createdAt: -1 });

export type CreditTransactionDoc = InferSchemaType<typeof creditTransactionSchema> & { _id: Types.ObjectId; createdAt: Date };
export const CreditTransaction =
  (models.CreditTransaction as Model<CreditTransactionDoc>) || model<CreditTransactionDoc>("CreditTransaction", creditTransactionSchema);
