import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/oauth-api': {
        target: 'https://uat-miniapp.kbzpay.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oauth-api/, '')
      },
      '/login-api': {
        target: 'https://wap.kbzpay.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/login-api/, '')
      }
    }
  }
});