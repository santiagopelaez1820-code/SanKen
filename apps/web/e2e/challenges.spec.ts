// Esta línea sirve para importar «test, expect, request as pwRequest, type APIRequestContext, type Page» desde «@playwright/test».
import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'
// Esta línea sirve para importar «execSync» desde «node:child_process».
import { execSync } from 'node:child_process'

// Esta línea sirve para declarar «API_URL» con el valor «'http://localhost:8000/api/v1'».
const API_URL = 'http://localhost:8000/api/v1'
// Esta línea sirve para crear «RUN_ID» llamando a «Date.now».
const RUN_ID = Date.now()
// Esta línea sirve para declarar «PASSWORD» con el valor «'Challenges123!'».
const PASSWORD = 'Challenges123!'

// Esta línea sirve para declarar la función «registerUser».
async function registerUser(ctx: APIRequestContext, name: string, email: string) {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «res».
  const res = await ctx.post(`${API_URL}/auth/register`, {
    // Esta línea sirve para enviar los datos del registro con los consentimientos aceptados.
    data: { name, email, password: PASSWORD, password_confirmation: PASSWORD, accept_terms: true, accept_privacy: true, accept_health_data: true },
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

// Esta línea sirve para declarar la función «completeOnboarding».
async function completeOnboarding(ctx: APIRequestContext, token: string) {
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, '/onboarding', {
    // Esta línea sirve para enviar las respuestas del onboarding con perfil intermedio.
    age: 28, sex: 'male', height_cm: 178, weight_kg: 80, city_id: 1, level: 'intermediate',
    // Esta línea sirve para declarar la propiedad «goals» con el valor o tipo «['gain_muscle'], frequency_days: 4».
    goals: ['gain_muscle'], frequency_days: 4,
    // Esta línea sirve para indicar el equipamiento disponible.
    equipment_available: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
  })
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, '/onboarding/complete')
}

// Esta línea sirve para declarar la función «completeAWorkoutSession».
async function completeAWorkoutSession(ctx: APIRequestContext, token: string) {
  // Esta línea sirve para extraer «xercise» de «(await authedGet(ctx, token, '/exercises».
  const exercises = (await authedGet(ctx, token, '/exercises')) as { data: { id: number }[] }
  // Esta línea sirve para extraer «essio» de «(await authedPost(ctx, token, '/workout-».
  const session = (await authedPost(ctx, token, '/workout-sessions')) as { data: { id: number } }
  // Esta línea sirve para extraer «orkoutExercis» de «(await authedPost(ctx, token, `/workout-».
  const workoutExercise = (await authedPost(ctx, token, `/workout-sessions/${session.data.id}/exercises`, {
    // Esta línea sirve para declarar la propiedad «exercise_id» con el valor o tipo «exercises.data[0].id».
    exercise_id: exercises.data[0].id,
  // Esta línea sirve para tipar la respuesta como un objeto con el id.
  })) as { data: { id: number } }
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, `/workout-sessions/${session.data.id}/exercises/${workoutExercise.data.id}/sets`, {
    // Esta línea sirve para declarar la propiedad «weight_kg» con el valor o tipo «50, reps: 10».
    weight_kg: 50, reps: 10,
  })
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, `/workout-sessions/${session.data.id}/complete`)
}

// Esta línea sirve para declarar la función «login».
async function login(page: Page, email: string) {
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/login')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#email', email)
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password', PASSWORD)
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('button[type=submit]')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/dashboard$/)
}

// Este spec prueba retos, no el tutorial guiado de cada sección -- lo
// marcamos como ya visto en localStorage antes de la primera navegación
// para no depender de que un clic real (el link "Retos" en /dashboard, el
// botón "Ver tabla" en /challenges) le gane la carrera a la apertura
// automática del tutorial, que si no bloquearía el clic con su overlay de
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

