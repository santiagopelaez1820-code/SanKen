# Cloudinary — multimedia de SanKen

SanKen usa Cloudinary como almacenamiento y CDN para el multimedia que suben usuarios y administradores: avatares, imágenes de la Tienda, videos de ejercicios y videos de evidencia de PR.

## Qué se migra y qué no

| Recurso | Dónde vivía | Dónde vive ahora |
|---|---|---|
| Avatares (`users.avatar_url`) | disco `public` del servidor | Cloudinary `sanken/users/avatars/user_{id}` |
| Imágenes de la Tienda (`products.image`) | disco `public` | `sanken/store/products/product_{id}` |
| Videos de ejercicios (`exercises.video_url`) | disco `public` | `sanken/exercises/videos/exercise_{id}` |
| Videos de PR (`pr_submissions.video_url`) | disco `public` | `sanken/pr-submissions/videos/submission_{id}` |
| `exercises.image_url`, `news_promotions.image_url`, `body_measurements.progress_photo_url`, `user_profiles.avatar_url` | links que pega un admin | solo se migran si contienen una ruta `/storage/...` de este servidor; los links externos quedan igual |

**Lo que no se migra:** las imágenes del repositorio (íconos, splash, logos). El detalle está en `scripts/cloudinary/local-assets-required.json`. Las referencia `app.json` (Expo las necesita en el build) o son branding que se muestra antes de tener sesión o conexión: login, animación de apertura, tarjeta de Inicio. Hoy el repo no tiene ningún archivo multimedia de runtime que convenga sacar del APK.

## Arquitectura

```
apps/api
  app/Infrastructure/Media/
    MediaStorage.php            interfaz: store() / delete()
    CloudinaryMediaStorage.php  implementación Cloudinary (producción)
    LocalPublicMediaStorage.php disco public (dev/tests y respaldo)
    CloudinaryClient.php        envoltorio del SDK oficial cloudinary/cloudinary_php
    MediaSlot.php               carpeta + public_id estable de cada recurso
    MediaColumns.php            columnas de la base con multimedia
    CloudinaryUrl.php           lee public_id/resource_type de un secure_url
    MediaMap.php                registro idempotente de la migración
  app/Console/Commands/CloudinaryMediaCommand.php   php artisan media:cloudinary
packages/core/src/lib/media.ts  variantes de entrega (f_auto, q_auto, ancho)
scripts/cloudinary/inventory.mjs  inventario del repo
```

- **Una sola interfaz.** Los controladores (`AuthController`, `AdminProductController`, `AdminExerciseController`, `PrSubmissionController`) y `DeleteOwnAccountAction` reciben `MediaStorage` y no saben dónde terminan los archivos. `AppServiceProvider` elige la implementación.
- **La columna guarda el `secure_url`.** No hay columnas nuevas: el `public_id` es estable por fila y también se puede leer de la URL, así que reemplazar o borrar siempre encuentra el asset correcto. Las URLs de otra cuenta, o fuera de la carpeta `sanken/`, nunca se borran.
- **Reemplazar no acumula huérfanos.** Una foto nueva sobrescribe el mismo `public_id` (`overwrite` + `invalidate`), y la URL cambia de versión (`/v123/`), así que ningún cliente ve la imagen vieja cacheada.
- **Subida fallida = nada cambia.** Si Cloudinary falla, la petición responde 500 y la fila conserva el archivo anterior.
- **Los clientes no cambian de contrato.** `api.mediaUrl(path, variant)` sigue resolviendo rutas `/storage/...` (dev) y aplica la variante a las URLs de Cloudinary.

## Variables de entorno (solo en el backend)

```dotenv
MEDIA_STORAGE=cloudinary          # por defecto; "local" fuerza el disco public
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=sanken          # raíz de todos los public_id
# CLOUDINARY_MAP_PATH=...         # opcional; por defecto storage/app/private/cloudinary/media-map.json
```

- El `API_SECRET` vive **solo** en el `.env` del servidor. Nunca va en `apps/mobile`, `apps/web`, `packages/core`, `.env.example` ni en git. Ningún endpoint lo devuelve: todas las subidas pasan por la API y la firma ocurre en el backend.
- Los clientes no necesitan ninguna variable: reciben URLs públicas de `res.cloudinary.com`.
- `phpunit.xml` fuerza `MEDIA_STORAGE=local`, así que los tests nunca usan credenciales reales.

## Comandos

Se ejecutan **en el servidor donde está el disco `public` con los archivos**; en desarrollo es la copia de WSL (`~/sanken/api`), no la carpeta de Windows.

```bash
npm run cloudinary:inventory            # inventario del repo (no necesita PHP)

cd apps/api                             # o ~/sanken/api en WSL
php artisan media:cloudinary status     # qué hay: local / Cloudinary / externo / falta archivo
php artisan media:cloudinary migrate --dry-run -v   # qué subiría, sin tocar nada
php artisan media:cloudinary migrate    # sube y actualiza la base
php artisan media:cloudinary verify     # comprueba que cada URL responda
php artisan media:cloudinary cleanup    # simula la limpieza
php artisan media:cloudinary cleanup --force   # borra los locales ya migrados
```

