import type { ToolCategory, ToolDef } from "./types";
import { generatorTools } from "./content/generators";
import { fontTools } from "./content/fonts";
import { symbolTools } from "./content/symbols";
import { planningTools } from "./content/planning";
import { styleTools } from "./content/styles";

export const TOOLS: ToolDef[] = [...generatorTools, ...fontTools, ...symbolTools, ...planningTools, ...styleTools];

export const getTool = (slug: string) => TOOLS.find((t) => t.slug === slug);
export const toolsByCategory = (c: ToolCategory) => TOOLS.filter((t) => t.category === c);
export const toolPath = (slug: string) => `/${slug}`;
