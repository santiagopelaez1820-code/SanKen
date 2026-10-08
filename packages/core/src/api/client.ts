// Esta línea sirve para importar los tipos de consentimientos legales.
import type { ConsentType, PendingConsent } from '../legal/types';
// Esta línea sirve para importar la función que ajusta el tamaño de las imágenes y videos.
import { applyMediaVariant, type MediaVariant } from '../lib/media';

/** Body del 403 que devuelve EnsureLegalConsentsAccepted. */
// Esta línea sirve para declarar el cuerpo del error 403 de consentimientos pendientes.
interface ConsentRequiredBody extends ApiErrorBody {
  // Esta línea sirve para indicar el código fijo "consent_required".
  code: 'consent_required';
  // Esta línea sirve para incluir la lista de consentimientos pendientes (opcional).
  pending?: PendingConsent[];
}

// Esta línea sirve para declarar la forma de una respuesta exitosa de la API.
export interface ApiSuccess<T> {
  // Esta línea sirve para incluir los datos.
  data: T;
  // Esta línea sirve para incluir datos extra (opcional).
  meta?: Record<string, unknown>;
}

// Esta línea sirve para declarar la forma de un error de la API.
export interface ApiErrorBody {
  // Esta línea sirve para incluir el mensaje.
  message: string;
  // Esta línea sirve para incluir los errores por campo (opcional).
  errors?: Record<string, string[]>;
}

// Esta línea sirve para declarar el error que lanza el cliente cuando la API responde con error.
export class ApiError extends Error {
  // Esta línea sirve para guardar el código HTTP.
  readonly status: number;
  // Esta línea sirve para guardar el cuerpo del error.
  readonly body: ApiErrorBody;

  // Esta línea sirve para declarar el constructor.
  constructor(status: number, body: ApiErrorBody) {
    // Esta línea sirve para llamar al constructor base con el mensaje.
    super(body.message);
    // Esta línea sirve para nombrar el error "ApiError".
    this.name = 'ApiError';
    // Esta línea sirve para guardar el código HTTP.
    this.status = status;
    // Esta línea sirve para guardar el cuerpo del error.
    this.body = body;
  }
}

// Esta línea sirve para declarar la configuración del cliente.
export interface ApiClientConfig {
  /** e.g. https://api.sanken.app or http://localhost:8000 */
  // Esta línea sirve para recibir la URL base de la API.
  baseUrl: string;
  /** Returns the current Sanctum bearer token, if any (mobile). */
  // Esta línea sirve para recibir la función que devuelve el token de acceso.
  getToken?: () => string | null | undefined;
  /**
   * Web SPA only: send/receive cookies and attach the Sanctum CSRF header,
   * per Sanctum's "stateful" flow (ver docs/03-api.md §1). Requires calling
   * `bootstrapCsrf()` once before the first mutating request.
   */
  // Esta línea sirve para recibir si se envían cookies (web).
  withCredentials?: boolean;
  /** Returns the current XSRF-TOKEN cookie value, URL-decoded. Web only. */
  // Esta línea sirve para recibir la función que devuelve el token CSRF.
  getCsrfToken?: () => string | null | undefined;
  /**
   * Called whenever the API rejects an authenticated request with 401. The
   * backend never returns 401 for a failed login/register (those are 422
   * validation errors, see AuthenticateUserAction) — a 401 always means the
   * caller's session/token is no longer valid (expired, revoked, or —
   * concretely, what happened to a dev testing this — pointing at a token
   * row that no longer exists after the local DB was rebuilt). Each
   * platform wires this to clear its local session so the UI falls back to
   * the login screen instead of hanging on a request that can never
   * succeed (see OnboardingPage's old `isLoading || !questions` bug).
   */
  // Esta línea sirve para recibir la función a ejecutar cuando la API responde 401.
  onUnauthorized?: () => void;
  /**
   * Called when the API answers 403 `code: "consent_required"`: the user has
   * legal documents pending (never accepted, or a newer version was
   * published mid-session — see EnsureLegalConsentsAccepted). Each platform
   * wires this to show its re-acceptance screen. The request still rejects
   * with ApiError so callers stop as usual.
   */
  // Esta línea sirve para recibir la función a ejecutar cuando faltan consentimientos.
  onConsentRequired?: (pending: ConsentType[]) => void;
}

/**
 * Thin, framework-agnostic wrapper around fetch for the SanKen API (/api/v1/*).
 * Shared between the web (Vite) and mobile (Expo) clients so request/response
 * shapes only need to be defined once. See docs/03-api.md for the contract.
 */
