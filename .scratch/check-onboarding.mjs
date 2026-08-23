import { chromium } from 'playwright';

const SHOTS = '/home/santiago/sanken/.scratch/shots';
const email = `onb-${Date.now()}@sanken.app`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

await page.goto('http://localhost:5173/register');
await page.fill('#name', 'Onboarding Test');
await page.fill('#email', email);
await page.fill('#password', 'Password123!');
await page.fill('#password_confirmation', 'Password123!');
await page.click('button[type=submit]');

// debe caer directo en /onboarding, no en /dashboard, porque el usuario no completó el cuestionario
await page.waitForURL(/\/onboarding$/, { timeout: 15000 });
await page.screenshot({ path: `${SHOTS}/8-onboarding-step1.png` });

// age
await page.fill('input[type=number]', '30');
await page.click('text=Continuar');

// sex
await page.click('text=Hombre');
await page.click('text=Continuar');

// height
await page.fill('input[type=number]', '180');
await page.click('text=Continuar');

// weight
await page.fill('input[type=number]', '82');
await page.click('text=Continuar');
await page.screenshot({ path: `${SHOTS}/9-onboarding-mid.png` });

// country
await page.locator('button', { hasText: /./ }).first().waitFor();
const countryBtn = page.locator('main button').first();
await countryBtn.click();
await page.click('text=Continuar');

// city
await page.locator('main button').first().click();
await page.click('text=Continuar');

// level
await page.click('text=Principiante');
await page.click('text=Continuar');

// goals
await page.click('text=Ganar músculo');
await page.click('text=Continuar');

// frequency
await page.click('text=3 días');
await page.click('text=Continuar');

// session
await page.click('text=45 minutos');
await page.click('text=Continuar');

// place
await page.click('text=Gimnasio');
await page.click('text=Continuar');
await page.screenshot({ path: `${SHOTS}/10-onboarding-place.png` });

// equipment (optional) - just continue
await page.click('text=Continuar');

// injuries (optional) - just continue
await page.click('text=Continuar');

// experience (optional) - final step
await page.screenshot({ path: `${SHOTS}/11-onboarding-last-step.png` });
await page.click('text=Generar mi plan');

await page.waitForURL(/\/dashboard$/, { timeout: 20000 });
await page.waitForLoadState('networkidle');
await page
  .waitForFunction(() => !document.body.innerText.includes('Cargando tu plan'), { timeout: 20000 })
  .catch(() => {});
await page.screenshot({ path: `${SHOTS}/12-onboarding-done-dashboard.png` });

console.log('ERRORS:', JSON.stringify(errors.filter((e) => !e.includes('WebSocket'))));
console.log('OK', email);
await browser.close();
