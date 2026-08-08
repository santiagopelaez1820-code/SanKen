import { test, expect, request as pwRequest } from '@playwright/test'
import { execSync } from 'node:child_process'

const API_URL = 'http://localhost:8000/api/v1'
// Email único por corrida: no hay endpoint de borrado de usuarios en la API,
// así que en vez de reusar+limpiar un fixture, cada corrida registra el suyo.
const EMAIL = `e2e-2fa-${Date.now()}@sanken.app`
const PASSWORD = 'E2eTwoFa123!'

function currentOtp(secret: string): string {
  return execSync(
    `php -r 'require "vendor/autoload.php"; $g = new \\PragmaRX\\Google2FA\\Google2FA(); echo $g->getCurrentOtp($argv[1]);' "${secret}"`,
    { cwd: '../api' },
  ).toString().trim()
}

test.beforeAll(async () => {
  const ctx = await pwRequest.newContext()
  const res = await ctx.post(`${API_URL}/auth/register`, {
    data: {
      name: 'E2E 2FA',
      email: EMAIL,
      password: PASSWORD,
      password_confirmation: PASSWORD,
    },
  })
  if (!res.ok()) {
    throw new Error(`fixture setup failed: ${res.status()} ${await res.text()}`)
  }
  await ctx.dispose()
})

test('activar, desafiar en el login, y desactivar 2FA de punta a punta', async ({ page }) => {
  await page.goto('/login')
  await page.fill('#email', EMAIL)
  await page.fill('#password', PASSWORD)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/\/dashboard$/)

  await page.click('text=Configuración')
  await expect(page).toHaveURL(/\/settings$/)
  await page.click('text=Activar 2FA')

  const secret = (await page.locator('p.font-mono').textContent())?.trim()
  expect(secret).toBeTruthy()

  await page.fill('#code', currentOtp(secret!))
  await page.click('text=Confirmar')
  await expect(page.getByText('2FA activado. Guarda estos códigos de recuperación:')).toBeVisible()

  await page.click('text=Ya los guardé')
  await expect(page.getByText('2FA está activado en tu cuenta.')).toBeVisible()

  // Cerrar sesión y volver a loguear: ahora debe pedir el segundo factor.
  await page.click('text=Volver')
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.click('text=Cerrar sesión')
  await expect(page).toHaveURL(/\/login$/)

  await page.fill('#email', EMAIL)
  await page.fill('#password', PASSWORD)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/\/login\/verify$/)

  await page.fill('#code', currentOtp(secret!))
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/\/dashboard$/)

  // Desactivar de nuevo para dejar la cuenta en un estado limpio.
  await page.click('text=Configuración')
  await page.fill('#password', PASSWORD)
  await page.click('text=Desactivar 2FA')
  await expect(page.getByText('Activar 2FA')).toBeVisible()
})
