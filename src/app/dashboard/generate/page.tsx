import type { Metadata } from "next";
import { TattooGenerator, type GeneratorValues } from "@/components/generator/TattooGenerator";
import { colorValues, placementValues, sizeValues, styleValues, PROMPT_MAX } from "@/lib/config/generation";

export const metadata: Metadata = { title: "Generate a tattoo" };

const pick = (v: string | string[] | undefined, allowed: readonly string[]) => {
  const s = Array.isArray(v) ? v[0] : v;
  return s && allowed.includes(s) ? s : undefined;
};

/** Deep links from tools: /dashboard/generate?prompt=…&style=…&placement=… (validated against known options). */
export default async function GeneratePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const prompt = (Array.isArray(sp.prompt) ? sp.prompt[0] : sp.prompt)?.slice(0, PROMPT_MAX);
  const initial: Partial<GeneratorValues> = {
    ...(prompt && { prompt }),
    ...(pick(sp.style, styleValues) && { style: pick(sp.style, styleValues) }),
    ...(pick(sp.placement, placementValues) && { placement: pick(sp.placement, placementValues) }),
    ...(pick(sp.size, sizeValues) && { size: pick(sp.size, sizeValues) }),
    ...(pick(sp.color, colorValues) && { color: pick(sp.color, colorValues) }),
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Generate a tattoo</h1>
        <p className="mt-1 text-muted">Describe your idea, choose a style, and create tattoo-ready concepts.</p>
      </div>
      <div className="rounded-3xl border border-line bg-paper p-4 sm:p-7">
        <TattooGenerator initial={initial} plansHref="/dashboard/pricing" />
      </div>
    </div>
  );
}
