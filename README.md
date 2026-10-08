# SanKen

Plataforma fitness inteligente: un **motor de rutinas automático** (genera y ajusta el entrenamiento de cada usuario con sobrecarga progresiva) más un **módulo profesional para entrenadores**, con capa social (rankings, retos, chat), nutrición, tienda, soporte y panel de administración.

Una sola API (Laravel) alimenta dos clientes: una **web** (React) y una **app móvil** (React Native / Expo). Ambos comparten tipos y cliente HTTP a través de `@sanken/core`.

> Arquitectura completa, modelo de datos y roadmap: empieza por [`docs/00-resumen-ejecutivo.md`](docs/00-resumen-ejecutivo.md).

## Contenido

- [Estructura del repositorio](#estructura-del-repositorio)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalar dependencias](#instalar-dependencias)
- [Arrancar el entorno](#arrancar-el-entorno)
- [Documentación de la API (Swagger)](#documentación-de-la-api-swagger)
- [Pruebas y calidad](#pruebas-y-calidad)
- [Integración continua](#integración-continua)
- [Convención de comentarios del código](#convención-de-comentarios-del-código)
- [Documentación adicional](#documentación-adicional)
- [Estado actual](#estado-actual)

## Estructura del repositorio

```
apps/api         API Laravel 12 — Clean Architecture
                 (Domain / Application / Infrastructure / Http)
apps/web         Web: React + Vite + TailwindCSS + Shadcn UI (+ React Bootstrap en las pantallas de marca)
apps/mobile      App móvil: React Native + Expo (Expo Router)
packages/core    Tipos, cliente HTTP (ApiClient), textos legales y utilidades compartidas entre web y mobile
scripts/         Arranque automático del entorno de desarrollo (PowerShell + WSL) e inventario/credenciales de Cloudinary
docs/            Arquitectura, modelo de datos, API, UX/UI, roadmap, legal, soporte, Cloudinary, entorno y APK
.github/         Flujos de CI (api, web, mobile)
docker-compose.yml   MySQL 8.4 + Redis 7 (ver la nota de entorno más abajo)
```

Dentro de `apps/api/app/`:

| Carpeta | Qué contiene |
|---|---|
| `Domain/` | Reglas de negocio puras (motor de rutinas, sobrecarga progresiva, nutrición, rankings, gamificación). Sin dependencias de framework. |
| `Application/` | Casos de uso (`Actions`) que orquestan el dominio y la infraestructura. |
| `Infrastructure/` | Repositorios, Cloudinary, Firebase, notificaciones push y otros servicios externos. |
| `Http/` | Controladores (agrupados por módulo con `#[Group]`), FormRequests, API Resources y el soporte de la documentación OpenAPI. |
| `Models/`, `Policies/`, `Events/`, `Listeners/`, `Notifications/`, `Rules/`, `Console/` | Eloquent, autorización, eventos de tiempo real, notificaciones, reglas de validación y comandos Artisan. |

### Notas del monorepo

- **`apps/mobile` NO es parte del workspace raíz de npm** (a diferencia de `apps/web` y `packages/core`). El tooling de Expo (`@expo/cli`, `expo-router`) asume una instalación de `node_modules` autocontenida; si se hoistea junto al resto del monorepo, `expo export`/`expo start` rompen resolviendo módulos internos. `apps/mobile` se instala de forma independiente y consume `@sanken/core` mediante `file:../../packages/core` (symlink, sin paso de build).
- `packages/core` tampoco se instala solo desde el workspace: sus dependencias (`pusher-js`, `laravel-echo`) se instalan con `npm install --prefix packages/core` (la CI de mobile ya lo hace).

## Tecnologías

| Capa | Stack |
|---|---|
| API | Laravel 12, PHP 8.2+ (la CI usa 8.4), Sanctum (auth por token + 2FA), Reverb (WebSockets), MySQL 8.4, Redis 7, Cloudinary (multimedia), Firebase (login social), Web Push + Expo Push |
| Documentación de la API | [Scramble](https://scramble.dedoc.co) (OpenAPI 3.1) + Swagger UI |
| Web | React, Vite, TypeScript, TailwindCSS, Shadcn UI, React Query, Zustand, React Hook Form + Zod, Recharts, Framer Motion, Vitest, Playwright |
| Mobile | React Native, Expo, Expo Router, TypeScript, Zustand, Reanimated, Jest |
| Compartido | `@sanken/core` (TypeScript) |

## Requisitos

- **WSL2 con Ubuntu 24.04** para la API (el desarrollo de este proyecto se hace en WSL2 para evitar los problemas de permisos/atributos que OneDrive introduce sobre `vendor/`).
- **PHP 8.2 o superior** + Composer (en la máquina de desarrollo, vía el PPA `ondrej/php`).
- **Node.js 22**.
- **MySQL 8 y Redis 7**: en el entorno real de esta máquina corren **nativos dentro de WSL** (systemd), sin Docker. El `docker-compose.yml` del repo sirve para levantarlos en cualquier otra máquina con Docker Desktop.

> Cómo está montado el entorno real (Windows + WSL, tarea programada de arranque, sincronización con `rsync`, túneles) y cómo generar el APK: [`docs/07-entorno-dev-y-apk.md`](docs/07-entorno-dev-y-apk.md).

## Instalar dependencias

```bash
npm install                      # raíz del monorepo: apps/web + packages/core
npm install --prefix packages/core
cd apps/mobile && npm install    # apps/mobile es un proyecto aislado
cd apps/api && composer install
```

## Arrancar el entorno

```bash
# 1. Infraestructura (solo si no tienes MySQL y Redis nativos)
docker compose up -d

# 2. Backend
cd apps/api
cp .env.example .env              # si no existe ya
php artisan key:generate
php artisan migrate
php artisan db:seed               # países/ciudades/ejercicios base
php artisan serve                 # http://localhost:8000
php artisan queue:work            # OBLIGATORIO: sin esto, completar el onboarding
                                  # nunca genera la rutina (queda encolada en Redis
                                  # y nadie la procesa — ver docs/01-arquitectura.md §6)
php artisan reverb:start          # OBLIGATORIO para el leaderboard en vivo de Retos
                                  # y el chat en vivo — sin esto los cambios se guardan
                                  # pero nunca llegan por websocket a quien tenga la
                                  # pantalla abierta.
php artisan challenges:generate   # crea los retos de la semana/mes actual si no
                                  # existen todavía (igual que rankings:recalculate,
                                  # no corre solo: no hay cron en este entorno de dev)

# 3. Frontend web
cd apps/web
cp .env.example .env              # VITE_API_URL, Reverb, VAPID y Firebase
npm run dev                       # http://localhost:5173

# 4. Mobile
cd apps/mobile
cp .env.example .env              # EXPO_PUBLIC_API_URL, Reverb, Firebase y Google
npm run start                     # Expo Dev Tools / Metro
```

Desde la raíz del monorepo: `npm run dev:web` y `npm run dev:mobile` (este último solo invoca `npm --prefix apps/mobile run start`, no depende del workspace).

**Arranque automático (solo Windows + WSL):** `scripts/start-sanken.ps1` levanta todo el entorno (WSL, MySQL, Redis, Laravel, cola, Reverb, túneles, web y Expo) y `scripts/install-autostart.ps1` lo registra como tarea programada; `scripts/stop-sanken.ps1` lo detiene. Los `.ps1` están escritos en **ASCII puro** a propósito (Windows PowerShell 5.1 interpreta mal UTF-8 sin BOM), por eso sus comentarios no llevan tildes.

### Web push y notificaciones móviles

- Web push usa claves VAPID. Para generar un par nuevo:
  `php -r "require 'vendor/autoload.php'; print_r(Minishlink\WebPush\VAPID::createVapidKeys());"`
  y copiar la clave pública/privada a `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` (`apps/api/.env`) y la pública a `VITE_VAPID_PUBLIC_KEY` (`apps/web/.env`).
- El push a móvil (Expo) necesita credenciales FCM V1 propias (`eas credentials`) en Android y una cuenta de Apple Developer en iOS: son pasos manuales fuera de este repo. Sin ellas la app funciona igual, solo que no entrega el push a un dispositivo real.

### Multimedia (Cloudinary)

Avatares, imágenes de la tienda y videos (ejercicios y evidencia de PR) viven en Cloudinary. Comandos desde la raíz: `npm run cloudinary:inventory`, `cloudinary:status`, `cloudinary:migrate`, `cloudinary:verify`, `cloudinary:cleanup`. Detalle y variables de entorno en [`docs/CLOUDINARY.md`](docs/CLOUDINARY.md).

## Documentación de la API (Swagger)

La API está documentada con **OpenAPI 3.1**, generado automáticamente desde el código (rutas, FormRequests, API Resources y los comentarios PHPDoc de los controladores). Con la API en marcha:

| URL | Qué es |
|---|---|
| `http://localhost:8000/docs/api` | **Swagger UI** interactivo |
| `http://localhost:8000/docs/api.json` | Especificación OpenAPI en JSON |

Para probar endpoints protegidos: haz `POST /api/v1/auth/login`, pulsa **Authorize** en Swagger UI y pega el `token` (sin el prefijo `Bearer`).

Comandos útiles (desde `apps/api`):

```bash
php artisan scramble:analyze                                        # diagnóstico de lo que se pudo/no se pudo inferir
php artisan scramble:export --path=storage/app/openapi.json         # exportar el JSON a un archivo
```

- La configuración está en `apps/api/config/scramble.php` y la vista de Swagger UI en `apps/api/resources/views/api-docs/swagger.blade.php`.
- Cada controlador lleva `#[Group('…')]` y PHPDoc para agrupar y describir los endpoints.
- Los comentarios línea por línea del código (ver más abajo) **no se filtran** a la documentación: `App\Http\ApiDocs\StripLineCommentsFromDescriptions` los quita de las descripciones, y hay una prueba (`tests/Feature/ApiDocs/ApiDocumentationTest.php`) que lo verifica.
- Por defecto la UI está disponible en entornos `local`. Si publicas la API (por ejemplo con un túnel ngrok) con `APP_ENV=local`, la documentación queda pública: ajusta `APP_ENV`/el gate antes de exponerla.

Más detalle en [`docs/03-api.md`](docs/03-api.md) (sección 16).

## Pruebas y calidad

| Qué | Comando | Resultado actual |
|---|---|---|
| API (PHPUnit) | `cd apps/api && php artisan test` | 720 pruebas |
| API (estilo) | `cd apps/api && vendor/bin/pint --test` | sin diferencias (584 archivos) |
| Web (unitarias) | `npm run test:unit --workspace=apps/web` | 102 pruebas (Vitest) |
| Web (tipos) | `cd apps/web && npx tsc -b --noEmit` | sin errores |
| Web (lint) | `npm run lint --workspace=apps/web` | oxlint |
| Web (E2E) | `cd apps/web && npm run test:e2e` | Playwright (necesita la API en marcha) |
| Mobile (unitarias) | `cd apps/mobile && npm test` | 203 pruebas (Jest) |
| Mobile (tipos) | `cd apps/mobile && npx tsc --noEmit` | sin errores |
| Core (tipos) | `cd packages/core && npx tsc --noEmit` | sin errores |


## Integración continua

Hay un flujo de GitHub Actions por aplicación en `.github/workflows/`, que se dispara con cambios en la ruta correspondiente:

- **`api.yml`**: MySQL + Redis como servicios, instala Composer, copia `.env.example`, genera la clave, `pint --test`, migra y ejecuta `php artisan test`.
- **`web.yml`**: `npm ci`, lint, `tsc -b --noEmit`, pruebas unitarias y build.
- **`mobile.yml`**: instala `apps/mobile` y `packages/core` por separado, `tsc --noEmit`, Jest y `expo export --platform web` como prueba de humo.

## Convención de comentarios del código

Todo el código fuente está comentado **línea por línea** con un comentario encima de cada línea con código:

```
// Esta línea sirve para <qué hace la línea, con un verbo en infinitivo>.
```

Reglas:

- El comentario va **encima** de cada línea que contiene código. Las líneas que solo abren o cierran un bloque (`{`, `}`, `)`, `],`) y las líneas en blanco no llevan comentario.
- Se usa el estilo de cada lenguaje: `//` (PHP, TypeScript, JavaScript), `/* … */` (CSS), `{{-- … --}}` (Blade), `<!-- … -->` (HTML), `;` (INI) y `#` (`.env.example`, YAML, shell, PowerShell).
- Los archivos **JSON** no admiten comentarios y no se tocaron. Los **`.ps1`** usan ASCII puro (`Esta linea sirve para …`, sin tildes).
- En scripts de shell/PowerShell y en YAML no se comentan las líneas de continuación ni el contenido de bloques de texto (`>-`, here-strings), porque un comentario ahí cambiaría el comportamiento.
- Al **modificar código**, mantén el comentario de la línea que cambias (o escribe uno nuevo con el mismo formato).

## Documentación adicional

| Documento | Contenido |
|---|---|
| [`docs/00-resumen-ejecutivo.md`](docs/00-resumen-ejecutivo.md) | Visión, pilares y fases del producto |
| [`docs/01-arquitectura.md`](docs/01-arquitectura.md) | Arquitectura de software y Clean Architecture |
| [`docs/02-modelo-datos-bd.md`](docs/02-modelo-datos-bd.md) | Modelo de datos y esquema MySQL |
| [`docs/03-api.md`](docs/03-api.md) | API REST, versionado, autenticación y documentación OpenAPI |
| [`docs/04-ux-ui-wireframes.md`](docs/04-ux-ui-wireframes.md) | Design system, wireframes y flujos |
| [`docs/05-casos-uso-historias-usuario.md`](docs/05-casos-uso-historias-usuario.md) | Casos de uso e historias de usuario |
| [`docs/06-roadmap-sprints.md`](docs/06-roadmap-sprints.md) | Roadmap por fases y sprints |
| [`docs/07-entorno-dev-y-apk.md`](docs/07-entorno-dev-y-apk.md) | Entorno de desarrollo real y generación del APK |
| [`docs/08-legal-y-consentimiento.md`](docs/08-legal-y-consentimiento.md) | Documentos legales, versiones y consentimiento |
| [`docs/09-soporte-y-checkin.md`](docs/09-soporte-y-checkin.md) | Soporte al usuario y check-in semanal |
| [`docs/CLOUDINARY.md`](docs/CLOUDINARY.md) | Multimedia en Cloudinary y su migración |

## Estado actual

Implementado de punta a punta (API + web + mobile):

- **Identidad:** registro, login, 2FA, recuperación de contraseña, login social con Google, consentimientos legales versionados y eliminación de cuenta.
- **Onboarding y motor de rutinas:** cuestionario, generación automática de la rutina según objetivo, nivel y frecuencia, y **sobrecarga progresiva** con feedback de cada sesión.
- **Entrenamiento:** sesión con series, temporizador de descanso, bloqueo diario, récords personales, historial, estadísticas y dashboard.
- **Módulo entrenador:** gestión de clientes, rutinas manuales y chat entrenador-cliente en tiempo real.
- **Social y gamificación:** XP, niveles, logros, rankings, retos semanales/mensuales con leaderboard en vivo, calendario y feed de novedades.
- **Nutrición:** objetivos calóricos y de macros, plan de comidas, registro de comidas y escáner de código de barras.
- **Tienda:** catálogo, carrito, checkout, pedidos y seguimiento.
- **Soporte:** solicitudes, conversación con el equipo y check-in semanal.
- **Administración:** usuarios, ejercicios, plantillas de rutina y de retos, productos y pedidos, reportes, solicitudes de PR, noticias, soporte, analítica de uso y auditoría.
- **Transversal:** tema claro/oscuro, tutoriales guiados, notificaciones push (web y Expo), multimedia en Cloudinary y documentación OpenAPI.

Lo que sigue (suscripciones, marketplace de entrenadores, wearables e IA) está en [`docs/06-roadmap-sprints.md`](docs/06-roadmap-sprints.md).
