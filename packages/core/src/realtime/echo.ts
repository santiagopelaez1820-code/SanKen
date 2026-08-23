import Echo from 'laravel-echo';

/**
 * Bajo Metro (mobile), con `resolver.unstable_enablePackageExports = false`
 * en `apps/mobile/metro.config.js` (necesario desde Sprint 12 por el bug de
 * `barcode-detector`), el default import de `laravel-echo` no se interopera
 * bien — `Echo` llega como el objeto módulo completo en vez de la clase, y
 * `new Echo(...)` explota con "Object cannot be used as a constructor". En
 * web (Vite) el import ya llega correctamente interoperado. Este fallback
 * cubre ambos casos sin depender de cuál bundler lo está cargando.
 */
const EchoCtor: typeof Echo =
  typeof Echo === 'function' ? Echo : (Echo as unknown as { default: typeof Echo }).default;

export interface CreateEchoConfig {
  /** REVERB_APP_KEY (VITE_REVERB_APP_KEY / EXPO_PUBLIC_REVERB_APP_KEY). */
  key: string;
  host: string;
  port: number;
  scheme: 'http' | 'https';
  /** Base de la API, sin `/api/v1` — ej. http://localhost:8000. */
  apiBaseUrl: string;
  /** Bearer token actual del usuario autenticado. */
  token: string;
  /**
   * Cliente Pusher a usar — cada plataforma lo importa e inyecta acá, este
   * archivo NUNCA importa `pusher-js` directamente: es el build de browser
   * (usa DOM/`window` en su propio código de carga, no solo en runtime) y
   * este módulo es compartido con Metro/React Native, que necesita el build
   * separado `pusher-js/react-native`. Un `import` estático de `pusher-js`
   * acá se colaría en TODO consumidor de @sanken/core — incluido mobile, que
   * ya importa el paquete en casi todos sus archivos — así que se inyecta en
   * vez de importarse.
   */
  pusherClient: unknown;
}

/**
 * Wrapper fino sobre laravel-echo (broadcaster "reverb"), primer uso de
 * websockets en la app (Sprint 10: retos). Esta app no tiene sesión de
 * cookie (autentica todo por Bearer token — ver ApiClient), así que en vez
 * de un authorizer custom se usa la opción nativa `bearerToken` de
 * laravel-echo: internamente agrega `Authorization: Bearer <token>` a los
 * headers que pusher-js manda en el POST a `authEndpoint` para autorizar
 * canales privados. El token es una foto del momento de creación — si el
 * usuario cierra sesión y entra con otro, hay que llamar disconnect() en el
 * Echo viejo y crear uno nuevo, no reusar la instancia.
 */
export function createEcho(config: CreateEchoConfig): Echo<'reverb'> {
  // El conector "reverb" de laravel-echo (un PusherConnector con cluster
  // vacío) busca el cliente en globalThis.Pusher cuando no se pasa
  // `options.client` explícito.
  (globalThis as unknown as { Pusher: unknown }).Pusher = config.pusherClient;

  return new EchoCtor<'reverb'>({
    broadcaster: 'reverb',
    key: config.key,
    wsHost: config.host,
    wsPort: config.port,
    wssPort: config.port,
    forceTLS: config.scheme === 'https',
    enabledTransports: config.scheme === 'https' ? ['wss'] : ['ws'],
    authEndpoint: `${config.apiBaseUrl}/broadcasting/auth`,
    bearerToken: config.token,
  });
}

export type { default as EchoInstance } from 'laravel-echo';
