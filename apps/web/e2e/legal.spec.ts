import { test, expect } from '@playwright/test'

// Navegador "nuevo": sin la elección de cookies que playwright.config.ts
// precarga para el resto de los specs.
test.use({ storageState: { cookies: [], origins: [] } })

test('legal documents are public and reachable from the login footer', async ({ page }) => {
  await page.goto('/login')
  const footer = page.getByRole('navigation', { name: 'Privacidad y documentos legales' })

  await footer.getByRole('link', { name: 'Términos y Condiciones' }).click()
  await expect(page).toHaveURL(/\/legal\/terminos$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Términos y Condiciones' })).toBeVisible()

  await page.goto('/legal/privacidad')
  await expect(page.getByRole('heading', { level: 1, name: 'Política de Privacidad' })).toBeVisible()
  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible()

  await page.goto('/legal/cookies')
  await expect(page.getByRole('heading', { level: 1, name: /Política de Cookies|Cookie Policy/ })).toBeVisible()
})

test('cookie banner: reject optional persists across reloads', async ({ page }) => {
  await page.goto('/login')
  const banner = page.getByRole('region', { name: 'Usamos cookies' })
  await expect(banner).toBeVisible()

  await banner.getByRole('button', { name: 'Rechazar opcionales' }).click()
  await expect(banner).toBeHidden()

  await page.reload()
  await expect(page.getByRole('region', { name: 'Usamos cookies' })).toBeHidden()
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('sanken-cookie-consent') ?? 'null'))
  expect(stored.categories).toEqual({ necessary: true, preferences: false })
})

test('cookie settings can be changed later from the footer', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('region', { name: 'Usamos cookies' }).getByRole('button', { name: 'Aceptar todas' }).click()

  await page.getByRole('navigation', { name: 'Privacidad y documentos legales' }).getByRole('button', { name: 'Configuración de cookies' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('switch', { name: 'Preferencias' })).toBeChecked()
  await dialog.getByRole('switch', { name: 'Preferencias' }).uncheck()
  await dialog.getByRole('button', { name: 'Guardar preferencias' }).click()

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('sanken-cookie-consent') ?? 'null'))
  expect(stored.categories.preferences).toBe(false)
})

test('legal pages have no horizontal overflow on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 })
  for (const path of ['/legal/terminos', '/legal/privacidad', '/legal/cookies']) {
    await page.goto(path)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, path).toBeLessThanOrEqual(0)
  }
})
