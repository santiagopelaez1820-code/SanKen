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
param(
  [int]$WaitSeconds = 60
)

$ErrorActionPreference = 'Continue'

# --- Rutas ---
$RepoRoot   = "C:\Users\SatanKen\OneDrive\Desktop\SanKen-main"
$WebDir     = Join-Path $RepoRoot "apps\web"
$MobileDir  = Join-Path $RepoRoot "apps\mobile"
$WslDistro  = "Ubuntu"

$StateDir = "$env:LOCALAPPDATA\SanKen"
$LogDir   = Join-Path $StateDir "logs"
$PidDir   = Join-Path $StateDir "pids"
New-Item -ItemType Directory -Force -Path $LogDir, $PidDir | Out-Null

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$LogFile   = Join-Path $LogDir "autostart-$Timestamp.log"
$LatestLog = Join-Path $LogDir "latest.log"

function Write-Log {
  param([string]$Message)
  $line = "[{0}] {1}" -f (Get-Date -Format "HH:mm:ss"), $Message
  Write-Host $line
  Add-Content -Path $LogFile -Value $line
  Add-Content -Path $LatestLog -Value $line
}

Set-Content -Path $LatestLog -Value ""
Write-Log "===================================================="
Write-Log "SanKen AutoStart iniciado"

if ($WaitSeconds -gt 0) {
  Write-Log "Esperando $WaitSeconds segundos (arranque de Windows/red)..."
  Start-Sleep -Seconds $WaitSeconds
}

# --- Helpers ---
function Test-PortOpen {
  param([string]$ComputerName = "127.0.0.1", [int]$Port)
  try {
    $result = Test-NetConnection -ComputerName $ComputerName -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
    return [bool]$result
  } catch {
    return $false
  }
}

function Get-LanIPAddress {
  # La interfaz real es la que tiene default gateway y esta activa - esto
  # descarta adaptadores host-only de VirtualBox, APIPA (169.254.x.x), etc.
  $cfg = Get-NetIPConfiguration -ErrorAction SilentlyContinue |
    Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up' } |
    Select-Object -First 1
  if ($cfg) {
    return $cfg.IPv4Address.IPAddress
  }
  return $null
}

function Set-EnvValue {
  param([string]$Path, [string]$Key, [string]$Value)
  if (-not (Test-Path $Path)) {
    Write-Log "AVISO: no existe $Path - no se actualiza $Key"
    return
  }
  $content = Get-Content -Path $Path -Raw
  $pattern = "(?m)^$([regex]::Escape($Key))=.*$"
  $newLine = "$Key=$Value"
  if ($content -match $pattern) {
    if ($Matches[0] -eq $newLine) {
      return
    }
    $evaluator = [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $newLine }
    $content = [regex]::Replace($content, $pattern, $evaluator)
    Set-Content -Path $Path -Value $content -NoNewline
    Write-Log "$Key actualizado en $(Split-Path $Path -Leaf) -> $Value"
  } else {
    Add-Content -Path $Path -Value "`n$newLine"
    Write-Log "$Key agregado a $(Split-Path $Path -Leaf) -> $Value"
  }
}

