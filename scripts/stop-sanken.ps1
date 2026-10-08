<#
.SYNOPSIS
  Para los procesos de SanKen que levanta start-sanken.ps1.

.DESCRIPTION
  Detiene: Web (Vite), Mobile (Expo), Laravel, Queue worker, Reverb y los
  tuneles Cloudflare. NO detiene MySQL ni Redis: son servicios systemd
  compartidos de la distro WSL, no algo que este flujo controle en exclusiva.
  Si tambien queres pararlos, hacelo a mano (ver el mensaje final).

  NOTA DE ENCODING: archivo en ASCII puro a proposito (ver start-sanken.ps1).
#>

# Esta linea sirve para definir el nombre de la distro de WSL.
$WslDistro = "Ubuntu"
# Esta linea sirve para definir la carpeta de archivos PID.
$PidDir    = "$env:LOCALAPPDATA\SanKen\pids"

# Esta linea sirve para avisar que se detienen la web y la app movil.
Write-Host "Deteniendo Web/Mobile (Windows)..."
# Esta linea sirve para recorrer los nombres de los servicios de Windows.
foreach ($name in "web", "mobile") {
  # Esta linea sirve para armar la ruta del archivo PID del servicio.
  $pidFile = Join-Path $PidDir "$name.pid"
  # Esta linea sirve para revisar si el archivo PID existe.
  if (Test-Path $pidFile) {
    # Esta linea sirve para leer el PID guardado.
    $procId = Get-Content $pidFile
    # Esta linea sirve para revisar si el proceso sigue corriendo.
    if ($procId -and (Get-Process -Id $procId -ErrorAction SilentlyContinue)) {
      # taskkill /T mata todo el arbol (cmd -> npm -> node/expo); matar solo
      # el PID guardado dejaria huerfano el proceso real de node.
      # Esta linea sirve para matar el proceso y todo su arbol.
      taskkill /T /F /PID $procId 2>$null | Out-Null
      # Esta linea sirve para avisar que el servicio fue detenido.
      Write-Host "  $name detenido (PID $procId)"
    }
    # Esta linea sirve para borrar el archivo PID.
    Remove-Item $pidFile -ErrorAction SilentlyContinue
  }
}

# Esta linea sirve para avisar que se detienen los servicios de WSL.
Write-Host "Deteniendo Laravel/Queue/Reverb/tuneles (WSL)..."
# Esta linea sirve para armar el comando que mata los procesos de Laravel, colas, Reverb y tuneles.
$wslCmd = 'pkill -f "artisan serve" 2>/dev/null; pkill -f "artisan queue:listen" 2>/dev/null; pkill -f "artisan reverb:start" 2>/dev/null; pkill -f "cloudflared tunnel --url" 2>/dev/null; pkill -f "ngrok http" 2>/dev/null; rm -f ~/sanken/logs/tunnel-api-url.txt ~/sanken/logs/tunnel-web-url.txt; echo "WSL: procesos detenidos"'
# Esta linea sirve para ejecutar el comando dentro de WSL.
wsl.exe -d $WslDistro -e bash -lc $wslCmd

# Esta linea sirve para imprimir una linea en blanco.
Write-Host ""
# Esta linea sirve para avisar que MySQL y Redis siguen corriendo.
Write-Host "Listo. MySQL y Redis siguen corriendo (son servicios systemd compartidos)."
# Esta linea sirve para mostrar como apagarlos a mano.
Write-Host "Si ademas queres apagarlos: wsl -d $WslDistro -e bash -lc 'sudo systemctl stop mysql redis-server'"
