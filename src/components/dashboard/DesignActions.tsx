"use client";

import { useRouter } from "next/navigation";
import { ResultPanel } from "@/components/generator/ResultPanel";
import type { GenerationDto } from "@/lib/services/generation";

/** Design detail: reuses the result panel; "generate again / edit / try style" open the generator prefilled. */
export function DesignActions({ generation, regenerateHref }: { generation: GenerationDto; regenerateHref: string }) {
  const router = useRouter();
  const go = () => router.push(regenerateHref);
  return <ResultPanel generation={generation} busy={false} onAgain={go} onEditPrompt={go} onTryStyle={go} onDeleted={() => router.push("/dashboard/designs")} />;
}
