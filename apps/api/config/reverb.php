<?php

// Esta línea sirve para devolver el arreglo de configuración de Reverb.
return [

    /*
    |--------------------------------------------------------------------------
    | Default Reverb Server
    |--------------------------------------------------------------------------
    |
    | This option controls the default server used by Reverb to handle
    | incoming messages as well as broadcasting message to all your
    | connected clients. At this time only "reverb" is supported.
    |
    */

    // Esta línea sirve para definir el servidor por defecto.
    'default' => env('REVERB_SERVER', 'reverb'),

    /*
    |--------------------------------------------------------------------------
    | Reverb Servers
    |--------------------------------------------------------------------------
    |
    | Here you may define details for each of the supported Reverb servers.
    | Each server has its own configuration options that are defined in
    | the array below. You should ensure all the options are present.
    |
    */

    // Esta línea sirve para definir los servidores.
    'servers' => [

        // Esta línea sirve para configurar el servidor "reverb".
        'reverb' => [
            // Esta línea sirve para escuchar en todas las interfaces (0.0.0.0 por defecto).
            'host' => env('REVERB_SERVER_HOST', '0.0.0.0'),
            // Esta línea sirve para escuchar en el puerto 8080 por defecto.
            'port' => env('REVERB_SERVER_PORT', 8080),
            // Esta línea sirve para definir la ruta base.
            'path' => env('REVERB_SERVER_PATH', ''),
            // Esta línea sirve para definir el nombre de host público.
            'hostname' => env('REVERB_HOST'),
            // Esta línea sirve para definir las opciones del servidor.
            'options' => [
                // Esta línea sirve para dejar las opciones de TLS vacías.
                'tls' => [],
            ],
            // Esta línea sirve para definir el tamaño máximo de una petición.
            'max_request_size' => env('REVERB_MAX_REQUEST_SIZE', 10_000),
            // Esta línea sirve para configurar el escalado horizontal.
            'scaling' => [
                // Esta línea sirve para activarlo o no (desactivado por defecto).
                'enabled' => env('REVERB_SCALING_ENABLED', false),
                // Esta línea sirve para definir el canal de Redis para el escalado.
                'channel' => env('REVERB_SCALING_CHANNEL', 'reverb'),
                // Esta línea sirve para definir el servidor de Redis.
                'server' => [
                    // Esta línea sirve para definir la URL.
                    'url' => env('REDIS_URL'),
                    // Esta línea sirve para definir el host.
                    'host' => env('REDIS_HOST', '127.0.0.1'),
                    // Esta línea sirve para definir el puerto.
                    'port' => env('REDIS_PORT', '6379'),
                    // Esta línea sirve para definir el usuario.
                    'username' => env('REDIS_USERNAME'),
                    // Esta línea sirve para definir la contraseña.
                    'password' => env('REDIS_PASSWORD'),
                    // Esta línea sirve para definir la base de datos.
                    'database' => env('REDIS_DB', '0'),
                    // Esta línea sirve para definir el tiempo de espera.
                    'timeout' => env('REDIS_TIMEOUT', 60),
                ],
            ],
            // Esta línea sirve para definir cada cuánto se envían datos a Pulse.
            'pulse_ingest_interval' => env('REVERB_PULSE_INGEST_INTERVAL', 15),
            // Esta línea sirve para definir cada cuánto se envían datos a Telescope.
            'telescope_ingest_interval' => env('REVERB_TELESCOPE_INGEST_INTERVAL', 15),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Reverb Applications
    |--------------------------------------------------------------------------
    |
    | Here you may define how Reverb applications are managed. If you choose
    | to use the "config" provider, you may define an array of apps which
    | your server will support, including their connection credentials.
    |
    */

    // Esta línea sirve para configurar las aplicaciones.
    'apps' => [

        // Esta línea sirve para leer las aplicaciones desde esta configuración.
        'provider' => 'config',

        // Esta línea sirve para definir la lista de aplicaciones.
        'apps' => [
            [
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
                // Esta línea sirve para permitir conexiones desde cualquier origen.
                'allowed_origins' => ['*'],
                // Esta línea sirve para definir cada cuánto se hace ping a los clientes.
                'ping_interval' => env('REVERB_APP_PING_INTERVAL', 60),
                // Esta línea sirve para cerrar la conexión tras 30 segundos sin actividad.
                'activity_timeout' => env('REVERB_APP_ACTIVITY_TIMEOUT', 30),
                // Esta línea sirve para definir el máximo de conexiones.
                'max_connections' => env('REVERB_APP_MAX_CONNECTIONS'),
                // Esta línea sirve para definir el tamaño máximo de un mensaje.
                'max_message_size' => env('REVERB_APP_MAX_MESSAGE_SIZE', 10_000),
                // Esta línea sirve para aceptar eventos de cliente solo de los miembros.
                'accept_client_events_from' => env('REVERB_APP_ACCEPT_CLIENT_EVENTS_FROM', 'members'),
                // Esta línea sirve para configurar el límite de mensajes.
                'rate_limiting' => [
                    // Esta línea sirve para activarlo o no (desactivado por defecto).
                    'enabled' => env('REVERB_APP_RATE_LIMITING_ENABLED', false),
                    // Esta línea sirve para definir el máximo de intentos.
                    'max_attempts' => env('REVERB_APP_RATE_LIMIT_MAX_ATTEMPTS', 60),
                    // Esta línea sirve para definir la ventana de tiempo en segundos.
                    'decay_seconds' => env('REVERB_APP_RATE_LIMIT_DECAY_SECONDS', 60),
                    // Esta línea sirve para definir si se cierra la conexión al superar el límite.
                    'terminate_on_limit' => env('REVERB_APP_RATE_LIMIT_TERMINATE', false),
                ],
            ],
        ],

    ],

];
