/**
 * Mock de tests para @/lib/social-auth — evita cargar el SDK de Firebase
 * (ESM puro, no lo resuelve el runtime CJS de Jest) en la suite de tests.
 * auth-store.test.ts no ejercita el flujo real de Google, solo la lógica
 * de la store; esta integración solo se puede probar de verdad en un
 * navegador/dispositivo real.
 */
// Esta línea sirve para declarar la clase «SocialAuthCancelledError».
export class SocialAuthCancelledError extends Error {}
// Esta línea sirve para declarar la clase «SocialAuthUnavailableError».
export class SocialAuthUnavailableError extends Error {}

// Esta línea sirve para declarar la función «signInWithGoogle».
export async function signInWithGoogle(): Promise<{ idToken: string }> {
  // Esta línea sirve para lanzar un error de tipo «SocialAuthUnavailableError».
  throw new SocialAuthUnavailableError('signInWithGoogle está mockeado en tests.');
}

// Esta línea sirve para declarar la función «signOutFromGoogle».
export async function signOutFromGoogle(): Promise<void> {}

// Esta línea sirve para declarar la función «describeSocialAuthError».
export function describeSocialAuthError(_err: unknown): string {
  // Esta línea sirve para devolver «'Mocked social auth error.'».
  return 'Mocked social auth error.';
}
