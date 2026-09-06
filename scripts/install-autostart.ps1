<#
.SYNOPSIS
  Instala el arranque automatico de SanKen: reglas de firewall (una sola vez)
  + tarea de Windows Task Scheduler que corre start-sanken.ps1 al iniciar
  sesion.

.DESCRIPTION
  Correr esto UNA sola vez (a mano). Si no tenes permisos de administrador,
  las reglas de firewall se saltean con un aviso, pero la tarea programada se
  crea igual (no necesita admin porque corre en el contexto del usuario
  actual, no de SYSTEM).

  NOTA DE ENCODING: archivo en ASCII puro a proposito (ver start-sanken.ps1).
#>

$RepoRoot    = "C:\Users\SatanKen\OneDrive\Desktop\SanKen-main"
$StartScript = Join-Path $RepoRoot "scripts\start-sanken.ps1"
$TaskName    = "SanKen AutoStart"

# --- 1. Reglas de firewall (una sola vez; requiere administrador) ---
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
  # La red Wi-Fi puede estar categorizada como "Publica" en Windows (pasa
  # seguido, por ejemplo despues de una actualizacion). Con perfil Publico,
  # Windows Firewall bloquea el trafico entrante aunque existan reglas para
  # el puerto -- y ademas, con WSL en modo "mirrored", tambien bloquea que
  # Windows llegue a los servicios que corren dentro de WSL. Sin pasar esto
  # a "Privada", ni LAN ni el acceso Windows->WSL van a funcionar bien.
  $profiles = Get-NetConnectionProfile | Where-Object { $_.NetworkCategory -eq 'Public' }
  foreach ($p in $profiles) {
    Write-Host "Red '$($p.Name)' esta como Publica, la paso a Privada (necesario para LAN/WSL)..."
    Set-NetConnectionProfile -InterfaceIndex $p.InterfaceIndex -NetworkCategory Private
  }
  if (-not $profiles) {
    Write-Host "Perfil de red: ya esta en Privada/Domain, no hace falta cambiar nada."
  }

  $rules = @(
    @{ Name = "SanKen Web (5173)";    Port = 5173 },
    @{ Name = "SanKen Mobile (8081)"; Port = 8081 },
    @{ Name = "SanKen API (8000)";    Port = 8000 }
  )
  foreach ($rule in $rules) {
    $existing = Get-NetFirewallRule -DisplayName $rule.Name -ErrorAction SilentlyContinue
    if ($existing) {
      Write-Host "Firewall: '$($rule.Name)' ya existia, no se duplica."
    } else {
      New-NetFirewallRule -DisplayName $rule.Name -Direction Inbound -Action Allow `
        -Protocol TCP -LocalPort $rule.Port -Profile Private, Domain | Out-Null
      Write-Host "Firewall: regla '$($rule.Name)' creada (perfiles Private/Domain, no Public)."
    }
  }
} else {
  Write-Host "AVISO: no estas corriendo como administrador, salteo las reglas de firewall."
  Write-Host "       Para crearlas, volve a correr este script desde una PowerShell 'Ejecutar como administrador'."
}

# --- 2. Tarea programada (Task Scheduler) ---
$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existingTask) {
  Write-Host "Tarea '$TaskName' ya existia, se reemplaza con la configuracion actual."
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$StartScript`" -WaitSeconds 60"

# AtLogOn (no AtStartup/SYSTEM): WSL y npm necesitan el contexto del usuario
# logueado para resolver PATH, permisos y la propia distro WSL; en SYSTEM
# esto es mucho menos confiable. En una PC personal, "al iniciar sesion"
# cubre en la practica lo mismo que "al prender la PC".
# El trigger necesita el formato "DOMINIO\usuario" (o "COMPUTADORA\usuario"
# en una cuenta local) -- pasarle solo $env:USERNAME hace que
# Register-ScheduledTask falle mas adelante con "El parametro no es correcto"
# (se detecto probandolo: fallaba con HRESULT 0x80070057).
$userTrigger = "$env:COMPUTERNAME\$env:USERNAME"
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $userTrigger

$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
  -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 0) -MultipleInstances IgnoreNew

try {
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings `
    -Description "Levanta el entorno de desarrollo de SanKen (WSL/MySQL/Redis/Laravel/Queue/Web/Mobile/Tunel) unos 60s despues de iniciar sesion." `
    -ErrorAction Stop | Out-Null

  Write-Host ""
  Write-Host "Tarea '$TaskName' instalada: se va a ejecutar unos 60s despues de que inicies sesion en Windows."
  Write-Host "Para probarla ya mismo sin reiniciar: Start-ScheduledTask -TaskName '$TaskName'"
  Write-Host "Para desinstalarla: Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
} catch {
  Write-Host ""
  Write-Host "ERROR: no se pudo registrar la tarea programada: $($_.Exception.Message)"
  Write-Host "       Nada mas de lo de arriba se deshizo (firewall/red quedan aplicados)."
  exit 1
}