// Esta línea sirve para declarar el cliente de la API compartido por web y móvil.
export class ApiClient {
  // Esta línea sirve para guardar la URL base.
  private readonly baseUrl: string;
  // Esta línea sirve para guardar la función del token.
  private readonly getToken?: () => string | null | undefined;
  // Esta línea sirve para guardar si se envían cookies.
  private readonly withCredentials: boolean;
  // Esta línea sirve para guardar la función del token CSRF.
  private readonly getCsrfToken?: () => string | null | undefined;
  // Esta línea sirve para guardar la función para el caso 401.
  private readonly onUnauthorized?: () => void;
  // Esta línea sirve para guardar la función para el caso de consentimientos pendientes.
  private readonly onConsentRequired?: (pending: ConsentType[]) => void;

  // Esta línea sirve para declarar el constructor.
  constructor(config: ApiClientConfig) {
    // Esta línea sirve para guardar la URL base sin barras al final.
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    // Esta línea sirve para guardar la función del token.
    this.getToken = config.getToken;
    // Esta línea sirve para guardar si se envían cookies (falso por defecto).
    this.withCredentials = config.withCredentials ?? false;
    // Esta línea sirve para guardar la función del token CSRF.
    this.getCsrfToken = config.getCsrfToken;
    // Esta línea sirve para guardar la función para el caso 401.
    this.onUnauthorized = config.onUnauthorized;
    // Esta línea sirve para guardar la función para consentimientos pendientes.
    this.onConsentRequired = config.onConsentRequired;
  }

