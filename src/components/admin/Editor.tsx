"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/client/api";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

/** Dropdown options by field name; everything else is inferred from the value's type. */
const SELECTS: Record<string, string[]> = {
  category: ["ideas", "styles", "lettering", "placement", "design", "guides"],
  status: ["draft", "published"],
  role: ["user", "admin"],
  plan: ["free", "creator", "pro"],
};

const blank = (v: Json): Json =>
  typeof v === "string" ? "" : typeof v === "number" ? 0 : typeof v === "boolean" ? false : Array.isArray(v) ? [] : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)])) : null;

function Field({ name, value, onChange, locked }: { name: string; value: Json; onChange: (v: Json) => void; locked: string[] }) {
  const label = name.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  const disabled = locked.includes(name);
  if (typeof value === "string") {
    return (
      <label className="block">
        <span className="label">{label}</span>
        {SELECTS[name] ? (
          <select className="input" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
            {SELECTS[name].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : value.length > 80 || value.includes("\n") || name === "content" || name === "body" ? (
          <textarea className="input font-mono text-sm" rows={Math.min(Math.max(value.split("\n").length + 1, 4), 28)} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input className="input" value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
        )}
      </label>
    );
  }
  if (typeof value === "number") {
    return (
      <label className="block">
        <span className="label">{label}</span>
        <input className="input" type="number" value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} />
      </label>
    );
  }
  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={value} disabled={disabled} onChange={(e) => onChange(e.target.checked)} /> {label}
      </label>
    );
  }
  if (Array.isArray(value)) {
    return (
      <fieldset className="space-y-3">
        <legend className="label">
          {label} ({value.length})
        </legend>
        {value.map((item, i) => (
          <div key={i} className="rounded-xl border border-line bg-white p-3">
            <Field name={typeof item === "object" ? `Item ${i + 1}` : `${label} ${i + 1}`} value={item} locked={locked} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
            <button type="button" className="mt-2 text-xs text-red-600 hover:underline" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange([...value, value.length ? blank(value[0]) : ""])}>
          + Add
        </button>
      </fieldset>
    );
  }
  if (value && typeof value === "object") {
    return (
      <div className="space-y-4">
        {Object.entries(value).map(([k, v]) => (
          <Field key={k} name={k} value={v} locked={locked} onChange={(nv) => onChange({ ...value, [k]: nv })} />
        ))}
      </div>
    );
  }
  return null;
}

/** Generic form for any JSON document: edits `initial`, then sends it to `url` (optionally wrapped as `{ [wrap]: data }`). */
export function Editor({ initial, url, method = "PUT", wrap, locked = [], redirectTo, deleteUrl }: { initial: { [k: string]: Json }; url: string; method?: string; wrap?: string; locked?: string[]; redirectTo?: string; deleteUrl?: string }) {
  const [data, setData] = useState(initial);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function save() {
    setBusy(true);
    try {
      const res = await apiFetch<{ id?: string }>(url, { method, body: wrap ? { [wrap]: data } : data });
      toast.success("Saved");
      if (redirectTo) router.push(redirectTo.replace(":id", res.id ?? ""));
      else router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!deleteUrl || !confirm("Delete permanently?")) return;
    try {
      await apiFetch(deleteUrl, { method: "DELETE" });
      router.push(redirectTo ?? "/admin");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  return (
    <div className="space-y-5">
      <Field name="" value={data} locked={locked} onChange={(v) => setData(v as typeof data)} />
      <div className="sticky bottom-0 -mx-1 flex gap-3 border-t border-line bg-bone/90 p-3 backdrop-blur">
        <button className="btn btn-primary" disabled={busy} onClick={save}>
          {busy ? "Saving…" : "Save"}
        </button>
        {deleteUrl && (
          <button className="btn btn-outline" onClick={remove}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
