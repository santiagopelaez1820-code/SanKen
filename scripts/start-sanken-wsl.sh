# Esta línea sirve para indicar que el script se ejecuta con bash.
#!/usr/bin/env bash
# SanKen AutoStart — parte WSL (Ubuntu).
#
# Se ejecuta desde Windows vía:
#   wsl.exe -d Ubuntu -e bash -lc "bash '/mnt/c/.../scripts/start-sanken-wsl.sh'"
#
# Es idempotente: cada paso primero verifica si el servicio ya está arriba
# antes de intentar iniciarlo. No usa `set -e` a propósito — si un paso falla
# (por ejemplo el túnel), el resto tiene que seguir intentando lo suyo.
# Esta línea sirve para fallar ante variables sin definir y errores en tuberías, sin abortar por cada error.
set -uo pipefail

# Esta línea sirve para definir la ruta de apps/api en Windows vista desde WSL.
REPO_API_WIN="/mnt/c/Users/SatanKen/OneDrive/Desktop/AplicacionesparaGithub/SanKen/apps/api"
# Esta línea sirve para definir la carpeta de la API dentro de WSL.
API_DIR="$HOME/sanken/api"
# Esta línea sirve para definir la carpeta de logs.
LOG_DIR="$HOME/sanken/logs"
# Esta línea sirve para definir el archivo de log del arranque.
AUTOSTART_LOG="$LOG_DIR/autostart.log"
# Esta línea sirve para definir la ruta del binario de cloudflared.
CLOUDFLARED="$HOME/.local/bin/cloudflared"
# Esta línea sirve para definir la ruta del binario de ngrok.
NGROK="$HOME/.local/bin/ngrok"
# Esta línea sirve para definir el dominio reservado de ngrok para la API.
NGROK_API_DOMAIN="wielder-freeware-starship.ngrok-free.dev"

# Esta línea sirve para crear la carpeta de logs si no existe.
mkdir -p "$LOG_DIR"

# Esta línea sirve para declarar la función que escribe un mensaje con hora.
log() {
  # Esta línea sirve para imprimir el mensaje y agregarlo al log.
  echo "[$(date '+%H:%M:%S')] $*" | tee -a "$AUTOSTART_LOG"
}

# IMPORTANTE: `nohup cmd & disown` sin más no alcanza para que un proceso
# sobreviva a este script — este script corre dentro de una invocación de
# `wsl.exe -e bash -lc "..."`, y cuando ESA invocación termina, WSL puede
# tirar abajo la sesión/pty asociada y con ella cualquier proceso que siga
# atado a ella (verificado empíricamente: sin `setsid` y sin redirigir stdin,
# `php artisan serve` moría a los pocos segundos de terminar este script).
# `setsid` lo desengancha en su propia sesión, inmune a eso.
# Esta línea sirve para declarar la función que lanza un proceso desligado de la sesión.
daemonize() {
  # Esta línea sirve para recibir la ruta del archivo de log.
  local logfile="$1"
  # Esta línea sirve para quitar el primer argumento para dejar solo el comando.
  shift
  # Esta línea sirve para lanzar el comando en una sesión nueva, sin stdin y con la salida al log.
  setsid nohup "$@" </dev/null >"$logfile" 2>&1 &
  # Esta línea sirve para desvincular el proceso del shell.
  disown
}

# Esta línea sirve para registrar una línea separadora.
log "===================================================="
# Esta línea sirve para registrar el inicio del arranque.
log "SanKen AutoStart (WSL) iniciado"

