import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const port = Number(process.env.PORT ?? 5173);
const apiPort = Number(process.env.API_PORT ?? 5001);

export default defineConfig({
  base: "/",
  envDir: path.resolve(import.meta.dirname, "..", ".."),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@core": path.resolve(import.meta.dirname, "..", "..", "core", "src"),
      "@shared": path.resolve(import.meta.dirname, "..", "..", "shared", "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: true,
    fs: {
      allow: [path.resolve(import.meta.dirname, "..", "..")],
    },
    proxy: {
      "/api": {
        target: `http://127.0.0.1:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: true,
  },
});
