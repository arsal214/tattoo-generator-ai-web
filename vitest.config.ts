import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "server-only": path.resolve("tests/stubs/empty.ts"),
      "@": path.resolve("src"),
    },
  },
  test: { environment: "node", testTimeout: 120_000, hookTimeout: 240_000, fileParallelism: false },
});
