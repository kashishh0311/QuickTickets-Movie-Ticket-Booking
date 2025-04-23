import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/user": "http://localhost:3001/api/v1",
    },
  },
  plugins: [react()],
});
