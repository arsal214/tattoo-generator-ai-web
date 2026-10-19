/**
 * Seeds reference data: plans, blog posts, page content, the admin user (admin@gmail.com / 12345678) and DB indexes.
 *   npm run seed            # upsert plans (keeps admin edits) + blog posts (refreshes content)
 *   npm run seed -- --reset-plans   # also overwrite plan price/credits/features from src/lib/config/plans.ts
 *
 * Styles, placements, tool categories and blog categories live in typed config modules
 * (src/lib/config/*, src/lib/tools/*) shared by the UI, validation and prompt engine — they need no DB seeding.
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { CONTENT_DEFAULTS } from "../src/lib/content/defaults";
import { PageContent } from "../src/lib/db/models/PageContent";
import { PLANS } from "../src/lib/config/plans";
import { BlogPost } from "../src/lib/db/models/BlogPost";
import { Plan } from "../src/lib/db/models/Plan";
import { CreditTransaction } from "../src/lib/db/models/CreditTransaction";
import { Favorite } from "../src/lib/db/models/Favorite";
import { Generation } from "../src/lib/db/models/Generation";
import { Payment } from "../src/lib/db/models/Payment";
import { Transaction } from "../src/lib/db/models/Transaction";
import { User } from "../src/lib/db/models/User";
import { PasswordResetToken, RateLimit, AnalyticsEvent } from "../src/lib/db/models/Misc";
import { ideasPosts } from "../src/lib/blog/posts/ideas";
import { letteringPosts } from "../src/lib/blog/posts/lettering";
import { placementPosts } from "../src/lib/blog/posts/placement";
import { TOOLS } from "../src/lib/tools/registry";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set (use .env.local)");

async function main() {
  await mongoose.connect(uri!);

  // Plans
  const reset = process.argv.includes("--reset-plans");
  for (const [i, p] of PLANS.entries()) {
    const fields = { name: p.name, price: p.price, credits: p.credits, currency: p.currency, features: p.features, sortOrder: i };
    await Plan.updateOne({ key: p.id }, reset ? { $set: { ...fields, active: true } } : { $setOnInsert: { key: p.id, ...fields, active: true } }, { upsert: true });
  }
  console.log(`plans: ${PLANS.length} ensured${reset ? " (reset)" : ""}`);

  // Blog posts: interleave clusters so the newest posts span topics. Sanity-check tool links against the registry.
  const toolSlugs = new Set(TOOLS.map((t) => t.slug));
  const clusters = [letteringPosts, ideasPosts, placementPosts];
  const posts = Array.from({ length: Math.max(...clusters.map((c) => c.length)) }, (_, i) => clusters.map((c) => c[i])).flat().filter((p) => p !== undefined);
  const base = Date.UTC(2026, 8, 20);
  for (const [i, post] of posts.entries()) {
    const unknown = post.tools.filter((t) => !toolSlugs.has(t));
    if (unknown.length) throw new Error(`Post ${post.slug} references unknown tools: ${unknown.join(", ")}`);
    await BlogPost.updateOne(
      { slug: post.slug },
      { $set: { ...post, status: "published" }, $setOnInsert: { publishedAt: new Date(base - i * 36 * 3600_000) } },
      { upsert: true },
    );
  }
  console.log(`blog posts: ${posts.length} upserted`);

  // Page content: only inserted when missing, so admin edits survive re-seeding.
  for (const [key, data] of Object.entries(CONTENT_DEFAULTS)) await PageContent.updateOne({ key }, { $setOnInsert: { key, data } }, { upsert: true });
  console.log(`page content: ${Object.keys(CONTENT_DEFAULTS).length} ensured`);

  // Admin user. The password is only set on first insert; change it from the dashboard in production.
  await User.updateOne(
    { email: "admin@gmail.com" },
    { $set: { role: "admin", emailVerified: true }, $setOnInsert: { name: "Admin", passwordHash: await bcrypt.hash("12345678", 12), credits: 1000, plan: "pro" } },
    { upsert: true },
  );
  console.log("admin user: admin@gmail.com ensured");

  // Indexes (unique keys back the idempotency guarantees, so make sure they exist).
  for (const m of [PageContent, User, Generation, CreditTransaction, Plan, Payment, Transaction, Favorite, BlogPost, PasswordResetToken, RateLimit, AnalyticsEvent]) await m.createIndexes();
  console.log("indexes ensured");
}

main()
  .then(() => mongoose.disconnect())
  .catch(async (e) => {
    console.error(e);
    await mongoose.disconnect();
    process.exit(1);
  });
