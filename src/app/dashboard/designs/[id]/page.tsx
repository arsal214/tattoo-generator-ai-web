import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUserOrRedirect } from "@/lib/auth/session";
import { connectDB } from "@/lib/db/connect";
import { AppError } from "@/lib/errors";
import { getOwnedGeneration, isFavorite, toGenerationDto } from "@/lib/services/generation";
import { DesignActions } from "@/components/dashboard/DesignActions";

export const metadata: Metadata = { title: "Design" };

export default async function DesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUserOrRedirect(`/dashboard/designs/${id}`);
  await connectDB();
  let dto;
  try {
    const g = await getOwnedGeneration(user._id, id); // other users' designs → 404
    dto = toGenerationDto(g, await isFavorite(user._id, g._id));
  } catch (e) {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  }
  if (dto.status !== "success") notFound();
  const q = new URLSearchParams({ prompt: dto.prompt, style: dto.style, placement: dto.placement, size: dto.size, color: dto.color });
  return (
    <div className="space-y-6">
      <Link href="/dashboard/designs" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft size={16} aria-hidden /> Back to My Designs
      </Link>
      <h1 className="text-3xl font-semibold sm:text-4xl">Your design</h1>
      <div className="rounded-3xl border border-line bg-paper p-4 sm:p-7">
        <DesignActions generation={dto} regenerateHref={`/dashboard/generate?${q}`} />
      </div>
    </div>
  );
}
