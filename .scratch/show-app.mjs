import { chromium } from 'playwright';

const API_URL = 'http://localhost:8000/api/v1';
const WEB_URL = 'http://localhost:5173';
const EMAIL = `demo-${Date.now()}@sanken.app`;
const PASSWORD = 'Demo12345!';
const SHOTS = '/home/santiago/sanken/.scratch/shots';

async function main() {
  // 1. Register via API (same recipe as e2e fixtures)
  const reg = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ name: 'Usuario Demo', email: EMAIL, password: PASSWORD, password_confirmation: PASSWORD }),
  });
  if (!reg.ok) throw new Error(`register failed: ${reg.status} ${await reg.text()}`);

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${WEB_URL}/login`);
  await page.fill('#email', EMAIL);
  await page.fill('#password', PASSWORD);
  await page.click('button[type=submit]');
  await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 });

  const token = await page.evaluate(() => {
    const raw = localStorage.getItem('sanken-auth');
    return raw ? JSON.parse(raw).state?.token ?? null : null;
  });
  if (!token) throw new Error('no auth token in localStorage after login');

  async function authedPost(path, data) {
    const res = await page.evaluate(
      async ({ path, data, apiUrl, token }) => {
        function readCookie(name) {
          const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
          return match ? decodeURIComponent(match[1]) : null;
        }
        const res = await fetch(`${apiUrl}${path}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'X-XSRF-TOKEN': readCookie('XSRF-TOKEN') ?? '',
          },
          body: JSON.stringify(data),
        });
        return { ok: res.ok, status: res.status, text: await res.text() };
      },
      { path, data, apiUrl: API_URL, token },
    );
    if (!res.ok) throw new Error(`POST ${path} failed: ${res.status} ${res.text}`);
    return res.text ? JSON.parse(res.text) : null;
  }

  await authedPost('/onboarding', {
    age: 27,
    sex: 'female',
    height_cm: 165,
    weight_kg: 62,
    level: 'beginner',
    goals: ['gain_muscle'],
    frequency_days: 3,
    session_minutes: 45,
    place: 'gym',
    equipment_available: ['barbell', 'dumbbells', 'machines'],
    injuries: [],
  });
  await authedPost('/onboarding/complete', {});
  await authedPost('/routines/generate', {});

  // give the queued routine-generation job a moment to land
  await page.waitForTimeout(4000);

  await page.goto(`${WEB_URL}/dashboard`);
  await page.waitForLoadState('networkidle');
  await page
    .waitForFunction(() => !document.body.innerText.includes('Cargando tu plan'), { timeout: 15000 })
    .catch(() => {});
  await page.screenshot({ path: `${SHOTS}/1-dashboard.png` });

  for (const [route, name] of [
    ['/rankings', '2-rankings'],
    ['/nutrition', '3-nutrition'],
    ['/challenges', '4-challenges'],
  ]) {
    await page.goto(`${WEB_URL}${route}`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `${SHOTS}/${name}.png` });
  }

  console.log('EMAIL=' + EMAIL);
  console.log('OK');
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