  /**
   * Resuelve una URL de media (video/imagen) devuelta por la API contra
   * este mismo baseUrl. El backend guarda video_url como ruta relativa
   * (p. ej. "/storage/exercise-videos/x.mp4") en vez de absoluta a
   * propósito: "localhost" no significa nada en un celular físico, y
   * bakear el host de turno (ngrok en dev, dominio en prod) directamente
   * en la DB rompe apenas ese host cambia. Cada plataforma resuelve la
   * ruta contra SU PROPIO baseUrl (mismo que usa para /api/v1) — así
   * mobile y web comparten la única fuente de verdad para media.
   * Una URL ya absoluta (http/https) se devuelve sin tocar, por si un
   * admin pegó un link externo directamente en video_url/image_url.
   *
   * En producción el multimedia vive en Cloudinary (URL absoluta): con
   * `variant` se pide el tamaño/formato que necesita cada pantalla (ver
   * lib/media.ts). Sin variant, o si la URL no es de Cloudinary, no cambia.
   */
  // Esta línea sirve para declarar el método que convierte la ruta de un archivo en una URL completa.
  mediaUrl(path: string | null | undefined, variant?: MediaVariant): string | null {
    // Esta línea sirve para devolver null si no hay ruta.
    if (!path) return null;
    // Esta línea sirve para devolver las URLs absolutas tal cual (ajustando la variante si se pidió).
    if (/^https?:\/\//.test(path)) return variant ? applyMediaVariant(path, variant) : path;
    // Esta línea sirve para unir la URL base con la ruta relativa.
    return `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  /**
   * Pide la cookie XSRF-TOKEN a Sanctum. Debe llamarse (una vez, o antes de
   * cada login) antes de cualquier request mutante desde la SPA web.
   */
  // Esta línea sirve para declarar el método que pide la cookie XSRF a Sanctum.
  async bootstrapCsrf(): Promise<void> {
    // Esta línea sirve para pedir la cookie a Sanctum.
    await fetch(`${this.baseUrl}/sanctum/csrf-cookie`, {
      // Esta línea sirve para enviar cookies con la petición.
      credentials: 'include',
      // Esta línea sirve para pedir una respuesta JSON.
      headers: { Accept: 'application/json' },
    });
  }

  // Esta línea sirve para declarar el método GET que devuelve solo los datos.
  get<T>(path: string) {
    // Esta línea sirve para hacer la petición y quedarse con los datos.
    return this.request<T>('GET', path).then((envelope) => envelope.data);
  }

  /**
   * `envelope` puede ser null: varios endpoints de acción responden 204 sin
   * body (p. ej. POST /feed/{type}/{id}/read). Antes esto hacía
   * `envelope.data` sobre null, tiraba un TypeError aunque la request
   * hubiera salido bien, y quien llamaba nunca llegaba a refrescar su
   * estado (bug de "la notificación no se marca como leída").
   */
  // Esta línea sirve para declarar el método POST que devuelve solo los datos.
  post<T>(path: string, body?: unknown) {
    // Esta línea sirve para hacer la petición y quedarse con los datos (o undefined si no hay cuerpo).
    return this.request<T>('POST', path, body).then((envelope) => envelope?.data as T);
  }

  // Esta línea sirve para declarar el método PATCH que devuelve solo los datos.
  patch<T>(path: string, body?: unknown) {
    // Esta línea sirve para hacer la petición y quedarse con los datos (o undefined si no hay cuerpo).
    return this.request<T>('PATCH', path, body).then((envelope) => envelope?.data as T);
  }

  /**
   * `body` es opcional (ej. DELETE /calendar/reminders/{id} no lo necesita,
   * el id ya va en la URL) pero /push/expo-token y /push/web-subscription
   * (Sprint 11) sí lo usan: son recursos sin id propio del lado servidor,
   * el token/endpoint a borrar viaja en el body. `envelope` puede ser
   * `null` acá porque un 204 No Content no trae body — `res.json()`
   * rechaza y `request()` lo atrapa como null.
   */
  // Esta línea sirve para declarar el método DELETE que devuelve solo los datos.
  delete<T = void>(path: string, body?: unknown) {
    // Esta línea sirve para hacer la petición y quedarse con los datos (o undefined si no hay cuerpo).
    return this.request<T>('DELETE', path, body).then((envelope) => envelope?.data as T);
  }

  /**
   * Igual que `get`, pero conserva `meta` (paginación, next_day_id, etc.)
   * en vez de descartarlo. Usar solo cuando el endpoint documenta un `meta`
   * relevante — ver docs/03-api.md.
   */
  // Esta línea sirve para declarar el método GET que conserva los datos extra (meta).
  getWithMeta<T>(path: string): Promise<ApiSuccess<T>> {
    // Esta línea sirve para hacer la petición y devolver la respuesta completa.
    return this.request<T>('GET', path);
  }

  /**
   * Igual que `post`, pero conserva `meta` (p. ej. meta.gamification al
   * completar una sesión) en vez de descartarlo.
   */
  // Esta línea sirve para declarar el método POST que conserva los datos extra (meta).
  postWithMeta<T>(path: string, body?: unknown): Promise<ApiSuccess<T>> {
    // Esta línea sirve para hacer la petición y devolver la respuesta completa.
    return this.request<T>('POST', path, body);
  }

  // Esta línea sirve para declarar el método privado que hace todas las peticiones a la API.
  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiSuccess<T>> {
    // Esta línea sirve para obtener el token de acceso actual.
    const token = this.getToken?.();
    // Esta línea sirve para obtener el token CSRF si se usan cookies.
    const csrfToken = this.withCredentials ? this.getCsrfToken?.() : null;
    // Esta línea sirve para indicar si la petición modifica datos.
    const isMutating = method !== 'GET';
    // FormData (subida de archivos, ej. video de ejercicio) nunca se
    // serializa a JSON ni lleva Content-Type manual — fetch arma el
    // boundary multipart/form-data solo si el header se deja sin definir.
    // Esta línea sirve para revisar si el cuerpo es un FormData (subida de archivos).
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    // Esta línea sirve para hacer la petición a la ruta de la API v1.
    const res = await fetch(`${this.baseUrl}/api/v1${path}`, {
      // Esta línea sirve para indicar el método HTTP.
      method,
      // Esta línea sirve para enviar cookies solo si se configuró.
      credentials: this.withCredentials ? 'include' : 'same-origin',
      // Esta línea sirve para definir los encabezados.
      headers: {
        // Esta línea sirve para pedir una respuesta JSON.
        Accept: 'application/json',
        // Esta línea sirve para indicar que el cuerpo es JSON, salvo en archivos.
        ...(body !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        // Esta línea sirve para enviar el token de acceso si existe.
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        // Esta línea sirve para enviar el token CSRF en las peticiones que modifican datos.
        ...(isMutating && csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
      },
      // Esta línea sirve para enviar el cuerpo como FormData, como JSON o sin cuerpo.
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    });

    // Esta línea sirve para leer la respuesta como JSON (o null si no tiene cuerpo).
    const json = (await res.json().catch(() => null)) as
      // Esta línea sirve para aceptar una respuesta exitosa.
      | ApiSuccess<T>
      // Esta línea sirve para aceptar también un error de la API.
      | ApiErrorBody
      // Esta línea sirve para aceptar también una respuesta vacía.
      | null;

    // Esta línea sirve para revisar si la respuesta fue un error.
    if (!res.ok) {
      // Esta línea sirve para revisar si es un 401.
      if (res.status === 401) {
        // Esta línea sirve para avisar que la sesión ya no es válida.
        this.onUnauthorized?.();
      }
      // Esta línea sirve para revisar si es un 403 por consentimientos pendientes.
      if (res.status === 403 && (json as ConsentRequiredBody | null)?.code === 'consent_required') {
        // Esta línea sirve para avisar con los tipos de consentimiento que faltan.
        this.onConsentRequired?.(((json as ConsentRequiredBody).pending ?? []).map((p) => p.type));
      }
      // Esta línea sirve para lanzar un ApiError con el código y el cuerpo.
      throw new ApiError(res.status, (json as ApiErrorBody) ?? { message: res.statusText });
    }

    // Esta línea sirve para devolver la respuesta exitosa.
    return json as ApiSuccess<T>;
  }
}
