import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  // Vite inlines env at build time; a build without a backend URL would ship a broken app.
  if (command === "build" && !process.env.VITE_API_URL) {
    throw new Error("VITE_API_URL must be set for production builds (for example https://your-backend-host/api/v1).");
  }
  return { plugins: [react()] };
});
