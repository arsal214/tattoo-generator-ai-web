import { marked } from "marked";

/** Admin-authored copy is HTML (rich text editor) or legacy markdown; render either as block HTML. */
export const richHtml = (s: string) => (/^\s*<\w/.test(s) ? s : (marked.parse(s, { async: false }) as string));
