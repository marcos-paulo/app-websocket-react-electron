import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: "/usr/bin/firefox",
  },
  build: {
    outDir: "build", // Diretório de saída do build
  },
});
