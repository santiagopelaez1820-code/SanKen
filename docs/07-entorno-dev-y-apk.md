# Entorno de desarrollo y generación de APK

Este documento existe para no repetir errores ya resueltos entre sesiones —
en particular, **cómo generar el APK correctamente**. Antes de tocar nada de
esto, leer este archivo entero.

## 1. Arquitectura real del entorno (verificada, no asumida)

- **Windows + WSL2 (distro `Ubuntu`)**, modo de red `mirrored` (ver `.wslconfig`).
- **MySQL y Redis** corren **nativos dentro de WSL** vía `systemd` (`enabled`,
  arrancan solos al bootear WSL). **No hay Docker involucrado**, aunque
  `docker-compose.yml` exista en el repo — es un artefacto no usado en esta
  máquina.
- **Laravel (`apps/api`)** corre dentro de WSL, en `~/sanken/api` — una
  **copia de trabajo separada** del repo real (`C:\...\SanKen-main\apps\api`
  en Windows/OneDrive). Se sincroniza con `rsync` en cada arranque, nunca al
  revés.
- **Web (`apps/web`) y Mobile (`apps/mobile`)** corren **nativos en
  Windows** (Node de Windows), directo desde la carpeta de OneDrive — NO
  dentro de WSL.
- Todo esto lo orquesta `scripts/start-sanken.ps1` (+ `start-sanken-wsl.sh`),
  registrado como tarea de Windows Task Scheduler (`SanKen AutoStart`,
  corre ~60s después de iniciar sesión, con privilegios elevados). Ver esos
  scripts para el detalle de cada paso — están comentados a propósito.

## 2. Gotchas ya resueltos (no reintroducirlos)

- **`public/storage` es un symlink que OneDrive nunca sincroniza.** Cualquier
  `rsync` de `apps/api` con `--delete` lo borra si no se excluye
  explícitamente (`--exclude "public/storage"`, ya está en
  `start-sanken-wsl.sh`). Si alguna vez corrés un rsync manual de
  `apps/api` para pruebas rápidas, **agregá ese exclude vos también**, o
  corré `php artisan storage:link` después. Sin esto: todas las fotos
  (perfil, productos) devuelven 404 aunque el resto de la app funcione bien.
- **NAT hairpin**: esta PC no puede conectarse a su propia IP de LAN
  (`192.168.1.8`) — solo a `localhost`/`127.0.0.1` de WSL, o a IPs de otros
  dispositivos reales. Por eso `apps/web/src/lib/api.ts` y
  `apps/mobile/src/lib/api.ts` (rama web) derivan la URL de la API del host
  de la página en vez de una IP fija — nunca volver a hardcodear
  `VITE_API_URL`/`EXPO_PUBLIC_API_URL` a la IP de LAN para uso local.
- **Cleartext HTTP en Android**: sin `usesCleartextTraffic: true` en
  `app.json` (`expo.android`), Android bloquea CUALQUIER request `http://`
  en builds de producción — la app falla en silencio (login, todo). Ya está
  seteado, no sacarlo mientras se use un backend `http://`.
- **Procesos en WSL necesitan `setsid`**: `nohup cmd & disown` solo (sin
  `setsid`) NO sobrevive a que termine la invocación de `wsl.exe` que lo
  lanzó. Usar siempre el helper `daemonize()` de `start-sanken-wsl.sh`.

## 3. Cómo generar el APK (leer ANTES de correr `eas build`)

### Perfil a usar: `preview`, no `development`

- **`preview`** = APK standalone real. Se instala y se abre directo, sin
  login ni código de ningún tipo. **Este es el que se comparte con
  compañeros/testers.**
- **`development`** = APK con el Dev Client de Expo — al abrirla pide
  conectarse a un servidor Metro (QR / código), no es standalone. Solo sirve
  para desarrollo activo con hot-reload, conectado a la PC. **No es el que
  se comparte con nadie que no esté literalmente sentado en tu red con
  Metro corriendo.**

