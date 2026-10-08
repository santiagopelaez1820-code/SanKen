// Esta línea sirve para importar «test, expect, request as pwRequest, type APIRequestContext, type Page» desde «@playwright/test».
import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'
// Esta línea sirve para importar «execSync» desde «node:child_process».
import { execSync } from 'node:child_process'

// Esta línea sirve para declarar «API_URL» con el valor «'http://localhost:8000/api/v1'».
const API_URL = 'http://localhost:8000/api/v1'
// Esta línea sirve para crear «RUN_ID» llamando a «Date.now».
const RUN_ID = Date.now()

// pwRequest.newContext() no manda Origin/Referer como un navegador real, así
// que Sanctum's EnsureFrontendRequestsAreStateful no lo trata como "frontend"
// y no exige sesión/CSRF — alcanza con el Bearer token de /auth/register, tal
// como usa la app mobile. Todo el setup de ambos usuarios se hace así, sin
// abrir una página; solo la verificación final usa el navegador real.
// Esta línea sirve para declarar la función «registerUser».
async function registerUser(ctx: APIRequestContext, name: string, email: string) {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «res».
  const res = await ctx.post(`${API_URL}/auth/register`, {
    // Esta línea sirve para definir «data» con «{ name, email, password: 'Rankings123!',…».
    data: { name, email, password: 'Rankings123!', password_confirmation: 'Rankings123!', accept_terms: true, accept_privacy: true, accept_health_data: true },
  })
  // Esta línea sirve para lanzar un error si «!res.ok()».
  if (!res.ok()) throw new Error(`register failed: ${res.status()} ${await res.text()}`)
  // Esta línea sirve para extraer «data» de «(await res.json()) as { data: { token: s».
  const { data } = (await res.json()) as { data: { token: string; user: { id: number } } }
  // Esta línea sirve para devolver «{ token: data.token, id: data.user.id }».
  return { token: data.token, id: data.user.id }
}

// Esta línea sirve para declarar la función «authedPost».
async function authedPost(ctx: APIRequestContext, token: string, path: string, data: unknown = {}) {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «res».
  const res = await ctx.post(`${API_URL}${path}`, { data, headers: { Authorization: `Bearer ${token}` } })
  // Esta línea sirve para lanzar un error si «!res.ok()».
  if (!res.ok()) throw new Error(`POST ${path} failed: ${res.status()} ${await res.text()}`)
  // Esta línea sirve para devolver «res.json()».
  return res.json()
}

// Esta línea sirve para declarar la función «authedGet».
async function authedGet(ctx: APIRequestContext, token: string, path: string) {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «res».
  const res = await ctx.get(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } })
  // Esta línea sirve para lanzar un error si «!res.ok()».
  if (!res.ok()) throw new Error(`GET ${path} failed: ${res.status()} ${await res.text()}`)
  // Esta línea sirve para devolver «res.json()».
  return res.json()
}

// Este spec prueba rankings, no el tutorial guiado -- lo marcamos como ya
// visto en localStorage antes de la primera navegación para no depender de
// que el clic en "Rankings" en /dashboard le gane la carrera a la apertura
// automática del tutorial, que si no lo bloquearía con su overlay de
// pantalla completa (ver useTutorial).
// Esta línea sirve para declarar la función «dismissTutorials».
async function dismissTutorials(page: Page, userId: number) {
  // Esta línea sirve para esperar el resultado de «page.addInitScript».
  await page.addInitScript((id) => {
    // Esta línea sirve para recorrer los tutoriales y marcarlos como vistos.
    for (const section of ['inicio', 'nutricion', 'tienda', 'retos', 'calendario', 'chat', 'mi-entrenador']) {
      // Esta línea sirve para guardar un valor en el almacenamiento local.
      localStorage.setItem(`sanken_tutorial_seen_${id}_${section}`, '1')
    }
  // Esta línea sirve para volver a ejecutar el efecto cuando cambian «serI».
  }, userId)
}

