// @lovable.dev/vite-tanstack-config already handles most plugins
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" }, // Existing
  },
  // Add for GH Pages
  base: process.env.NODE_ENV === 'production' 
    ? '/loudmouf/'  // IMPORTANT: /<repo-name>/ (with trailing slash) or '/' for root/custom domain
    : '/',
  build: {
    outDir: 'dist',  // Default; ensure this matches Pages source
    // Optional: sourcemaps, minify, etc. for production
    rollupOptions: {
      output: {
        // Asset handling if needed
      }
    }
  },
  // For SPA routing (client-side)
  // TanStack Router should handle most; test deeply linked routes
});