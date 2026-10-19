import "server-only";
import { cache } from "react";
import { marked } from "marked";
import { connectDB } from "../db/connect";
import { PageContent } from "../db/models/PageContent";
import { CONTENT_DEFAULTS, type ContentKey } from "./defaults";

/** Page copy: admin overrides from the DB layered over the defaults. Falls back to defaults if the DB is unreachable (e.g. `next build`). */
export const getContent = cache(async <K extends ContentKey>(key: K): Promise<(typeof CONTENT_DEFAULTS)[K]> => {
  const defaults = CONTENT_DEFAULTS[key];
  if (!process.env.MONGODB_URI) return defaults;
  try {
    await connectDB();
    const row = await PageContent.findOne({ key }).lean();
    return { ...defaults, ...(row?.data as object) };
  } catch (e) {
    console.error("[content] load failed", (e as Error).message);
    return defaults;
  }
});

/** Admin-authored markdown only (never user input). */
export const md = (s: string) => marked.parse(s, { async: false }) as string;
