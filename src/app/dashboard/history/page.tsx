import type { Metadata } from "next";
import { GenerationList } from "@/components/dashboard/GenerationList";
import { requireUserOrRedirect } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { listGenerations, sweepStale } from "@/lib/services/generation";

export const metadata: Metadata = { title: "Generation History" };

export default async function HistoryPage() {
  const user = await requireUserOrRedirect("/dashboard/history");
  await connectDB();
  await sweepStale(user._id);
  const initial = await listGenerations(user._id, { limit: 24 });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Generation History</h1>
        <p className="mt-1 text-muted">Every generation, including failed ones (those are refunded automatically).</p>
      </div>
      <GenerationList initial={initial} variant="history" emptyTitle="No history yet" emptyBody="Once you generate a tattoo it will be listed here with its settings." />
    </div>
  );
}
