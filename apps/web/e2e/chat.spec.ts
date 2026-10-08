// Esta línea sirve para importar «test, expect, request as pwRequest, type APIRequestContext, type Page» desde «@playwright/test».
import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'
// Esta línea sirve para importar «execSync» desde «node:child_process».
import { execSync } from 'node:child_process'

// Esta línea sirve para declarar «API_URL» con el valor «'http://localhost:8000/api/v1'».
const API_URL = 'http://localhost:8000/api/v1'
// Esta línea sirve para crear «RUN_ID» llamando a «Date.now».
const RUN_ID = Date.now()
// Esta línea sirve para declarar «PASSWORD» con el valor «'Chat123!'».
const PASSWORD = 'Chat123!'

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

// Sin esto, RequireAuth manda al login posterior a /onboarding en vez de
// /dashboard o /trainer — este spec asume que el login entra directo.
// Esta línea sirve para declarar la función «completeOnboarding».
async function completeOnboarding(ctx: APIRequestContext, token: string) {
  // Esta línea sirve para extraer «eader» de «{ Authorization: `Bearer ${token}` }».
  const headers = { Authorization: `Bearer ${token}` }
  // Esta línea sirve para esperar el resultado de «ctx.post».
  await ctx.post(`${API_URL}/onboarding`, {
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «{».
    data: {
      // Esta línea sirve para enviar las respuestas del onboarding con perfil intermedio.
      age: 28, sex: 'male', height_cm: 178, weight_kg: 78, level: 'intermediate',
      // Esta línea sirve para declarar la propiedad «goals» con el valor o tipo «['gain_muscle'], frequency_days: 3».
      goals: ['gain_muscle'], frequency_days: 3,
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
}

// Este spec prueba chat, no el tutorial guiado -- lo marcamos como ya visto
// en localStorage antes de la primera navegación para no depender de que el
// clic en "Chatear" en /my-trainer le gane la carrera a la apertura
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

// Un solo login por UI por usuario en este archivo (throttle:5,1 en
// /auth/login — ver la nota en challenges.spec.ts sobre por qué eso importa).
// Esta línea sirve para declarar la prueba que verifica que «un mensaje enviado por el entrenador llega en vivo al cliente, que lo ».
test('un mensaje enviado por el entrenador llega en vivo al cliente, que lo ve desde "Mi entrenador"', async ({ browser }) => {
  // Esta línea sirve para llamar a «test.setTimeout» con «60_000».
  test.setTimeout(60_000)

  // Esta línea sirve para ejecutar la acción y guardar el resultado en «ctx».
  const ctx = await pwRequest.newContext()
  // Esta línea sirve para extraer «rainerEmai» de «`e2e-chat-trainer-${RUN_ID}@sanken.app`».
  const trainerEmail = `e2e-chat-trainer-${RUN_ID}@sanken.app`
  // Esta línea sirve para extraer «lientEmai» de «`e2e-chat-client-${RUN_ID}@sanken.app`».
  const clientEmail = `e2e-chat-client-${RUN_ID}@sanken.app`
  // Esta línea sirve para extraer «rainerNam» de «`Coach Chat ${RUN_ID}`».
  const trainerName = `Coach Chat ${RUN_ID}`

  // Esta línea sirve para esperar «registerUser(ctx, trainerName, trainerEm» y obtener «token: trainerToken».
  const { token: trainerToken } = await registerUser(ctx, trainerName, trainerEmail)
  // Esta línea sirve para esperar «registerUser(ctx, `Cliente Chat ${RUN_ID» y obtener «token: clientToken, id: clientId».
  const { token: clientToken, id: clientId } = await registerUser(ctx, `Cliente Chat ${RUN_ID}`, clientEmail)
  // Esta línea sirve para esperar el resultado de «completeOnboarding».
  await completeOnboarding(ctx, trainerToken)
  // Esta línea sirve para esperar el resultado de «completeOnboarding».
  await completeOnboarding(ctx, clientToken)

  // No hay forma de registrarse como entrenador vía API (RegisterUserAction
  // fuerza role=user) — se promueve directo en la DB, como hacen otros
  // fixtures de entrenador en este proyecto.
  // Esta línea sirve para ejecutar un comando de Artisan para preparar los datos.
  execSync(
    // Esta línea sirve para incluir el texto o las clases «php artisan tinker --execute=…».
    `php artisan tinker --execute="App\\\\Models\\\\User::where('email','${trainerEmail}')->update(['role'=>'trainer']);"`,
    // Esta línea sirve para ejecutar el comando dentro de la carpeta de la API.
    { cwd: '../api' }
  )

  // Esta línea sirve para esperar el resultado de «ctx.post».
  await ctx.post(`${API_URL}/trainer/clients`, {
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «{ email: clientEmail }».
    data: { email: clientEmail },
    // Esta línea sirve para declarar la propiedad «headers» con el valor o tipo «{ Authorization: `Bearer ${trainerToken}` }».
    headers: { Authorization: `Bearer ${trainerToken}` },
  })
  // Esta línea sirve para esperar el resultado de «ctx.dispose».
  await ctx.dispose()

  // Esta línea sirve para esperar «(await browser.newContext()).newPage()» y guardar el resultado en «trainerPage».
  const trainerPage = await (await browser.newContext()).newPage()
  // /trainer no tiene tutorial guiado (fuera de alcance, panel interno) --
  // no hace falta dismissTutorials acá.
  // Esta línea sirve para esperar el resultado de «login».
  await login(trainerPage, trainerEmail)
  // Esta línea sirve para esperar el resultado de «trainerPage.waitForURL».
  await trainerPage.waitForURL(/\/trainer$/) // los entrenadores entran directo a /trainer, no a /dashboard
  // Esta línea sirve para esperar el resultado de «trainerPage.getByText».
  await trainerPage.getByText(`Cliente Chat ${RUN_ID}`).click()
  // Esta línea sirve para esperar el resultado de «trainerPage.getByRole».
  await trainerPage.getByRole('button', { name: 'Chat' }).click()
  // Esta línea sirve para esperar el resultado de «trainerPage.waitForURL».
  await trainerPage.waitForURL(/\/chat\/\d+$/)

  // Esta línea sirve para esperar «(await browser.newContext()).newPage()» y guardar el resultado en «clientPage».
  const clientPage = await (await browser.newContext()).newPage()
  // Esta línea sirve para esperar el resultado de «dismissTutorials».
  await dismissTutorials(clientPage, clientId)
  // Esta línea sirve para esperar el resultado de «login».
  await login(clientPage, clientEmail)
  // Esta línea sirve para esperar el resultado de «clientPage.waitForURL».
  await clientPage.waitForURL(/\/dashboard$/)
  // Esta línea sirve para esperar el resultado de «clientPage.goto».
  await clientPage.goto('/my-trainer')
  // Esta línea sirve para esperar y verificar «clientPage.getByText(trainerName».
  await expect(clientPage.getByText(trainerName)).toBeVisible()
  // Esta línea sirve para esperar el resultado de «clientPage.getByRole».
  await clientPage.getByRole('button', { name: 'Chatear' }).click()
  // Esta línea sirve para esperar el resultado de «clientPage.waitForURL».
  await clientPage.waitForURL(/\/chat\/\d+$/)

  // El cliente ya tiene el hilo abierto (suscripto al canal privado de
  // Reverb) antes de que el entrenador escriba nada.
  // Esta línea sirve para esperar el resultado de «trainerPage.fill».
  await trainerPage.fill('textarea[placeholder="Escribí un mensaje…"]', 'Hola, esto llega en vivo')
  // Esta línea sirve para esperar el resultado de «trainerPage.click».
  await trainerPage.click('button[type=submit]')

  // Esta línea sirve para esperar y verificar «clientPage.getByText('Hola, esto llega en vivo'».
  await expect(clientPage.getByText('Hola, esto llega en vivo')).toBeVisible({ timeout: 10_000 })

  // También debería haber generado una notificación in-app para el cliente.
  // Esta línea sirve para esperar el resultado de «clientPage.goto».
  await clientPage.goto('/dashboard')
  // Esta línea sirve para esperar el resultado de «expect».
  await expect(clientPage.getByRole('button', { name: 'Notificaciones' })).toContainText('1')
})
