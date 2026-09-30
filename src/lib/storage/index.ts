import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { env } from "../env";

/** Storage abstraction: the DB stores key + provider + metadata, never image bytes. Add another provider here and return it from getStorage(). */
export interface ImageStorage {
  name: "local";
  put(key: string, data: Buffer, mimeType: string): Promise<{ url: string }>;
  read(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  /** Public URL for a stored key. */
  url(key: string): string;
}

export const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };
export const MIME: Record<string, string> = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" };
/** Keys are server-generated; the file route only serves this exact shape (blocks path traversal). */
export const KEY_PATTERN = /^generations\/[0-9a-f-]{36}\.(png|jpg|webp)$/;

function localStorageProvider(): ImageStorage {
  const root = path.resolve(process.cwd(), env().LOCAL_STORAGE_DIR);
  const file = (key: string) => {
    if (!KEY_PATTERN.test(key)) throw new Error("invalid storage key");
    return path.join(root, key);
  };
  const url = (key: string) => `/api/files/${key}`;
  return {
    name: "local",
    url,
    async put(key, data) {
      const f = file(key);
      await fs.mkdir(path.dirname(f), { recursive: true });
      await fs.writeFile(f, data);
      return { url: url(key) };
    },
    read: (key) => fs.readFile(file(key)),
    delete: (key) => fs.rm(file(key), { force: true }),
  };
}

let storage: ImageStorage | undefined;
export const getStorage = (): ImageStorage => (storage ??= localStorageProvider());
