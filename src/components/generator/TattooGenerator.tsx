"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/components/UserProvider";
import { apiFetch, ApiError, track } from "@/lib/client/api";
import { COLORS, CREDITS_PER_GENERATION, PLACEMENTS, PROMPT_EXAMPLES, PROMPT_MAX, SIZES, STYLES } from "@/lib/config/generation";
import { LOW_CREDITS } from "@/lib/config/plans";
import type { ToolPreset } from "@/lib/tools/types";
import type { GenerationDto } from "@/lib/services/generation";
import { CreditBadge } from "./CreditBadge";
import { ResultPanel } from "./ResultPanel";

export interface GeneratorValues {
  prompt: string;
  style: string;
  placement: string;
  size: string;
  color: string;
}

const DEFAULTS: GeneratorValues = { prompt: "", style: "fine-line", placement: "forearm", size: "medium", color: "black-grey" };
const DRAFT_KEY = "tg_draft";

interface Props {
  /** Landing-page presets (style, chips…) from the tool registry. */
  preset?: ToolPreset;
  /** Pre-filled values, e.g. from /dashboard/generate?prompt=… deep links. Wins over `preset`. */
  initial?: Partial<GeneratorValues>;
  /** Where signup/login should send the user afterwards. */
  next?: string;
  /** Where "View plans" points (dashboard users have their own pricing view). */
  plansHref?: string;
}

