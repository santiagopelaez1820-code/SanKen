<?php

// Esta línea sirve para devolver el arreglo de configuración de CORS.
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

    // broadcasting/auth: agregado en Sprint 11 (chat) — el navegador nunca
    // había necesitado autorizar un canal privado de Reverb hasta ahora, así
    // que esta ruta quedó afuera de `paths` desde que se instaló Reverb en
    // Sprint 10 sin que nada lo notara (el POST lleva un header Authorization
    // custom, que dispara preflight — sin esto, cualquier canal privado
    // queda roto en el navegador, no solo el de chat).
    // Esta línea sirve para aplicar CORS a la API, la cookie CSRF y la autorización de canales.
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'broadcasting/auth'],

    // Esta línea sirve para permitir todos los métodos HTTP.
    'allowed_methods' => ['*'],

    // localhost:5173 = web SPA (stateful, necesita credentials); localhost:8081 =
    // vista web de Expo (apps/mobile) usada para pruebas manuales en navegador.
    // Esta línea sirve para definir los orígenes permitidos.
    'allowed_origins' => [
        // Esta línea sirve para permitir la URL del frontend (localhost:5173 por defecto).
        env('FRONTEND_URL', 'http://localhost:5173'),
        // Esta línea sirve para permitir la vista web de Expo.
        'http://localhost:8081',
        // Dominio ngrok reservado (estable, no cambia entre reinicios) usado
        // para que la APK y la web funcionen desde cualquier red, no solo la
        // LAN de esta PC — ver scripts/start-sanken-wsl.sh.
        // Esta línea sirve para permitir el dominio de ngrok reservado.
        'https://wielder-freeware-starship.ngrok-free.dev',
    ],

    // Acceso desde la LAN (ver scripts/start-sanken.ps1 y AUTOSTART.md): la IP
    // que asigna el router puede cambiar, así que en vez de hardcodear una IP
    // se permite cualquier host de rango privado típico en los puertos que
    // usan la web (5173) y la vista web de Expo (8081).
    // El túnel de Cloudflare (scripts/start-sanken.ps1) sirve la web con una
    // URL https://algo.trycloudflare.com nueva cada vez que arranca — no se
    // puede hardcodear, así que se permite el subdominio genérico.
    // Esta línea sirve para definir patrones de orígenes permitidos.
    'allowed_origins_patterns' => [
        // Esta línea sirve para permitir IPs de la red local 192.168.x.x en los puertos 5173 y 8081.
        '#^http://192\.168\.\d{1,3}\.\d{1,3}:(5173|8081)$#',
        // Esta línea sirve para permitir IPs de la red local 10.x.x.x en los puertos 5173 y 8081.
        '#^http://10\.\d{1,3}\.\d{1,3}\.\d{1,3}:(5173|8081)$#',
        // Esta línea sirve para permitir cualquier subdominio de trycloudflare.com.
        '#^https://[a-z0-9-]+\.trycloudflare\.com$#',
    ],

    // Esta línea sirve para permitir todos los encabezados.
    'allowed_headers' => ['*'],

    // Esta línea sirve para evitar exponer encabezados extra.
    'exposed_headers' => [],

    // Esta línea sirve para evitar guardar en caché la respuesta del preflight.
    'max_age' => 0,

    // Requerido por el flujo de Sanctum stateful (cookies de sesión) que usa
    // la SPA web — ver SANCTUM_STATEFUL_DOMAINS y docs/03-api.md §1.
    // Esta línea sirve para permitir enviar cookies y credenciales.
    'supports_credentials' => true,

];