Si alguna vez la app pide un "código" al abrirla y no debería, es que se
generó con el perfil equivocado (`development` en vez de `preview`).

### La API tiene que ser alcanzable desde CUALQUIER red

El APK `preview` es un bundle standalone: la URL de la API queda **grabada
para siempre** en ese build (no se puede cambiar después sin recompilar). Si
un compañero va a usar la app desde una red distinta a la tuya, esa URL
**no puede ser tu IP de LAN** (`192.168.x.x`) — nadie fuera de tu red puede
llegar a una IP privada.

**Solución ya montada**: hay un túnel de **ngrok con dominio reservado**
(cuenta `santiago.pelaez1820@gmail.com`, plan Free), que es **estable** (no
cambia entre reinicios, a diferencia de un quick tunnel de Cloudflare):

```
https://wielder-freeware-starship.ngrok-free.dev  ->  localhost:8000 (Laravel)
```

Este túnel se levanta solo, como parte de `start-sanken-wsl.sh` (paso "6a").
Para confirmarlo antes de un build:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://wielder-freeware-starship.ngrok-free.dev/api/v1/ping
# tiene que dar 200
```

### Variables de entorno EAS (perfil `preview`)

Viven en el proyecto de EAS (`kennethsankens-team/kennethsanken`), NO en
`apps/mobile/.env` — un build en la nube nunca ve el `.env` local (está
gitignored, y aunque no lo estuviera, EAS no lo sube automáticamente).
Verificar/setear así:

```bash
cd apps/mobile
npx eas-cli env:list preview

# Si EXPO_PUBLIC_API_URL no es la URL de ngrok de arriba:
npx eas-cli env:set preview --name EXPO_PUBLIC_API_URL \
  --value "https://wielder-freeware-starship.ngrok-free.dev" \
  --visibility plaintext --non-interactive
```

Confirmar que quedó bien ANTES de lanzar el build — un build ya lanzado con
la variable vieja hay que cancelarlo (`eas-cli build:cancel <id>`) y
relanzar, no sirve arreglarlo después.

### Comando del build

```bash
cd apps/mobile
npx eas-cli build --platform android --profile preview --non-interactive --no-wait
```

Guardar el build ID que devuelve. Para esperarlo sin bloquear la sesión:

```bash
# poll cada 20-30s hasta status=finished/errored/canceled
npx eas-cli build:view <build-id>
```

Tarda entre 10 y 20 minutos. El resultado trae `Application Archive URL` —
esa es la URL que se comparte.

### Checklist antes de lanzar un build para compartir

1. `npx eas-cli env:list preview` → `EXPO_PUBLIC_API_URL` es la URL de ngrok
   (o la URL pública vigente), no una IP de LAN ni `localhost`.
2. El túnel de ngrok responde 200 (ver arriba).
3. `app.json` → `expo.android.usesCleartextTraffic` sigue en `true` (si el
   backend algún día pasa a ser 100% HTTPS propio, esto se puede sacar).
4. Backend, tests, tsc, lint todos verdes (ver sección de verificación de
   `start-sanken.ps1` / correr la suite de tests).
5. Perfil = `preview`, nunca `development`, para un build que se comparte.

## 4. Comandos de referencia rápida

```powershell
# Levantar todo (o verificar que ya está arriba)
C:\Users\SatanKen\OneDrive\Desktop\SanKen-main\scripts\start-sanken.ps1 -WaitSeconds 0

# Parar todo (menos MySQL/Redis)
C:\Users\SatanKen\OneDrive\Desktop\SanKen-main\scripts\stop-sanken.ps1

# Reinstalar el arranque automático (firewall + red + tarea programada) — requiere administrador
C:\Users\SatanKen\OneDrive\Desktop\SanKen-main\scripts\install-autostart.ps1
```

Logs: `%LOCALAPPDATA%\SanKen\logs\latest.log` (Windows) y `~/sanken/logs/`
(dentro de WSL: `laravel.log`, `queue.log`, `reverb.log`, `ngrok-api.log`,
`cloudflared-web.log`).