export function TattooGenerator({ preset, initial, next = "/dashboard/generate", plansHref = "/pricing" }: Props) {
  const { user, loading: userLoading, setCredits, refresh } = useUser();
  const [values, setValues] = useState<GeneratorValues>({
    ...DEFAULTS,
    ...(preset?.style && { style: preset.style }),
    ...(preset?.placement && { placement: preset.placement }),
    ...(preset?.size && { size: preset.size }),
    ...(preset?.color && { color: preset.color }),
    ...(preset?.prompt && { prompt: preset.prompt }),
    ...initial,
  });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<GenerationDto | null>(null);
  const [error, setError] = useState<{ message: string; noCredits?: boolean } | null>(null);
  const [needsAccount, setNeedsAccount] = useState(false);
  const keyRef = useRef<string | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const styleRef = useRef<HTMLFieldSetElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const set = <K extends keyof GeneratorValues>(k: K, v: GeneratorValues[K]) => setValues((s) => ({ ...s, [k]: v }));

  useEffect(() => {
    track("generator_opened");
    // Restore what a visitor typed before being asked to sign up.
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw && !initial?.prompt) {
        setValues((s) => ({ ...s, ...JSON.parse(raw) }));
        sessionStorage.removeItem(DRAFT_KEY);
      }
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const credits = user?.credits ?? null;
  const outOfCredits = credits === 0;
  const promptTooShort = values.prompt.trim().length < 3;

  async function generate() {
    setError(null);
    if (promptTooShort) {
      setError({ message: "Please describe the tattoo you want to generate." });
      promptRef.current?.focus();
      return;
    }
    if (!user) {
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
      } catch {
        /* ignore */
      }
      setNeedsAccount(true);
      return;
    }
    if (busy) return;
    setBusy(true);
    // Same key for the same click: retries after a dropped connection can never double-charge.
    keyRef.current ??= crypto.randomUUID().replace(/-/g, "");
    try {
      const data = await apiFetch<{ generation: GenerationDto; credits: number }>("/api/generate", { body: { ...values, idempotencyKey: keyRef.current } });
      keyRef.current = null;
      setResult(data.generation);
      setCredits(data.credits);
      requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    } catch (e) {
      const err = e as ApiError;
      if (err.status !== 0) keyRef.current = null; // definitive answer from the server → next click is a new request
      setError({ message: err.message, noCredits: err.code === "NO_CREDITS" });
      if (err.code !== "NO_CREDITS") toast.error(err.message);
      // Credits may have changed server-side (refund, sweep); re-sync after failures.
      if (err.code === "GENERATION_FAILED" || err.code === "NO_CREDITS") void refresh();
    } finally {
      setBusy(false);
    }
  }

  const chip = (active: boolean) => ({ className: "chip", "aria-pressed": active, "data-active": active });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ---------- form ---------- */}
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          void generate();
        }}
        noValidate
      >
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="tg-prompt" className="label !mb-0 text-base">
            Describe your tattoo idea
          </label>
          {user && <CreditBadge credits={user.credits} />}
        </div>
        <div>
          <textarea
            id="tg-prompt"
            ref={promptRef}
            className="input min-h-32 resize-y text-base"
            placeholder="Describe your tattoo idea..."
            maxLength={PROMPT_MAX}
            value={values.prompt}
            onChange={(e) => set("prompt", e.target.value)}
            aria-describedby="tg-prompt-help"
          />
          <div id="tg-prompt-help" className="mt-1.5 flex justify-between text-xs text-muted">
            <span>Try an idea below or write your own.</span>
            <span>
              {values.prompt.length}/{PROMPT_MAX}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[...(preset?.chips ?? PROMPT_EXAMPLES)].map((ex) => (
              <button key={ex} type="button" className="chip" onClick={() => set("prompt", ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>

        <fieldset ref={styleRef} className="scroll-mt-24">
          <legend className="label">Style</legend>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button key={s.value} type="button" {...chip(values.style === s.value)} onClick={() => set("style", s.value)}>
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="tg-placement" className="label">
              Placement
            </label>
            <select id="tg-placement" className="input" value={values.placement} onChange={(e) => set("placement", e.target.value)}>
              {PLACEMENTS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <fieldset>
            <legend className="label">Size</legend>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s.value} type="button" {...chip(values.size === s.value)} onClick={() => set("size", s.value)}>
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset>
          <legend className="label">Color</legend>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button key={c.value} type="button" {...chip(values.color === c.value)} onClick={() => set("color", c.value)}>
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="space-y-3">
          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={busy || outOfCredits || userLoading}>
            {busy ? (
              <>
                <Loader2 className="animate-spin" size={18} aria-hidden /> Designing your tattoo…
              </>
            ) : (
              <>
                <Sparkles size={18} aria-hidden /> Generate Tattoo — {CREDITS_PER_GENERATION} Credit
              </>
            )}
          </button>

          {error && !error.noCredits && (
            <p role="alert" className="rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent-dark">
              {error.message}
            </p>
          )}

          {(outOfCredits || error?.noCredits) && (
            <div role="alert" className="rounded-xl border border-accent/30 bg-accent-soft p-4">
              <p className="font-semibold text-accent-dark">You&apos;re out of credits.</p>
              <p className="mt-1 text-sm text-ink/80">Choose a plan to keep creating tattoo designs.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={plansHref} className="btn btn-primary btn-sm" onClick={() => track("upgrade_clicked", { from: "generator_empty" })}>
                  View Plans
                </Link>
                <Link href={plansHref} className="btn btn-outline btn-sm" onClick={() => track("upgrade_clicked", { from: "generator_empty_upgrade" })}>
                  Upgrade
                </Link>
              </div>
            </div>
          )}

          {credits !== null && credits > 0 && credits <= LOW_CREDITS && (
            <p className="text-sm text-muted">
              Only {credits} credit{credits === 1 ? "" : "s"} left.{" "}
              <Link href={plansHref} className="font-semibold text-accent underline underline-offset-4" onClick={() => track("upgrade_clicked", { from: "generator_low" })}>
                Get more credits
              </Link>
            </p>
          )}

          {needsAccount && !user && (
            <div className="rounded-xl border border-ink/15 bg-bone p-4">
              <p className="font-semibold">Create a free account to generate this tattoo</p>
              <p className="mt-1 text-sm text-ink/75">You get 20 free credits at signup — no payment needed. We&apos;ve saved your idea.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href={`/signup?next=${encodeURIComponent(next)}`} className="btn btn-dark btn-sm">
                  Sign up free
                </Link>
                <Link href={`/login?next=${encodeURIComponent(next)}`} className="btn btn-outline btn-sm">
                  Log in
                </Link>
              </div>
            </div>
          )}
          {!user && !needsAccount && !userLoading && <p className="text-center text-sm text-muted">Sign up free and get 20 credits. 1 credit = 1 tattoo generation.</p>}
        </div>
      </form>

      {/* ---------- preview ---------- */}
      <div ref={resultRef} className="min-w-0 scroll-mt-24" aria-live="polite">
        {busy ? (
          <div className="flex aspect-square w-full max-w-[560px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink/25 bg-bone/60 p-6 text-center lg:mx-auto">
            <Loader2 className="animate-spin text-accent" size={34} aria-hidden />
            <p className="font-semibold">Designing your tattoo…</p>
            <p className="text-sm text-muted">This usually takes 10–30 seconds. Please keep this tab open.</p>
          </div>
        ) : result ? (
          <ResultPanel
            key={result.id}
            generation={result}
            busy={busy}
            onAgain={() => void generate()}
            onEditPrompt={() => promptRef.current?.focus()}
            onTryStyle={() => {
              styleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              styleRef.current?.querySelector("button")?.focus();
            }}
            onDeleted={() => setResult(null)}
          />
        ) : (
          <div className="flex aspect-square w-full max-w-[560px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink/25 bg-bone/60 p-6 text-center lg:mx-auto">
            <Sparkles className="text-accent" size={30} aria-hidden />
            <p className="font-display text-xl font-semibold">Your design appears here</p>
            <p className="max-w-xs text-sm text-muted">Describe your idea, pick a style and placement, then generate. You can save, download and refine every design.</p>
          </div>
        )}
      </div>
    </div>
  );
}
