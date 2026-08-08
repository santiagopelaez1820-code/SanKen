<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // localhost:5173 = web SPA (stateful, necesita credentials); localhost:8081 =
    // vista web de Expo (apps/mobile) usada para pruebas manuales en navegador.
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
        'http://localhost:8081',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Requerido por el flujo de Sanctum stateful (cookies de sesión) que usa
    // la SPA web — ver SANCTUM_STATEFUL_DOMAINS y docs/03-api.md §1.
    'supports_credentials' => true,

];
