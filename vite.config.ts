import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "server",          // src/server.ts (Lovable default)
      outDir: "dist/server",    // REQUIRED for Railway SSR
      target: "node18",         // Railway runtime
    },
  },
  vite: {
    plugins: [mcpPlugin()],
    build: {
      target: "esnext",         // Vercel preview compatibility (your existing config)
    },
  },
});