# --- 1. Sincronizar código apps/api: Windows (fuente real, git) -> WSL (donde corre PHP) ---
# Nunca toca vendor/, node_modules/, storage/, bootstrap/cache/, .env ni
# public/storage — así no se pisa nada de la config local de esta copia, no
# hace falta reinstalar dependencias en cada arranque, y el symlink de
# storage (ver 1b) no se borra en cada sync solo porque OneDrive nunca lo
# tuvo del lado Windows (--delete lo interpretaba como "hay que borrarlo").
# Esto pasó de verdad: el symlink se recreaba bien corriendo este script
# completo, pero un rsync manual suelto (sin este exclude) durante una
# sesión de arreglos lo volvía a romper sin que nada lo recreara después.
# Esta línea sirve para revisar si existe la carpeta de apps/api en Windows.
if [ -d "$REPO_API_WIN" ]; then
  # Esta línea sirve para registrar que se sincroniza el código.
  log "Sincronizando código apps/api (Windows -> WSL)..."
  # Esta línea sirve para sincronizar con rsync, excluyendo lo que no debe pisarse.
  if rsync -a --delete \
      --exclude "vendor/" --exclude "node_modules/" --exclude "storage/" \
      --exclude "bootstrap/cache/" --exclude ".env" --exclude "database/database.sqlite" \
      --exclude "public/storage" \
      "$REPO_API_WIN/" "$API_DIR/" >>"$AUTOSTART_LOG" 2>&1; then
    # Esta línea sirve para registrar que el código se sincronizó bien.
    log "Código sincronizado OK"
  else
    # Esta línea sirve para registrar el aviso de que falló la sincronización.
    log "AVISO: falló la sincronización (¿OneDrive/WSL no montado?) — sigo con la copia existente en $API_DIR"
  fi
else
  # Esta línea sirve para registrar el aviso de que no se encontró la carpeta de Windows.
  log "AVISO: no encuentro $REPO_API_WIN — sigo con la copia existente en $API_DIR"
fi

# Esta línea sirve para entrar a la carpeta de la API o terminar con error fatal.
cd "$API_DIR" || { log "ERROR FATAL: no existe $API_DIR — no se puede continuar"; exit 1; }

# --- 1b. Symlink de storage (sirve fotos/avatares/imagenes de producto
# subidas). OneDrive no sincroniza symlinks de Unix, asi que si esta copia
# de WSL se recreo desde cero en Windows, este symlink nunca existe y
# CUALQUIER foto subida devuelve 404 aunque la app funcione bien en todo lo
# demas — se detecto exactamente asi, con las fotos de perfil/tienda rotas.
# Esta línea sirve para revisar si falta el enlace simbólico public/storage.
if [ ! -L "public/storage" ]; then
  # Esta línea sirve para registrar que se va a crear el enlace.
  log "public/storage: no existe, creando (php artisan storage:link)..."
  # Esta línea sirve para crear el enlace con storage:link.
  if php artisan storage:link >>"$AUTOSTART_LOG" 2>&1; then
    # Esta línea sirve para registrar que el enlace se creó.
    log "public/storage: OK (creado)"
  else
    # Esta línea sirve para registrar el error si no se pudo crear.
    log "ERROR: no se pudo crear public/storage — revisar $AUTOSTART_LOG"
  fi
else
  # Esta línea sirve para registrar que el enlace ya existía.
  log "public/storage: OK (ya existía)"
fi

# --- 2. MySQL y Redis: en esta máquina corren nativos vía systemd dentro de
# WSL (NO Docker) — booteando WSL, systemd ya los arranca solo porque están
# `enabled`. Esto solo verifica y, si hiciera falta, intenta un start. ---
# Esta línea sirve para declarar la función que verifica un servicio del sistema.
check_service() {
  # Esta línea sirve para recibir el nombre visible y la unidad de systemd.
  local name="$1" unit="$2"
  # Esta línea sirve para revisar si el servicio ya está activo.
  if systemctl is-active --quiet "$unit" 2>/dev/null; then
    # Esta línea sirve para registrar que ya estaba activo.
    log "$name: OK (ya estaba activo)"
  else
    # Esta línea sirve para registrar que está inactivo y se intenta iniciar.
    log "$name: inactivo, intentando iniciar..."
    # Esta línea sirve para intentar iniciar el servicio sin pedir contraseña.
    if sudo -n systemctl start "$unit" >>"$AUTOSTART_LOG" 2>&1; then
      # Esta línea sirve para esperar un segundo.
      sleep 1
      # Esta línea sirve para revisar si el servicio quedó activo.
      if systemctl is-active --quiet "$unit" 2>/dev/null; then
        # Esta línea sirve para registrar que se inició ahora.
        log "$name: OK (iniciado ahora)"
      else
        # Esta línea sirve para registrar el error de que no pudo iniciarse.
        log "ERROR: $name no pudo iniciarse"
      fi
    else
      # Esta línea sirve para registrar que hace falta iniciarlo a mano con sudo.
      log "ERROR: $name inactivo y no se pudo iniciar sin contraseña de sudo — iniciálo manualmente con: sudo systemctl start $unit"
    fi
  fi
}
# Esta línea sirve para verificar MySQL.
check_service "MySQL" mysql
# Esta línea sirve para verificar Redis.
check_service "Redis" redis-server

