import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const REPOSITORY_BASE_PATH = "/Np1C14/";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? REPOSITORY_BASE_PATH : "/",
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:3001" },
  },
}));
