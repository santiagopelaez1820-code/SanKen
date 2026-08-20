import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1000, height: 800 } });

await page.goto('http://localhost:5173/login');
await page.waitForLoadState('networkidle');
await page.screenshot({ path: '/home/santiago/sanken/.scratch/shots/5-login-with-link.png' });

await page.click('text=Registrate');
await page.waitForURL(/\/register$/);
await page.waitForLoadState('networkidle');
await page.screenshot({ path: '/home/santiago/sanken/.scratch/shots/6-register.png' });

console.log(page.url());
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

// quick fill + submit smoke test with a fresh email
const email = `webreg-${Date.now()}@sanken.app`;
await page.fill('#name', 'Web Register Test');
await page.fill('#email', email);
await page.fill('#password', 'Password123!');
await page.fill('#password_confirmation', 'Password123!');
await page.click('button[type=submit]');
await page.waitForURL(/\/dashboard$/, { timeout: 15000 });
await page.screenshot({ path: '/home/santiago/sanken/.scratch/shots/7-register-success-dashboard.png' });

console.log('ERRORS:', JSON.stringify(errors));
console.log('OK', email);
await browser.close();
