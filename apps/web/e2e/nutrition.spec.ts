// Esta línea sirve para importar «test, expect, request as pwRequest, type APIRequestContext, type Page» desde «@playwright/test».
import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'

// Esta línea sirve para declarar «API_URL» con el valor «'http://localhost:8000/api/v1'».
const API_URL = 'http://localhost:8000/api/v1'
// Esta línea sirve para crear «RUN_ID» llamando a «Date.now».
const RUN_ID = Date.now()
// Esta línea sirve para declarar «PASSWORD» con el valor «'Nutrition123!'».
const PASSWORD = 'Nutrition123!'

// Esta línea sirve para declarar la función «registerUser».
async function registerUser(ctx: APIRequestContext, name: string, email: string) {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «res».
  const res = await ctx.post(`${API_URL}/auth/register`, {
    // Esta línea sirve para definir «data» con «{ name, email, password: PASSWORD, passw…».
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

// Esta línea sirve para declarar la función «completeOnboarding».
async function completeOnboarding(ctx: APIRequestContext, token: string) {
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, '/onboarding', {
    // Esta línea sirve para definir «age» con «28, sex: 'male', height_cm: 178, weight_…».
    age: 28, sex: 'male', height_cm: 178, weight_kg: 80, city_id: 1, level: 'intermediate',
    // Esta línea sirve para declarar la propiedad «goals» con el valor o tipo «['gain_muscle'], frequency_days: 4».
    goals: ['gain_muscle'], frequency_days: 4,
    // Esta línea sirve para definir «equipment_available» con «['barbell', 'dumbbells', 'machines', 'ca…».
    equipment_available: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
  })
  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(ctx, token, '/onboarding/complete')
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

// Este spec prueba nutrición, no el tutorial guiado -- lo marcamos como ya
// visto en localStorage (clave por usuario+sección, ver tutorial-storage.ts)
// antes de la primera navegación para no depender de que un clic real (ej.
// el link "Nutrición" en /dashboard) le gane la carrera a la apertura
// automática del tutorial (500ms tras cargar datos, ver useTutorial), que
// si no bloquearía el clic con su overlay de pantalla completa.
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

// La búsqueda pega contra Open Food Facts real (sin API key, mismo enfoque
// que OpenFoodFactsClient — ver plan Sprint 12) así que usamos un término
// común ("banana") que consistentemente devuelve resultados en vez de
// mockear la red, cosa que sí hacemos del lado PHP (Http::fake en
// NutritionApiTest) pero que este spec no puede hacer contra el server real.
// Esta línea sirve para declarar la prueba que verifica que «completar el perfil habilita los objetivos, y registrar una comida por».
test('completar el perfil habilita los objetivos, y registrar una comida por búsqueda actualiza el total diario', async ({
  // Esta línea sirve para incluir el valor «page» en la lista.
  page,
// Esta línea sirve para cerrar los parámetros de la prueba y abrir su cuerpo.
}) => {
  // La búsqueda de alimentos pega contra Open Food Facts real (sin mock),
  // así que este spec necesita más margen que el default de 30s.
  // Esta línea sirve para llamar a «test.setTimeout» con «90_000».
  test.setTimeout(90_000)

  // Esta línea sirve para ejecutar la acción y guardar el resultado en «ctx».
  const ctx = await pwRequest.newContext()

  // Esta línea sirve para extraer «am» de «`Nutri Test ${RUN_ID}`».
  const name = `Nutri Test ${RUN_ID}`
  // Esta línea sirve para extraer «mai» de «`e2e-nutrition-${RUN_ID}@sanken.app`».
  const email = `e2e-nutrition-${RUN_ID}@sanken.app`
  // Esta línea sirve para esperar «registerUser(ctx, name, email)» y obtener «token, id».
  const { token, id } = await registerUser(ctx, name, email)
  // Esta línea sirve para esperar el resultado de «completeOnboarding».
  await completeOnboarding(ctx, token)
  // Esta línea sirve para esperar el resultado de «ctx.dispose».
  await ctx.dispose()

  // Esta línea sirve para esperar el resultado de «dismissTutorials».
  await dismissTutorials(page, id)
  // Esta línea sirve para esperar el resultado de «login».
  await login(page, email)
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('link', { name: 'Nutrición' }).click()
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/nutrition$/)

  // Esta línea sirve para esperar y verificar «page.getByText('Calorías', { exact: true }».
  await expect(page.getByText('Calorías', { exact: true })).toBeVisible({ timeout: 15_000 })
  // Esta línea sirve para esperar y verificar «page.getByText('Proteína', { exact: true }».
  await expect(page.getByText('Proteína', { exact: true })).toBeVisible()

  // Esta línea sirve para esperar el resultado de «page.getByPlaceholder».
  await page.getByPlaceholder('Buscar alimento…').fill('banana')
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('button', { name: 'Buscar' }).click()

  // Esta línea sirve para crear «firstResult» llamando a «page.getByRole».
  const firstResult = page.getByRole('button').filter({ hasText: 'kcal/100g' }).first()
  // Esta línea sirve para esperar y verificar «firstResult».
  await expect(firstResult).toBeVisible({ timeout: 15_000 })
  // Esta línea sirve para esperar el resultado de «firstResult.click».
  await firstResult.click()

  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#grams', '150')
  // Esta línea sirve para esperar el resultado de «page.selectOption».
  await page.selectOption('#meal-type', 'lunch')
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('button', { name: 'Registrar' }).click()

  // Esta línea sirve para crear «lunchSection» llamando a «page.locator».
  const lunchSection = page.locator('section').filter({ hasText: 'Almuerzo' })
  // Esta línea sirve para esperar y verificar «lunchSection.getByText('150 g'».
  await expect(lunchSection.getByText('150 g')).toBeVisible()
  // Esta línea sirve para esperar y verificar «page.getByText(/Hoy llevás/».
  await expect(page.getByText(/Hoy llevás/)).not.toContainText('0 kcal')
})
