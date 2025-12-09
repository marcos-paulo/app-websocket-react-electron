import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./", // Importante: usar caminho relativo
  plugins: [react()],
  server: {
    port: 3001,
    open: false, // Não abre automaticamente, será aberto pelo script concurrently
  },
});
