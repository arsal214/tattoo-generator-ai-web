"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { downloadCanvas, ensureFont, renderLettering, type LetteringOptions } from "@/lib/lettering";

/**
 * Canvas-based lettering preview with PNG download. Shared by the font generator and every text tool
 * (names, initials, dates, numerals, coordinates). Responsive: the canvas scales to its container.
 */
export function LetteringPreview({
  filename = "tattoo-lettering",
  showDownload = true,
  className = "",
  ...opts
}: LetteringOptions & { filename?: string; showDownload?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const key = JSON.stringify([opts.lines, opts.font.id, opts.size, opts.spacing, opts.align, opts.lineHeight, opts.color, opts.background, opts.mirror, opts.padding]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await ensureFont(opts.font, opts.size, opts.lines.join(""));
      if (cancelled || !ref.current) return;
      renderLettering(ref.current, opts);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const checker =
    opts.background === "transparent"
      ? "bg-[repeating-conic-gradient(#eee_0_25%,#fff_0_50%)] bg-[length:16px_16px]"
      : "";

  return (
    <div className={className}>
      <div className={`flex min-h-40 items-center justify-center overflow-hidden rounded-xl border border-line ${checker}`}>
        <canvas ref={ref} className="h-auto max-h-[420px] w-full object-contain" role="img" aria-label={`Tattoo lettering preview: ${opts.lines.join(" ")}`} />
      </div>
      {showDownload && (
        <button type="button" className="btn btn-dark mt-3 w-full sm:w-auto" disabled={!ready} onClick={() => ref.current && downloadCanvas(ref.current, filename)}>
          <Download size={16} aria-hidden /> Download PNG
        </button>
      )}
    </div>
  );
}
