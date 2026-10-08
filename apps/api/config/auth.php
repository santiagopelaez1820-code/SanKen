<?php

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para devolver el arreglo de configuración de autenticación.
return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    |
    | This option defines the default authentication "guard" and password
    | reset "broker" for your application. You may change these values
    | as required, but they're a perfect start for most applications.
    |
    */

    // Guard por defecto = sanctum, no web: esta app es API-only, autentica
    // todo por Bearer token (nunca sesión) — routes/web.php no tiene nada
    // real. Encontrado en Sprint 11: `$request->user()` sin guard explícito
    // (que es lo que usa Broadcasting internamente para autorizar canales
    // privados en `retrieveUser()`, sin que Broadcast::routes() lo pueda
    // sobreescribir por canal) resolvía contra el guard 'web' (sesión, sin
    // usuario) en vez de 'sanctum', tirando 403 en /broadcasting/auth pese a
    // que el Bearer token era válido — canal privado roto para cualquier
    // suscripción a Reverb, no solo la de chat.
    // Esta línea sirve para definir los valores por defecto.
    'defaults' => [
        // Esta línea sirve para usar el guard "sanctum" por defecto (tokens Bearer).
        'guard' => env('AUTH_GUARD', 'sanctum'),
        // Esta línea sirve para usar el broker de contraseñas "users".
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Next, you may define every authentication guard for your application.
    | Of course, a great default configuration has been defined for you
    | which utilizes session storage plus the Eloquent user provider.
    |
    | All authentication guards have a user provider, which defines how the
    | users are actually retrieved out of your database or other storage
    | system used by the application. Typically, Eloquent is utilized.
    |
    | Supported: "session"
    |
    */

    // Esta línea sirve para definir los guards.
    'guards' => [
        // Esta línea sirve para definir el guard "web".
        'web' => [
            // Esta línea sirve para autenticar con sesión.
            'driver' => 'session',
            // Esta línea sirve para buscar los usuarios con el proveedor "users".
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    |
    | All authentication guards have a user provider, which defines how the
    | users are actually retrieved out of your database or other storage
    | system used by the application. Typically, Eloquent is utilized.
    |
    | If you have multiple user tables or models you may configure multiple
    | providers to represent the model / table. These providers may then
    | be assigned to any extra authentication guards you have defined.
    |
    | Supported: "database", "eloquent"
    |
    */

    // Esta línea sirve para definir los proveedores de usuarios.
    'providers' => [
        // Esta línea sirve para definir el proveedor "users".
        'users' => [
            // Esta línea sirve para buscar los usuarios con Eloquent.
            'driver' => 'eloquent',
            // Esta línea sirve para usar el modelo User.
            'model' => env('AUTH_MODEL', User::class),
        ],

        // 'users' => [
        //     'driver' => 'database',
        //     'table' => 'users',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    |
    | These configuration options specify the behavior of Laravel's password
    | reset functionality, including the table utilized for token storage
    | and the user provider that is invoked to actually retrieve users.
    |
    | The expiry time is the number of minutes that each reset token will be
    | considered valid. This security feature keeps tokens short-lived so
    | they have less time to be guessed. You may change this as needed.
    |
    | The throttle setting is the number of seconds a user must wait before
    | generating more password reset tokens. This prevents the user from
    | quickly generating a very large amount of password reset tokens.
    |
    */

    // Esta línea sirve para configurar el restablecimiento de contraseñas.
    'passwords' => [
        // Esta línea sirve para definir el broker "users".
        'users' => [
            // Esta línea sirve para usar el proveedor "users".
            'provider' => 'users',
            // Esta línea sirve para guardar los tokens en la tabla password_reset_tokens.
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            // Esta línea sirve para hacer que el token venza en 60 minutos.
            'expire' => 60,
            // Esta línea sirve para esperar 60 segundos entre solicitudes de token.
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    |
    | Here you may define the number of seconds before a password confirmation
    | window expires and users are asked to re-enter their password via the
    | confirmation screen. By default, the timeout lasts for three hours.
    |
    */

    // Esta línea sirve para pedir de nuevo la contraseña después de 3 horas (10800 segundos).
    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];
