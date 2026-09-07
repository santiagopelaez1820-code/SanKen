#!/usr/bin/env bash
# SanKen AutoStart — parte WSL (Ubuntu).
#
# Se ejecuta desde Windows vía:
#   wsl.exe -d Ubuntu -e bash -lc "bash '/mnt/c/.../scripts/start-sanken-wsl.sh'"
#
# Es idempotente: cada paso primero verifica si el servicio ya está arriba
# antes de intentar iniciarlo. No usa `set -e` a propósito — si un paso falla
# (por ejemplo el túnel), el resto tiene que seguir intentando lo suyo.
set -uo pipefail

REPO_API_WIN="/mnt/c/Users/SatanKen/OneDrive/Desktop/SanKen-main/apps/api"
API_DIR="$HOME/sanken/api"
LOG_DIR="$HOME/sanken/logs"
AUTOSTART_LOG="$LOG_DIR/autostart.log"
CLOUDFLARED="$HOME/.local/bin/cloudflared"
NGROK="$HOME/.local/bin/ngrok"
NGROK_API_DOMAIN="wielder-freeware-starship.ngrok-free.dev"

mkdir -p "$LOG_DIR"

log() {
  echo "[$(date '+%H:%M:%S')] $*" | tee -a "$AUTOSTART_LOG"
}

# IMPORTANTE: `nohup cmd & disown` sin más no alcanza para que un proceso
# sobreviva a este script — este script corre dentro de una invocación de
# `wsl.exe -e bash -lc "..."`, y cuando ESA invocación termina, WSL puede
# tirar abajo la sesión/pty asociada y con ella cualquier proceso que siga
# atado a ella (verificado empíricamente: sin `setsid` y sin redirigir stdin,
# `php artisan serve` moría a los pocos segundos de terminar este script).
# `setsid` lo desengancha en su propia sesión, inmune a eso.
daemonize() {
  local logfile="$1"
  shift
  setsid nohup "$@" </dev/null >"$logfile" 2>&1 &
  disown
}

log "===================================================="
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
if [ -d "$REPO_API_WIN" ]; then
  log "Sincronizando código apps/api (Windows -> WSL)..."
  if rsync -a --delete \
      --exclude "vendor/" --exclude "node_modules/" --exclude "storage/" \
      --exclude "bootstrap/cache/" --exclude ".env" --exclude "database/database.sqlite" \
      --exclude "public/storage" \
      "$REPO_API_WIN/" "$API_DIR/" >>"$AUTOSTART_LOG" 2>&1; then
    log "Código sincronizado OK"
  else
    log "AVISO: falló la sincronización (¿OneDrive/WSL no montado?) — sigo con la copia existente en $API_DIR"
  fi
else
  log "AVISO: no encuentro $REPO_API_WIN — sigo con la copia existente en $API_DIR"
fi

cd "$API_DIR" || { log "ERROR FATAL: no existe $API_DIR — no se puede continuar"; exit 1; }

# --- 1b. Symlink de storage (sirve fotos/avatares/imagenes de producto
# subidas). OneDrive no sincroniza symlinks de Unix, asi que si esta copia
# de WSL se recreo desde cero en Windows, este symlink nunca existe y
# CUALQUIER foto subida devuelve 404 aunque la app funcione bien en todo lo
# demas — se detecto exactamente asi, con las fotos de perfil/tienda rotas.
if [ ! -L "public/storage" ]; then
  log "public/storage: no existe, creando (php artisan storage:link)..."
  if php artisan storage:link >>"$AUTOSTART_LOG" 2>&1; then
    log "public/storage: OK (creado)"
  else
    log "ERROR: no se pudo crear public/storage — revisar $AUTOSTART_LOG"
  fi
else
  log "public/storage: OK (ya existía)"
fi

# --- 2. MySQL y Redis: en esta máquina corren nativos vía systemd dentro de
# WSL (NO Docker) — booteando WSL, systemd ya los arranca solo porque están
# `enabled`. Esto solo verifica y, si hiciera falta, intenta un start. ---
check_service() {
  local name="$1" unit="$2"
  if systemctl is-active --quiet "$unit" 2>/dev/null; then
    log "$name: OK (ya estaba activo)"
  else
    log "$name: inactivo, intentando iniciar..."
    if sudo -n systemctl start "$unit" >>"$AUTOSTART_LOG" 2>&1; then
      sleep 1
      if systemctl is-active --quiet "$unit" 2>/dev/null; then
        log "$name: OK (iniciado ahora)"
      else
        log "ERROR: $name no pudo iniciarse"
      fi
    else
      log "ERROR: $name inactivo y no se pudo iniciar sin contraseña de sudo — iniciálo manualmente con: sudo systemctl start $unit"
    fi
  fi
}
check_service "MySQL" mysql
check_service "Redis" redis-server

# --- 3. Laravel API ---
if curl -fs -o /dev/null --max-time 2 http://127.0.0.1:8000/api/v1/ping 2>/dev/null; then
  log "Laravel API: OK (ya estaba respondiendo en :8000)"
