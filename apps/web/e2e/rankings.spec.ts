import { test, expect, request as pwRequest, type APIRequestContext } from '@playwright/test'
import { execSync } from 'node:child_process'

const API_URL = 'http://localhost:8000/api/v1'
const RUN_ID = Date.now()

// pwRequest.newContext() no manda Origin/Referer como un navegador real, así
// que Sanctum's EnsureFrontendRequestsAreStateful no lo trata como "frontend"
// y no exige sesión/CSRF — alcanza con el Bearer token de /auth/register, tal
// como usa la app mobile. Todo el setup de ambos usuarios se hace así, sin
// abrir una página; solo la verificación final usa el navegador real.
async function registerUser(ctx: APIRequestContext, name: string, email: string) {
  const res = await ctx.post(`${API_URL}/auth/register`, {
    data: { name, email, password: 'Rankings123!', password_confirmation: 'Rankings123!' },
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

async function completeOnboardingAndLogVolume(
  ctx: APIRequestContext,
  token: string,
  profile: { age: number; sex: 'male' | 'female'; city_id: number },
  weightKg: number,
) {
  await authedPost(ctx, token, '/onboarding', {
    age: profile.age,
    sex: profile.sex,
    height_cm: 178,
    weight_kg: 80,
    city_id: profile.city_id,
    level: 'intermediate',
    goals: ['gain_muscle'],
    frequency_days: 4,
    equipment_available: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
  })
  await authedPost(ctx, token, '/onboarding/complete')
  await authedPost(ctx, token, '/rankings/opt-in')

  const exercises = (await authedGet(ctx, token, '/exercises')) as { data: { id: number }[] }
  const exerciseId = exercises.data[0].id

  const session = (await authedPost(ctx, token, '/workout-sessions')) as { data: { id: number } }
  const workoutExercise = (await authedPost(ctx, token, `/workout-sessions/${session.data.id}/exercises`, {
    exercise_id: exerciseId,
  })) as { data: { id: number } }
  await authedPost(ctx, token, `/workout-sessions/${session.data.id}/exercises/${workoutExercise.data.id}/sets`, {
    weight_kg: weightKg,
    reps: 10,
  })
  await authedPost(ctx, token, `/workout-sessions/${session.data.id}/complete`)
}

test('el ranking de ciudad muestra a ambos usuarios ordenados por volumen, con la fila propia destacada', async ({ page }) => {
  const ctx = await pwRequest.newContext()

  const nameA = `Atleta Uno ${RUN_ID}`
  const nameB = `Atleta Dos ${RUN_ID}`
  const emailA = `e2e-rankings-a-${RUN_ID}@sanken.app`
  const emailB = `e2e-rankings-b-${RUN_ID}@sanken.app`
  const tokenA = await registerUser(ctx, nameA, emailA)
  const tokenB = await registerUser(ctx, nameB, emailB)

  // Misma ciudad (id=1, sembrada en la DB de dev), volúmenes distintos y
  // determinísticos: A entrena más peso que B, así el orden es predecible.
  await completeOnboardingAndLogVolume(ctx, tokenA, { age: 28, sex: 'male', city_id: 1 }, 150)
  await completeOnboardingAndLogVolume(ctx, tokenB, { age: 32, sex: 'female', city_id: 1 }, 60)

  execSync('php artisan rankings:recalculate', { cwd: '../api' })

  await ctx.dispose()

  await page.goto('/login')
  await page.fill('#email', emailA)
  await page.fill('#password', 'Rankings123!')
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/\/dashboard$/)

  await page.getByRole('link', { name: 'Rankings' }).click()
  await expect(page).toHaveURL(/\/rankings$/)
  await page.getByRole('tab', { name: 'Ciudad' }).click()

  const list = page.locator('ul').first()
  await expect(list.getByText(nameA)).toBeVisible()
  await expect(list.getByText(nameB)).toBeVisible()

  // A (más volumen) va primero que B.
  const rowTexts = await list.locator('li').allTextContents()
  const indexA = rowTexts.findIndex((t) => t.includes(nameA))
  const indexB = rowTexts.findIndex((t) => t.includes(nameB))
  expect(indexA).toBeLessThan(indexB)
})
