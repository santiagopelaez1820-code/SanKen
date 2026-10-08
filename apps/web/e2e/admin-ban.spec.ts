// Esta línea sirve para importar «test, expect, request as pwRequest, type APIRequestContext, type Page» desde «@playwright/test».
import { test, expect, request as pwRequest, type APIRequestContext, type Page } from '@playwright/test'
// Esta línea sirve para importar «execSync» desde «node:child_process».
import { execSync } from 'node:child_process'

// Esta línea sirve para declarar «API_URL» con el valor «'http://localhost:8000/api/v1'».
const API_URL = 'http://localhost:8000/api/v1'
// Esta línea sirve para crear «RUN_ID» llamando a «Date.now».
const RUN_ID = Date.now()
// Esta línea sirve para declarar «PASSWORD» con el valor «'AdminBan123!'».
const PASSWORD = 'AdminBan123!'

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

// El admin necesita llegar a /dashboard (y de ahí a /admin) tras loguearse;
// sin onboarding completo, RequireAuth lo manda a /onboarding en su lugar.
// Esta línea sirve para declarar la función «completeOnboarding».
async function completeOnboarding(ctx: APIRequestContext, token: string) {
  // Esta línea sirve para extraer «eader» de «{ Authorization: `Bearer ${token}` }».
  const headers = { Authorization: `Bearer ${token}` }
  // Esta línea sirve para esperar el resultado de «ctx.post».
  await ctx.post(`${API_URL}/onboarding`, {
    // Esta línea sirve para declarar la propiedad «data» con el valor o tipo «{».
    data: {
      // Esta línea sirve para enviar las respuestas del onboarding con perfil de principiante.
      age: 30, sex: 'male', height_cm: 180, weight_kg: 80, level: 'beginner',
      // Esta línea sirve para declarar la propiedad «goals» con el valor o tipo «['gain_muscle'], frequency_days: 3».
      goals: ['gain_muscle'], frequency_days: 3,
    },
    // Esta línea sirve para incluir el valor «headers» en la lista.
    headers,
  })
  // Esta línea sirve para esperar el resultado de «ctx.post».
  await ctx.post(`${API_URL}/onboarding/complete`, { headers })
}

// Esta línea sirve para declarar la función «promoteToAdmin».
function promoteToAdmin(email: string) {
  // Esta línea sirve para ejecutar un comando de Artisan para promover al usuario a administrador.
  execSync(
    // Esta línea sirve para incluir el texto o las clases «php artisan tinker --execute=…».
    `php artisan tinker --execute="App\\\\Models\\\\User::where('email','${email}')->update(['role'=>'super_admin']);"`,
    // Esta línea sirve para ejecutar el comando dentro de la carpeta de la API.
    { cwd: '../api' },
  )
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

// Este spec prueba el baneo de admin, no el tutorial guiado -- lo marcamos
// como ya visto en localStorage antes de la primera navegación para no
// depender de que el clic en "Super Admin" en /dashboard le gane la carrera
// a la apertura automática del tutorial, que si no lo bloquearía con su
// overlay de pantalla completa (ver useTutorial).
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

// Esta línea sirve para declarar la prueba que verifica que «un admin banea a un usuario, y ese usuario ya no puede volver a loguea».
test('un admin banea a un usuario, y ese usuario ya no puede volver a loguearse', async ({ page, browser }) => {
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «ctx».
  const ctx = await pwRequest.newContext()

  // Esta línea sirve para extraer «argetNam» de «`Baneado ${RUN_ID}`».
  const targetName = `Baneado ${RUN_ID}`
  // Esta línea sirve para extraer «argetEmai» de «`e2e-ban-target-${RUN_ID}@sanken.app`».
  const targetEmail = `e2e-ban-target-${RUN_ID}@sanken.app`
  // Esta línea sirve para extraer «dminEmai» de «`e2e-ban-admin-${RUN_ID}@sanken.app`».
  const adminEmail = `e2e-ban-admin-${RUN_ID}@sanken.app`

  // Esta línea sirve para esperar el resultado de «registerUser».
  await registerUser(ctx, targetName, targetEmail)
  // Esta línea sirve para esperar «registerUser(ctx, `Admin ${RUN_ID}`, adm» y obtener «token: adminToken, id: adminId».
  const { token: adminToken, id: adminId } = await registerUser(ctx, `Admin ${RUN_ID}`, adminEmail)
  // Esta línea sirve para esperar el resultado de «completeOnboarding».
  await completeOnboarding(ctx, adminToken)
  // Esta línea sirve para llamar a «promoteToAdmin» con «adminEmail».
  promoteToAdmin(adminEmail)
  // Esta línea sirve para esperar el resultado de «ctx.dispose».
  await ctx.dispose()

  // Esta línea sirve para esperar el resultado de «dismissTutorials».
  await dismissTutorials(page, adminId)
  // Esta línea sirve para esperar el resultado de «login».
  await login(page, adminEmail)
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/dashboard$/)

  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('link', { name: 'Super Admin' }).click()
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/admin$/)
  // Esta línea sirve para esperar el resultado de «page.getByRole».
  await page.getByRole('link', { name: 'Usuarios' }).click()
  // Esta línea sirve para esperar y verificar «page».
  await expect(page).toHaveURL(/\/admin\/users$/)

  // Esta línea sirve para crear «row» llamando a «page.locator».
  const row = page.locator('li').filter({ hasText: targetName })
  // Esta línea sirve para esperar y verificar «row».
  await expect(row).toBeVisible()
  // Esta línea sirve para esperar el resultado de «row.getByRole».
  await row.getByRole('button', { name: 'Banear' }).click()
  // Esta línea sirve para esperar y verificar «row.getByRole('button', { name: 'Desbanear' }».
  await expect(row.getByRole('button', { name: 'Desbanear' })).toBeVisible()

  // Sesión aparte (sin el token del admin) para probar el login real del
  // usuario baneado.
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «otherContext».
  const otherContext = await browser.newContext()
  // Esta línea sirve para ejecutar la acción y guardar el resultado en «otherPage».
  const otherPage = await otherContext.newPage()
  // Esta línea sirve para esperar el resultado de «login».
  await login(otherPage, targetEmail)

  // Esta línea sirve para esperar y verificar «otherPage.getByText(/suspendida/i».
  await expect(otherPage.getByText(/suspendida/i)).toBeVisible()
  // Esta línea sirve para esperar y verificar «otherPage».
  await expect(otherPage).toHaveURL(/\/login$/)

  // Esta línea sirve para esperar el resultado de «otherContext.close».
  await otherContext.close()
})
