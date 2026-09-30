import type { Types } from "mongoose";
import { atomically, isDuplicateKey } from "../db/tx";
import { CreditTransaction, type CreditTransactionDoc } from "../db/models/CreditTransaction";
import { User } from "../db/models/User";
import { err } from "../errors";

type TxType = CreditTransactionDoc["type"];

interface ApplyInput {
  userId: Types.ObjectId | string;
  /** Positive to grant, negative to spend. */
  amount: number;
  type: TxType;
  /** Unique per (type, referenceId): the idempotency key of this mutation (generation id, payment id…). */
  referenceId: string;
  description?: string;
}

/**
 * The ONLY function that changes a user's credit balance.
 *
 *  1. Insert the ledger row first. Its unique (type, referenceId) index is the gate: a duplicate
 *     request/webhook/refund hits E11000 and becomes a no-op ({ applied: false }).
 *  2. Apply a single conditional atomic $inc. Spending requires `credits >= amount` inside the same
 *     update, so concurrent requests can never overdraw.
 *  3. Fill in balanceBefore/After on the ledger row.
 * Inside a transaction (replica set) any failure rolls all three back; without one, an insufficient
 * balance removes the gate row explicitly. Duplicate-key is handled outside the transaction because
 * MongoDB aborts a transaction on any write error.
 */
export async function applyCredits({ userId, amount, type, referenceId, description }: ApplyInput) {
  try {
    return await atomically(async (session) => {
      const [gate] = await CreditTransaction.create([{ userId, type, amount, referenceId, description, balanceBefore: 0, balanceAfter: 0 }], { session });

      const filter = amount < 0 ? { _id: userId, credits: { $gte: -amount } } : { _id: userId };
      const user = await User.findOneAndUpdate(filter, { $inc: { credits: amount } }, { returnDocument: "after", session, projection: { credits: 1 } }).lean();
      if (!user) {
        if (!session) await CreditTransaction.deleteOne({ _id: gate._id });
        throw amount < 0 ? err.noCredits() : err.notFound("Account not found.");
      }

      await CreditTransaction.updateOne({ _id: gate._id }, { balanceBefore: user.credits - amount, balanceAfter: user.credits }, { session });
      return { applied: true as const, balance: user.credits };
    });
  } catch (e) {
    if (isDuplicateKey(e)) return { applied: false as const, balance: await getBalance(userId) };
    throw e;
  }
}

export async function getBalance(userId: Types.ObjectId | string) {
  const u = await User.findById(userId, { credits: 1 }).lean();
  return u?.credits ?? 0;
}
