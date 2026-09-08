import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'
import { execSync } from 'node:child_process'

const API_URL = 'http://localhost:8000/api/v1'
const RUN_ID = Date.now()
const PASSWORD = 'AdminBan123!'

async function registerUser(ctx: APIRequestContext, name: string, email: string) {
  const res = await ctx.post(`${API_URL}/auth/register`, {
    data: { name, email, password: PASSWORD, password_confirmation: PASSWORD },
  })
  if (!res.ok()) throw new Error(`register failed: ${res.status()} ${await res.text()}`)
  const { data } = (await res.json()) as { data: { token: string; user: { id: number } } }
  return { token: data.token, id: data.user.id }
}

// El admin necesita llegar a /dashboard (y de ahí a /admin) tras loguearse;
// sin onboarding completo, RequireAuth lo manda a /onboarding en su lugar.
async function completeOnboarding(ctx: APIRequestContext, token: string) {
  const headers = { Authorization: `Bearer ${token}` }
  await ctx.post(`${API_URL}/onboarding`, {
    data: {
      age: 30, sex: 'male', height_cm: 180, weight_kg: 80, level: 'beginner',
      goals: ['gain_muscle'], frequency_days: 3,
    },
    headers,
  })
  await ctx.post(`${API_URL}/onboarding/complete`, { headers })
}

function promoteToAdmin(email: string) {
  execSync(
    `php artisan tinker --execute="App\\\\Models\\\\User::where('email','${email}')->update(['role'=>'super_admin']);"`,
    { cwd: '../api' },
  )
}

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.fill('#email', email)
  await page.fill('#password', PASSWORD)
  await page.click('button[type=submit]')
}

// Este spec prueba el baneo de admin, no el tutorial guiado -- lo marcamos
// como ya visto en localStorage antes de la primera navegación para no
// depender de que el clic en "Super Admin" en /dashboard le gane la carrera
// a la apertura automática del tutorial, que si no lo bloquearía con su
// overlay de pantalla completa (ver useTutorial).
async function dismissTutorials(page: Page, userId: number) {
  await page.addInitScript((id) => {
    for (const section of ['inicio', 'nutricion', 'tienda', 'retos', 'calendario', 'chat', 'mi-entrenador']) {
      localStorage.setItem(`sanken_tutorial_seen_${id}_${section}`, '1')
    }
  }, userId)
}

test('un admin banea a un usuario, y ese usuario ya no puede volver a loguearse', async ({ page, browser }) => {
  const ctx = await pwRequest.newContext()

  const targetName = `Baneado ${RUN_ID}`
  const targetEmail = `e2e-ban-target-${RUN_ID}@sanken.app`
  const adminEmail = `e2e-ban-admin-${RUN_ID}@sanken.app`

  await registerUser(ctx, targetName, targetEmail)
  const { token: adminToken, id: adminId } = await registerUser(ctx, `Admin ${RUN_ID}`, adminEmail)
  await completeOnboarding(ctx, adminToken)
  promoteToAdmin(adminEmail)
  await ctx.dispose()

  await dismissTutorials(page, adminId)
  await login(page, adminEmail)
  await expect(page).toHaveURL(/\/dashboard$/)

  await page.getByRole('link', { name: 'Super Admin' }).click()
  await expect(page).toHaveURL(/\/admin$/)
  await page.getByRole('link', { name: 'Usuarios' }).click()
  await expect(page).toHaveURL(/\/admin\/users$/)

  const row = page.locator('li').filter({ hasText: targetName })
  await expect(row).toBeVisible()
  await row.getByRole('button', { name: 'Banear' }).click()
  await expect(row.getByRole('button', { name: 'Desbanear' })).toBeVisible()

  // Sesión aparte (sin el token del admin) para probar el login real del
  // usuario baneado.
  const otherContext = await browser.newContext()
  const otherPage = await otherContext.newPage()
  await login(otherPage, targetEmail)

  await expect(otherPage.getByText(/suspendida/i)).toBeVisible()
  await expect(otherPage).toHaveURL(/\/login$/)

  await otherContext.close()
})