# --- 3. Laravel API ---
# Esta línea sirve para revisar si la API ya responde en el puerto 8000.
if curl -fs -o /dev/null --max-time 2 http://127.0.0.1:8000/api/v1/ping 2>/dev/null; then
  # Esta línea sirve para registrar que la API ya estaba respondiendo.
  log "Laravel API: OK (ya estaba respondiendo en :8000)"
else
  # Esta línea sirve para registrar que se inicia la API.
  log "Laravel API: iniciando (php artisan serve --host=0.0.0.0 --port=8000)..."
  # PHP_INI_SCAN_DIR con ":" adelante = "los conf.d de siempre + esta
  # carpeta": suma apps/api/php/uploads.ini (límites de subida de 2M -> 110M,
  # sin eso los videos de evidencia de PR nunca llegaban a Laravel) sin
  # necesitar sudo para tocar /etc/php. `artisan serve` hereda el entorno
  # en el proceso `php -S` que lanza.
  # Esta línea sirve para lanzar php artisan serve desligado, con los límites de subida ampliados.
  daemonize "$LOG_DIR/laravel.log" env PHP_INI_SCAN_DIR=":$API_DIR/php" php artisan serve --host=0.0.0.0 --port=8000
  # Esta línea sirve para inicializar la bandera de éxito en cero.
  ok=0
  # Esta línea sirve para repetir hasta 20 veces.
  for _ in $(seq 1 20); do
    # Esta línea sirve para marcar éxito y salir del ciclo si la API responde.
    if curl -fs -o /dev/null --max-time 2 http://127.0.0.1:8000/api/v1/ping 2>/dev/null; then ok=1; break; fi
    # Esta línea sirve para esperar un segundo entre intentos.
    sleep 1
  done
  # Esta línea sirve para revisar si la API respondió a tiempo.
  if [ "$ok" = "1" ]; then
    # Esta línea sirve para registrar que la API se inició.
    log "Laravel API: OK (recién iniciado)"
  else
    # Esta línea sirve para registrar el error de que la API no respondió a tiempo.
    log "ERROR: Laravel API no respondió a tiempo — revisar $LOG_DIR/laravel.log"
    # Esta línea sirve para revisar si el log indica que el puerto ya está en uso.
    if tail -n 5 "$LOG_DIR/laravel.log" 2>/dev/null | grep -q "Address already in use"; then
      # En modo mirrored, algo de Windows ya tiene el :8000 — típicamente el
      # viejo "netsh portproxy" (ver el paso 1b de start-sanken.ps1).
      # Esta línea sirve para registrar la causa probable y cómo corregirla.
      log "CAUSA: el puerto 8000 está tomado (¿port proxy viejo de Windows?). Correr scripts/install-autostart.ps1 como administrador."
    fi
  fi
fi

# --- 4. Queue worker (mismo comando que composer.json -> scripts.dev) ---
# Esta línea sirve para revisar si el worker de colas ya está corriendo.
if pgrep -f "artisan queue:listen" >/dev/null 2>&1; then
  # Esta línea sirve para registrar que ya estaba corriendo.
  log "Queue worker: OK (ya estaba corriendo)"
