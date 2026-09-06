/// <reference types="vitest/config" />
import path from "node:path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    // host:true (== --host 0.0.0.0) para que otros dispositivos de la LAN
    // puedan abrir la web usando la IP local del PC (ver scripts/start-sanken.ps1
    // y AUTOSTART.md) — sin esto Vite solo escucha en localhost.
    host: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Sin esto, Vitest también intenta recolectar los specs de Playwright en
    // e2e/ (coinciden con el patrón *.spec.ts por defecto) y explotan porque
    // usan el runner de Playwright, no el de Vitest.
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
})
