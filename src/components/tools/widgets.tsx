import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ToolDef, ToolKind } from "@/lib/tools/types";

const Skeleton = () => <div className="h-72 animate-pulse rounded-2xl bg-bone" aria-hidden />;
const lazy = (loader: () => Promise<{ default: ComponentType<{ tool: ToolDef }> }>) => dynamic(loader, { loading: Skeleton });

/** Kind → interactive widget. Each is code-split so a tool page only ships its own JavaScript. */
const WIDGETS: Record<ToolKind, ComponentType<{ tool: ToolDef }>> = {
  ai: lazy(() => import("./AiToolWidget")),
  font: lazy(() => import("./FontGenerator")),
  name: lazy(() => import("./NameGenerator")),
  quote: lazy(() => import("./QuoteGenerator")),
  roman: lazy(() => import("./RomanNumeralGenerator")),
  date: lazy(() => import("./DateTattooGenerator")),
  coordinates: lazy(() => import("./CoordinatesGenerator")),
  initials: lazy(() => import("./InitialsGenerator")),
  symbols: lazy(() => import("./SymbolGenerator")),
  size: lazy(() => import("./SizeCalculator")),
  "placement-guide": lazy(() => import("./PlacementGuide")),
  visualizer: lazy(() => import("./PlacementVisualizer")),
  stencil: lazy(() => import("./StencilMaker")),
};

export function ToolWidget({ tool }: { tool: ToolDef }) {
  const Widget = WIDGETS[tool.kind];
  return <Widget tool={tool} />;
}