else
  # Esta línea sirve para registrar que se inicia el worker de colas.
  log "Queue worker: iniciando (queue:listen)..."
  # Esta línea sirve para lanzar queue:listen desligado.
  daemonize "$LOG_DIR/queue.log" php artisan queue:listen --tries=1 --timeout=0
  # Esta línea sirve para esperar dos segundos.
  sleep 2
  # Esta línea sirve para revisar si el worker quedó corriendo.
  if pgrep -f "artisan queue:listen" >/dev/null 2>&1; then
    # Esta línea sirve para registrar que se inició.
    log "Queue worker: OK (recién iniciado)"
  else
    # Esta línea sirve para registrar el error de que no arrancó.
    log "ERROR: Queue worker no arrancó — revisar $LOG_DIR/queue.log"
  fi
fi

# --- 5. Reverb (websockets — chat/retos en vivo). Opcional: si falla, no
# bloquea nada del resto de la app, que funciona igual sin tiempo real. ---
# Esta línea sirve para revisar si Reverb ya está corriendo.
if pgrep -f "artisan reverb:start" >/dev/null 2>&1; then
  # Esta línea sirve para registrar que ya estaba corriendo.
  log "Reverb: OK (ya estaba corriendo)"
else
  # Esta línea sirve para registrar que se inicia Reverb.
  log "Reverb: iniciando (opcional, websockets)..."
  # Esta línea sirve para lanzar reverb:start desligado.
  daemonize "$LOG_DIR/reverb.log" php artisan reverb:start
  # Esta línea sirve para esperar dos segundos.
  sleep 2
  # Esta línea sirve para revisar si Reverb quedó corriendo.
  if pgrep -f "artisan reverb:start" >/dev/null 2>&1; then
    # Esta línea sirve para registrar que se inició.
    log "Reverb: OK (recién iniciado)"
  else
    # Esta línea sirve para registrar el aviso de que no arrancó.
    log "AVISO: Reverb no arrancó (no crítico, chat en vivo no andará) — revisar $LOG_DIR/reverb.log"
  fi
fi

# --- 6a. Tunel estable de la API (ngrok, dominio reservado) — a diferencia
# de los quick tunnels de Cloudflare, esta URL NO cambia entre reinicios, asi
# que es la que se hornea en el APK (EAS env "preview" -> EXPO_PUBLIC_API_URL)
# para que funcione desde cualquier red, no solo la LAN de esta PC.
# Esta línea sirve para revisar si el binario de ngrok existe y es ejecutable.
if [ -x "$NGROK" ]; then
  # Esta línea sirve para revisar si el túnel de ngrok ya está corriendo.
  if pgrep -f "ngrok http .*$NGROK_API_DOMAIN" >/dev/null 2>&1; then
    # Esta línea sirve para guardar la URL fija del túnel en un archivo.
    echo "https://$NGROK_API_DOMAIN" >"$LOG_DIR/tunnel-api-url.txt"
    # Esta línea sirve para registrar que el túnel ya estaba corriendo.
    log "Tunel API (ngrok): OK (ya estaba corriendo) -> https://$NGROK_API_DOMAIN"
  else
    # Esta línea sirve para registrar que se inicia el túnel de ngrok.
    log "Tunel API (ngrok): iniciando -> https://$NGROK_API_DOMAIN ..."
    # Esta línea sirve para vaciar el log del túnel.
    : >"$LOG_DIR/ngrok-api.log"
    # Esta línea sirve para lanzar ngrok desligado apuntando al puerto 8000.
    daemonize "$LOG_DIR/ngrok-api.log" "$NGROK" http 8000 --url "https://$NGROK_API_DOMAIN" --log=stdout --log-level=info
    # Esta línea sirve para inicializar la bandera de éxito en cero.
    ok=0
    # Esta línea sirve para repetir hasta 20 veces.
    for _ in $(seq 1 20); do
      # Esta línea sirve para marcar éxito y salir del ciclo si el log indica que el túnel arrancó.
      if grep -q "started tunnel" "$LOG_DIR/ngrok-api.log" 2>/dev/null; then ok=1; break; fi
      # Esta línea sirve para esperar un segundo entre intentos.
      sleep 1
    done
    # Esta línea sirve para revisar si el túnel arrancó.
    if [ "$ok" = "1" ]; then
      # Esta línea sirve para guardar la URL fija del túnel en un archivo.
      echo "https://$NGROK_API_DOMAIN" >"$LOG_DIR/tunnel-api-url.txt"
      # Esta línea sirve para registrar que el túnel arrancó.
      log "Tunel API (ngrok): OK -> https://$NGROK_API_DOMAIN"
    else
      # Esta línea sirve para borrar el archivo de URL si el túnel no arrancó.
      rm -f "$LOG_DIR/tunnel-api-url.txt"
      # Esta línea sirve para registrar el error de que el túnel no arrancó a tiempo.
      log "ERROR: tunel API (ngrok) no arranco a tiempo — revisar $LOG_DIR/ngrok-api.log"
    fi
  fi
