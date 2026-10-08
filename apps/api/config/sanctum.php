<?php

// Esta línea sirve para importar el middleware que cifra las cookies.
use Illuminate\Cookie\Middleware\EncryptCookies;
// Esta línea sirve para importar el middleware que valida el token CSRF.
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
// Esta línea sirve para importar el middleware de Sanctum que autentica la sesión.
use Laravel\Sanctum\Http\Middleware\AuthenticateSession;
// Esta línea sirve para importar la clase Sanctum.
use Laravel\Sanctum\Sanctum;

// Esta línea sirve para devolver el arreglo de configuración de Sanctum.
return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains
    |--------------------------------------------------------------------------
    |
    | Requests from the following domains / hosts will receive stateful API
    | authentication cookies. Typically, these should include your local
    | and production domains which access your API via a frontend SPA.
    |
    */

    // Esta línea sirve para definir los dominios que usan autenticación por cookies (SANCTUM_STATEFUL_DOMAINS).
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        // Esta línea sirve para armar el valor por defecto uniendo dos textos.
        '%s%s',
        // Esta línea sirve para incluir localhost y 127.0.0.1 con sus puertos comunes.
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        // Esta línea sirve para incluir la URL de la propia app con su puerto.
        Sanctum::currentApplicationUrlWithPort(),
        // Sanctum::currentRequestHost(),
    ))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | This array contains the authentication guards that will be checked when
    | Sanctum is trying to authenticate a request. If none of these guards
    | are able to authenticate the request, Sanctum will use the bearer
    | token that's present on an incoming request for authentication.
    |
    */

    // Esta línea sirve para usar el guard "web" para las peticiones con cookies.
    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | This value controls the number of minutes until an issued token will be
    | considered expired. This will override any values set in the token's
    | "expires_at" attribute, but first-party sessions are not affected.
    |
    */

    // Esta línea sirve para hacer que los tokens venzan a los 30 días (43200 minutos).
    'expiration' => 43200,

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Sanctum can prefix new tokens in order to take advantage of numerous
    | security scanning initiatives maintained by open source platforms
    | that notify developers if they commit tokens into repositories.
    |
    | See: https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning
    |
    */

    // Esta línea sirve para definir el prefijo de los tokens.
    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    |
    | When authenticating your first-party SPA with Sanctum you may need to
    | customize some of the middleware Sanctum uses while processing the
    | request. You may change the middleware listed below as required.
    |
    */

    // Esta línea sirve para definir los middleware que usa Sanctum.
    'middleware' => [
        // Esta línea sirve para usar el middleware que autentica la sesión.
        'authenticate_session' => AuthenticateSession::class,
        // Esta línea sirve para usar el middleware que cifra las cookies.
        'encrypt_cookies' => EncryptCookies::class,
        // Esta línea sirve para usar el middleware que valida el token CSRF.
        'validate_csrf_token' => ValidateCsrfToken::class,
    ],

];