else
  log "Laravel API: iniciando (php artisan serve --host=0.0.0.0 --port=8000)..."
  daemonize "$LOG_DIR/laravel.log" php artisan serve --host=0.0.0.0 --port=8000
  ok=0
  for _ in $(seq 1 20); do
    if curl -fs -o /dev/null --max-time 2 http://127.0.0.1:8000/api/v1/ping 2>/dev/null; then ok=1; break; fi
    sleep 1
  done
  if [ "$ok" = "1" ]; then
    log "Laravel API: OK (recién iniciado)"
  else
    log "ERROR: Laravel API no respondió a tiempo — revisar $LOG_DIR/laravel.log"
  fi
fi

# --- 4. Queue worker (mismo comando que composer.json -> scripts.dev) ---
if pgrep -f "artisan queue:listen" >/dev/null 2>&1; then
  log "Queue worker: OK (ya estaba corriendo)"
else
  log "Queue worker: iniciando (queue:listen)..."
  daemonize "$LOG_DIR/queue.log" php artisan queue:listen --tries=1 --timeout=0
  sleep 2
  if pgrep -f "artisan queue:listen" >/dev/null 2>&1; then
    log "Queue worker: OK (recién iniciado)"
  else
    log "ERROR: Queue worker no arrancó — revisar $LOG_DIR/queue.log"
  fi
fi

# --- 5. Reverb (websockets — chat/retos en vivo). Opcional: si falla, no
# bloquea nada del resto de la app, que funciona igual sin tiempo real. ---
if pgrep -f "artisan reverb:start" >/dev/null 2>&1; then
  log "Reverb: OK (ya estaba corriendo)"
else
  log "Reverb: iniciando (opcional, websockets)..."
  daemonize "$LOG_DIR/reverb.log" php artisan reverb:start
  sleep 2
  if pgrep -f "artisan reverb:start" >/dev/null 2>&1; then
    log "Reverb: OK (recién iniciado)"
  else
    log "AVISO: Reverb no arrancó (no crítico, chat en vivo no andará) — revisar $LOG_DIR/reverb.log"
  fi
fi

# --- 6a. Tunel estable de la API (ngrok, dominio reservado) — a diferencia
# de los quick tunnels de Cloudflare, esta URL NO cambia entre reinicios, asi
# que es la que se hornea en el APK (EAS env "preview" -> EXPO_PUBLIC_API_URL)
# para que funcione desde cualquier red, no solo la LAN de esta PC.
if [ -x "$NGROK" ]; then
  if pgrep -f "ngrok http .*$NGROK_API_DOMAIN" >/dev/null 2>&1; then
    echo "https://$NGROK_API_DOMAIN" >"$LOG_DIR/tunnel-api-url.txt"
    log "Tunel API (ngrok): OK (ya estaba corriendo) -> https://$NGROK_API_DOMAIN"
  else
    log "Tunel API (ngrok): iniciando -> https://$NGROK_API_DOMAIN ..."
    : >"$LOG_DIR/ngrok-api.log"
    daemonize "$LOG_DIR/ngrok-api.log" "$NGROK" http 8000 --url "https://$NGROK_API_DOMAIN" --log=stdout --log-level=info
    ok=0
    for _ in $(seq 1 20); do
      if grep -q "started tunnel" "$LOG_DIR/ngrok-api.log" 2>/dev/null; then ok=1; break; fi
      sleep 1
    done
    if [ "$ok" = "1" ]; then
      echo "https://$NGROK_API_DOMAIN" >"$LOG_DIR/tunnel-api-url.txt"
      log "Tunel API (ngrok): OK -> https://$NGROK_API_DOMAIN"
    else
      rm -f "$LOG_DIR/tunnel-api-url.txt"
      log "ERROR: tunel API (ngrok) no arranco a tiempo — revisar $LOG_DIR/ngrok-api.log"
    fi
  fi
else
  log "AVISO: ngrok no encontrado en $NGROK — omito el tunel estable de la API"
fi

# --- 6b. Tunel de Cloudflare para la Web (quick tunnel, sin cuenta -> URL
# aleatoria cada vez) — para demos puntuales de la web completa, ver el
# informe de start-sanken.ps1 sobre la limitacion de VITE_API_URL. ---
start_tunnel() {
  local name="$1" port="$2" logfile="$3" urlfile="$4"
  if pgrep -f "cloudflared tunnel --url http://localhost:$port" >/dev/null 2>&1; then
    log "Túnel $name: OK (ya estaba corriendo) -> $(cat "$urlfile" 2>/dev/null || echo '?')"
    return
  fi
  log "Túnel $name: iniciando (cloudflared -> localhost:$port)..."
  : >"$logfile"
  daemonize "$logfile" "$CLOUDFLARED" tunnel --url "http://localhost:$port"
  local url=""
  for _ in $(seq 1 20); do
    url=$(grep -oE 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' "$logfile" 2>/dev/null | head -1)
    [ -n "$url" ] && break
    sleep 1
  done
  if [ -n "$url" ]; then
    echo "$url" >"$urlfile"
    log "Túnel $name: OK -> $url"
  else
    rm -f "$urlfile"
    log "ERROR: túnel $name no generó URL a tiempo — revisar $logfile"
  fi
}

if [ -x "$CLOUDFLARED" ]; then
  start_tunnel "Web" 5173 "$LOG_DIR/cloudflared-web.log" "$LOG_DIR/tunnel-web-url.txt"
else
  log "AVISO: cloudflared no encontrado en $CLOUDFLARED — omito el túnel de la web"
fi

log "SanKen AutoStart (WSL) terminado"
