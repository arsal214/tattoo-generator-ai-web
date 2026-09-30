"use client";

import { TattooGenerator } from "@/components/generator/TattooGenerator";
import type { ToolDef } from "@/lib/tools/types";

/** AI tool pages use the shared generator with the page's preset (style, chips, defaults). */
export default function AiToolWidget({ tool }: { tool: ToolDef }) {
  return <TattooGenerator preset={tool.preset} />;
}
