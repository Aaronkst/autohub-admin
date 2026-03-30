import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    allowedHosts: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/kbz': {
        target: 'https://uat-miniapp.kbzpay.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/kbz/, '')
      },
    }
  }
});
