import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

export default defineConfig({
  tanstackStart: {
    server: {
      entry: "src/server.ts",   // TanStack Start server entry for Railway
      outDir: "dist/server",    // REQUIRED for Railway SSR
      target: "node18",         // Railway runtime
    },
  },
  vite: {
    plugins: [mcpPlugin()],
    resolve: {
      tsconfigPaths: true,  // Replace deprecated vite-tsconfig-paths plugin
    },
    build: {
      target: "esnext",         // Vercel preview compatibility (your existing config)
    },
  },
});