// Un solo login por UI en todo el archivo (el de A) — cada login real dispara
// 2 requests a /auth/login (POST real + algo más, a confirmar) y esta ruta
// tiene throttle:5,1; dos tests con login propio en la misma ventana de un
// minuto ya alcanzaban "Too Many Attempts". B nunca necesita abrir la UI:
// todo lo suyo (join, entrenamientos) va por API directa con pwRequest.
// Esta línea sirve para declarar la prueba que verifica que «unirse a un reto refleja el progreso en la tabla y se actualiza en viv».
test('unirse a un reto refleja el progreso en la tabla y se actualiza en vivo por Reverb', async ({ page }) => {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «ctx».
  const ctx = await pwRequest.newContext()

  // Esta línea sirve para extraer «ame» de «`Reto Uno ${RUN_ID}`».
  const nameA = `Reto Uno ${RUN_ID}`
  // Esta línea sirve para extraer «ame» de «`Reto Dos ${RUN_ID}`».
  const nameB = `Reto Dos ${RUN_ID}`
  // Esta línea sirve para extraer «mail» de «`e2e-challenges-a-${RUN_ID}@sanken.app`».
  const emailA = `e2e-challenges-a-${RUN_ID}@sanken.app`
  // Esta línea sirve para extraer «mail» de «`e2e-challenges-b-${RUN_ID}@sanken.app`».
  const emailB = `e2e-challenges-b-${RUN_ID}@sanken.app`
  // Esta línea sirve para esperar «registerUser(ctx, nameA, emailA)» y obtener «token: tokenA, id: idA».
  const { token: tokenA, id: idA } = await registerUser(ctx, nameA, emailA)
  // Esta línea sirve para esperar «registerUser(ctx, nameB, emailB)» y obtener «token: tokenB».
  const { token: tokenB } = await registerUser(ctx, nameB, emailB)
  // Esta línea sirve para esperar el resultado de «completeOnboarding».
  await completeOnboarding(ctx, tokenA)
  // Esta línea sirve para esperar el resultado de «completeOnboarding».
  await completeOnboarding(ctx, tokenB)

  // Esta línea sirve para ejecutar el comando de Artisan que genera los retos.
  execSync('php artisan challenges:generate', { cwd: '../api' })

  // Esta línea sirve para extraer «hallenge» de «(await authedGet(ctx, tokenA, '/challeng».
  const challenges = (await authedGet(ctx, tokenA, '/challenges')) as { data: { id: number; title: string }[] }
  // Esta línea sirve para crear «weekly» llamando a «challenges.data.find».
  const weekly = challenges.data.find((c) => c.title === 'Racha semanal')!

  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, tokenA, `/challenges/${weekly.id}/join`)
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, tokenB, `/challenges/${weekly.id}/join`)
  // B entrena una vez más que A, así el orden inicial en la tabla es determinístico.
  // Esta línea sirve para esperar el resultado de «completeAWorkoutSession».
  await completeAWorkoutSession(ctx, tokenA)
  // Esta línea sirve para esperar el resultado de «completeAWorkoutSession».
  await completeAWorkoutSession(ctx, tokenB)
  // Esta línea sirve para esperar el resultado de «completeAWorkoutSession».
  await completeAWorkoutSession(ctx, tokenB)

  // Esta línea sirve para esperar el resultado de «dismissTutorials».
  await dismissTutorials(page, idA)
  // Esta línea sirve para esperar el resultado de «login».
  await login(page, emailA)
  // Retos ya no está en la barra principal (cedió su lugar a PR): se entra por URL.
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/challenges')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/challenges$/)

  // Esta línea sirve para esperar y verificar «page.getByText('Racha semanal'».
  await expect(page.getByText('Racha semanal')).toBeVisible()
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('button', { name: 'Ver tabla' }).click()

  // Esta línea sirve para crear «list» llamando a «page.locator».
  const list = page.locator('ul').first()
  // Esta línea sirve para esperar y verificar «list.getByText(nameA».
  await expect(list.getByText(nameA)).toBeVisible()
  // Esta línea sirve para esperar y verificar «list.getByText(nameB».
  await expect(list.getByText(nameB)).toBeVisible()

  // Esta línea sirve para ejecutar la acción y guardar el resultado en «rowTexts».
  const rowTexts = await list.locator('li').allTextContents()
  // Esta línea sirve para crear «indexA» llamando a «rowTexts.findIndex».
  const indexA = rowTexts.findIndex((t) => t.includes(nameA))
  // Esta línea sirve para crear «indexB» llamando a «rowTexts.findIndex».
  const indexB = rowTexts.findIndex((t) => t.includes(nameB))
  // Esta línea sirve para verificar que «indexB» cumple «toBeLessThan».
  expect(indexB).toBeLessThan(indexA)

  // Con la tabla ya abierta (suscripta al canal privado de Reverb), B
  // completa un tercer entrenamiento por la vía HTTP directa — sin refresh
  // ni interacción de A, lo único que puede haber actualizado su fila es
  // el websocket.
  // Esta línea sirve para crear «rowB» llamando a «list.locator».
  const rowB = list.locator('li').filter({ hasText: nameB })
  // Esta línea sirve para esperar y verificar «rowB».
  await expect(rowB).toContainText('2')

  // Esta línea sirve para esperar el resultado de «completeAWorkoutSession».
  await completeAWorkoutSession(ctx, tokenB)
  // Esta línea sirve para esperar el resultado de «ctx.dispose».
  await ctx.dispose()

  // Esta línea sirve para esperar y verificar «rowB».
  await expect(rowB).toContainText('3', { timeout: 10_000 })
})