Los `npm run cloudinary:status|migrate|verify|cleanup` de la raíz son atajos de lo mismo y necesitan `php` en el PATH.

### Orden de una migración

1. Configurar las variables de arriba en el `.env` del servidor (puede quedar `MEDIA_STORAGE=local` mientras se migra).
2. `migrate --dry-run -v` → revisar la lista.
3. `migrate` → sube cada archivo y actualiza su fila. **No borra nada.**
4. `verify` → todas las URLs deben responder.
5. Poner `MEDIA_STORAGE=cloudinary` y `php artisan config:clear`: desde ahí, las subidas nuevas van a Cloudinary.
6. Probar en la app: avatar, Tienda, video de un ejercicio y video de PR.
7. `cleanup` y luego `cleanup --force`.

### Idempotencia y reanudación

- `migrate` se puede correr las veces que haga falta. El mapa guarda el SHA-256 de cada archivo: si no cambió, no se vuelve a subir.
- Si la corrida se corta, al reanudar consulta Cloudinary. Si el asset ya existe con el mismo contenido (etag = MD5), lo reutiliza en lugar de subirlo otra vez.
- Cada fila se actualiza solo si sigue apuntando al mismo archivo. Si alguien subió otro mientras corría, no se pisa.
- Los errores quedan en el mapa con `status: failed`; la siguiente corrida los reintenta.

### Cuándo `cleanup` NO borra un archivo

`cleanup` conserva el archivo local si se cumple cualquiera de estas condiciones:
- No pasó por la migración, como los archivos huérfanos de versiones viejas.
- La base todavía lo referencia.
- Su URL de Cloudinary no responde en ese momento.

Sin `--force` solo informa qué borraría.

## Entrega optimizada (`packages/core/src/lib/media.ts`)

| Variante | Uso | Transformación |
|---|---|---|
| `avatarSmall` | header, filas, menú | `c_fill,g_face,w_144,h_144,f_auto,q_auto` |
| `avatarLarge` | perfil, configuración | `c_fill,g_face,w_320,h_320,f_auto,q_auto` |
| `productThumb` | carrito | `c_limit,w_240,f_auto,q_auto` |
| `productCard` | grilla de la Tienda, preview admin | `c_limit,w_600,f_auto,q_auto` |
| `productDetail` | detalle de producto | `c_limit,w_1200,f_auto,q_auto` |
| `video` | demos de ejercicio, videos de PR | `c_limit,w_720,q_auto,vc_h264` + `.mp4` |

- Cloudinary genera cada variante la primera vez y la cachea en su CDN; no se guardan copias.
- `c_limit` nunca agranda la imagen.
- **Videos:** son clips cortos, así que se entregan como MP4 H.264 a 720 px como máximo, que reproduce en Android, iOS y web (un `.mov` de iPhone también sale como `.mp4`). No se usa HLS/DASH porque con clips de segundos solo agregaría complejidad. Si en el futuro hubiera videos largos, conviene una variante `sp_auto` con `.m3u8`.
- **Caché:** la URL es una función pura del valor de la columna y la variante (siempre la misma cadena). `expo-image` cachea en disco y el navegador por URL, así que no se re-descarga ni se re-renderiza en vano.

## Fallos de red

| Caso | Móvil | Web |
|---|---|---|
| Avatar no carga | inicial del nombre (`Avatar`) | — |
| Imagen de producto no carga | ícono de bolsa (tarjeta y detalle) | degradado de marca de la tarjeta |
| Video no carga | fallback de marca + "No se pudo cargar el video." | fallback de marca |

## Agregar un tipo de recurso nuevo

1. Agregar un `MediaSlot::...()` con su carpeta y su `public_id` estable.
2. En el controlador, inyectar `MediaStorage` y llamar `store($file, MediaSlot::..., $anterior, 'mensaje')` y `delete($url)`.
3. Si tiene columna propia, agregarla a `MediaColumns` para que la cubra la migración.
4. En los clientes, usar `api.mediaUrl(valor, 'variante')`, agregando una variante en `media.ts` si ninguna sirve.

## Reemplazar o borrar un recurso a mano

- **Reemplazar:** volver a subirlo desde la app o el admin. Se sobrescribe el mismo `public_id` y la URL cambia de versión.
- **Borrar:** usar la acción de borrar de la app o el admin, que llama a `MediaStorage::delete()` y además invalida el CDN. Borrarlo solo desde la consola de Cloudinary deja la fila apuntando a una URL rota; la app muestra el fallback, pero la fila conviene limpiarla.

## Recuperación si algo sale mal

- `migrate` nunca borra archivos locales, así que hasta correr `cleanup --force` siempre se puede volver atrás.
- **Para volver a servir desde el disco local:** poner `MEDIA_STORAGE=local` y restaurar las columnas con el mapa (`localPath` de cada entrada → `/storage/{localPath}`).
- El mapa (`storage/app/private/cloudinary/media-map.json`) guarda, por fila, la ruta local, el hash, el `public_id` y el `secure_url`. Respáldalo antes de `cleanup --force`.
- Los tests (`tests/Feature/Media`) cubren la subida, el reemplazo, el borrado, los fallos de Cloudinary, la idempotencia, la reanudación, la verificación y la limpieza, con un cliente falso y sin red.
