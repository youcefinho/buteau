import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    // Image optimization at build time (sharp-based) — JPG/PNG/SVG lossless.
    ViteImageOptimizer({
      jpg: { quality: 80 },
      jpeg: { quality: 80 },
      png: { quality: 80 },
      webp: { quality: 80 },
    }),
  ],
  // Drop chatty console calls in prod (preserve error/warn for real issues).
  esbuild: {
    pure: ["console.log", "console.debug", "console.info", "console.trace"],
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          router: ["@tanstack/react-router"],
          motion: ["motion"],
          icons: ["lucide-react"],
          radix: ["@radix-ui/react-accordion"],
        },
      },
    },
  },
  server: {
    proxy: {
      // Proxy /api/* vers wrangler dev (port 8787) pour test local.
      // Lance `bunx wrangler dev` dans un 2e terminal en parallèle de `bun run dev`.
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
});
