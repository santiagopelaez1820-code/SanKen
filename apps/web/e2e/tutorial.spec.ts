// Esta línea sirve para importar «test, expect, request as pwRequest, type APIRequestContext, type Page» desde «@playwright/test».
import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'

// Esta línea sirve para declarar «API_URL» con el valor «'http://localhost:8000/api/v1'».
const API_URL = 'http://localhost:8000/api/v1'
// Esta línea sirve para crear «RUN_ID» llamando a «Date.now».
const RUN_ID = Date.now()
// Esta línea sirve para declarar «PASSWORD» con el valor «'Tutorial123!'».
const PASSWORD = 'Tutorial123!'

// Esta línea sirve para declarar la función «registerUser».
async function registerUser(ctx: APIRequestContext, name: string, email: string) {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «res».
  const res = await ctx.post(`${API_URL}/auth/register`, {
    // Esta línea sirve para definir «data» con «{ name, email, password: PASSWORD, passw…».
    data: { name, email, password: PASSWORD, password_confirmation: PASSWORD, accept_terms: true, accept_privacy: true, accept_health_data: true },
  })
  // Esta línea sirve para lanzar un error si «!res.ok()».
  if (!res.ok()) throw new Error(`register failed: ${res.status()} ${await res.text()}`)
  // Esta línea sirve para devolver el token de la respuesta de registro.
  return ((await res.json()) as { data: { token: string } }).data.token
}

// Esta línea sirve para declarar la función «completeOnboarding».
async function completeOnboarding(ctx: APIRequestContext, token: string) {
  // Esta línea sirve para extraer «eader» de «{ Authorization: `Bearer ${token}` }».
  const headers = { Authorization: `Bearer ${token}` }
  // Esta línea sirve para esperar el resultado de «ctx.post».
  await ctx.post(`${API_URL}/onboarding`, {
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «{».
    data: {
      // Esta línea sirve para definir «age» con «28, sex: 'male', height_cm: 178, weight_…».
      age: 28, sex: 'male', height_cm: 178, weight_kg: 80, city_id: 1, level: 'intermediate',
      // Esta línea sirve para declarar la propiedad «goals» con el valor o tipo «['gain_muscle'], frequency_days: 4».
      goals: ['gain_muscle'], frequency_days: 4,
      // Esta línea sirve para definir «equipment_available» con «['barbell', 'dumbbells', 'machines', 'ca…».
      equipment_available: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
    },
    // Esta línea sirve para incluir el valor «headers» en la lista.
    headers,
  })
  // Esta línea sirve para esperar el resultado de «ctx.post».
  await ctx.post(`${API_URL}/onboarding/complete`, { headers })
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

// Verifica el mecanismo real (useTutorial + SpotlightOverlay) para un
// usuario que nunca lo vio: aparece solo en /dashboard, navega entre pasos,
// se puede cerrar, y no reaparece en una recarga (persistencia por
// localStorage, ver tutorial-storage.ts). No pasa por el wizard de
// onboarding real (completeOnboarding va por API, mismo patrón que el
// resto de este suite) para no depender de su UI.
// Esta línea sirve para declarar la prueba que verifica que «el tutorial guiado de Inicio aparece para un usuario nuevo, se navega,».
test('el tutorial guiado de Inicio aparece para un usuario nuevo, se navega, se cierra y no reaparece', async ({
  // Esta línea sirve para incluir el valor «page» en la lista.
  page,
// Esta línea sirve para cerrar los parámetros de la prueba y abrir su cuerpo.
}) => {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «ctx».
  const ctx = await pwRequest.newContext()
  // Esta línea sirve para extraer «mai» de «`e2e-tutorial-${RUN_ID}@sanken.app`».
  const email = `e2e-tutorial-${RUN_ID}@sanken.app`
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «token».
  const token = await registerUser(ctx, `Tutorial Test ${RUN_ID}`, email)
  // Esta línea sirve para esperar el resultado de «completeOnboarding».
  await completeOnboarding(ctx, token)
  // Esta línea sirve para esperar el resultado de «ctx.dispose».
  await ctx.dispose()

  // Esta línea sirve para esperar el resultado de «login».
  await login(page, email)

  // Esta línea sirve para esperar y verificar «page.getByText('¡Bienvenido a SanKen! 👋'».
  await expect(page.getByText('¡Bienvenido a SanKen! 👋')).toBeVisible({ timeout: 5000 })

  // El overlay bloquea la página real de atrás -- confirma que el clic en
  // "Siguiente" avanza al segundo paso en vez de interactuar con el fondo.
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('button', { name: 'Siguiente' }).click()
  // Esta línea sirve para esperar y verificar «page.getByText('Tu entrenamiento de hoy'».
  await expect(page.getByText('Tu entrenamiento de hoy')).toBeVisible()

  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('button', { name: 'Atrás' }).click()
  // Esta línea sirve para esperar y verificar «page.getByText('¡Bienvenido a SanKen! 👋'».
  await expect(page.getByText('¡Bienvenido a SanKen! 👋')).toBeVisible()

  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('button', { name: 'Siguiente' }).click()
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('button', { name: 'Siguiente' }).click()
  // Esta línea sirve para esperar y verificar «page.getByText('Todo lo demás está en el menú'».
  await expect(page.getByText('Todo lo demás está en el menú')).toBeVisible()
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('button', { name: 'Entendido' }).click()

  // Esta línea sirve para esperar y verificar «page.getByText('¡Bienvenido a SanKen! 👋'».
  await expect(page.getByText('¡Bienvenido a SanKen! 👋')).not.toBeVisible()

  // La página de atrás vuelve a ser interactiva.
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('link', { name: 'Nutrición' }).click()
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/nutrition$/)

  // Persistencia: recargar /dashboard no debe volver a mostrarlo.
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/dashboard')
  // Esta línea sirve para esperar y verificar «page.getByText('¿Listo para entrenar?'».
  await expect(page.getByText('¿Listo para entrenar?')).toBeVisible({ timeout: 15_000 })
  // Esta línea sirve para esperar el resultado de «page.waitForTimeout».
  await page.waitForTimeout(1000)
  // Esta línea sirve para esperar y verificar «page.getByText('¡Bienvenido a SanKen! 👋'».
  await expect(page.getByText('¡Bienvenido a SanKen! 👋')).not.toBeVisible()
})
