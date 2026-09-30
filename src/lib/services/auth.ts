import "server-only";
import { createHash, randomBytes } from "node:crypto";
import type { Types } from "mongoose";
import { z } from "zod";
import { AppError, err } from "../errors";
import { atomically, isDuplicateKey } from "../db/tx";
import { User } from "../db/models/User";
import { CreditTransaction } from "../db/models/CreditTransaction";
import { PasswordResetToken } from "../db/models/Misc";
import { dummyHash, hashPassword, verifyPassword } from "../auth/session";
import { SIGNUP_CREDITS } from "../config/generation";
import { enforce } from "../rate-limit";
import { sendEmail } from "./email";
import { absoluteUrl } from "../site";

const email = z.string().trim().toLowerCase().pipe(z.email("Please enter a valid email address."));
// bcrypt only uses the first 72 bytes, so cap there.
const password = z.string().min(8, "Password must be at least 8 characters.").max(72, "Password must be at most 72 characters.");

export const registerSchema = z.object({ name: z.string().trim().min(1, "Please enter your name.").max(80), email, password });
export const loginSchema = z.object({ email, password: z.string().min(1, "Please enter your password.").max(72) });
export const forgotSchema = z.object({ email });
export const resetSchema = z.object({ token: z.string().length(64), password });
export const profileSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  currentPassword: z.string().max(72).optional(),
  newPassword: password.optional(),
});

/**
 * Creates the account and grants the 20 signup credits exactly once: the user's unique email index
 * guarantees one account per email, and the ledger's unique (signup_bonus, userId) key backs it up.
 */
export async function registerUser(input: z.infer<typeof registerSchema>) {
  const passwordHash = await hashPassword(input.password);
  try {
    return await atomically(async (session) => {
      const [user] = await User.create([{ name: input.name, email: input.email, passwordHash, credits: SIGNUP_CREDITS }], { session });
      await CreditTransaction.create(
        [{ userId: user._id, type: "signup_bonus", amount: SIGNUP_CREDITS, balanceBefore: 0, balanceAfter: SIGNUP_CREDITS, referenceId: String(user._id), description: "Free signup credits" }],
        { session },
      );
      return user.toObject();
    });
  } catch (e) {
    if (isDuplicateKey(e)) throw err.conflict("An account with that email already exists. Try logging in.");
    throw e;
  }
}

export async function authenticate(input: z.infer<typeof loginSchema>) {
  await enforce({ name: "login-email", max: 10, windowSec: 600, by: "ip" }, input.email);
  const user = await User.findOne({ email: input.email }).select("+passwordHash").lean();
  const ok = await verifyPassword(input.password, user?.passwordHash ?? (await dummyHash()));
  if (!user || !user.passwordHash || !ok) throw new AppError(401, "UNAUTHENTICATED", "Incorrect email or password.");
  return user;
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/** Always resolves the same way whether or not the email exists (no account enumeration). */
export async function startPasswordReset(emailAddr: string) {
  await enforce({ name: "forgot-email", max: 3, windowSec: 3600, by: "ip" }, emailAddr);
  const user = await User.findOne({ email: emailAddr }, { _id: 1, name: 1 }).lean();
  if (!user) return;
  const token = randomBytes(32).toString("hex");
  await PasswordResetToken.deleteMany({ userId: user._id });
  await PasswordResetToken.create({ userId: user._id, tokenHash: sha256(token), expiresAt: new Date(Date.now() + 60 * 60_000) });
  const link = absoluteUrl(`/reset-password?token=${token}`);
  await sendEmail({
    to: emailAddr,
    subject: "Reset your TattooGenerator password",
    text: `Hi ${user.name},\n\nUse this link to choose a new password (valid for 1 hour):\n${link}\n\nIf you didn't ask for this, you can ignore this email.`,
    html: `<p>Hi ${escapeHtml(user.name)},</p><p><a href="${link}">Choose a new password</a> (valid for 1 hour).</p><p>If you didn't ask for this, you can ignore this email.</p>`,
  });
}

export async function completePasswordReset(token: string, newPassword: string) {
  // findOneAndDelete makes the token single-use even under concurrent requests.
  const t = await PasswordResetToken.findOneAndDelete({ tokenHash: sha256(token) }).lean();
  if (!t || t.expiresAt < new Date()) throw err.validation("This reset link is invalid or has expired. Please request a new one.");
  const passwordHash = await hashPassword(newPassword);
  await User.updateOne({ _id: t.userId }, { passwordHash, $inc: { sessionVersion: 1 } }); // signs out every device
}

export async function updateProfile(userId: Types.ObjectId, input: z.infer<typeof profileSchema>) {
  const update: Record<string, unknown> = {};
  if (input.name) update.name = input.name;
  let bumpSession = false;
  if (input.newPassword) {
    const u = await User.findById(userId).select("+passwordHash").lean();
    if (!u?.passwordHash || !input.currentPassword || !(await verifyPassword(input.currentPassword, u.passwordHash))) {
      throw err.validation("Your current password is incorrect.");
    }
    update.passwordHash = await hashPassword(input.newPassword);
    bumpSession = true;
  }
  const doc = await User.findByIdAndUpdate(userId, { ...update, ...(bumpSession && { $inc: { sessionVersion: 1 } }) }, { returnDocument: "after" }).lean();
  return { user: doc!, sessionRotated: bumpSession };
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
