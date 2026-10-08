#Requires -Version 5.1
<#
.SYNOPSIS
  SanKen AutoStart - levanta todo el entorno de desarrollo (WSL/MySQL/Redis/
  Laravel/Queue/Reverb/tuneles Cloudflare en WSL, Web/Expo en Windows).

.DESCRIPTION
  Pensado para correr solo (Task Scheduler, ver install-autostart.ps1) o a
  mano. Es idempotente: cada servicio se verifica antes de intentar iniciarlo,
  asi que correrlo varias veces seguidas no duplica nada.

  NOTA DE ENCODING: este archivo se guarda a proposito solo con caracteres
  ASCII (sin tildes ni guiones largos) porque Windows PowerShell 5.1 puede
  interpretar mal un .ps1 en UTF-8 sin BOM y romper el parseo. No agregues
  acentos ni comillas especiales aca.

.PARAMETER WaitSeconds
  Segundos a esperar antes de arrancar nada (pensado para el arranque de
  Windows, para darle tiempo a la red/WSL). Default 60. Usar 0 para arrancar
  ya mismo (pruebas manuales).

.EXAMPLE
  .\start-sanken.ps1 -WaitSeconds 0
#>
# Esta linea sirve para abrir los parametros del script.
param(
  # Esta linea sirve para definir los segundos de espera antes de arrancar, 60 por defecto.
  [int]$WaitSeconds = 60
# Esta linea sirve para cerrar los parametros del script.
)

# Esta linea sirve para continuar la ejecucion aunque un comando falle.
$ErrorActionPreference = 'Continue'

# --- Rutas ---
# Esta linea sirve para definir la raiz del repositorio.
$RepoRoot   = "C:\Users\SatanKen\OneDrive\Desktop\AplicacionesparaGithub\SanKen"
# Esta linea sirve para definir la carpeta de la web.
$WebDir     = Join-Path $RepoRoot "apps\web"
# Esta linea sirve para definir la carpeta de la app movil.
$MobileDir  = Join-Path $RepoRoot "apps\mobile"
# Esta linea sirve para definir el nombre de la distro de WSL.
$WslDistro  = "Ubuntu"

# Esta linea sirve para definir la carpeta de estado local.
$StateDir = "$env:LOCALAPPDATA\SanKen"
# Esta linea sirve para definir la carpeta de logs.
$LogDir   = Join-Path $StateDir "logs"
# Esta linea sirve para definir la carpeta de archivos PID.
$PidDir   = Join-Path $StateDir "pids"
# Esta linea sirve para crear las carpetas de logs y PID si no existen.
New-Item -ItemType Directory -Force -Path $LogDir, $PidDir | Out-Null

# Esta linea sirve para obtener la marca de tiempo para el nombre del log.
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
# Esta linea sirve para definir el archivo de log de esta ejecucion.
$LogFile   = Join-Path $LogDir "autostart-$Timestamp.log"
# Esta linea sirve para definir el archivo del ultimo log.
$LatestLog = Join-Path $LogDir "latest.log"

# Esta linea sirve para declarar la funcion que escribe un mensaje con hora.
function Write-Log {
  # Esta linea sirve para recibir el mensaje a escribir.
  param([string]$Message)
  # Esta linea sirve para armar la linea con la hora y el mensaje.
  $line = "[{0}] {1}" -f (Get-Date -Format "HH:mm:ss"), $Message
  # Esta linea sirve para mostrar la linea en pantalla.
  Write-Host $line
  # Esta linea sirve para agregar la linea al log de esta ejecucion.
  Add-Content -Path $LogFile -Value $line
  # Esta linea sirve para agregar la linea al ultimo log.
  Add-Content -Path $LatestLog -Value $line
}

# Esta linea sirve para vaciar el archivo del ultimo log.
Set-Content -Path $LatestLog -Value ""
# Esta linea sirve para escribir una linea separadora.
Write-Log "===================================================="
# Esta linea sirve para registrar el inicio del arranque.
Write-Log "SanKen AutoStart iniciado"

# Esta linea sirve para revisar si hay que esperar antes de arrancar.
if ($WaitSeconds -gt 0) {
  # Esta linea sirve para registrar cuantos segundos se espera.
  Write-Log "Esperando $WaitSeconds segundos (arranque de Windows/red)..."
  # Esta linea sirve para esperar los segundos indicados.
  Start-Sleep -Seconds $WaitSeconds
}

