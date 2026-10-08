// Esta línea sirve para importar «test, expect, request as pwRequest, type Page» desde «@playwright/test».
import { test, expect, request as pwRequest, type Page } from '@playwright/test'

// Esta línea sirve para declarar «API_URL» con el valor «'http://localhost:8000/api/v1'».
const API_URL = 'http://localhost:8000/api/v1'
// Email único por corrida: no hay endpoint de borrado de usuarios en la API.
// Esta línea sirve para declarar «EMAIL» con el valor «`e2e-levelup-${Date.now()}@sanken.app`».
const EMAIL = `e2e-levelup-${Date.now()}@sanken.app`
// Esta línea sirve para declarar «PASSWORD» con el valor «'LevelUp123!'».
const PASSWORD = 'LevelUp123!'

// El ApiClient de la app autentica por Bearer token (guardado por el store
// de auth en localStorage bajo "sanken-auth" vía zustand/persist), no solo
// por cookie de sesión — hay que leerlo de ahí para poder pegarle a la API
// ya logueado desde fuera del flujo normal de la SPA.
// Esta línea sirve para declarar la función «authToken».
async function authToken(page: Page): Promise<string> {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «token».
  const token = await page.evaluate(() => {
    // Esta línea sirve para crear «raw» llamando a «localStorage.getItem».
    const raw = localStorage.getItem('sanken-auth')
    // Esta línea sirve para devolver el token guardado en el almacenamiento o null.
    return raw ? (JSON.parse(raw).state?.token ?? null) : null
  })
  // Esta línea sirve para lanzar un error si «!token».
  if (!token) throw new Error('No auth token found in localStorage — ¿falló el login?')
  // Esta línea sirve para devolver «token».
  return token
}

// Esta línea sirve para declarar la función «authedPost».
async function authedPost(page: Page, path: string, data: unknown) {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «token».
  const token = await authToken(page)
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «result».
  const result = await page.evaluate(
    // Esta línea sirve para declarar la función que se ejecuta dentro del navegador con los datos recibidos.
    async ({ path, data, apiUrl, token }) => {
      // Esta línea sirve para declarar la función que lee una cookie por nombre.
      function readCookie(name: string): string | null {
        // Esta línea sirve para crear «match» llamando a «document.cookie.match».
        const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
        // Esta línea sirve para devolver «match ? decodeURIComponent(match[1]) : null».
        return match ? decodeURIComponent(match[1]) : null
      }

      // El origin de la SPA está en la lista de dominios "stateful" de
      // Sanctum, así que CUALQUIER request desde acá — sea Bearer o no —
      // pasa igual por el middleware de sesión/CSRF; hay que mandar ambos.
      // Esta línea sirve para ejecutar la acción y guardar el resultado en «res».
      const res = await fetch(`${apiUrl}${path}`, {
        // Esta línea sirve para declarar la propiedad «method» con el valor o tipo «'POST'».
        method: 'POST',
        // Esta línea sirve para declarar la propiedad «credentials» con el valor o tipo «'include'».
        credentials: 'include',
        // Esta línea sirve para declarar la propiedad «headers» con el valor o tipo «{».
        headers: {
          // Esta línea sirve para declarar la propiedad «Accept» con el valor o tipo «'application/json'».
          Accept: 'application/json',
          // Esta línea sirve para incluir el texto o las clases «Content-Type…».
          'Content-Type': 'application/json',
          // Esta línea sirve para declarar la propiedad «Authorization» con el valor o tipo «`Bearer ${token}`».
          Authorization: `Bearer ${token}`,
          // Esta línea sirve para incluir el texto o las clases «X-XSRF-TOKEN…».
          'X-XSRF-TOKEN': readCookie('XSRF-TOKEN') ?? '',
        },
        // Esta línea sirve para declarar la propiedad «body» con el valor o tipo «JSON.stringify(data)».
        body: JSON.stringify(data),
      })
      // Esta línea sirve para ejecutar la acción y guardar el resultado en «text».
      const text = await res.text()
      // Esta línea sirve para devolver «{ ok: res.ok, status: res.status, text }».
      return { ok: res.ok, status: res.status, text }
    },
    // Esta línea sirve para pasar los datos al navegador: ruta, cuerpo, URL de la API y token.
    { path, data, apiUrl: API_URL, token },
  )

  // Esta línea sirve para revisar si «!result.ok».
  if (!result.ok) {
    // Esta línea sirve para lanzar un error de tipo «Error».
    throw new Error(`POST ${path} failed: ${result.status} ${result.text}`)
  }
  // Esta línea sirve para devolver «JSON.parse(result.text || 'null')».
  return JSON.parse(result.text || 'null')
}

