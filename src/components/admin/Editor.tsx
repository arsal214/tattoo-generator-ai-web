"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { richHtml } from "@/lib/rich";
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

const RICH_FIELD = /^(content|body|intro|a|footerBlurb|description|\w+Body)$/;

/** Rich text (TipTap) for admin copy. Stores HTML; legacy markdown is converted on load. */
function RichText({ value, onChange, disabled }: { value: string; onChange: (v: string) => void; disabled: boolean }) {
  const [source, setSource] = useState<string | null>(null); // non-null = editing raw HTML
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false } })],
    content: richHtml(value),
    editable: !disabled,
    immediatelyRender: false, // avoids an SSR hydration mismatch
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
    editorProps: { attributes: { class: "prose-tg min-h-40 max-h-[32rem] overflow-y-auto p-4 outline-none" } },
  });
  if (!editor) return <div className="min-h-40 rounded-xl border border-line bg-white" />;
  const chain = () => editor.chain().focus();
  const tools: [string, () => void, boolean][] = [
    ["B", () => chain().toggleBold().run(), editor.isActive("bold")],
    ["I", () => chain().toggleItalic().run(), editor.isActive("italic")],
    ["U", () => chain().toggleUnderline().run(), editor.isActive("underline")],
    ["S", () => chain().toggleStrike().run(), editor.isActive("strike")],
    ["H2", () => chain().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 })],
    ["H3", () => chain().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 })],
    ["• List", () => chain().toggleBulletList().run(), editor.isActive("bulletList")],
    ["1. List", () => chain().toggleOrderedList().run(), editor.isActive("orderedList")],
    ["Quote", () => chain().toggleBlockquote().run(), editor.isActive("blockquote")],
    [
      "Link",
      () => {
        const href = window.prompt("Link URL (empty to remove)", editor.getAttributes("link").href ?? "");
        if (href === null) return;
        href ? chain().extendMarkRange("link").setLink({ href }).run() : chain().extendMarkRange("link").unsetLink().run();
      },
      editor.isActive("link"),
    ],
    ["Clear", () => chain().unsetAllMarks().clearNodes().run(), false],
    ["Undo", () => chain().undo().run(), false],
    ["Redo", () => chain().redo().run(), false],
  ];
  const toggleSource = () => {
    if (source === null) return setSource(editor.getHTML());
    editor.commands.setContent(richHtml(source)); // setContent fires onUpdate, which saves the HTML
    onChange(editor.isEmpty ? "" : editor.getHTML());
    setSource(null);
  };
  return (
    <div className="rounded-xl border border-line bg-white">
      {!disabled && (
        <div className="flex flex-wrap gap-1 border-b border-line p-2">
          {source === null &&
            tools.map(([label, run, on]) => (
              <button key={label} type="button" className={`btn btn-sm ${on ? "btn-primary" : "btn-outline"}`} onMouseDown={(e) => e.preventDefault()} onClick={run}>
                {label}
              </button>
            ))}
          <button type="button" className={`btn btn-sm ml-auto ${source !== null ? "btn-primary" : "btn-outline"}`} onClick={toggleSource}>
            {source === null ? "</> HTML" : "Back to editor"}
          </button>
        </div>
      )}
      {source === null ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea className="input min-h-64 w-full rounded-none border-0 font-mono text-sm" value={source} onChange={(e) => (setSource(e.target.value), onChange(e.target.value))} />
      )}
    </div>
  );
}

function Field({ name, value, onChange, locked }: { name: string; value: Json; onChange: (v: Json) => void; locked: string[] }) {
  const label = name.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
  const disabled = locked.includes(name);
  if (typeof value === "string" && !SELECTS[name] && RICH_FIELD.test(name)) {
    // not wrapped in <label>: a label would forward editor clicks to the first toolbar button
    return (
      <div>
        <span className="label">{label}</span>
        <RichText value={value} disabled={disabled} onChange={onChange} />
      </div>
    );
  }
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
        ) : value.length > 80 || value.includes("\n") ? (
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
