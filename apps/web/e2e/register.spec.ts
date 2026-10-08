// Esta línea sirve para importar «test, expect» desde «@playwright/test».
import { test, expect } from '@playwright/test'

// /auth/register tiene throttle:5,1 (5 intentos/min por IP) — igual que
// /auth/login (ver nota en login.spec.ts). Este archivo solo llama al
// endpoint una vez (el test de contraseñas no coincidentes falla la
// validación de zod en el cliente, nunca llega a la API).

// Esta línea sirve para declarar la prueba que verifica que «shows a validation error when passwords do not match and stays on /reg».
test('shows a validation error when passwords do not match and stays on /register', async ({ page }) => {
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/register')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#name', 'Mismatch Test')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#email', `mismatch-${Date.now()}@sanken.app`)
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password', 'Password123!')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password_confirmation', 'Different123!')
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('button[type=submit]')

  // Esta línea sirve para esperar y verificar «page.getByText(/las contraseñas no coinciden/i».
  await expect(page.getByText(/las contraseñas no coinciden/i)).toBeVisible()
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/register$/)
})

// Esta línea sirve para declarar la prueba que verifica que «registers a new user, is routed through onboarding, and reaches the da».
test('registers a new user, is routed through onboarding, and reaches the dashboard', async ({ page }) => {
  // Esta línea sirve para extraer «mai» de «`onb-${Date.now()}@sanken.app`».
  const email = `onb-${Date.now()}@sanken.app`

  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/register')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#name', 'Onboarding Test')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#email', email)
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password', 'Password123!')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password_confirmation', 'Password123!')
  // Consentimientos obligatorios (una casilla por finalidad).
  // Esta línea sirve para esperar el resultado de «page.check».
  await page.check('#register-terms')
  // Esta línea sirve para esperar el resultado de «page.check».
  await page.check('#register-privacy')
  // Esta línea sirve para esperar el resultado de «page.check».
  await page.check('#register-health_data')
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('button[type=submit]')

  // Un usuario recién registrado no tiene onboarding_completed=true, así que
  // RequireAuth debe mandarlo a /onboarding en vez de /dashboard.
  // Esta línea sirve para esperar el resultado de «page.waitForURL».
  await page.waitForURL(/\/onboarding$/, { timeout: 15000 })

  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('input[type=number]', '30') // age
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Continuar')

  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Hombre') // sex
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Continuar')

  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('input[type=number]', '180') // height
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Continuar')

  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('input[type=number]', '82') // weight
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Continuar')

  // Esta línea sirve para esperar el resultado de «page.selectOption».
  await page.selectOption('select', { index: 1 }) // country (primera opción real, index 0 es el placeholder)
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Continuar')

  // Esta línea sirve para esperar el resultado de «page.waitForFunction».
  await page.waitForFunction(() => document.querySelectorAll('select')[0]?.options.length > 1)
  // Esta línea sirve para esperar el resultado de «page.selectOption».
  await page.selectOption('select', { index: 1 }) // city
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Continuar')

  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Principiante') // level
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Continuar')

  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Ganar músculo') // goals
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Continuar')

  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=3 días') // frequency
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Continuar')

  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Generar mi plan') // equipment (optional, last step)

  // Esta línea sirve para esperar el resultado de «page.waitForURL».
  await page.waitForURL(/\/dashboard$/, { timeout: 20000 })
})

// Esta línea sirve para declarar la prueba que verifica que «cannot create an account without accepting the legal documents».
test('cannot create an account without accepting the legal documents', async ({ page }) => {
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/register')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#name', 'No Consent')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#email', `noconsent-${Date.now()}@sanken.app`)
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password', 'Password123!')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password_confirmation', 'Password123!')
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('button[type=submit]')

  // Esta línea sirve para esperar el resultado de «expect».
  await expect(page.getByText('Debes aceptar los Términos y Condiciones.')).toBeVisible()
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/register$/)
})
