import { Schema, model, models, type Model, type Types } from "mongoose";

// ---- Rate-limit counters (fixed window, TTL cleaned) ----
const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});
export const RateLimit = (models.RateLimit as Model<{ key: string; count: number; expiresAt: Date }>) || model("RateLimit", rateLimitSchema);

// ---- Password reset tokens (only the SHA-256 hash is stored) ----
const resetSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});
export const PasswordResetToken =
  (models.PasswordResetToken as Model<{ userId: Types.ObjectId; tokenHash: string; expiresAt: Date }>) || model("PasswordResetToken", resetSchema);

// ---- Analytics events (fire-and-forget, 180 day TTL) ----
const analyticsSchema = new Schema({
  name: { type: String, required: true, index: true },
  userId: { type: Schema.Types.ObjectId },
  props: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: () => new Date(), index: { expireAfterSeconds: 60 * 60 * 24 * 180 } },
});
export const AnalyticsEvent =
  (models.AnalyticsEvent as Model<{ name: string; userId?: unknown; props?: unknown; createdAt: Date }>) || model("AnalyticsEvent", analyticsSchema);

// ---- Contact form submissions ----
const contactSchema = new Schema(
  {
    name: String,
    email: String,
    subject: String,
    message: String,
    ip: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
export const ContactMessage =
  (models.ContactMessage as Model<{ name: string; email: string; subject: string; message: string; ip: string }>) || model("ContactMessage", contactSchema);