# --- Helpers ---
# Esta linea sirve para declarar la funcion que comprueba si un puerto esta abierto.
function Test-PortOpen {
  # Esta linea sirve para recibir el equipo y el puerto a comprobar.
  param([string]$ComputerName = "127.0.0.1", [int]$Port)
  # Esta linea sirve para intentar la conexion.
  try {
    # Esta linea sirve para probar la conexion al puerto sin mostrar avisos.
    $result = Test-NetConnection -ComputerName $ComputerName -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
    # Esta linea sirve para devolver si la conexion tuvo exito.
    return [bool]$result
  # Esta linea sirve para capturar cualquier error de conexion.
  } catch {
    # Esta linea sirve para devolver falso.
    return $false
  }
}

# Esta linea sirve para declarar la funcion que obtiene la IP de la red local.
function Get-LanIPAddress {
  # La interfaz real es la que tiene default gateway y esta activa - esto
  # descarta adaptadores host-only de VirtualBox, APIPA (169.254.x.x), etc.
  # Esta linea sirve para buscar la configuracion de red con puerta de enlace.
  $cfg = Get-NetIPConfiguration -ErrorAction SilentlyContinue |
    # Esta linea sirve para quedarse con la interfaz activa que tiene puerta de enlace.
    Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up' } |
    # Esta linea sirve para tomar solo la primera.
    Select-Object -First 1
  # Esta linea sirve para revisar si se encontro una configuracion.
  if ($cfg) {
    # Esta linea sirve para devolver la direccion IPv4 de la interfaz.
    return $cfg.IPv4Address.IPAddress
  }
  # Esta linea sirve para devolver nulo si no se encontro ninguna.
  return $null
}

# Esta linea sirve para declarar la funcion que escribe un valor en un archivo .env.
function Set-EnvValue {
  # Esta linea sirve para recibir la ruta, la clave y el valor.
  param([string]$Path, [string]$Key, [string]$Value)
  # Esta linea sirve para revisar si el archivo no existe.
  if (-not (Test-Path $Path)) {
    # Esta linea sirve para registrar el aviso de que no se actualiza la clave.
    Write-Log "AVISO: no existe $Path - no se actualiza $Key"
    # Esta linea sirve para salir de la funcion.
    return
  }
  # Esta linea sirve para leer todo el contenido del archivo.
  $content = Get-Content -Path $Path -Raw
  # Esta linea sirve para armar el patron que busca la clave.
  $pattern = "(?m)^$([regex]::Escape($Key))=.*$"
  # Esta linea sirve para armar la linea nueva con la clave y el valor.
  $newLine = "$Key=$Value"
  # Esta linea sirve para revisar si la clave ya existe.
  if ($content -match $pattern) {
    # Esta linea sirve para revisar si ya tiene el valor correcto.
    if ($Matches[0] -eq $newLine) {
      # Esta linea sirve para salir sin cambios.
      return
    }
    # Esta linea sirve para crear el evaluador que devuelve la linea nueva.
    $evaluator = [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newLine }
    # Esta linea sirve para reemplazar la linea anterior por la nueva.
    $content = [regex]::Replace($content, $pattern, $evaluator)
    # Esta linea sirve para guardar el contenido actualizado.
    Set-Content -Path $Path -Value $content -NoNewline
    # Esta linea sirve para registrar que la clave fue actualizada.
    Write-Log "$Key actualizado en $(Split-Path $Path -Leaf) -> $Value"
  } else {
    # Esta linea sirve para agregar la clave nueva al final del archivo.
    Add-Content -Path $Path -Value "`n$newLine"
    # Esta linea sirve para registrar que la clave fue agregada.
    Write-Log "$Key agregado a $(Split-Path $Path -Leaf) -> $Value"
  }
}

