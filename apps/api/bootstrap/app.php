<?php

use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\TouchLastActive;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    // El framework auto-descubre listeners en app/Listeners por defecto, lo
    // que duplica el registro de todo evento también wireado explícitamente
    // en AppServiceProvider::boot() (confirmado: sin esto, cada evento tenía
    // 2 listeners registrados — uno explícito, uno auto-descubierto — y cada
    // uno corría por separado). Esta app siempre wirea a mano, así que se
    // desactiva el discovery para que quede una sola fuente de verdad.
    ->withEvents(discover: false)
    // Primer uso de Schedule:: en la app (Sprint 9, rankings). Esta
    // registración por sí sola NO alcanza para que corra en este entorno
    // WSL de dev: no hay cron ni un contenedor de scheduler en
    // docker-compose.yml, así que nada invoca `schedule:run` en el tiempo.
    // Para dev/testing hay que correr `php artisan rankings:recalculate`
    // a mano; esta registración sirve para un despliegue real con cron.
    ->withSchedule(function (Schedule $schedule): void {
        $schedule->command('rankings:recalculate')->daily();
        // Igual salvedad que rankings:recalculate arriba: no corre solo en
        // este entorno WSL de dev, hay que invocarlo a mano
        // (`php artisan challenges:generate`).
        $schedule->command('challenges:generate')->weekly();
    })
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->throttleApi();
        $middleware->alias(['role' => EnsureUserHasRole::class]);
        // Global: corre para toda request bajo routes/api.php sin tener que
        // apendearlo a cada uno de los ~15 grupos `auth:sanctum` existentes.
        // No-op para requests sin usuario autenticado (ver TouchLastActive).
        $middleware->api(append: [TouchLastActive::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
