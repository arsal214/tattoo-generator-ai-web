import { NextResponse, type NextRequest } from "next/server";
import { KEY_PATTERN, MIME, getStorage } from "@/lib/storage";

/**
 * Serves images from local storage (development / single-server deployments). Keys are random UUIDs
 * generated server-side, and only that exact shape is served — no path traversal possible.
 * Files live under LOCAL_STORAGE_DIR (default public/generated).
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ key: string[] }> }) {
  const key = (await params).key.join("/");
  const storage = getStorage();
  if (storage.name !== "local" || !KEY_PATTERN.test(key)) return NextResponse.json({ error: { code: "NOT_FOUND", message: "Not found." } }, { status: 404 });
  try {
    const data = await storage.read(key);
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": MIME[key.split(".").pop()!] ?? "application/octet-stream", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Not found." } }, { status: 404 });
  }
}
