import type { Metadata } from "next";
import Link from "next/link";
import { GenerationList } from "@/components/dashboard/GenerationList";
import { requireUserOrRedirect } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { listGenerations } from "@/lib/services/generation";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "My Designs" };

export default async function DesignsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await requireUserOrRedirect("/dashboard/designs");
  const favoritesOnly = (await searchParams).tab === "favorites";
  await connectDB();
  const initial = await listGenerations(user._id, { status: "success", favoritesOnly, limit: 24 });
  const tab = (active: boolean) => cn("chip", active && "border-ink bg-ink text-bone");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">My Designs</h1>
        <p className="mt-1 text-muted">Everything you&apos;ve generated. Open, download, favorite or delete.</p>
      </div>
      <div className="flex gap-2" role="tablist" aria-label="Design filter">
        <Link href="/dashboard/designs" className={tab(!favoritesOnly)} role="tab" aria-selected={!favoritesOnly}>
          All designs
        </Link>
        <Link href="/dashboard/designs?tab=favorites" className={tab(favoritesOnly)} role="tab" aria-selected={favoritesOnly}>
          Favorites
        </Link>
      </div>
      <GenerationList key={favoritesOnly ? "fav" : "all"} initial={initial} variant="gallery" favoritesOnly={favoritesOnly} emptyTitle={favoritesOnly ? "No favorites yet" : "No designs yet"} emptyBody={favoritesOnly ? "Tap the heart on a design to keep it here." : "Your generated tattoo designs will appear here."} />
    </div>
  );
}
