import { test, expect, request as pwRequest, type Page } from '@playwright/test'

const API_URL = 'http://localhost:8000/api/v1'
// Email único por corrida: no hay endpoint de borrado de usuarios en la API.
const EMAIL = `e2e-levelup-${Date.now()}@sanken.app`
const PASSWORD = 'LevelUp123!'

// El ApiClient de la app autentica por Bearer token (guardado por el store
// de auth en localStorage bajo "sanken-auth" vía zustand/persist), no solo
// por cookie de sesión — hay que leerlo de ahí para poder pegarle a la API
// ya logueado desde fuera del flujo normal de la SPA.
async function authToken(page: Page): Promise<string> {
  const token = await page.evaluate(() => {
    const raw = localStorage.getItem('sanken-auth')
    return raw ? (JSON.parse(raw).state?.token ?? null) : null
  })
  if (!token) throw new Error('No auth token found in localStorage — ¿falló el login?')
  return token
}

async function authedPost(page: Page, path: string, data: unknown) {
  const token = await authToken(page)
  const result = await page.evaluate(
    async ({ path, data, apiUrl, token }) => {
      function readCookie(name: string): string | null {
        const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
        return match ? decodeURIComponent(match[1]) : null
      }

      // El origin de la SPA está en la lista de dominios "stateful" de
      // Sanctum, así que CUALQUIER request desde acá — sea Bearer o no —
      // pasa igual por el middleware de sesión/CSRF; hay que mandar ambos.
      const res = await fetch(`${apiUrl}${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-XSRF-TOKEN': readCookie('XSRF-TOKEN') ?? '',
        },
        body: JSON.stringify(data),
      })
      const text = await res.text()
      return { ok: res.ok, status: res.status, text }
    },
    { path, data, apiUrl: API_URL, token },
  )

  if (!result.ok) {
    throw new Error(`POST ${path} failed: ${result.status} ${result.text}`)
  }
  return JSON.parse(result.text || 'null')
}

async function authedGet(page: Page, path: string) {
  const token = await authToken(page)
  const result = await page.evaluate(
    async ({ path, apiUrl, token }) => {
      const res = await fetch(`${apiUrl}${path}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      })
      const text = await res.text()
      return { ok: res.ok, status: res.status, text }
    },
    { path, apiUrl: API_URL, token },
  )

  if (!result.ok) {
    throw new Error(`GET ${path} failed: ${result.status} ${result.text}`)
  }
  return JSON.parse(result.text || 'null')
}

test.beforeAll(async () => {
  const ctx = await pwRequest.newContext()
  const res = await ctx.post(`${API_URL}/auth/register`, {
    data: { name: 'E2E LevelUp', email: EMAIL, password: PASSWORD, password_confirmation: PASSWORD },
  })
  if (!res.ok()) {
    throw new Error(`fixture setup failed: ${res.status()} ${await res.text()}`)
  }
  await ctx.dispose()
})

test('completar un entrenamiento que cruza un nivel muestra el modal de subida de nivel', async ({ page }) => {
  await page.goto('/login')
  await page.fill('#email', EMAIL)
  await page.fill('#password', PASSWORD)
  await page.click('button[type=submit]')
  await expect(page).toHaveURL(/\/dashboard$/)

  const onboardingPayload = {
    age: 28,
    sex: 'male',
    height_cm: 178,
    weight_kg: 80,
    level: 'intermediate',
    goals: ['gain_muscle'],
    frequency_days: 4,
    session_minutes: 60,
    place: 'gym',
    equipment_available: ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
    injuries: [],
  }
  await authedPost(page, '/onboarding', onboardingPayload)
  await authedPost(page, '/onboarding/complete', {})
  await authedPost(page, '/routines/generate', {})

  // Dos sesiones completas de calentamiento vía API (20 XP base c/u + 50 del
  // logro "first_workout" en la primera) para acercar al usuario al límite
  // de nivel 2 (100 XP) sin tener que repetir el flujo de UI 3 veces.
  for (let i = 0; i < 2; i++) {
    const { data: session } = await authedPost(page, '/workout-sessions', {})
    await authedPost(page, `/workout-sessions/${session.id}/complete`, {})
  }

  const gamification = await authedGet(page, '/gamification')
  expect(gamification.data.total_xp).toBe(90)

  // La tercera sesión (90 + 20 = 110 XP) sí cruza el nivel 2 — esta se hace
  // por la UI real para verificar que el modal efectivamente aparece.
  await page.reload()
  await page.click('text=Comenzar')
  await expect(page).toHaveURL(/\/workout\/precheck$/)
  await page.click('text=Comenzar')
  await expect(page).toHaveURL(/\/workout\/session\//)

  // Deliberadamente no se registra ninguna serie: cualquier peso logueado
  // por primera vez para un ejercicio dispara un PR (PRBroken es
  // fire-and-forget, no muestra modal), lo que adelantaría el cruce de
  // nivel a un evento previo y volvería falso el "leveled_up" del propio
  // complete que este test quiere observar. La rutina puede traer varios
  // ejercicios: se avanza sin cargar series hasta el botón de "Finalizar".
  for (let guard = 0; guard < 20; guard++) {
    const finishButton = page.getByRole('button', { name: /Finalizar entrenamiento|Siguiente ejercicio/ })
    await expect(finishButton).toBeEnabled()
    const label = await finishButton.textContent()
    await finishButton.click()
    if (label?.includes('Finalizar')) break
    // Deja asentar la transición (mutation + re-render) antes de re-consultar
    // el botón en la próxima vuelta — evita pegarle a un elemento a punto de
    // desmontarse.
    await page.waitForTimeout(300)
  }

  await expect(page.getByText('¡Subiste de nivel!')).toBeVisible()
  await expect(page.getByText('Nivel 2')).toBeVisible()
})
