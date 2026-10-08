// Esta línea sirve para importar «test, expect» desde «@playwright/test».
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
// Esta línea sirve para declarar «EMAIL» con el valor «'workout-test@sanken.app'».
const EMAIL = 'workout-test@sanken.app'
// Esta línea sirve para declarar «PASSWORD» con el valor «'WorkoutTest123!'».
const PASSWORD = 'WorkoutTest123!'

// Esta línea sirve para declarar la prueba que verifica que «logs in with valid credentials and reaches the dashboard».
test('logs in with valid credentials and reaches the dashboard', async ({ page }) => {
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/login')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#email', EMAIL)
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password', PASSWORD)
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('button[type=submit]')

  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/dashboard$/)
})

// Esta línea sirve para declarar la prueba que verifica que «shows an error and stays on /login with a wrong password».
test('shows an error and stays on /login with a wrong password', async ({ page }) => {
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/login')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#email', EMAIL)
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password', 'wrong-password')
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('button[type=submit]')

  // Esta línea sirve para esperar y verificar «page.getByText(/credenciales/i».
  await expect(page.getByText(/credenciales/i)).toBeVisible()
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/login$/)
})
