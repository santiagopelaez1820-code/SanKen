import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'
import { execSync } from 'node:child_process'

const API_URL = 'http://localhost:8000/api/v1'
const RUN_ID = Date.now()
const PASSWORD = 'Challenges123!'

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

async function authedGet(ctx: APIRequestContext, token: string, path: string) {
  const res = await ctx.get(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok()) throw new Error(`GET ${path} failed: ${res.status()} ${await res.text()}`)
  return res.json()
}

async function completeOnboarding(ctx: APIRequestContext, token: string) {
  await authedPost(ctx, token, '/onboarding', {
    age: 28, sex: 'male', height_cm: 178, weight_kg: 80, city_id: 1, level: 'intermediate',
    goals: ['gain_muscle'], frequency_days: 4, session_minutes: 60, place: 'gym',
    equipment_available: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
    injuries: [],
  })
  await authedPost(ctx, token, '/onboarding/complete')
}

async function completeAWorkoutSession(ctx: APIRequestContext, token: string) {
  const exercises = (await authedGet(ctx, token, '/exercises')) as { data: { id: number }[] }
  const session = (await authedPost(ctx, token, '/workout-sessions')) as { data: { id: number } }
  const workoutExercise = (await authedPost(ctx, token, `/workout-sessions/${session.data.id}/exercises`, {
    exercise_id: exercises.data[0].id,
  })) as { data: { id: number } }
  await authedPost(ctx, token, `/workout-sessions/${session.data.id}/exercises/${workoutExercise.data.id}/sets`, {
    weight_kg: 50, reps: 10,
  })
  await authedPost(ctx, token, `/workout-sessions/${session.data.id}/complete`)
}

async function login(page: Page, email: string) {
  await page.goto('/login')
  await page.fill('#email', email)
  await page.fill('#password', PASSWORD)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/\/dashboard$/)
}

// Un solo login por UI en todo el archivo (el de A) — cada login real dispara
// 2 requests a /auth/login (POST real + algo más, a confirmar) y esta ruta
// tiene throttle:5,1; dos tests con login propio en la misma ventana de un
// minuto ya alcanzaban "Too Many Attempts". B nunca necesita abrir la UI:
// todo lo suyo (join, entrenamientos) va por API directa con pwRequest.
test('unirse a un reto refleja el progreso en la tabla y se actualiza en vivo por Reverb', async ({ page }) => {
  const ctx = await pwRequest.newContext()

  const nameA = `Reto Uno ${RUN_ID}`
  const nameB = `Reto Dos ${RUN_ID}`
  const emailA = `e2e-challenges-a-${RUN_ID}@sanken.app`
  const emailB = `e2e-challenges-b-${RUN_ID}@sanken.app`
  const tokenA = await registerUser(ctx, nameA, emailA)
  const tokenB = await registerUser(ctx, nameB, emailB)
  await completeOnboarding(ctx, tokenA)
  await completeOnboarding(ctx, tokenB)

  execSync('php artisan challenges:generate', { cwd: '../api' })

  const challenges = (await authedGet(ctx, tokenA, '/challenges')) as { data: { id: number; title: string }[] }
  const weekly = challenges.data.find((c) => c.title === 'Racha semanal')!

  await authedPost(ctx, tokenA, `/challenges/${weekly.id}/join`)
  await authedPost(ctx, tokenB, `/challenges/${weekly.id}/join`)
  // B entrena una vez más que A, así el orden inicial en la tabla es determinístico.
  await completeAWorkoutSession(ctx, tokenA)
  await completeAWorkoutSession(ctx, tokenB)
  await completeAWorkoutSession(ctx, tokenB)

  await login(page, emailA)
  await page.getByRole('link', { name: 'Retos' }).click()
  await expect(page).toHaveURL(/\/challenges$/)

  await expect(page.getByText('Racha semanal')).toBeVisible()
  await page.getByRole('button', { name: 'Ver tabla' }).click()

  const list = page.locator('ul').first()
  await expect(list.getByText(nameA)).toBeVisible()
  await expect(list.getByText(nameB)).toBeVisible()

  const rowTexts = await list.locator('li').allTextContents()
  const indexA = rowTexts.findIndex((t) => t.includes(nameA))
  const indexB = rowTexts.findIndex((t) => t.includes(nameB))
  expect(indexB).toBeLessThan(indexA)

  // Con la tabla ya abierta (suscripta al canal privado de Reverb), B
  // completa un tercer entrenamiento por la vía HTTP directa — sin refresh
  // ni interacción de A, lo único que puede haber actualizado su fila es
  // el websocket.
  const rowB = list.locator('li').filter({ hasText: nameB })
  await expect(rowB).toContainText('2')

  await completeAWorkoutSession(ctx, tokenB)
  await ctx.dispose()

  await expect(rowB).toContainText('3', { timeout: 10_000 })
})
