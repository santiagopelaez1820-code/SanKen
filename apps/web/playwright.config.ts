import { defineConfig, devices } from '@playwright/test'

// Los specs existentes navegan la app como un usuario que ya decidió sobre
// cookies: sin esto, el aviso de cookies (fijo abajo) podría tapar botones.
// e2e/legal.spec.ts arranca sin este estado para probar el propio aviso.
const COOKIE_CONSENT = JSON.stringify({
  version: '1.0',
  decidedAt: new Date().toISOString(),
  categories: { necessary: true, preferences: false },
})

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    storageState: {
      cookies: [],
      origins: [{ origin: 'http://localhost:5173', localStorage: [{ name: 'sanken-cookie-consent', value: COOKIE_CONSENT }] }],
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