else
  # Esta línea sirve para registrar el aviso de que no se encontró ngrok.
  log "AVISO: ngrok no encontrado en $NGROK — omito el tunel estable de la API"
fi

# --- 6b. Tunel de Cloudflare para la Web (quick tunnel, sin cuenta -> URL
# aleatoria cada vez) — para demos puntuales de la web completa, ver el
# informe de start-sanken.ps1 sobre la limitacion de VITE_API_URL. ---
# Esta línea sirve para declarar la función que inicia un túnel de Cloudflare.
start_tunnel() {
  # Esta línea sirve para recibir el nombre, el puerto, el log y el archivo de la URL.
  local name="$1" port="$2" logfile="$3" urlfile="$4"
  # Esta línea sirve para revisar si el túnel ya está corriendo.
  if pgrep -f "cloudflared tunnel --url http://localhost:$port" >/dev/null 2>&1; then
    # Esta línea sirve para registrar que ya estaba corriendo con su URL.
    log "Túnel $name: OK (ya estaba corriendo) -> $(cat "$urlfile" 2>/dev/null || echo '?')"
    # Esta línea sirve para salir de la función.
    return
  fi
  # Esta línea sirve para registrar que se inicia el túnel.
  log "Túnel $name: iniciando (cloudflared -> localhost:$port)..."
  # Esta línea sirve para vaciar el log del túnel.
  : >"$logfile"
  # Esta línea sirve para lanzar cloudflared desligado apuntando al puerto.
  daemonize "$logfile" "$CLOUDFLARED" tunnel --url "http://localhost:$port"
  # Esta línea sirve para inicializar la URL vacía.
  local url=""
  # Esta línea sirve para repetir hasta 20 veces.
  for _ in $(seq 1 20); do
    # Esta línea sirve para extraer la URL pública del log.
    url=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$logfile" 2>/dev/null | head -1)
    # Esta línea sirve para salir del ciclo cuando ya hay URL.
    [ -n "$url" ] && break
    # Esta línea sirve para esperar un segundo entre intentos.
    sleep 1
  done
  # Esta línea sirve para revisar si se obtuvo la URL.
  if [ -n "$url" ]; then
    # Esta línea sirve para guardar la URL en el archivo.
    echo "$url" >"$urlfile"
    # Esta línea sirve para registrar que el túnel está listo con su URL.
    log "Túnel $name: OK -> $url"
  else
    # Esta línea sirve para borrar el archivo de URL si no se obtuvo.
    rm -f "$urlfile"
    # Esta línea sirve para registrar el error de que no generó URL a tiempo.
    log "ERROR: túnel $name no generó URL a tiempo — revisar $logfile"
  fi
}

# Esta línea sirve para revisar si el binario de cloudflared existe y es ejecutable.
if [ -x "$CLOUDFLARED" ]; then
  # Esta línea sirve para iniciar el túnel de la web en el puerto 5173.
  start_tunnel "Web" 5173 "$LOG_DIR/cloudflared-web.log" "$LOG_DIR/tunnel-web-url.txt"
else
  # Esta línea sirve para registrar el aviso de que no se encontró cloudflared.
  log "AVISO: cloudflared no encontrado en $CLOUDFLARED — omito el túnel de la web"
fi

# Esta línea sirve para registrar que el arranque en WSL terminó.
log "SanKen AutoStart (WSL) terminado"