// Esta línea sirve para declarar la variable «userId» sin valor inicial.
let userId: number

// Este spec prueba el modal de subida de nivel, no el tutorial guiado -- lo
// marcamos como ya visto en localStorage (clave por usuario+sección, ver
// tutorial-storage.ts) antes de la primera navegación para no depender de
// que el clic en "Comenzar" en /dashboard (tras el reload de la línea
// ~124) le gane la carrera a la apertura automática del tutorial, que si
// no lo bloquearía con su overlay de pantalla completa (ver useTutorial).
// Esta línea sirve para declarar la función «dismissTutorials».
async function dismissTutorials(page: Page) {
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

// Esta línea sirve para declarar la función «authedGet».
async function authedGet(page: Page, path: string) {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «token».
  const token = await authToken(page)
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «result».
  const result = await page.evaluate(
    // Esta línea sirve para declarar la función que se ejecuta dentro del navegador con los datos recibidos.
    async ({ path, apiUrl, token }) => {
      // Esta línea sirve para ejecutar la acción y guardar el resultado en «res».
      const res = await fetch(`${apiUrl}${path}`, {
        // Esta línea sirve para definir «headers» con «{ Accept: 'application/json', Authorizat…».
        headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      })
      // Esta línea sirve para ejecutar la acción y guardar el resultado en «text».
      const text = await res.text()
      // Esta línea sirve para devolver «{ ok: res.ok, status: res.status, text }».
      return { ok: res.ok, status: res.status, text }
    },
    // Esta línea sirve para pasar los datos al navegador: ruta, URL de la API y token.
    { path, apiUrl: API_URL, token },
  )

  // Esta línea sirve para revisar si «!result.ok».
  if (!result.ok) {
    // Esta línea sirve para lanzar un error de tipo «Error».
    throw new Error(`GET ${path} failed: ${result.status} ${result.text}`)
  }
  // Esta línea sirve para devolver «JSON.parse(result.text || 'null')».
  return JSON.parse(result.text || 'null')
}

// Esta línea sirve para declarar lo que se ejecuta una vez antes de todas las pruebas.
test.beforeAll(async () => {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «ctx».
  const ctx = await pwRequest.newContext()
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «res».
  const res = await ctx.post(`${API_URL}/auth/register`, {
    // Esta línea sirve para definir «data» con «{ name: 'E2E LevelUp', email: EMAIL, pas…».
    data: { name: 'E2E LevelUp', email: EMAIL, password: PASSWORD, password_confirmation: PASSWORD, accept_terms: true, accept_privacy: true, accept_health_data: true },
  })
  // Esta línea sirve para revisar si «!res.ok()».
  if (!res.ok()) {
    // Esta línea sirve para lanzar un error de tipo «Error».
    throw new Error(`fixture setup failed: ${res.status()} ${await res.text()}`)
  }

  // Completar onboarding acá (no via UI) porque, sin onboarding_completed,
  // RequireAuth manda al login posterior a /onboarding en vez de /dashboard
  // — este spec asume que el primer login ya entra directo.
  // Esta línea sirve para extraer «data» de «(await res.json()) as { data: { token: s».
  const { data } = (await res.json()) as { data: { token: string; user: { id: number } } }
  // Esta línea sirve para asignar «data.user.id» a «userId».
  userId = data.user.id
  // Esta línea sirve para extraer «eader» de «{ Authorization: `Bearer ${data.token}` ».
  const headers = { Authorization: `Bearer ${data.token}` }
  // Esta línea sirve para esperar el resultado de «ctx.post».
  await ctx.post(`${API_URL}/onboarding`, {
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «{».
    data: {
      // Esta línea sirve para definir «age» con «28, sex: 'male', height_cm: 178, weight_…».
      age: 28, sex: 'male', height_cm: 178, weight_kg: 80, level: 'intermediate',
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
  // Esta línea sirve para esperar el resultado de «ctx.dispose».
  await ctx.dispose()
})

// Esta línea sirve para declarar la prueba que verifica que «completar un entrenamiento que cruza un nivel muestra el modal de subi».
test('completar un entrenamiento que cruza un nivel muestra el modal de subida de nivel', async ({ page }) => {
  // Esta línea sirve para esperar el resultado de «dismissTutorials».
  await dismissTutorials(page)
  // Esta línea sirve para esperar el resultado de «page.goto».
  await page.goto('/login')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#email', EMAIL)
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password', PASSWORD)
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('button[type=submit]')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/dashboard$/)

  // Esta línea sirve para esperar el resultado de «authedPost».
  await authedPost(page, '/routines/generate', {})

  // Dos sesiones completas de calentamiento vía API (20 XP base c/u + 50 del
  // logro "first_workout" en la primera) para acercar al usuario al límite
  // de nivel 2 (100 XP) sin tener que repetir el flujo de UI 3 veces.
  // Esta línea sirve para recorrer los elementos con «let i = 0; i < 2; i++».
  for (let i = 0; i < 2; i++) {
    // Esta línea sirve para esperar «authedPost(page, '/workout-sessions', {}» y obtener «data: session».
    const { data: session } = await authedPost(page, '/workout-sessions', {})
    // Esta línea sirve para esperar el resultado de «authedPost».
    await authedPost(page, `/workout-sessions/${session.id}/complete`, {})
  }

  // Esta línea sirve para ejecutar la acción y guardar el resultado en «gamification».
  const gamification = await authedGet(page, '/gamification')
  // Esta línea sirve para verificar que «gamification.data.total_xp» cumple «toBe».
  expect(gamification.data.total_xp).toBe(90)

  // La tercera sesión (90 + 20 = 110 XP) sí cruza el nivel 2 — esta se hace
  // por la UI real para verificar que el modal efectivamente aparece.
  // Esta línea sirve para esperar el resultado de «page.reload».
  await page.reload()
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Comenzar')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/workout\/precheck$/)
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Comenzar')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/workout\/session\//)

  // Deliberadamente no se registra ninguna serie: cualquier peso logueado
  // por primera vez para un ejercicio dispara un PR (PRBroken es
  // fire-and-forget, no muestra modal), lo que adelantaría el cruce de
  // nivel a un evento previo y volvería falso el "leveled_up" del propio
  // complete que este test quiere observar. La rutina puede traer varios
  // ejercicios: se avanza sin cargar series hasta el botón de "Finalizar".
  // Esta línea sirve para recorrer los elementos con «let guard = 0; guard < 20; guard++».
  for (let guard = 0; guard < 20; guard++) {
    // Esta línea sirve para crear «finishButton» llamando a «page.getByRole».
    const finishButton = page.getByRole('button', { name: /Finalizar entrenamiento|Siguiente ejercicio/ })
    // Esta línea sirve para esperar y verificar «finishButton».
    await expect(finishButton).toBeEnabled()
    // Esta línea sirve para ejecutar la acción y guardar el resultado en «label».
    const label = await finishButton.textContent()
    // Esta línea sirve para esperar el resultado de «finishButton.click».
    await finishButton.click()
    // Esta línea sirve para terminar el ciclo cuando el botón dice «Finalizar».
    if (label?.includes('Finalizar')) break
    // Deja asentar la transición (mutation + re-render) antes de re-consultar
    // el botón en la próxima vuelta — evita pegarle a un elemento a punto de
    // desmontarse.
    // Esta línea sirve para esperar el resultado de «page.waitForTimeout».
    await page.waitForTimeout(300)
  }

  // Esta línea sirve para esperar y verificar «page.getByText('¡Subiste de nivel!'».
  await expect(page.getByText('¡Subiste de nivel!')).toBeVisible()
  // Esta línea sirve para esperar y verificar «page.getByText('Nivel 2'».
  await expect(page.getByText('Nivel 2')).toBeVisible()
})
