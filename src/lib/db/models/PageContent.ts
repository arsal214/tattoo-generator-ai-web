import { Schema, model, models, type Model } from "mongoose";

/** One editable document per page/section (key = "home", "about", ...). `data` mirrors the defaults in lib/content/defaults.ts. */
const pageContentSchema = new Schema({ key: { type: String, required: true, unique: true }, data: { type: Schema.Types.Mixed, required: true } }, { timestamps: true });

export const PageContent = (models.PageContent as Model<{ key: string; data: Record<string, unknown> }>) || model("PageContent", pageContentSchema);
