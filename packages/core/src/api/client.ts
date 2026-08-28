export interface ApiSuccess<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export interface ApiClientConfig {
  /** e.g. https://api.sanken.app or http://localhost:8000 */
  baseUrl: string;
  /** Returns the current Sanctum bearer token, if any (mobile). */
  getToken?: () => string | null | undefined;
  /**
   * Web SPA only: send/receive cookies and attach the Sanctum CSRF header,
   * per Sanctum's "stateful" flow (ver docs/03-api.md §1). Requires calling
   * `bootstrapCsrf()` once before the first mutating request.
   */
  withCredentials?: boolean;
  /** Returns the current XSRF-TOKEN cookie value, URL-decoded. Web only. */
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
  onUnauthorized?: () => void;
}

/**
 * Thin, framework-agnostic wrapper around fetch for the SanKen API (/api/v1/*).
 * Shared between the web (Vite) and mobile (Expo) clients so request/response
 * shapes only need to be defined once. See docs/03-api.md for the contract.
 */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly getToken?: () => string | null | undefined;
  private readonly withCredentials: boolean;
  private readonly getCsrfToken?: () => string | null | undefined;
  private readonly onUnauthorized?: () => void;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.getToken = config.getToken;
    this.withCredentials = config.withCredentials ?? false;
    this.getCsrfToken = config.getCsrfToken;
    this.onUnauthorized = config.onUnauthorized;
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
   */
  mediaUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (/^https?:\/\//.test(path)) return path;
    return `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  /**
   * Pide la cookie XSRF-TOKEN a Sanctum. Debe llamarse (una vez, o antes de
   * cada login) antes de cualquier request mutante desde la SPA web.
   */
  async bootstrapCsrf(): Promise<void> {
    await fetch(`${this.baseUrl}/sanctum/csrf-cookie`, {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
  }

  get<T>(path: string) {
    return this.request<T>('GET', path).then((envelope) => envelope.data);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>('POST', path, body).then((envelope) => envelope.data);
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>('PATCH', path, body).then((envelope) => envelope.data);
  }

  /**
   * `body` es opcional (ej. DELETE /calendar/reminders/{id} no lo necesita,
   * el id ya va en la URL) pero /push/expo-token y /push/web-subscription
   * (Sprint 11) sí lo usan: son recursos sin id propio del lado servidor,
   * el token/endpoint a borrar viaja en el body. `envelope` puede ser
   * `null` acá porque un 204 No Content no trae body — `res.json()`
   * rechaza y `request()` lo atrapa como null.
   */
  delete<T = void>(path: string, body?: unknown) {
    return this.request<T>('DELETE', path, body).then((envelope) => envelope?.data as T);
  }

  /**
   * Igual que `get`, pero conserva `meta` (paginación, next_day_id, etc.)
   * en vez de descartarlo. Usar solo cuando el endpoint documenta un `meta`
   * relevante — ver docs/03-api.md.
   */
  getWithMeta<T>(path: string): Promise<ApiSuccess<T>> {
    return this.request<T>('GET', path);
  }

  /**
   * Igual que `post`, pero conserva `meta` (p. ej. meta.gamification al
   * completar una sesión) en vez de descartarlo.
   */
  postWithMeta<T>(path: string, body?: unknown): Promise<ApiSuccess<T>> {
    return this.request<T>('POST', path, body);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiSuccess<T>> {
    const token = this.getToken?.();
    const csrfToken = this.withCredentials ? this.getCsrfToken?.() : null;
    const isMutating = method !== 'GET';
    // FormData (subida de archivos, ej. video de ejercicio) nunca se
    // serializa a JSON ni lleva Content-Type manual — fetch arma el
    // boundary multipart/form-data solo si el header se deja sin definir.
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

    const res = await fetch(`${this.baseUrl}/api/v1${path}`, {
      method,
      credentials: this.withCredentials ? 'include' : 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(body !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(isMutating && csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
      },
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    });

    const json = (await res.json().catch(() => null)) as
      | ApiSuccess<T>
      | ApiErrorBody
      | null;

    if (!res.ok) {
      if (res.status === 401) {
        this.onUnauthorized?.();
      }
      throw new ApiError(res.status, (json as ApiErrorBody) ?? { message: res.statusText });
    }

    return json as ApiSuccess<T>;
  }
}
