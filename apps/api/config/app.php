<?php

// Esta línea sirve para devolver el arreglo de configuración de la aplicación.
return [

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application, which will be used when the
    | framework needs to place the application's name in a notification or
    | other UI elements where an application name needs to be displayed.
    |
    */

    // Esta línea sirve para definir el nombre de la app (APP_NAME, "Laravel" por defecto).
    'name' => env('APP_NAME', 'Laravel'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    // Esta línea sirve para definir el entorno (APP_ENV, "production" por defecto).
    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    // Esta línea sirve para activar o desactivar el modo debug (APP_DEBUG).
    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | This URL is used by the console to properly generate URLs when using
    | the Artisan command line tool. You should set this to the root of
    | the application so that it's available within Artisan commands.
    |
    */

    // Esta línea sirve para definir la URL base de la API (APP_URL).
    'url' => env('APP_URL', 'http://localhost'),

    // Esta línea sirve para definir la URL del frontend web (FRONTEND_URL) para los enlaces de los correos.
    'frontend_url' => env('FRONTEND_URL'),

    /**
     * Línea de WhatsApp de atención de SanKen — a donde va el botón
     * "Contactar con SanKen" del cliente (ver OrderWhatsAppMessageBuilder).
     * En formato internacional sin '+' (ej. 573001234567). Vacío = el
     * botón simplemente no aparece, no es un error.
     */
    // Esta línea sirve para definir el número de WhatsApp de atención de SanKen.
    'support_whatsapp_number' => env('SUPPORT_WHATSAPP_NUMBER'),

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. The timezone
    | is set to "UTC" by default as it is suitable for most use cases.
    |
    */

    // Esta línea sirve para usar la zona horaria UTC.
    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by Laravel's translation / localization methods. This option can be
    | set to any locale for which you plan to have translation strings.
    |
    */

    // Esta línea sirve para definir el idioma de la app (APP_LOCALE).
    'locale' => env('APP_LOCALE', 'en'),

    // Esta línea sirve para definir el idioma de respaldo.
    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    // Esta línea sirve para definir el idioma de los datos falsos de prueba (Faker).
    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is utilized by Laravel's encryption services and should be set
    | to a random, 32 character string to ensure that all encrypted values
    | are secure. You should do this prior to deploying the application.
    |
    */

    // Esta línea sirve para definir el algoritmo de cifrado.
    'cipher' => 'AES-256-CBC',

    // Esta línea sirve para definir la clave de cifrado (APP_KEY).
    'key' => env('APP_KEY'),

    // Esta línea sirve para definir las claves de cifrado anteriores.
    'previous_keys' => [
        // Esta línea sirve para tomar solo las claves no vacías.
        ...array_filter(
            // Esta línea sirve para separar por comas las claves de APP_PREVIOUS_KEYS.
            explode(',', (string) env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    // Esta línea sirve para configurar el modo mantenimiento.
    'maintenance' => [
        // Esta línea sirve para definir dónde se guarda el estado de mantenimiento (archivo por defecto).
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        // Esta línea sirve para definir el almacén de caché si se usa el driver "cache".
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];
