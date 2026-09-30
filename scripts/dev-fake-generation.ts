// Dev-only: inserts fake successful generations (a real PNG on disk) for a user, so the UI can be explored without a Gemini key.
//   npx tsx --env-file-if-exists=.env scripts/dev-fake-generation.ts you@example.com 4
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import zlib from "node:zlib";
import mongoose from "mongoose";
import { Generation } from "../src/lib/db/models/Generation";
import { User } from "../src/lib/db/models/User";

function png(w: number, h: number) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 3 + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const d = Math.hypot(x - w / 2, y - h / 2);
      const ring = Math.abs(d - w * 0.32) < 5 || Math.abs(d - w * 0.18) < 3;
      const v = ring ? 20 : 250;
      const o = y * (w * 3 + 1) + 1 + x * 3;
      raw[o] = v; raw[o + 1] = v; raw[o + 2] = v;
    }
  }
  const crcT = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = (b: Buffer) => { let c = -1; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const chunk = (t: string, d: Buffer) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const email = process.argv[2];
  const count = Number(process.argv[3] ?? 1);
  const user = await User.findOne({ email });
  if (!user) throw new Error("no such user");
  mkdirSync("public/generated/generations", { recursive: true });
  for (let i = 0; i < count; i++) {
    const key = `generations/${randomUUID()}.png`;
    const data = png(512, 512);
    writeFileSync(`public/generated/${key}`, data);
    await Generation.create({ userId: user._id, prompt: `Sample wolf with mountains #${i + 1}`, style: "fine-line", placement: "forearm", size: "medium", color: "black-grey", status: "success", creditsUsed: 1, imageKey: key, imageUrl: `/api/files/${key}`, storageProvider: "local", imageMeta: { mimeType: "image/png", bytes: data.length } });
  }
  console.log("inserted", count);
  await mongoose.disconnect();
}
main();
