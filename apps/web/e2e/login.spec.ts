import { test, expect } from '@playwright/test'

// Fixture pre-existente en la DB de desarrollo (ver memoria de sesiones
// anteriores) — sin 2FA, con onboarding completo, no requiere setup propio.
//
// Nota: /auth/login tiene throttle:5,1 (5 intentos/min por IP). Si esta
// suite se corre varias veces seguidas en menos de un minuto (o junto con
// otros specs/curl manuales contra el mismo backend), este test puede
// devolver "Too Many Attempts." en vez del error de credenciales — no es un
// bug del test, es el rate limit real de la API. Esperar ~60s entre corridas
// si eso pasa.
const EMAIL = 'workout-test@sanken.app'
const PASSWORD = 'WorkoutTest123!'

test('logs in with valid credentials and reaches the dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.fill('#email', EMAIL)
  await page.fill('#password', PASSWORD)
  await page.click('button[type=submit]')

  await expect(page).toHaveURL(/\/dashboard$/)
})

test('shows an error and stays on /login with a wrong password', async ({ page }) => {
  await page.goto('/login')
  await page.fill('#email', EMAIL)
  await page.fill('#password', 'wrong-password')
  await page.click('button[type=submit]')

  await expect(page.getByText(/credenciales/i)).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
})
