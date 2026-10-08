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

# Esta linea sirve para definir la raiz del repositorio.
$RepoRoot    = "C:\Users\SatanKen\OneDrive\Desktop\AplicacionesparaGithub\SanKen"
# Esta linea sirve para definir la ruta del script de arranque.
$StartScript = Join-Path $RepoRoot "scripts\start-sanken.ps1"
# Esta linea sirve para definir el nombre de la tarea programada.
$TaskName    = "SanKen AutoStart"

# --- 1. Reglas de firewall (una sola vez; requiere administrador) ---
# Esta linea sirve para comprobar si el script corre como administrador.
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

# Esta linea sirve para revisar si hay permisos de administrador.
if ($isAdmin) {
  # La red Wi-Fi puede estar categorizada como "Publica" en Windows (pasa
  # seguido, por ejemplo despues de una actualizacion). Con perfil Publico,
  # Windows Firewall bloquea el trafico entrante aunque existan reglas para
  # el puerto -- y ademas, con WSL en modo "mirrored", tambien bloquea que
  # Windows llegue a los servicios que corren dentro de WSL. Sin pasar esto
  # a "Privada", ni LAN ni el acceso Windows->WSL van a funcionar bien.
  # Esta linea sirve para buscar las redes marcadas como publicas.
  $profiles = Get-NetConnectionProfile | Where-Object { $_.NetworkCategory -eq 'Public' }
  # Esta linea sirve para recorrer cada red publica.
  foreach ($p in $profiles) {
    # Esta linea sirve para avisar que la red se pasa a privada.
    Write-Host "Red '$($p.Name)' esta como Publica, la paso a Privada (necesario para LAN/WSL)..."
    # Esta linea sirve para cambiar la red a privada.
    Set-NetConnectionProfile -InterfaceIndex $p.InterfaceIndex -NetworkCategory Private
  }
  # Esta linea sirve para revisar si no habia redes publicas.
  if (-not $profiles) {
    # Esta linea sirve para avisar que no hace falta cambiar nada.
    Write-Host "Perfil de red: ya esta en Privada/Domain, no hace falta cambiar nada."
  }

  # Esta linea sirve para declarar las reglas de firewall a crear.
  $rules = @(
    # Esta linea sirve para definir la regla de la web en el puerto 5173.
    @{ Name = "SanKen Web (5173)";    Port = 5173 },
    # Esta linea sirve para definir la regla de la app movil en el puerto 8081.
    @{ Name = "SanKen Mobile (8081)"; Port = 8081 },
    # Esta linea sirve para definir la regla de la API en el puerto 8000.
    @{ Name = "SanKen API (8000)";    Port = 8000 }
  )
  # Esta linea sirve para recorrer cada regla.
  foreach ($rule in $rules) {
    # Esta linea sirve para buscar si la regla ya existe.
    $existing = Get-NetFirewallRule -DisplayName $rule.Name -ErrorAction SilentlyContinue
    # Esta linea sirve para revisar si ya existia.
    if ($existing) {
      # Esta linea sirve para avisar que no se duplica.
      Write-Host "Firewall: '$($rule.Name)' ya existia, no se duplica."
    } else {
      # Esta linea sirve para crear la regla de entrada del firewall.
      New-NetFirewallRule -DisplayName $rule.Name -Direction Inbound -Action Allow `
        -Protocol TCP -LocalPort $rule.Port -Profile Private, Domain | Out-Null
      # Esta linea sirve para avisar que la regla fue creada.
      Write-Host "Firewall: regla '$($rule.Name)' creada (perfiles Private/Domain, no Public)."
    }
  }

  # WSL en modo mirrored: el acceso desde la LAN a Laravel (8000) y Reverb
  # (8080), que corren DENTRO de WSL, lo controla el firewall de Hyper-V
  # (WSL trae DefaultInboundAction=Block). Esto reemplaza al viejo
  # "netsh portproxy 0.0.0.0:8000", que es persistente y dejaba el :8000
  # tomado por Windows al reiniciar: Laravel no podia arrancar (ver el paso
  # 1b de start-sanken.ps1).
  # Esta linea sirve para buscar un port proxy heredado en el puerto 8000.
  $legacyProxy = netsh interface portproxy show v4tov4 | Select-String "\s8000\s"
  # Esta linea sirve para revisar si existe el port proxy.
  if ($legacyProxy) {
    # Esta linea sirve para eliminar el port proxy heredado.
    netsh interface portproxy delete v4tov4 listenport=8000 listenaddress=0.0.0.0 2>$null | Out-Null
    # Esta linea sirve para avisar que fue eliminado.
    Write-Host "Port proxy 8000 (legado): eliminado."
  }
  # Esta linea sirve para revisar si existe el comando del firewall de Hyper-V.
  if (Get-Command New-NetFirewallHyperVRule -ErrorAction SilentlyContinue) {
    # Esta linea sirve para definir el identificador del creador de la VM de WSL.
    $wslVmCreatorId = '{40E0AC32-46A5-438A-A0B2-2B479E8F2E90}'
    # Esta linea sirve para recorrer las reglas de WSL para la API y Reverb.
    foreach ($r in @(@{ Name = "SanKen-WSL-API-8000"; Port = 8000 }, @{ Name = "SanKen-WSL-Reverb-8080"; Port = 8080 })) {
      # Esta linea sirve para revisar si la regla ya existe.
      if (Get-NetFirewallHyperVRule -Name $r.Name -ErrorAction SilentlyContinue) {
        # Esta linea sirve para avisar que ya existia.
        Write-Host "Firewall Hyper-V (WSL): '$($r.Name)' ya existia."
      } else {
        # Esta linea sirve para crear la regla de entrada del firewall de Hyper-V.
        New-NetFirewallHyperVRule -Name $r.Name -DisplayName $r.Name -Direction Inbound -VMCreatorId $wslVmCreatorId `
          -Protocol TCP -LocalPorts $r.Port -Action Allow | Out-Null
        # Esta linea sirve para avisar que la regla fue creada.
        Write-Host "Firewall Hyper-V (WSL): regla '$($r.Name)' creada."
      }
    }
  } else {
    # Esta linea sirve para avisar que este Windows no tiene firewall de Hyper-V.
    Write-Host "AVISO: este Windows no tiene firewall de Hyper-V (New-NetFirewallHyperVRule); la LAN no va a poder llegar a Laravel dentro de WSL."
  }
} else {
  # Esta linea sirve para avisar que no se corre como administrador.
  Write-Host "AVISO: no estas corriendo como administrador, salteo las reglas de firewall."
  # Esta linea sirve para explicar como crear las reglas despues.
  Write-Host "       Para crearlas, volve a correr este script desde una PowerShell 'Ejecutar como administrador'."
}