function Start-BackgroundNpm {
  param([string]$Name, [string]$WorkDir, [string]$Arguments, [string]$LogPath, [string]$PidFile)
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = "cmd.exe"
  $psi.Arguments = "/c npm $Arguments > `"$LogPath`" 2>&1"
  $psi.WorkingDirectory = $WorkDir
  $psi.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
  $psi.CreateNoWindow = $true
  $psi.UseShellExecute = $true
  $proc = [System.Diagnostics.Process]::Start($psi)
  Set-Content -Path $PidFile -Value $proc.Id
  Write-Log "$Name iniciado (PID $($proc.Id)) -> log: $LogPath"
}

function Test-HttpOk {
  param([string]$Url, [int]$TimeoutSec = 3)
  try {
    $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec -ErrorAction Stop
    return $r.StatusCode -lt 500
  } catch {
    if ($_.Exception.Response) {
      return $true
    }
    return $false
  }
}

function Mark {
  param([bool]$Ok)
  if ($Ok) { return "OK" }
  return "X"
}

function Wait-ForHttpOk {
  param([string]$Url, [int]$MaxWaitSec = 20)
  # Metro (Expo) puede tardar 20-40s en compilar en frio recien arrancado
  # (mas todavia justo despues de un reinicio de Windows, con todo lo demas
  # arrancando a la vez) -- un solo chequeo a los 3 segundos lo daba por
  # caido cuando en realidad solo estaba tardando. Reintenta hasta $MaxWaitSec.
  $deadline = (Get-Date).AddSeconds($MaxWaitSec)
  do {
    if (Test-HttpOk -Url $Url -TimeoutSec 3) { return $true }
    Start-Sleep -Seconds 2
  } while ((Get-Date) -lt $deadline)
  return $false
}

# --- 1. WSL: asegurar que la distro este arriba (esto ya dispara systemd ->
# MySQL/Redis nativos - ver diagnostico: NO se usa Docker para esto). ---
Write-Log "Verificando WSL ($WslDistro)..."
$wslList = wsl.exe -l -v 2>$null
$running = ($wslList -join "`n") -match "$WslDistro\s+Running"
if (-not $running) {
  Write-Log "WSL no estaba corriendo, iniciando..."
  wsl.exe -d $WslDistro -e true | Out-Null
  Start-Sleep -Seconds 3
}
Write-Log "WSL: OK"

# --- 2. Delegar a la parte WSL: MySQL, Redis, Laravel, Queue, Reverb, tuneles ---
Write-Log "Ejecutando start-sanken-wsl.sh dentro de WSL..."
$wslScriptPath = "/mnt/c/Users/SatanKen/OneDrive/Desktop/SanKen-main/scripts/start-sanken-wsl.sh"
$wslOutput = wsl.exe -d $WslDistro -e bash -lc "bash '$wslScriptPath'" 2>&1
foreach ($line in $wslOutput) {
  Write-Host $line
  Add-Content -Path $LogFile -Value $line
  Add-Content -Path $LatestLog -Value $line
}

# --- 3. Detectar IP de LAN ---
# apps/web ya no necesita que le toquemos el .env: api.ts deriva la URL de
# la API del host de la pagina (localhost, IP de LAN, lo que sea) solo -- ver
# el comentario en apps/web/src/lib/api.ts y apps/mobile/src/lib/api.ts.
# Tocar VITE_API_URL a mano acá rompia el login (NAT hairpin) para quien usa
# localhost:5173 en esta misma PC, asi que se dejo de hacer a proposito.
#
# apps/mobile SI sigue necesitando esto para el celular con Expo Go (no hay
# "host de la pagina" al que apuntar en nativo).
$LanIp = Get-LanIPAddress
if ($LanIp) {
  Write-Log "IP de LAN detectada: $LanIp"
  Set-EnvValue -Path (Join-Path $MobileDir ".env") -Key "EXPO_PUBLIC_API_URL" -Value "http://$($LanIp):8000"
} else {
  Write-Log "AVISO: no se pudo detectar una IP de LAN (sin red?) - dejo el .env de mobile como estaba"
}

# --- 4. Web (Vite) - nativo en Windows ---
if (Test-PortOpen -Port 5173) {
  Write-Log "Web (Vite): OK (ya estaba corriendo en :5173)"
} else {
  Write-Log "Web (Vite): iniciando..."
  Start-BackgroundNpm -Name "Web" -WorkDir $WebDir -Arguments "run dev" `
    -LogPath (Join-Path $LogDir "web.log") -PidFile (Join-Path $PidDir "web.pid")
  Start-Sleep -Seconds 3
}

# --- 5. Mobile (Expo) - nativo en Windows ---
if (Test-PortOpen -Port 8081) {
  Write-Log "Mobile (Expo): OK (ya estaba corriendo en :8081)"
} else {
  Write-Log "Mobile (Expo): iniciando..."
  Start-BackgroundNpm -Name "Mobile" -WorkDir $MobileDir -Arguments "start" `
    -LogPath (Join-Path $LogDir "mobile.log") -PidFile (Join-Path $PidDir "mobile.pid")
  Start-Sleep -Seconds 3
}

# --- 6. Comprobacion final ---
# Cada Wait-ForHttpOk reintenta hasta su propio limite en vez de un solo
# chequeo fijo -- Metro (mobile) en particular puede tardar bastante mas que
# Vite en estar listo, sobre todo recien despues de reiniciar Windows con
# todo lo demas arrancando a la vez.
Write-Log "Ejecutando comprobacion final (puede tardar un poco si algo recien arranco)..."

$mysqlOk  = (wsl.exe -d $WslDistro -e bash -lc "systemctl is-active --quiet mysql && echo OK" 2>$null) -match "OK"
$redisOk  = (wsl.exe -d $WslDistro -e bash -lc "systemctl is-active --quiet redis-server && echo OK" 2>$null) -match "OK"
$queueOk  = (wsl.exe -d $WslDistro -e bash -lc "pgrep -f 'artisan queue:listen' >/dev/null && echo OK" 2>$null) -match "OK"
$reverbOk = (wsl.exe -d $WslDistro -e bash -lc "pgrep -f 'artisan reverb:start' >/dev/null && echo OK" 2>$null) -match "OK"
# 127.0.0.1 explicito (no "localhost"): Invoke-WebRequest a veces intenta
# ::1 primero contra el relay de WSL en modo mirrored y tarda de mas en
# caer a IPv4, aunque el servicio responde bien (verificado con curl.exe).
$apiOk    = Wait-ForHttpOk -Url "http://127.0.0.1:8000/api/v1/ping" -MaxWaitSec 20
$webOk    = Wait-ForHttpOk -Url "http://127.0.0.1:5173/" -MaxWaitSec 20
$mobileOk = Wait-ForHttpOk -Url "http://127.0.0.1:8081/status" -MaxWaitSec 60

$tunnelApiUrl = (wsl.exe -d $WslDistro -e bash -lc "cat ~/sanken/logs/tunnel-api-url.txt 2>/dev/null") 2>$null
$tunnelWebUrl = (wsl.exe -d $WslDistro -e bash -lc "cat ~/sanken/logs/tunnel-web-url.txt 2>/dev/null") 2>$null
$tunnelOk = [bool]$tunnelWebUrl

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

Tunnel (Cloudflare, URL nueva cada arranque):
  Web: $tunnelWebUrl
  API: $tunnelApiUrl
====================================
"@

Write-Host $summary
Add-Content -Path $LogFile -Value $summary
Add-Content -Path $LatestLog -Value $summary
Write-Log "SanKen AutoStart terminado. Log completo: $LogFile"
