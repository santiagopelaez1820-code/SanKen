import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'

const API_URL = 'http://localhost:8000/api/v1'
const RUN_ID = Date.now()
const PASSWORD = 'Nutrition123!'

async function registerUser(ctx: APIRequestContext, name: string, email: string) {
  const res = await ctx.post(`${API_URL}/auth/register`, {
    data: { name, email, password: PASSWORD, password_confirmation: PASSWORD },
  })
  if (!res.ok()) throw new Error(`register failed: ${res.status()} ${await res.text()}`)
  return ((await res.json()) as { data: { token: string } }).data.token
}

async function authedPost(ctx: APIRequestContext, token: string, path: string, data: unknown = {}) {
  const res = await ctx.post(`${API_URL}${path}`, { data, headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok()) throw new Error(`POST ${path} failed: ${res.status()} ${await res.text()}`)
  return res.json()
}

async function completeOnboarding(ctx: APIRequestContext, token: string) {
  await authedPost(ctx, token, '/onboarding', {
    age: 28, sex: 'male', height_cm: 178, weight_kg: 80, city_id: 1, level: 'intermediate',
    goals: ['gain_muscle'], frequency_days: 4,
    equipment_available: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
  })
  await authedPost(ctx, token, '/onboarding/complete')
}

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.fill('#email', email)
  await page.fill('#password', PASSWORD)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/\/dashboard$/)
}

// La búsqueda pega contra Open Food Facts real (sin API key, mismo enfoque
// que OpenFoodFactsClient — ver plan Sprint 12) así que usamos un término
// común ("banana") que consistentemente devuelve resultados en vez de
// mockear la red, cosa que sí hacemos del lado PHP (Http::fake en
// NutritionApiTest) pero que este spec no puede hacer contra el server real.
test('completar el perfil habilita los objetivos, y registrar una comida por búsqueda actualiza el total diario', async ({
  page,
}) => {
  // La búsqueda de alimentos pega contra Open Food Facts real (sin mock),
  // así que este spec necesita más margen que el default de 30s.
  test.setTimeout(90_000)

  const ctx = await pwRequest.newContext()

  const name = `Nutri Test ${RUN_ID}`
  const email = `e2e-nutrition-${RUN_ID}@sanken.app`
  const token = await registerUser(ctx, name, email)
  await completeOnboarding(ctx, token)
  await ctx.dispose()

  await login(page, email)
  await page.getByRole('link', { name: 'Nutrición' }).click()
  await expect(page).toHaveURL(/\/nutrition$/)

  await expect(page.getByText('Calorías', { exact: true })).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText('Proteína', { exact: true })).toBeVisible()

  await page.getByPlaceholder('Buscar alimento…').fill('banana')
  await page.getByRole('button', { name: 'Buscar' }).click()

  const firstResult = page.getByRole('button').filter({ hasText: 'kcal/100g' }).first()
  await expect(firstResult).toBeVisible({ timeout: 15_000 })
  await firstResult.click()

  await page.fill('#grams', '150')
  await page.selectOption('#meal-type', 'lunch')
  await page.getByRole('button', { name: 'Registrar' }).click()

  const lunchSection = page.locator('section').filter({ hasText: 'Almuerzo' })
  await expect(lunchSection.getByText('150g')).toBeVisible()
  await expect(page.getByText(/Hoy llevás/)).not.toContainText('0 kcal')
})
