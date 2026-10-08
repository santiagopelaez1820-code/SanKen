// Esta línea sirve para importar «test, expect» desde «@playwright/test».
import { test, expect } from '@playwright/test'

// Navegador "nuevo": sin la elección de cookies que playwright.config.ts
// precarga para el resto de los specs.
// Esta línea sirve para usar un estado sin cookies para empezar sin sesión.
test.use({ storageState: { cookies: [], origins: [] } })

// Esta línea sirve para declarar la prueba que verifica que «legal documents are public and reachable from the login footer».
test('legal documents are public and reachable from the login footer', async ({ page }) => {
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/login')
  // Esta línea sirve para crear «footer» llamando a «page.getByRole».
  const footer = page.getByRole('navigation', { name: 'Privacidad y documentos legales' })

  // Esta línea sirve para esperar el resultado de «footer.getByRole».
  await footer.getByRole('link', { name: 'Términos y Condiciones' }).click()
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/legal\/terminos$/)
  // Esta línea sirve para esperar el resultado de «expect».
  await expect(page.getByRole('heading', { level: 1, name: 'Términos y Condiciones' })).toBeVisible()

  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/legal/privacidad')
  // Esta línea sirve para esperar el resultado de «expect».
  await expect(page.getByRole('heading', { level: 1, name: 'Política de Privacidad' })).toBeVisible()
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('button', { name: 'English' }).click()
  // Esta línea sirve para esperar el resultado de «expect».
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible()

  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/legal/cookies')
  // Esta línea sirve para esperar el resultado de «expect».
  await expect(page.getByRole('heading', { level: 1, name: /Política de Cookies|Cookie Policy/ })).toBeVisible()
})

// Esta línea sirve para declarar la prueba que verifica que «cookie banner: reject optional persists across reloads».
test('cookie banner: reject optional persists across reloads', async ({ page }) => {
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/login')
  // Esta línea sirve para crear «banner» llamando a «page.getByRole».
  const banner = page.getByRole('region', { name: 'Usamos cookies' })
  // Esta línea sirve para esperar y verificar «banner».
  await expect(banner).toBeVisible()

  // Esta línea sirve para esperar el resultado de «banner.getByRole».
  await banner.getByRole('button', { name: 'Rechazar opcionales' }).click()
  // Esta línea sirve para esperar y verificar «banner».
  await expect(banner).toBeHidden()

  // Esta línea sirve para esperar el resultado de «page.reload».
  await page.reload()
  // Esta línea sirve para esperar el resultado de «expect».
  await expect(page.getByRole('region', { name: 'Usamos cookies' })).toBeHidden()
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «stored».
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('sanken-cookie-consent') ?? 'null'))
  // Esta línea sirve para verificar que «stored.categories» cumple «toEqual».
  expect(stored.categories).toEqual({ necessary: true, preferences: false })
})

// Esta línea sirve para declarar la prueba que verifica que «cookie settings can be changed later from the footer».
test('cookie settings can be changed later from the footer', async ({ page }) => {
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/login')
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('region', { name: 'Usamos cookies' }).getByRole('button', { name: 'Aceptar todas' }).click()

  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('navigation', { name: 'Privacidad y documentos legales' }).getByRole('button', { name: 'Configuración de cookies' }).click()
  // Esta línea sirve para crear «dialog» llamando a «page.getByRole».
  const dialog = page.getByRole('dialog')
  // Esta línea sirve para esperar el resultado de «expect».
  await expect(dialog.getByRole('switch', { name: 'Preferencias' })).toBeChecked()
  // Esta línea sirve para esperar el resultado de «dialog.getByRole».
  await dialog.getByRole('switch', { name: 'Preferencias' }).uncheck()
  // Esta línea sirve para esperar el resultado de «dialog.getByRole».
  await dialog.getByRole('button', { name: 'Guardar preferencias' }).click()

  // Esta línea sirve para ejecutar la acción y guardar el resultado en «stored».
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('sanken-cookie-consent') ?? 'null'))
  // Esta línea sirve para verificar que «stored.categories.preferences» cumple «toBe».
  expect(stored.categories.preferences).toBe(false)
})

// Esta línea sirve para declarar la prueba que verifica que «legal pages have no horizontal overflow on a phone».
test('legal pages have no horizontal overflow on a phone', async ({ page }) => {
  // Esta línea sirve para esperar el resultado de «page.setViewportSize».
  await page.setViewportSize({ width: 360, height: 740 })
  // Esta línea sirve para recorrer las rutas de los documentos legales.
  for (const path of ['/legal/terminos', '/legal/privacidad', '/legal/cookies']) {
    // Esta línea sirve para esperar el resultado de «page.goto».
    await page.goto(path)
    // Esta línea sirve para ejecutar la acción y guardar el resultado en «overflow».
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    // Esta línea sirve para verificar que «overflow, path» cumple «toBeLessThanOrEqual».
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})
