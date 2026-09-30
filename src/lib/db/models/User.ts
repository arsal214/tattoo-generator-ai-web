import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    // Null for social-login users, so Google sign-in can be added without changing this model.
    passwordHash: { type: String, select: false },
    avatar: { type: String },
    credits: { type: Number, required: true, default: 0, min: 0 },
    plan: { type: String, enum: ["free", "creator", "pro"], default: "free" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    emailVerified: { type: Boolean, default: false },
    /** Bumped on password reset/change; invalidates every existing session cookie. */
    sessionVersion: { type: Number, default: 0 },
    /** e.g. { google: "<sub>" } once social login exists. */
    providers: { type: Map, of: String },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: import("mongoose").Types.ObjectId };
export const User = (models.User as Model<UserDoc>) || model<UserDoc>("User", userSchema);
