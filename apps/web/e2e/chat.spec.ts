import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'
import { execSync } from 'node:child_process'

const API_URL = 'http://localhost:8000/api/v1'
const RUN_ID = Date.now()
const PASSWORD = 'Chat123!'

async function registerUser(ctx: APIRequestContext, name: string, email: string) {
  const res = await ctx.post(`${API_URL}/auth/register`, {
    data: { name, email, password: PASSWORD, password_confirmation: PASSWORD },
  })
  if (!res.ok()) throw new Error(`register failed: ${res.status()} ${await res.text()}`)
  return ((await res.json()) as { data: { token: string } }).data.token
}

// Sin esto, RequireAuth manda al login posterior a /onboarding en vez de
// /dashboard o /trainer — este spec asume que el login entra directo.
async function completeOnboarding(ctx: APIRequestContext, token: string) {
  const headers = { Authorization: `Bearer ${token}` }
  await ctx.post(`${API_URL}/onboarding`, {
    data: {
      age: 28, sex: 'male', height_cm: 178, weight_kg: 78, level: 'intermediate',
      goals: ['gain_muscle'], frequency_days: 3,
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
}

// Un solo login por UI por usuario en este archivo (throttle:5,1 en
// /auth/login — ver la nota en challenges.spec.ts sobre por qué eso importa).
test('un mensaje enviado por el entrenador llega en vivo al cliente, que lo ve desde "Mi entrenador"', async ({ browser }) => {
  test.setTimeout(60_000)

  const ctx = await pwRequest.newContext()
  const trainerEmail = `e2e-chat-trainer-${RUN_ID}@sanken.app`
  const clientEmail = `e2e-chat-client-${RUN_ID}@sanken.app`
  const trainerName = `Coach Chat ${RUN_ID}`

  const trainerToken = await registerUser(ctx, trainerName, trainerEmail)
  const clientToken = await registerUser(ctx, `Cliente Chat ${RUN_ID}`, clientEmail)
  await completeOnboarding(ctx, trainerToken)
  await completeOnboarding(ctx, clientToken)

  // No hay forma de registrarse como entrenador vía API (RegisterUserAction
  // fuerza role=user) — se promueve directo en la DB, como hacen otros
  // fixtures de entrenador en este proyecto.
  execSync(
    `php artisan tinker --execute="App\\\\Models\\\\User::where('email','${trainerEmail}')->update(['role'=>'trainer']);"`,
    { cwd: '../api' }
  )

  await ctx.post(`${API_URL}/trainer/clients`, {
    data: { email: clientEmail },
    headers: { Authorization: `Bearer ${trainerToken}` },
  })
  await ctx.dispose()

  const trainerPage = await (await browser.newContext()).newPage()
  await login(trainerPage, trainerEmail)
  await trainerPage.waitForURL(/\/trainer$/) // los entrenadores entran directo a /trainer, no a /dashboard
  await trainerPage.getByText(`Cliente Chat ${RUN_ID}`).click()
  await trainerPage.getByRole('button', { name: 'Chat' }).click()
  await trainerPage.waitForURL(/\/chat\/\d+$/)

  const clientPage = await (await browser.newContext()).newPage()
  await login(clientPage, clientEmail)
  await clientPage.waitForURL(/\/dashboard$/)
  await clientPage.goto('/my-trainer')
  await expect(clientPage.getByText(trainerName)).toBeVisible()
  await clientPage.getByRole('button', { name: 'Chatear' }).click()
  await clientPage.waitForURL(/\/chat\/\d+$/)

  // El cliente ya tiene el hilo abierto (suscripto al canal privado de
  // Reverb) antes de que el entrenador escriba nada.
  await trainerPage.fill('input[placeholder="Escribí un mensaje…"]', 'Hola, esto llega en vivo')
  await trainerPage.click('button[type=submit]')

  await expect(clientPage.getByText('Hola, esto llega en vivo')).toBeVisible({ timeout: 10_000 })

  // También debería haber generado una notificación in-app para el cliente.
  await clientPage.goto('/dashboard')
  await expect(clientPage.getByRole('button', { name: 'Notificaciones' })).toContainText('1')
})
