import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
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
