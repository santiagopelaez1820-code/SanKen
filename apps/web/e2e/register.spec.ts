import { test, expect } from '@playwright/test'

// /auth/register tiene throttle:5,1 (5 intentos/min por IP) — igual que
// /auth/login (ver nota en login.spec.ts). Este archivo solo llama al
// endpoint una vez (el test de contraseñas no coincidentes falla la
// validación de zod en el cliente, nunca llega a la API).

test('shows a validation error when passwords do not match and stays on /register', async ({ page }) => {
  await page.goto('/register')
  await page.fill('#name', 'Mismatch Test')
  await page.fill('#email', `mismatch-${Date.now()}@sanken.app`)
  await page.fill('#password', 'Password123!')
  await page.fill('#password_confirmation', 'Different123!')
  await page.click('button[type=submit]')

  await expect(page.getByText(/las contraseñas no coinciden/i)).toBeVisible()
  await expect(page).toHaveURL(/\/register$/)
})

test('registers a new user, is routed through onboarding, and reaches the dashboard', async ({ page }) => {
  const email = `onb-${Date.now()}@sanken.app`

  await page.goto('/register')
  await page.fill('#name', 'Onboarding Test')
  await page.fill('#email', email)
  await page.fill('#password', 'Password123!')
  await page.fill('#password_confirmation', 'Password123!')
  await page.click('button[type=submit]')

  // Un usuario recién registrado no tiene onboarding_completed=true, así que
  // RequireAuth debe mandarlo a /onboarding en vez de /dashboard.
  await page.waitForURL(/\/onboarding$/, { timeout: 15000 })

  await page.fill('input[type=number]', '30') // age
  await page.click('text=Continuar')

  await page.click('text=Hombre') // sex
  await page.click('text=Continuar')

  await page.fill('input[type=number]', '180') // height
  await page.click('text=Continuar')

  await page.fill('input[type=number]', '82') // weight
  await page.click('text=Continuar')

  await page.selectOption('select', { index: 1 }) // country (primera opción real, index 0 es el placeholder)
  await page.click('text=Continuar')

  await page.waitForFunction(() => document.querySelectorAll('select')[0]?.options.length > 1)
  await page.selectOption('select', { index: 1 }) // city
  await page.click('text=Continuar')

  await page.click('text=Principiante') // level
  await page.click('text=Continuar')

  await page.click('text=Ganar músculo') // goals
  await page.click('text=Continuar')

  await page.click('text=3 días') // frequency
  await page.click('text=Continuar')

  await page.click('text=Generar mi plan') // equipment (optional, last step)

  await page.waitForURL(/\/dashboard$/, { timeout: 20000 })
})
