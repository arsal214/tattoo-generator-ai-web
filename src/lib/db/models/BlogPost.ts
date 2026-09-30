import { Schema, model, models, type InferSchemaType, type Model, type Types } from "mongoose";
import { blogCategorySlugs } from "@/lib/config/blog";

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    /** Markdown. Written by admins/seed only — never by end users. */
    content: { type: String, required: true },
    featuredImage: { type: String },
    category: { type: String, enum: blogCategorySlugs, required: true },
    author: { type: String, default: "TattooGenerator Editorial Team" },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    tools: [String],
    publishedAt: { type: Date },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true },
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ status: 1, category: 1, publishedAt: -1 });

export type BlogPostDoc = InferSchemaType<typeof blogPostSchema> & { _id: Types.ObjectId; createdAt: Date; updatedAt: Date };
export const BlogPost = (models.BlogPost as Model<BlogPostDoc>) || model<BlogPostDoc>("BlogPost", blogPostSchema);
