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

$WslDistro = "Ubuntu"
$PidDir    = "$env:LOCALAPPDATA\SanKen\pids"

Write-Host "Deteniendo Web/Mobile (Windows)..."
foreach ($name in "web", "mobile") {
  $pidFile = Join-Path $PidDir "$name.pid"
  if (Test-Path $pidFile) {
    $procId = Get-Content $pidFile
    if ($procId -and (Get-Process -Id $procId -ErrorAction SilentlyContinue)) {
      # taskkill /T mata todo el arbol (cmd -> npm -> node/expo); matar solo
      # el PID guardado dejaria huerfano el proceso real de node.
      taskkill /T /F /PID $procId 2>$null | Out-Null
      Write-Host "  $name detenido (PID $procId)"
    }
    Remove-Item $pidFile -ErrorAction SilentlyContinue
  }
}

Write-Host "Deteniendo Laravel/Queue/Reverb/tuneles (WSL)..."
$wslCmd = 'pkill -f "artisan serve" 2>/dev/null; pkill -f "artisan queue:listen" 2>/dev/null; pkill -f "artisan reverb:start" 2>/dev/null; pkill -f "cloudflared tunnel --url" 2>/dev/null; rm -f ~/sanken/logs/tunnel-api-url.txt ~/sanken/logs/tunnel-web-url.txt; echo "WSL: procesos detenidos"'
wsl.exe -d $WslDistro -e bash -lc $wslCmd

Write-Host ""
Write-Host "Listo. MySQL y Redis siguen corriendo (son servicios systemd compartidos)."
Write-Host "Si ademas queres apagarlos: wsl -d $WslDistro -e bash -lc 'sudo systemctl stop mysql redis-server'"
