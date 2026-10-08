<?php

// Esta línea sirve para importar el middleware que exige los consentimientos legales.
use App\Http\Middleware\EnsureLegalConsentsAccepted;
// Esta línea sirve para importar el middleware que exige un rol.
use App\Http\Middleware\EnsureUserHasRole;
// Esta línea sirve para importar el middleware que registra la última actividad.
use App\Http\Middleware\TouchLastActive;
// Esta línea sirve para importar la clase Schedule para programar tareas.
use Illuminate\Console\Scheduling\Schedule;
// Esta línea sirve para importar la clase Application de Laravel.
use Illuminate\Foundation\Application;
// Esta línea sirve para importar la configuración del manejo de excepciones.
use Illuminate\Foundation\Configuration\Exceptions;
// Esta línea sirve para importar la configuración de los middleware.
use Illuminate\Foundation\Configuration\Middleware;

// Esta línea sirve para crear y configurar la aplicación con la carpeta raíz del proyecto.
return Application::configure(basePath: dirname(__DIR__))
    // El framework auto-descubre listeners en app/Listeners por defecto, lo
    // que duplica el registro de todo evento también wireado explícitamente
    // en AppServiceProvider::boot() (confirmado: sin esto, cada evento tenía
    // 2 listeners registrados — uno explícito, uno auto-descubierto — y cada
    // uno corría por separado). Esta app siempre wirea a mano, así que se
    // desactiva el discovery para que quede una sola fuente de verdad.
    // Esta línea sirve para desactivar el descubrimiento automático de listeners.
    ->withEvents(discover: false)
    // Primer uso de Schedule:: en la app (Sprint 9). Esta registración por
    // sí sola NO alcanza para que corra en este entorno WSL de dev: no hay
    // cron ni un contenedor de scheduler en docker-compose.yml, así que
    // nada invoca `schedule:run` en el tiempo. Para dev/testing hay que
    // correr `php artisan challenges:generate` a mano; esta registración
    // sirve para un despliegue real con cron.
    // Esta línea sirve para programar las tareas periódicas.
    ->withSchedule(function (Schedule $schedule): void {
        // Esta línea sirve para generar los retos cada semana.
        $schedule->command('challenges:generate')->weekly();
        // Check-in semanal: viernes 5 p. m. hora de Colombia (ver
        // config/support.php). Idempotente: correrlo de nuevo no reenvía.
        // Esta línea sirve para programar los recordatorios del check-in semanal.
        $schedule->command('support:weekly-checkin-reminders')
            // Esta línea sirve para ejecutarlos los viernes a las 17:00.
            ->weeklyOn(5, '17:00')
            // Esta línea sirve para usar la zona horaria configurada para soporte.
            ->timezone(config('support.checkin.timezone'));
    })
    // Esta línea sirve para configurar los archivos de rutas.
    ->withRouting(
        // Esta línea sirve para cargar las rutas web.
        web: __DIR__.'/../routes/web.php',
        // Esta línea sirve para cargar las rutas de la API.
        api: __DIR__.'/../routes/api.php',
        // Esta línea sirve para cargar los comandos de consola.
        commands: __DIR__.'/../routes/console.php',
        // Esta línea sirve para cargar los canales de broadcasting.
        channels: __DIR__.'/../routes/channels.php',
        // Esta línea sirve para habilitar la ruta /up para comprobar la salud de la app.
        health: '/up',
    )
    // Esta línea sirve para configurar los middleware.
    ->withMiddleware(function (Middleware $middleware): void {
        // Esta línea sirve para permitir que la API use la sesión del frontend (cookies de Sanctum).
        $middleware->statefulApi();
        // Esta línea sirve para aplicar el límite de peticiones a la API.
        $middleware->throttleApi();
        // Esta línea sirve para registrar el alias "role" para el middleware de roles.
        $middleware->alias(['role' => EnsureUserHasRole::class]);
        // Global: corre para toda request bajo routes/api.php sin tener que
        // apendearlo a cada uno de los ~15 grupos `auth:sanctum` existentes.
        // No-op para requests sin usuario autenticado (ver TouchLastActive).
        // EnsureLegalConsentsAccepted: mismo criterio global — bloquea con 403
        // a quien tenga documentos legales pendientes (ver el middleware).
        // Esta línea sirve para agregar a toda la API el registro de actividad y la exigencia de consentimientos.
        $middleware->api(append: [TouchLastActive::class, EnsureLegalConsentsAccepted::class]);
    })
    // Esta línea sirve para configurar el manejo de excepciones.
    ->withExceptions(function (Exceptions $exceptions): void {
        //
        // Esta línea sirve para cerrar la configuración de excepciones y crear la aplicación.
    })->create();
