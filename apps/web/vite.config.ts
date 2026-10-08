/// <reference types="vitest/config" />
// Esta línea sirve para importar «path» desde «node:path».
import path from "node:path"
// Esta línea sirve para importar «defineConfig» desde «vite».
import { defineConfig } from 'vite'
// Esta línea sirve para importar «react» desde «@vitejs/plugin-react».
import react from '@vitejs/plugin-react'
// Esta línea sirve para importar «tailwindcss» desde «@tailwindcss/vite».
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Esta línea sirve para exportar la configuración de Vite.
export default defineConfig({
  // Esta línea sirve para declarar la propiedad «plugins» con el valor o tipo «[react(), tailwindcss()]».
  plugins: [react(), tailwindcss()],
  // Esta línea sirve para declarar la propiedad «resolve» con el valor o tipo «{».
  resolve: {
    // Esta línea sirve para declarar la propiedad «alias» con el valor o tipo «{».
    alias: {
      // Esta línea sirve para incluir el texto o las clases «@…».
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  // Esta línea sirve para declarar la propiedad «server» con el valor o tipo «{».
  server: {
    // Esta línea sirve para declarar la propiedad «port» con el valor o tipo «5173».
    port: 5173,
    // host:true (== --host 0.0.0.0) para que otros dispositivos de la LAN
    // puedan abrir la web usando la IP local del PC (ver scripts/start-sanken.ps1
    // y AUTOSTART.md) — sin esto Vite solo escucha en localhost.
    // Esta línea sirve para declarar la propiedad «host» con el valor o tipo «true».
    host: true,
  },
  // Esta línea sirve para declarar la propiedad «test» con el valor o tipo «{».
  test: {
    // Esta línea sirve para declarar la propiedad «environment» con el valor o tipo «'jsdom'».
    environment: 'jsdom',
    // Node 22+ trae una Web Storage API propia experimental, activada por
    // default (ver `node --help` -> --webstorage/--no-experimental-webstorage).
    // Choca con el localStorage que jsdom define en su propio `window`: el
    // getter de jsdom termina resolviendo a `undefined` en vez del Storage
    // real, así que cualquier store con `persist` de zustand (cart-store,
    // auth-store) rompe con "Cannot read properties of undefined (reading
    // 'setItem')" apenas hace el primer setState. Confirmado con un repro
    // mínimo: el mismo test pasa con este flag y falla sin él.
    // Esta línea sirve para declarar la propiedad «execArgv» con el valor o tipo «['--no-experimental-webstorage']».
    execArgv: ['--no-experimental-webstorage'],
    // Esta línea sirve para declarar la propiedad «globals» con el valor o tipo «true».
    globals: true,
    // Esta línea sirve para declarar la propiedad «setupFiles» con el valor o tipo «['./vitest.setup.ts']».
    setupFiles: ['./vitest.setup.ts'],
    // Sin esto, Vitest también intenta recolectar los specs de Playwright en
    // e2e/ (coinciden con el patrón *.spec.ts por defecto) y explotan porque
    // usan el runner de Playwright, no el de Vitest.
    // Esta línea sirve para declarar la propiedad «exclude» con el valor o tipo «['**/node_modules/**', 'e2e/**']».
    exclude: ['**/node_modules/**', 'e2e/**'],
  },
})