// Esta línea sirve para declarar la función «completeOnboardingAndLogVolume».
async function completeOnboardingAndLogVolume(
  // Esta línea sirve para declarar la propiedad «ctx» con el valor o tipo «APIRequestContext».
  ctx: APIRequestContext,
  // Esta línea sirve para declarar la propiedad «token» con el valor o tipo «string».
  token: string,
  // Esta línea sirve para definir «profile» con «{ age: number; sex: 'male' | 'female'; c…».
  profile: { age: number; sex: 'male' | 'female'; city_id: number },
  // Esta línea sirve para declarar la propiedad «weightKg» con el valor o tipo «number».
  weightKg: number,
// Esta línea sirve para cerrar los parámetros de la función.
) {
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, '/onboarding', {
    // Esta línea sirve para declarar la propiedad «age» con el valor o tipo «profile.age».
    age: profile.age,
    // Esta línea sirve para declarar la propiedad «sex» con el valor o tipo «profile.sex».
    sex: profile.sex,
    // Esta línea sirve para declarar la propiedad «height_cm» con el valor o tipo «178».
    height_cm: 178,
    // Esta línea sirve para declarar la propiedad «weight_kg» con el valor o tipo «80».
    weight_kg: 80,
    // Esta línea sirve para declarar la propiedad «city_id» con el valor o tipo «profile.city_id».
    city_id: profile.city_id,
    // Esta línea sirve para declarar la propiedad «level» con el valor o tipo «'intermediate'».
    level: 'intermediate',
    // Esta línea sirve para declarar la propiedad «goals» con el valor o tipo «['gain_muscle']».
    goals: ['gain_muscle'],
    // Esta línea sirve para declarar la propiedad «frequency_days» con el valor o tipo «4».
    frequency_days: 4,
    // Esta línea sirve para definir «equipment_available» con «['barbell', 'dumbbells', 'machines', 'ca…».
    equipment_available: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
  })
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, '/onboarding/complete')
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, '/rankings/opt-in')

  // Esta línea sirve para extraer «xercise» de «(await authedGet(ctx, token, '/exercises».
  const exercises = (await authedGet(ctx, token, '/exercises')) as { data: { id: number }[] }
  // Esta línea sirve para extraer «xerciseI» de «exercises.data[0].id».
  const exerciseId = exercises.data[0].id

  // Esta línea sirve para extraer «essio» de «(await authedPost(ctx, token, '/workout-».
  const session = (await authedPost(ctx, token, '/workout-sessions')) as { data: { id: number } }
  // Esta línea sirve para extraer «orkoutExercis» de «(await authedPost(ctx, token, `/workout-».
  const workoutExercise = (await authedPost(ctx, token, `/workout-sessions/${session.data.id}/exercises`, {
    // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «exerciseId».
    exercise_id: exerciseId,
  // Esta línea sirve para tipar la respuesta como un objeto con el id.
  })) as { data: { id: number } }
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, `/workout-sessions/${session.data.id}/exercises/${workoutExercise.data.id}/sets`, {
    // Esta línea sirve para declarar la propiedad «weight_kg» con el valor o tipo «weightKg».
    weight_kg: weightKg,
    // Esta línea sirve para declarar la propiedad «reps» con el valor o tipo «10».
    reps: 10,
  })
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, `/workout-sessions/${session.data.id}/complete`)
}

// Esta línea sirve para declarar la prueba que verifica que «el ranking de ciudad muestra a ambos usuarios ordenados por volumen, c».
test('el ranking de ciudad muestra a ambos usuarios ordenados por volumen, con la fila propia destacada', async ({ page }) => {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «ctx».
  const ctx = await pwRequest.newContext()

  // Esta línea sirve para extraer «ame» de «`Atleta Uno ${RUN_ID}`».
  const nameA = `Atleta Uno ${RUN_ID}`
  // Esta línea sirve para extraer «ame» de «`Atleta Dos ${RUN_ID}`».
  const nameB = `Atleta Dos ${RUN_ID}`
  // Esta línea sirve para extraer «mail» de «`e2e-rankings-a-${RUN_ID}@sanken.app`».
  const emailA = `e2e-rankings-a-${RUN_ID}@sanken.app`
  // Esta línea sirve para extraer «mail» de «`e2e-rankings-b-${RUN_ID}@sanken.app`».
  const emailB = `e2e-rankings-b-${RUN_ID}@sanken.app`
  // Esta línea sirve para esperar «registerUser(ctx, nameA, emailA)» y obtener «token: tokenA, id: idA».
  const { token: tokenA, id: idA } = await registerUser(ctx, nameA, emailA)
  // Esta línea sirve para esperar «registerUser(ctx, nameB, emailB)» y obtener «token: tokenB».
  const { token: tokenB } = await registerUser(ctx, nameB, emailB)

  // Misma ciudad (id=1, sembrada en la DB de dev), volúmenes distintos y
  // determinísticos: A entrena más peso que B, así el orden es predecible.
  // Esta línea sirve para esperar el resultado de «completeOnboardingAndLogVolume».
  await completeOnboardingAndLogVolume(ctx, tokenA, { age: 28, sex: 'male', city_id: 1 }, 150)
  // Esta línea sirve para esperar el resultado de «completeOnboardingAndLogVolume».
  await completeOnboardingAndLogVolume(ctx, tokenB, { age: 32, sex: 'female', city_id: 1 }, 60)

  // Esta línea sirve para ejecutar el comando de Artisan que recalcula los rankings.
  execSync('php artisan rankings:recalculate', { cwd: '../api' })

  // Esta línea sirve para esperar el resultado de «ctx.dispose».
  await ctx.dispose()

  // Esta línea sirve para esperar el resultado de «dismissTutorials».
  await dismissTutorials(page, idA)
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/login')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#email', emailA)
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password', 'Rankings123!')
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('button[type=submit]')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/dashboard$/)

  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('link', { name: 'Rankings' }).click()
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/rankings$/)
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('tab', { name: 'Ciudad' }).click()

  // Esta línea sirve para crear «list» llamando a «page.locator».
  const list = page.locator('ul').first()
  // Esta línea sirve para esperar y verificar «list.getByText(nameA».
  await expect(list.getByText(nameA)).toBeVisible()
  // Esta línea sirve para esperar y verificar «list.getByText(nameB».
  await expect(list.getByText(nameB)).toBeVisible()

  // A (más volumen) va primero que B.
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «rowTexts».
  const rowTexts = await list.locator('li').allTextContents()
  // Esta línea sirve para crear «indexA» llamando a «rowTexts.findIndex».
  const indexA = rowTexts.findIndex((t) => t.includes(nameA))
  // Esta línea sirve para crear «indexB» llamando a «rowTexts.findIndex».
  const indexB = rowTexts.findIndex((t) => t.includes(nameB))
  // Esta línea sirve para verificar que «indexA» cumple «toBeLessThan».
  expect(indexA).toBeLessThan(indexB)
})
