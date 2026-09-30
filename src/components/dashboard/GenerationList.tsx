"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Download, Heart, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/client/api";
import { COLORS, PLACEMENTS, SIZES, STYLES, label } from "@/lib/config/generation";
import type { GenerationDto } from "@/lib/services/generation";
import { cn, formatDate } from "@/lib/utils";

interface Props {
  initial: { items: GenerationDto[]; nextCursor: string | null };
  variant: "gallery" | "history";
  favoritesOnly?: boolean;
  emptyTitle: string;
  emptyBody: string;
}

/** Paginated list of the user's generations: card gallery (My Designs) or table-like rows (History). */
export function GenerationList({ initial, variant, favoritesOnly, emptyTitle, emptyBody }: Props) {
  const [items, setItems] = useState(initial.items);
  const [cursor, setCursor] = useState(initial.nextCursor);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function loadMore() {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ cursor, limit: "24" });
      if (variant === "gallery") params.set("status", "success");
      if (favoritesOnly) params.set("favorites", "1");
      const data = await apiFetch<{ items: GenerationDto[]; nextCursor: string | null }>(`/api/generations?${params}`);
      setItems((prev) => [...prev, ...data.items]);
      setCursor(data.nextCursor);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFav(g: GenerationDto) {
    const flip = (fav: boolean) => setItems((p) => p.map((x) => (x.id === g.id ? { ...x, favorite: fav } : x)));
    flip(!g.favorite);
    try {
      const r = await apiFetch<{ favorite: boolean }>(`/api/generations/${g.id}/favorite`, { method: "POST", body: {} });
      if (favoritesOnly && !r.favorite) setItems((p) => p.filter((x) => x.id !== g.id));
      else flip(r.favorite);
    } catch (e) {
      flip(g.favorite);
      toast.error((e as Error).message);
    }
  }

  async function remove(g: GenerationDto) {
    try {
      await apiFetch(`/api/generations/${g.id}`, { method: "DELETE" });
      setItems((p) => p.filter((x) => x.id !== g.id));
      toast.success("Design deleted.");
    } catch (e) {
      toast.error((e as Error).message);
    }
    setConfirmId(null);
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/25 bg-white p-10 text-center">
        <p className="font-display text-xl font-semibold">{emptyTitle}</p>
        <p className="mx-auto mt-1 max-w-md text-muted">{emptyBody}</p>
        <Link href="/dashboard/generate" className="btn btn-primary mt-5">
          Generate a tattoo
        </Link>
      </div>
    );
  }

  const more = cursor && (
    <div className="mt-8 flex justify-center">
      <button type="button" className="btn btn-outline" onClick={loadMore} disabled={loading}>
        {loading && <Loader2 className="animate-spin" size={16} aria-hidden />} Load more
      </button>
    </div>
  );

  if (variant === "history") {
    return (
      <>
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {items.map((g) => (
            <li key={g.id} className="flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-bone">
                {g.imageUrl && <Image src={g.imageUrl} alt="" fill sizes="64px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{g.prompt}</p>
                <p className="truncate text-[13px] text-muted">
                  {label(STYLES, g.style)} · {label(PLACEMENTS, g.placement)} · {label(SIZES, g.size)} · {label(COLORS, g.color)}
                </p>
                {g.status === "failed" && <p className="mt-0.5 text-[13px] text-accent-dark">{g.errorMessage ?? "Generation failed."} Credit refunded.</p>}
              </div>
              <div className="hidden text-right text-[13px] text-muted sm:block">
                <p>{formatDate(g.createdAt)}</p>
                <p>
                  {g.creditsUsed} credit{g.creditsUsed === 1 ? "" : "s"}
                </p>
              </div>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", g.status === "success" ? "bg-good/10 text-good" : g.status === "failed" ? "bg-accent-soft text-accent-dark" : "bg-bone text-muted")}>{g.status}</span>
              {g.status === "success" && (
                <Link href={`/dashboard/designs/${g.id}`} className="btn btn-outline btn-sm">
                  Open
                </Link>
              )}
            </li>
          ))}
        </ul>
        {more}
      </>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {items.map((g) => (
          <li key={g.id} className="group overflow-hidden rounded-2xl border border-line bg-white">
            <Link href={`/dashboard/designs/${g.id}`} className="relative block aspect-square bg-bone" aria-label={`Open design: ${g.prompt}`}>
              {g.imageUrl && <Image src={g.imageUrl} alt={`Tattoo design: ${g.prompt}`} fill sizes="(min-width: 768px) 30vw, 46vw" className="object-cover transition group-hover:scale-[1.03]" />}
            </Link>
            <div className="p-3">
              <p className="line-clamp-1 text-sm font-medium">{g.prompt}</p>
              <p className="text-xs text-muted">
                {label(STYLES, g.style)} · {formatDate(g.createdAt)}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <button type="button" onClick={() => toggleFav(g)} aria-pressed={g.favorite} aria-label={g.favorite ? "Remove from favorites" : "Add to favorites"} className="btn btn-ghost !min-h-11 !min-w-11 !px-0">
                  <Heart size={18} className={g.favorite ? "fill-accent text-accent" : ""} aria-hidden />
                </button>
                <a href={`/api/generations/${g.id}/download`} download aria-label="Download design" className="btn btn-ghost !min-h-11 !min-w-11 !px-0">
                  <Download size={18} aria-hidden />
                </a>
                {confirmId === g.id ? (
                  <span className="ml-auto flex gap-1">
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => remove(g)}>
                      Delete
                    </button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirmId(null)}>
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setConfirmId(g.id)} aria-label="Delete design" className="btn btn-ghost ml-auto !min-h-11 !min-w-11 !px-0 text-accent-dark">
                    <Trash2 size={18} aria-hidden />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {more}
    </>
  );
}
