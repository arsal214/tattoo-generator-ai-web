import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/** Provider event log. The unique (provider, eventId) index makes webhook delivery idempotent at the event level. */
const transactionSchema = new Schema(
  {
    provider: { type: String, required: true },
    eventId: { type: String, required: true },
    type: { type: String, required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
    outcome: { type: String }, // "fulfilled" | "ignored" | "rejected"
    receivedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false },
);

transactionSchema.index({ provider: 1, eventId: 1 }, { unique: true });

export type TransactionDoc = InferSchemaType<typeof transactionSchema>;
export const Transaction = (models.Transaction as Model<TransactionDoc>) || model<TransactionDoc>("Transaction", transactionSchema);