# --- 2. Tarea programada (Task Scheduler) ---
# Esta linea sirve para buscar si la tarea programada ya existe.
$existingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
# Esta linea sirve para revisar si ya existia.
if ($existingTask) {
  # Esta linea sirve para avisar que se reemplaza con la configuracion actual.
  Write-Host "Tarea '$TaskName' ya existia, se reemplaza con la configuracion actual."
  # Esta linea sirve para borrar la tarea anterior.
  Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Esta linea sirve para definir la accion que ejecuta el script de arranque oculto.
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
# Esta linea sirve para armar el usuario con el formato EQUIPO\usuario.
$userTrigger = "$env:COMPUTERNAME\$env:USERNAME"
# Esta linea sirve para crear el disparador al iniciar sesion.
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $userTrigger

# RunLevel Highest: start-sanken.ps1 necesita administrador para borrar un
# port proxy 8000 heredado y asegurar las reglas de firewall de Hyper-V
# (Windows -> WSL, ver el paso 1b de start-sanken.ps1) en cada arranque. Con el usuario logueado siendo
# administrador, una tarea programada con Highest corre elevada SOLA, sin
# pedir UAC (a diferencia de doble-clickear un .exe) -- es el mecanismo
# soportado para esto, no un workaround.
# Esta linea sirve para definir el contexto de ejecucion con el nivel mas alto.
$principal = New-ScheduledTaskPrincipal -UserId $userTrigger -RunLevel Highest -LogonType Interactive

# Esta linea sirve para definir las opciones de la tarea.
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
  -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 0) -MultipleInstances IgnoreNew

# Esta linea sirve para intentar registrar la tarea.
try {
  # Esta linea sirve para registrar la tarea programada con su accion, disparador y opciones.
  Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings `
    -Description "Levanta el entorno de desarrollo de SanKen (WSL/MySQL/Redis/Laravel/Queue/Web/Mobile/Tunel) unos 60s despues de iniciar sesion." `
    -ErrorAction Stop | Out-Null

  # Esta linea sirve para imprimir una linea en blanco.
  Write-Host ""
  # Esta linea sirve para avisar que la tarea quedo instalada.
  Write-Host "Tarea '$TaskName' instalada: se va a ejecutar unos 60s despues de que inicies sesion en Windows."
  # Esta linea sirve para explicar como desinstalarla.
  Write-Host "Para desinstalarla: Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"

  # Esta linea sirve para revisar si hay permisos de administrador.
  if ($isAdmin) {
    # La corremos ya mismo (elevada, gracias al RunLevel Highest de arriba)
    # para dejar todo arriba ahora, sin esperar al proximo login.
    # Esta linea sirve para avisar que se ejecuta la tarea ahora.
    Write-Host "Ejecutandola ahora mismo (tarda ~60s por el WaitSeconds interno)..."
    # Esta linea sirve para iniciar la tarea programada ahora.
    Start-ScheduledTask -TaskName $TaskName
  }
# Esta linea sirve para capturar el error al registrar la tarea.
} catch {
  # Esta linea sirve para imprimir una linea en blanco.
  Write-Host ""
  # Esta linea sirve para avisar que no se pudo registrar la tarea.
  Write-Host "ERROR: no se pudo registrar la tarea programada: $($_.Exception.Message)"
  # Esta linea sirve para avisar que lo anterior queda aplicado.
  Write-Host "       Nada mas de lo de arriba se deshizo (firewall/red quedan aplicados)."
  # Esta linea sirve para terminar con codigo de error.
  exit 1
}
