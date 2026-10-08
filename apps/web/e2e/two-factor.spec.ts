// Esta línea sirve para importar «test, expect, request as pwRequest, type Page» desde «@playwright/test».
import { test, expect, request as pwRequest, type Page } from '@playwright/test'
// Esta línea sirve para importar «execSync» desde «node:child_process».
import { execSync } from 'node:child_process'

// Esta línea sirve para declarar «API_URL» con el valor «'http://localhost:8000/api/v1'».
const API_URL = 'http://localhost:8000/api/v1'
// Email único por corrida: no hay endpoint de borrado de usuarios en la API,
// así que en vez de reusar+limpiar un fixture, cada corrida registra el suyo.
// Esta línea sirve para declarar «EMAIL» con el valor «`e2e-2fa-${Date.now()}@sanken.app`».
const EMAIL = `e2e-2fa-${Date.now()}@sanken.app`
// Esta línea sirve para declarar «PASSWORD» con el valor «'E2eTwoFa123!'».
const PASSWORD = 'E2eTwoFa123!'
// Esta línea sirve para declarar la variable «userId» sin valor inicial.
let userId: number

// Este spec prueba 2FA, no el tutorial guiado -- lo marcamos como ya visto
// en localStorage (clave por usuario+sección, ver tutorial-storage.ts) antes
// de la primera navegación para no depender de que el clic en
// "Configuración" en /dashboard le gane la carrera a la apertura automática
// del tutorial, que si no lo bloquearía con su overlay de pantalla completa
// (ver useTutorial).
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

// Esta línea sirve para declarar la función «currentOtp».
function currentOtp(secret: string): string {
  // Esta línea sirve para devolver «execSync(».
  return execSync(
    // Esta línea sirve para incluir el texto o las clases «php -r …».
    `php -r 'require "vendor/autoload.php"; $g = new \\PragmaRX\\Google2FA\\Google2FA(); echo $g->getCurrentOtp($argv[1]);' "${secret}"`,
    // Esta línea sirve para agregar un elemento cuyo «cwd» es «'../api' },…».
    { cwd: '../api' },
  // Esta línea sirve para convertir la salida del comando en texto sin espacios sobrantes.
  ).toString().trim()
}

// Esta línea sirve para declarar lo que se ejecuta una vez antes de todas las pruebas.
test.beforeAll(async () => {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «ctx».
  const ctx = await pwRequest.newContext()
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «res».
  const res = await ctx.post(`${API_URL}/auth/register`, {
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «{».
    data: {
      // Esta línea sirve para declarar la propiedad «name» con el valor o tipo «'E2E 2FA'».
      name: 'E2E 2FA',
      // Esta línea sirve para declarar la propiedad «email» con el valor o tipo «EMAIL».
      email: EMAIL,
      // Esta línea sirve para declarar la propiedad «password» con el valor o tipo «PASSWORD».
      password: PASSWORD,
      // Esta línea sirve para declarar la propiedad «password_confirmation» con el valor o tipo «PASSWORD».
      password_confirmation: PASSWORD,
      // Esta línea sirve para declarar la propiedad «accept_terms» con el valor o tipo «true».
      accept_terms: true,
      // Esta línea sirve para declarar la propiedad «accept_privacy» con el valor o tipo «true».
      accept_privacy: true,
      // Esta línea sirve para declarar la propiedad «accept_health_data» con el valor o tipo «true».
      accept_health_data: true,
    },
  })
  // Esta línea sirve para revisar si «!res.ok()».
  if (!res.ok()) {
    // Esta línea sirve para lanzar un error de tipo «Error».
    throw new Error(`fixture setup failed: ${res.status()} ${await res.text()}`)
  }

  // Sin onboarding completo, RequireAuth manda al usuario a /onboarding en
  // vez de /dashboard tras el login — este spec asume que entra directo.
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
      // Esta línea sirve para definir «age» con «30, sex: 'male', height_cm: 180, weight_…».
      age: 30, sex: 'male', height_cm: 180, weight_kg: 80, level: 'beginner',
      // Esta línea sirve para declarar la propiedad «goals» con el valor o tipo «['gain_muscle'], frequency_days: 3».
      goals: ['gain_muscle'], frequency_days: 3,
    },
    // Esta línea sirve para incluir el valor «headers» en la lista.
    headers,
  })
  // Esta línea sirve para esperar el resultado de «ctx.post».
  await ctx.post(`${API_URL}/onboarding/complete`, { headers })

  // Esta línea sirve para esperar el resultado de «ctx.dispose».
  await ctx.dispose()
})

// Esta línea sirve para declarar la prueba que verifica que «activar, desafiar en el login, y desactivar 2FA de punta a punta».
test('activar, desafiar en el login, y desactivar 2FA de punta a punta', async ({ page }) => {
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

  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Configuración')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/settings$/)
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Activar 2FA')

  // Esta línea sirve para extraer «ecre» de «(await page.locator('p.font-mono').textC».
  const secret = (await page.locator('p.font-mono').textContent())?.trim()
  // Esta línea sirve para verificar que «secret» cumple «toBeTruthy».
  expect(secret).toBeTruthy()

  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#code', currentOtp(secret!))
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Confirmar')
  // Esta línea sirve para esperar el resultado de «expect».
  await expect(page.getByText('2FA activado. Guarda estos códigos de recuperación:')).toBeVisible()

  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Ya los guardé')
  // Esta línea sirve para esperar y verificar «page.getByText('2FA está activado en tu cuenta.'».
  await expect(page.getByText('2FA está activado en tu cuenta.')).toBeVisible()

  // Cerrar sesión y volver a loguear: ahora debe pedir el segundo factor.
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Volver')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/dashboard$/)
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Cerrar sesión')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/login$/)

  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#email', EMAIL)
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password', PASSWORD)
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('button[type=submit]')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/login\/verify$/)

  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#code', currentOtp(secret!))
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('button[type=submit]')
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/dashboard$/)

  // Desactivar de nuevo para dejar la cuenta en un estado limpio.
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Configuración')
  // Esta línea sirve para esperar el resultado de «page.fill».
  await page.fill('#password', PASSWORD)
  // Esta línea sirve para esperar el resultado de «page.click».
  await page.click('text=Desactivar 2FA')
  // Esta línea sirve para esperar y verificar «page.getByText('Activar 2FA'».
  await expect(page.getByText('Activar 2FA')).toBeVisible()
})
