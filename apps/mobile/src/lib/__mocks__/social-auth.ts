/**
 * Mock de tests para @/lib/social-auth — evita cargar el SDK de Firebase
 * (ESM puro, no lo resuelve el runtime CJS de Jest) en la suite de tests.
 * auth-store.test.ts no ejercita el flujo real de Google, solo la lógica
 * de la store; esta integración solo se puede probar de verdad en un
 * navegador/dispositivo real.
 */
export class SocialAuthCancelledError extends Error {}
export class SocialAuthUnavailableError extends Error {}

export async function signInWithGoogle(): Promise<{ idToken: string }> {
  throw new SocialAuthUnavailableError('signInWithGoogle está mockeado en tests.');
}

export function describeSocialAuthError(_err: unknown): string {
  return 'Mocked social auth error.';
}
