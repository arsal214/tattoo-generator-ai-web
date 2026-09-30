"use client";

import Image from "next/image";
import { useState } from "react";
import { Download, Heart, Pencil, Palette, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/client/api";
import { COLORS, PLACEMENTS, SIZES, STYLES, label } from "@/lib/config/generation";
import type { GenerationDto } from "@/lib/services/generation";

interface Props {
  generation: GenerationDto;
  busy: boolean;
  onAgain: () => void;
  onEditPrompt: () => void;
  onTryStyle: () => void;
  onDeleted: () => void;
}

export function ResultPanel({ generation: g, busy, onAgain, onEditPrompt, onTryStyle, onDeleted }: Props) {
  const [fav, setFav] = useState(g.favorite);
  const [confirming, setConfirming] = useState(false);
  const [working, setWorking] = useState(false);

  const toggleFav = async () => {
    setFav((f) => !f); // optimistic
    try {
      const r = await apiFetch<{ favorite: boolean }>(`/api/generations/${g.id}/favorite`, { method: "POST", body: {} });
      setFav(r.favorite);
    } catch (e) {
      setFav((f) => !f);
      toast.error((e as Error).message);
    }
  };

  const remove = async () => {
    setWorking(true);
    try {
      await apiFetch(`/api/generations/${g.id}`, { method: "DELETE" });
      toast.success("Design deleted.");
      onDeleted();
    } catch (e) {
      toast.error((e as Error).message);
      setWorking(false);
    }
  };

  const meta: [string, string][] = [
    ["Style", label(STYLES, g.style)],
    ["Placement", label(PLACEMENTS, g.placement)],
    ["Size", label(SIZES, g.size)],
    ["Color", label(COLORS, g.color)],
    ["Credits used", String(g.creditsUsed)],
  ];

  return (
    <div className="space-y-4">
      <div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-2xl border border-line bg-white">
        {g.imageUrl && <Image src={g.imageUrl} alt={`Tattoo design: ${g.prompt}`} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-contain" priority />}
      </div>

      <div className="flex flex-wrap gap-2">
        <a className="btn btn-dark btn-sm" href={`/api/generations/${g.id}/download`} download>
          <Download size={15} aria-hidden /> Download
        </a>
        <button type="button" className="btn btn-outline btn-sm" onClick={toggleFav} aria-pressed={fav}>
          <Heart size={15} aria-hidden className={fav ? "fill-accent text-accent" : ""} /> {fav ? "Favorited" : "Favorite"}
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onAgain} disabled={busy}>
          <RefreshCw size={15} aria-hidden /> Generate Again
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onEditPrompt}>
          <Pencil size={15} aria-hidden /> Edit Prompt
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={onTryStyle}>
          <Palette size={15} aria-hidden /> Try Another Style
        </button>
        {confirming ? (
          <span className="inline-flex items-center gap-2">
            <button type="button" className="btn btn-primary btn-sm" onClick={remove} disabled={working}>
              Confirm delete
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </span>
        ) : (
          <button type="button" className="btn btn-ghost btn-sm text-accent-dark" onClick={() => setConfirming(true)}>
            <Trash2 size={15} aria-hidden /> Delete
          </button>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-bone p-4 text-sm sm:grid-cols-3">
        {meta.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">{k}</dt>
            <dd className="font-semibold">{v}</dd>
          </div>
        ))}
        <div className="col-span-2 sm:col-span-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Prompt</dt>
          <dd className="break-words">{g.prompt}</dd>
        </div>
      </dl>
      <p className="text-xs text-muted">Generated designs are concept art for inspiration. Bring them to a professional tattoo artist to adapt for your body and skin.</p>
    </div>
  );
}
