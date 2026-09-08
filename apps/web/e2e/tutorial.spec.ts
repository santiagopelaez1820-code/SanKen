import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'

const API_URL = 'http://localhost:8000/api/v1'
const RUN_ID = Date.now()
const PASSWORD = 'Tutorial123!'

async function registerUser(ctx: APIRequestContext, name: string, email: string) {
  const res = await ctx.post(`${API_URL}/auth/register`, {
    data: { name, email, password: PASSWORD, password_confirmation: PASSWORD },
  })
  if (!res.ok()) throw new Error(`register failed: ${res.status()} ${await res.text()}`)
  return ((await res.json()) as { data: { token: string } }).data.token
}

async function completeOnboarding(ctx: APIRequestContext, token: string) {
  const headers = { Authorization: `Bearer ${token}` }
  await ctx.post(`${API_URL}/onboarding`, {
    data: {
      age: 28, sex: 'male', height_cm: 178, weight_kg: 80, city_id: 1, level: 'intermediate',
      goals: ['gain_muscle'], frequency_days: 4,
      equipment_available: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
    },
    headers,
  })
  await ctx.post(`${API_URL}/onboarding/complete`, { headers })
}

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.fill('#email', email)
  await page.fill('#password', PASSWORD)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/\/dashboard$/)
}

// Verifica el mecanismo real (useTutorial + SpotlightOverlay) para un
// usuario que nunca lo vio: aparece solo en /dashboard, navega entre pasos,
// se puede cerrar, y no reaparece en una recarga (persistencia por
// localStorage, ver tutorial-storage.ts). No pasa por el wizard de
// onboarding real (completeOnboarding va por API, mismo patrón que el
// resto de este suite) para no depender de su UI.
test('el tutorial guiado de Inicio aparece para un usuario nuevo, se navega, se cierra y no reaparece', async ({
  page,
}) => {
  const ctx = await pwRequest.newContext()
  const email = `e2e-tutorial-${RUN_ID}@sanken.app`
  const token = await registerUser(ctx, `Tutorial Test ${RUN_ID}`, email)
  await completeOnboarding(ctx, token)
  await ctx.dispose()

  await login(page, email)

  await expect(page.getByText('¡Bienvenido a SanKen! 👋')).toBeVisible({ timeout: 5000 })

  // El overlay bloquea la página real de atrás -- confirma que el clic en
  // "Siguiente" avanza al segundo paso en vez de interactuar con el fondo.
  await page.getByRole('button', { name: 'Siguiente' }).click()
  await expect(page.getByText('Tu entrenamiento de hoy')).toBeVisible()

  await page.getByRole('button', { name: 'Atrás' }).click()
  await expect(page.getByText('¡Bienvenido a SanKen! 👋')).toBeVisible()

  await page.getByRole('button', { name: 'Siguiente' }).click()
  await page.getByRole('button', { name: 'Siguiente' }).click()
  await expect(page.getByText('Todo lo demás está en el menú')).toBeVisible()
  await page.getByRole('button', { name: 'Entendido' }).click()

  await expect(page.getByText('¡Bienvenido a SanKen! 👋')).not.toBeVisible()

  // La página de atrás vuelve a ser interactiva.
  await page.getByRole('link', { name: 'Nutrición' }).click()
  await expect(page).toHaveURL(/\/nutrition$/)

  // Persistencia: recargar /dashboard no debe volver a mostrarlo.
  await page.goto('/dashboard')
  await expect(page.getByText('¿Listo para entrenar?')).toBeVisible({ timeout: 15_000 })
  await page.waitForTimeout(1000)
  await expect(page.getByText('¡Bienvenido a SanKen! 👋')).not.toBeVisible()
})
