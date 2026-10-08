// Esta línea sirve para importar «defineConfig, devices» desde «@playwright/test».
import { defineConfig, devices } from '@playwright/test'

// Los specs existentes navegan la app como un usuario que ya decidió sobre
// cookies: sin esto, el aviso de cookies (fijo abajo) podría tapar botones.
// e2e/legal.spec.ts arranca sin este estado para probar el propio aviso.
// Esta línea sirve para declarar «COOKIE_CONSENT» con el valor «JSON.stringify({».
const COOKIE_CONSENT = JSON.stringify({
  // Esta línea sirve para declarar la propiedad «version» con el valor o tipo «'1.0'».
  version: '1.0',
  // Esta línea sirve para declarar la propiedad «decidedAt» con el valor o tipo «new Date().toISOString()».
  decidedAt: new Date().toISOString(),
  // Esta línea sirve para declarar la propiedad «categories» con el valor o tipo «{ necessary: true, preferences: false }».
  categories: { necessary: true, preferences: false },
})

// Esta línea sirve para exportar la configuración de Playwright.
export default defineConfig({
  // Esta línea sirve para declarar la propiedad «testDir» con el valor o tipo «'./e2e'».
  testDir: './e2e',
  // Esta línea sirve para declarar la propiedad «fullyParallel» con el valor o tipo «false».
  fullyParallel: false,
  // Esta línea sirve para declarar la propiedad «retries» con el valor o tipo «0».
  retries: 0,
  // Esta línea sirve para declarar la propiedad «reporter» con el valor o tipo «'list'».
  reporter: 'list',
  // Esta línea sirve para declarar la propiedad «use» con el valor o tipo «{».
  use: {
    // Esta línea sirve para declarar la propiedad «baseURL» con el valor o tipo «'http://localhost:5173'».
    baseURL: 'http://localhost:5173',
    // Esta línea sirve para declarar la propiedad «trace» con el valor o tipo «'retain-on-failure'».
    trace: 'retain-on-failure',
    // Esta línea sirve para declarar la propiedad «storageState» con el valor o tipo «{».
    storageState: {
      // Esta línea sirve para declarar la propiedad «cookies» con el valor o tipo «[]».
      cookies: [],
      // Esta línea sirve para definir «origins» con «[{ origin: 'http://localhost:5173', loca…».
      origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'sanken-cookie-consent', value: COOKIE_CONSENT }] }],
    },
  },
  // Esta línea sirve para declarar la propiedad «projects» con el valor o tipo «[».
  projects: [
    // Esta línea sirve para agregar un elemento cuyo «name» es «'chromium', use: { ...devices['Desktop C…».
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Esta línea sirve para declarar la propiedad «webServer» con el valor o tipo «{».
  webServer: {
    // Esta línea sirve para declarar la propiedad «command» con el valor o tipo «'npm run dev'».
    command: 'npm run dev',
    // Esta línea sirve para declarar la propiedad «url» con el valor o tipo «'http://localhost:5173'».
    url: 'http://localhost:5173',
    // Esta línea sirve para declarar la propiedad «reuseExistingServer» con el valor o tipo «true».
    reuseExistingServer: true,
    // Esta línea sirve para declarar la propiedad «timeout» con el valor o tipo «30_000».
    timeout: 30_000,
  },
})
