<?php

// Esta línea sirve para devolver el arreglo de configuración del broadcasting (tiempo real).
return [

    /*
    |--------------------------------------------------------------------------
    | Default Broadcaster
    |--------------------------------------------------------------------------
    |
    | This option controls the default broadcaster that will be used by the
    | framework when an event needs to be broadcast. You may set this to
    | any of the connections defined in the "connections" array below.
    |
    | Supported: "reverb", "pusher", "ably", "redis", "log", "null"
    |
    */

    // Esta línea sirve para definir la conexión por defecto (BROADCAST_CONNECTION, "null" por defecto).
    'default' => env('BROADCAST_CONNECTION', 'null'),

    /*
    |--------------------------------------------------------------------------
    | Broadcast Connections
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the broadcast connections that will be used
    | to broadcast events to other systems or over WebSockets. Samples of
    | each available type of connection are provided inside this array.
    |
    */

    // Esta línea sirve para definir las conexiones disponibles.
    'connections' => [

        // Esta línea sirve para configurar Reverb (WebSockets propios de Laravel).
        'reverb' => [
            // Esta línea sirve para usar el driver reverb.
            'driver' => 'reverb',
            // Esta línea sirve para definir la clave de la app.
            'key' => env('REVERB_APP_KEY'),
            // Esta línea sirve para definir el secreto de la app.
            'secret' => env('REVERB_APP_SECRET'),
            // Esta línea sirve para definir el id de la app.
            'app_id' => env('REVERB_APP_ID'),
            // Esta línea sirve para definir las opciones de conexión.
            'options' => [
                // Esta línea sirve para definir el host.
                'host' => env('REVERB_HOST'),
                // Esta línea sirve para definir el puerto (443 por defecto).
                'port' => env('REVERB_PORT', 443),
                // Esta línea sirve para definir el esquema (https por defecto).
                'scheme' => env('REVERB_SCHEME', 'https'),
                // Esta línea sirve para usar TLS si el esquema es https.
                'useTLS' => env('REVERB_SCHEME', 'https') === 'https',
            ],
            // Esta línea sirve para definir las opciones del cliente HTTP.
            'client_options' => [
                // Guzzle client options: https://docs.guzzlephp.org/en/stable/request-options.html
            ],
        ],

        // Esta línea sirve para configurar Pusher.
        'pusher' => [
            // Esta línea sirve para usar el driver pusher.
            'driver' => 'pusher',
            // Esta línea sirve para definir la clave de la app.
            'key' => env('PUSHER_APP_KEY'),
            // Esta línea sirve para definir el secreto de la app.
            'secret' => env('PUSHER_APP_SECRET'),
            // Esta línea sirve para definir el id de la app.
            'app_id' => env('PUSHER_APP_ID'),
            // Esta línea sirve para definir las opciones de conexión.
            'options' => [
                // Esta línea sirve para definir el cluster.
                'cluster' => env('PUSHER_APP_CLUSTER'),
                // Esta línea sirve para definir el host (o armarlo con el cluster).
                'host' => env('PUSHER_HOST') ?: 'api-'.env('PUSHER_APP_CLUSTER', 'mt1').'.pusher.com',
                // Esta línea sirve para definir el puerto (443 por defecto).
                'port' => env('PUSHER_PORT', 443),
                // Esta línea sirve para definir el esquema (https por defecto).
                'scheme' => env('PUSHER_SCHEME', 'https'),
                // Esta línea sirve para cifrar la conexión.
                'encrypted' => true,
                // Esta línea sirve para usar TLS si el esquema es https.
                'useTLS' => env('PUSHER_SCHEME', 'https') === 'https',
            ],
            // Esta línea sirve para definir las opciones del cliente HTTP.
            'client_options' => [
                // Guzzle client options: https://docs.guzzlephp.org/en/stable/request-options.html
            ],
        ],

        // Esta línea sirve para configurar Ably.
        'ably' => [
            // Esta línea sirve para usar el driver ably.
            'driver' => 'ably',
            // Esta línea sirve para definir la clave de Ably.
            'key' => env('ABLY_KEY'),
        ],

        // Esta línea sirve para configurar la conexión "log" (escribe los eventos en el log).
        'log' => [
            // Esta línea sirve para usar el driver log.
            'driver' => 'log',
        ],

        // Esta línea sirve para configurar la conexión "null" (no envía nada).
        'null' => [
            // Esta línea sirve para usar el driver null.
            'driver' => 'null',
        ],

    ],

];