# Esta linea sirve para declarar la funcion que inicia npm en segundo plano.
function Start-BackgroundNpm {
  # Esta linea sirve para recibir el nombre, la carpeta, los argumentos, el log y el archivo PID.
  param([string]$Name, [string]$WorkDir, [string]$Arguments, [string]$LogPath, [string]$PidFile)
  # Esta linea sirve para crear la configuracion del proceso.
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  # Esta linea sirve para usar cmd.exe como programa.
  $psi.FileName = "cmd.exe"
  # Esta linea sirve para pasar el comando npm y redirigir la salida al log.
  $psi.Arguments = "/c npm $Arguments > `"$LogPath`" 2>&1"
  # Esta linea sirve para definir la carpeta de trabajo.
  $psi.WorkingDirectory = $WorkDir
  # Esta linea sirve para ocultar la ventana del proceso.
  $psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
  # Esta linea sirve para evitar crear una ventana.
  $psi.CreateNoWindow = $true
  # Esta linea sirve para usar el shell del sistema para lanzarlo.
  $psi.UseShellExecute = $true
  # Esta linea sirve para iniciar el proceso.
  $proc = [System.Diagnostics.Process]::Start($psi)
  # Esta linea sirve para guardar el PID del proceso en su archivo.
  Set-Content -Path $PidFile -Value $proc.Id
  # Esta linea sirve para registrar que el servicio se inicio.
  Write-Log "$Name iniciado (PID $($proc.Id)) -> log: $LogPath"
}

# Esta linea sirve para declarar la funcion que comprueba si una URL responde.
function Test-HttpOk {
  # Esta linea sirve para recibir la URL y el tiempo maximo de espera.
  param([string]$Url, [int]$TimeoutSec = 3)
  # Esta linea sirve para intentar la peticion.
  try {
    # Esta linea sirve para pedir la URL con un tiempo limite.
    $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec -ErrorAction Stop
    # Esta linea sirve para devolver verdadero si el codigo de estado es menor a 500.
    return $r.StatusCode -lt 500
  # Esta linea sirve para capturar el error de la peticion.
  } catch {
    # Esta linea sirve para revisar si el error trae una respuesta del servidor.
    if ($_.Exception.Response) {
      # Esta linea sirve para devolver verdadero porque el servidor respondio.
      return $true
    }
    # Esta linea sirve para devolver falso si no hubo respuesta.
    return $false
  }
}

# Esta linea sirve para declarar la funcion que convierte un booleano en OK o X.
function Mark {
  # Esta linea sirve para recibir el booleano.
  param([bool]$Ok)
  # Esta linea sirve para devolver OK si es verdadero.
  if ($Ok) { return "OK" }
  # Esta linea sirve para devolver X en caso contrario.
  return "X"
}

# Esta linea sirve para declarar la funcion que espera a que una URL responda.
function Wait-ForHttpOk {
  # Esta linea sirve para recibir la URL y el tiempo maximo de espera.
  param([string]$Url, [int]$MaxWaitSec = 20)
  # Metro (Expo) puede tardar 20-40s en compilar en frio recien arrancado
  # (mas todavia justo despues de un reinicio de Windows, con todo lo demas
  # arrancando a la vez) -- un solo chequeo a los 3 segundos lo daba por
  # caido cuando en realidad solo estaba tardando. Reintenta hasta $MaxWaitSec.
  # Esta linea sirve para calcular el momento limite de la espera.
  $deadline = (Get-Date).AddSeconds($MaxWaitSec)
  # Esta linea sirve para abrir el ciclo de reintentos.
  do {
    # Esta linea sirve para devolver verdadero apenas la URL responda.
    if (Test-HttpOk -Url $Url -TimeoutSec 3) { return $true }
    # Esta linea sirve para esperar dos segundos antes de reintentar.
    Start-Sleep -Seconds 2
  # Esta linea sirve para repetir mientras no se pase del limite.
  } while ((Get-Date) -lt $deadline)
  # Esta linea sirve para devolver falso si se agoto el tiempo.
  return $false
}

# --- 1. WSL: asegurar que la distro este arriba (esto ya dispara systemd ->
# MySQL/Redis nativos - ver diagnostico: NO se usa Docker para esto). ---
# Esta linea sirve para registrar que se verifica WSL.
Write-Log "Verificando WSL ($WslDistro)..."
# Esta linea sirve para listar las distros de WSL.
$wslList = wsl.exe -l -v 2>$null
# Esta linea sirve para revisar si la distro esta corriendo.
$running = ($wslList -join "`n") -match "$WslDistro\s+Running"
# Esta linea sirve para revisar si no estaba corriendo.
if (-not $running) {
  # Esta linea sirve para registrar que se inicia WSL.
  Write-Log "WSL no estaba corriendo, iniciando..."
  # Esta linea sirve para arrancar la distro con un comando minimo.
  wsl.exe -d $WslDistro -e true | Out-Null
  # Esta linea sirve para esperar tres segundos.
  Start-Sleep -Seconds 3
}
# Esta linea sirve para registrar que WSL esta listo.
Write-Log "WSL: OK"

# --- 1b. Acceso LAN -> WSL (antes de arrancar Laravel) ---
# Version anterior: un "netsh portproxy 0.0.0.0:8000 -> 127.0.0.1:8000".
# Con WSL en modo mirrored eso ROMPE la API: netsh portproxy es persistente
# entre reinicios, asi que al prender la PC Windows (svchost/iphlpsvc) ya
# tiene tomado el :8000 y "php artisan serve" falla con "Address already in
# use" (paso el 2026-09-28: Laravel API X y ngrok con 503). Ahora:
#   1) se borra ese portproxy si existe (y ANTES del paso 2, que arranca
#      Laravel), y
#   2) el acceso desde la LAN se habilita con reglas del firewall de
#      Hyper-V para WSL (el mecanismo soportado en modo mirrored: WSL trae
#      DefaultInboundAction=Block), que NO ocupan el puerto.
# Ambas cosas requieren administrador (la tarea programada corre elevada,
# ver install-autostart.ps1). Sin admin solo se avisa.
# Esta linea sirve para definir el identificador del creador de la VM de WSL.
$WslVmCreatorId = '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}'
# Esta linea sirve para comprobar si el script corre como administrador.
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
# Esta linea sirve para buscar un port proxy heredado en el puerto 8000.
$legacyProxy = netsh interface portproxy show v4tov4 | Select-String "\s8000\s"
# Esta linea sirve para revisar si existe el port proxy.
if ($legacyProxy) {
  # Esta linea sirve para revisar si hay permisos de administrador.
  if ($isAdmin) {
    # Esta linea sirve para eliminar el port proxy heredado.
    netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0 2>$null | Out-Null
    # Esta linea sirve para registrar que el port proxy fue eliminado.
    Write-Log "Port proxy 8000 (legado): eliminado -- ocupaba el puerto de Laravel en modo mirrored"
  # Esta linea sirve para tratar el caso sin permisos de administrador.
  } else {
    # Esta linea sirve para registrar el error y como corregirlo.
    Write-Log "ERROR: existe un port proxy en :8000 que impide arrancar Laravel. Correr scripts\install-autostart.ps1 como administrador (lo elimina)."
  }
}
# Esta linea sirve para revisar si hay permisos y existe el comando del firewall de Hyper-V.
if ($isAdmin -and (Get-Command New-NetFirewallHyperVRule -ErrorAction SilentlyContinue)) {
  # Esta linea sirve para recorrer las reglas de firewall necesarias para WSL.
  foreach ($r in @(@{ Name = "SanKen-WSL-API-8000"; Port = 8000 }, @{ Name = "SanKen-WSL-Reverb-8080"; Port = 8080 })) {
    # Esta linea sirve para revisar si la regla todavia no existe.
    if (-not (Get-NetFirewallHyperVRule -Name $r.Name -ErrorAction SilentlyContinue)) {
      # Esta linea sirve para crear la regla de entrada del firewall de Hyper-V.
      New-NetFirewallHyperVRule -Name $r.Name -DisplayName $r.Name -Direction Inbound -VMCreatorId $WslVmCreatorId `
        -Protocol TCP -LocalPorts $r.Port -Action Allow | Out-Null
      # Esta linea sirve para registrar que la regla fue creada.
      Write-Log "Firewall Hyper-V (WSL): regla $($r.Name) creada"
    }
  }
}

# --- 2. Delegar a la parte WSL: MySQL, Redis, Laravel, Queue, Reverb, tuneles ---
# Esta linea sirve para registrar que se delega la parte de WSL.
Write-Log "Ejecutando start-sanken-wsl.sh dentro de WSL..."
# Esta linea sirve para definir la ruta del script de WSL.
$wslScriptPath = "/mnt/c/Users/SatanKen/OneDrive/Desktop/AplicacionesparaGithub/SanKen/scripts/start-sanken-wsl.sh"
# Esta linea sirve para ejecutar el script de WSL y capturar su salida.
$wslOutput = wsl.exe -d $WslDistro -e bash -lc "bash '$wslScriptPath'" 2>&1
# Esta linea sirve para recorrer cada linea de salida del script.
foreach ($line in $wslOutput) {
  # Esta linea sirve para mostrar la linea en pantalla.
  Write-Host $line
  # Esta linea sirve para agregar la linea al log de esta ejecucion.
  Add-Content -Path $LogFile -Value $line
  # Esta linea sirve para agregar la linea al ultimo log.
  Add-Content -Path $LatestLog -Value $line
}

# --- 3. Detectar IP de LAN ---
# apps/web ya no necesita que le toquemos el .env: api.ts deriva la URL de
# la API del host de la pagina (localhost, IP de LAN, lo que sea) solo -- ver
# el comentario en apps/web/src/lib/api.ts y apps/mobile/src/lib/api.ts.
# Tocar VITE_API_URL a mano aca rompia el login (NAT hairpin) para quien usa
# localhost:5173 en esta misma PC, asi que se dejo de hacer a proposito.
#
# apps/mobile SI sigue necesitando esto para el celular con Expo Go (no hay
# "host de la pagina" al que apuntar en nativo).
# Esta linea sirve para obtener la IP de la red local.
$LanIp = Get-LanIPAddress
# Esta linea sirve para revisar si se detecto una IP de red local.
if ($LanIp) {
  # Esta linea sirve para registrar la IP detectada.
  Write-Log "IP de LAN detectada: $LanIp"
  # Esta linea sirve para actualizar la URL de la API en el .env de la app movil.
  Set-EnvValue -Path (Join-Path $MobileDir ".env") -Key "EXPO_PUBLIC_API_URL" -Value "http://$($LanIp):8000"
# Esta linea sirve para tratar el caso sin IP de red local.
} else {
  # Esta linea sirve para registrar el aviso de que no se detecto la IP.
  Write-Log "AVISO: no se pudo detectar una IP de LAN (sin red?) - dejo el .env de mobile como estaba"
}

# --- 3b. (eliminado) Port proxy 8000 ---
# Ya no se crea: rompia la API en modo mirrored. El acceso LAN -> WSL lo dan
# las reglas de firewall de Hyper-V del paso 1b.

# --- 4. Web (Vite) - nativo en Windows ---
# Esta linea sirve para revisar si la web ya esta corriendo en el puerto 5173.
if (Test-PortOpen -Port 5173) {
  # Esta linea sirve para registrar que la web ya estaba corriendo.
  Write-Log "Web (Vite): OK (ya estaba corriendo en :5173)"
} else {
  # Esta linea sirve para registrar que se inicia la web.
  Write-Log "Web (Vite): iniciando..."
  # Esta linea sirve para iniciar la web con npm en segundo plano.
  Start-BackgroundNpm -Name "Web" -WorkDir $WebDir -Arguments "run dev" `
    -LogPath (Join-Path $LogDir "web.log") -PidFile (Join-Path $PidDir "web.pid")
  # Esta linea sirve para esperar tres segundos.
  Start-Sleep -Seconds 3
}

# --- 5. Mobile (Expo) - nativo en Windows ---
# Esta linea sirve para revisar si la app movil ya esta corriendo en el puerto 8081.
if (Test-PortOpen -Port 8081) {
  # Esta linea sirve para registrar que la app movil ya estaba corriendo.
  Write-Log "Mobile (Expo): OK (ya estaba corriendo en :8081)"
} else {
  # Esta linea sirve para registrar que se inicia la app movil.
  Write-Log "Mobile (Expo): iniciando..."
  # Esta linea sirve para iniciar la app movil con npm en segundo plano.
  Start-BackgroundNpm -Name "Mobile" -WorkDir $MobileDir -Arguments "start" `
    -LogPath (Join-Path $LogDir "mobile.log") -PidFile (Join-Path $PidDir "mobile.pid")
  # Esta linea sirve para esperar tres segundos.
  Start-Sleep -Seconds 3
}

# --- 6. Comprobacion final ---
# Cada Wait-ForHttpOk reintenta hasta su propio limite en vez de un solo
# chequeo fijo -- Metro (mobile) en particular puede tardar bastante mas que
# Vite en estar listo, sobre todo recien despues de reiniciar Windows con
# todo lo demas arrancando a la vez.
# Esta linea sirve para registrar que se ejecuta la comprobacion final.
Write-Log "Ejecutando comprobacion final (puede tardar un poco si algo recien arranco)..."

# Esta linea sirve para comprobar si MySQL esta activo.
$mysqlOk  = (wsl.exe -d $WslDistro -e bash -lc "systemctl is-active --quiet mysql && echo OK" 2>$null) -match "OK"
# Esta linea sirve para comprobar si Redis esta activo.
$redisOk  = (wsl.exe -d $WslDistro -e bash -lc "systemctl is-active --quiet redis-server && echo OK" 2>$null) -match "OK"
# Esta linea sirve para comprobar si el worker de colas esta corriendo.
$queueOk  = (wsl.exe -d $WslDistro -e bash -lc "pgrep -f 'artisan queue:listen' >/dev/null && echo OK" 2>$null) -match "OK"
# Esta linea sirve para comprobar si Reverb esta corriendo.
$reverbOk = (wsl.exe -d $WslDistro -e bash -lc "pgrep -f 'artisan reverb:start' >/dev/null && echo OK" 2>$null) -match "OK"
# 127.0.0.1 explicito (no "localhost"): Invoke-WebRequest a veces intenta
# ::1 primero contra el relay de WSL en modo mirrored y tarda de mas en
# caer a IPv4, aunque el servicio responde bien (verificado con curl.exe).
# Esta linea sirve para esperar a que la API responda.
$apiOk    = Wait-ForHttpOk -Url "http://127.0.0.1:8000/api/v1/ping" -MaxWaitSec 20
# Esta linea sirve para esperar a que la web responda.
$webOk    = Wait-ForHttpOk -Url "http://127.0.0.1:5173/" -MaxWaitSec 20
# Esta linea sirve para esperar a que la app movil responda.
$mobileOk = Wait-ForHttpOk -Url "http://127.0.0.1:8081/status" -MaxWaitSec 60

# Esta linea sirve para leer la URL del tunel de la API.
$tunnelApiUrl = (wsl.exe -d $WslDistro -e bash -lc "cat ~/sanken/logs/tunnel-api-url.txt 2>/dev/null") 2>$null
# Esta linea sirve para leer la URL del tunel de la web.
$tunnelWebUrl = (wsl.exe -d $WslDistro -e bash -lc "cat ~/sanken/logs/tunnel-web-url.txt 2>/dev/null") 2>$null
# Esta linea sirve para comprobar si hay tunel de la web.
$tunnelOk = [bool]$tunnelWebUrl

# Esta linea sirve para armar el resumen final con un texto de varias lineas.
$summary = @"

====================================
SANKEN DEV ENVIRONMENT
====================================
MySQL       $(Mark $mysqlOk)
Redis       $(Mark $redisOk)
Laravel API $(Mark $apiOk)
Queue       $(Mark $queueOk)
Reverb      $(Mark $reverbOk)  (opcional)
Web         $(Mark $webOk)
Mobile      $(Mark $mobileOk)
Tunnel      $(Mark $tunnelOk)

LAN:
  Web:    http://$($LanIp):5173
  API:    http://$($LanIp):8000
  Mobile: http://$($LanIp):8081  (o abri Expo Go y escanea el QR del log mobile.log)

Tunnel:
  Web (Cloudflare, cambia cada arranque): $tunnelWebUrl
  API (ngrok, fija, es la que usa el APK):  $tunnelApiUrl
====================================
"@

# Esta linea sirve para mostrar el resumen en pantalla.
Write-Host $summary
# Esta linea sirve para agregar el resumen al log de esta ejecucion.
Add-Content -Path $LogFile -Value $summary
# Esta linea sirve para agregar el resumen al ultimo log.
Add-Content -Path $LatestLog -Value $summary
# Esta linea sirve para registrar que el arranque termino.
Write-Log "SanKen AutoStart terminado. Log completo: $LogFile"
