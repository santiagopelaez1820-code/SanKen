// Esta línea sirve para importar el cliente de WebSockets Laravel Echo.
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
// Esta línea sirve para resolver el constructor de Echo según cómo lo exporte el bundler.
const EchoCtor: typeof Echo =
  // Esta línea sirve para usar Echo directamente o su export por defecto.
  typeof Echo === 'function' ? Echo : (Echo as unknown as { default: typeof Echo }).default;

// Esta línea sirve para declarar la configuración para crear la conexión en tiempo real.
export interface CreateEchoConfig {
  /** REVERB_APP_KEY (VITE_REVERB_APP_KEY / EXPO_PUBLIC_REVERB_APP_KEY). */
  // Esta línea sirve para guardar la clave de la aplicación Reverb.
  key: string;
  // Esta línea sirve para guardar el host del servidor WebSocket.
  host: string;
  // Esta línea sirve para guardar el puerto del servidor.
  port: number;
  // Esta línea sirve para guardar el esquema http o https.
  scheme: 'http' | 'https';
  /** Base de la API, sin `/api/v1` — ej. http://localhost:8000. */
  // Esta línea sirve para guardar la URL base de la API para autenticar canales.
  apiBaseUrl: string;
  /** Bearer token actual del usuario autenticado. */
  // Esta línea sirve para guardar el token de sesión del usuario.
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
  // Esta línea sirve para guardar el cliente Pusher que usa Echo para conectar.
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
// Esta línea sirve para declarar la función que crea la conexión Echo con Reverb.
export function createEcho(config: CreateEchoConfig): Echo<'reverb'> {
  // El conector "reverb" de laravel-echo (un PusherConnector con cluster
  // vacío) busca el cliente en globalThis.Pusher cuando no se pasa
  // `options.client` explícito.
  // Esta línea sirve para registrar Pusher como global porque Echo lo busca ahí.
  (globalThis as unknown as { Pusher: unknown }).Pusher = config.pusherClient;

  // Esta línea sirve para devolver una nueva instancia de Echo.
  return new EchoCtor<'reverb'>({
    // Esta línea sirve para indicar que el servidor de broadcasting es Reverb.
    broadcaster: 'reverb',
    // Esta línea sirve para enviar la clave de la aplicación.
    key: config.key,
    // Esta línea sirve para enviar el host del WebSocket.
    wsHost: config.host,
    // Esta línea sirve para enviar el puerto sin TLS.
    wsPort: config.port,
    // Esta línea sirve para enviar el puerto con TLS.
    wssPort: config.port,
    // Esta línea sirve para forzar TLS solo cuando el esquema es https.
    forceTLS: config.scheme === 'https',
    // Esta línea sirve para elegir el transporte seguro o no según el esquema.
    enabledTransports: config.scheme === 'https' ? ['wss'] : ['ws'],
    // Esta línea sirve para definir el endpoint que autoriza los canales privados.
    authEndpoint: `${config.apiBaseUrl}/broadcasting/auth`,
    // Esta línea sirve para enviar el token como bearer en la autorización.
    bearerToken: config.token,
  });
}

// Esta línea sirve para reexportar el tipo de instancia de Echo.
export type { default as EchoInstance } from 'laravel-echo';
