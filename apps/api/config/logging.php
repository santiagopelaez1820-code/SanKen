<?php

// Esta línea sirve para importar el handler que descarta los logs.
use Monolog\Handler\NullHandler;
// Esta línea sirve para importar el handler que escribe en un stream.
use Monolog\Handler\StreamHandler;
// Esta línea sirve para importar el handler que envía por syslog UDP.
use Monolog\Handler\SyslogUdpHandler;
// Esta línea sirve para importar el procesador que reemplaza los placeholders del mensaje.
use Monolog\Processor\PsrLogMessageProcessor;

// Esta línea sirve para devolver el arreglo de configuración de los logs.
return [

    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that is utilized to write
    | messages to your logs. The value provided here should match one of
    | the channels present in the list of "channels" configured below.
    |
    */

    // Esta línea sirve para definir el canal por defecto (LOG_CHANNEL, "stack" por defecto).
    'default' => env('LOG_CHANNEL', 'stack'),

    /*
    |--------------------------------------------------------------------------
    | Deprecations Log Channel
    |--------------------------------------------------------------------------
    |
    | This option controls the log channel that should be used to log warnings
    | regarding deprecated PHP and library features. This allows you to get
    | your application ready for upcoming major versions of dependencies.
    |
    */

    // Esta línea sirve para configurar el log de funciones obsoletas.
    'deprecations' => [
        // Esta línea sirve para definir su canal ("null" por defecto, es decir, no se guardan).
        'channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),
        // Esta línea sirve para definir si se incluye la traza.
        'trace' => env('LOG_DEPRECATIONS_TRACE', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Laravel
    | utilizes the Monolog PHP logging library, which includes a variety
    | of powerful log handlers and formatters that you're free to use.
    |
    | Available drivers: "single", "daily", "slack", "syslog",
    |                    "errorlog", "monolog", "custom", "stack"
    |
    */

    // Esta línea sirve para definir los canales disponibles.
    'channels' => [

        // Esta línea sirve para configurar el canal "stack" (agrupa varios canales).
        'stack' => [
            // Esta línea sirve para usar el driver stack.
            'driver' => 'stack',
            // Esta línea sirve para tomar los canales de LOG_STACK separados por comas.
            'channels' => explode(',', (string) env('LOG_STACK', 'single')),
            // Esta línea sirve para evitar ignorar las excepciones de los canales.
            'ignore_exceptions' => false,
        ],

        // Esta línea sirve para configurar el canal "single" (un solo archivo).
        'single' => [
            // Esta línea sirve para usar el driver single.
            'driver' => 'single',
            // Esta línea sirve para escribir en storage/logs/laravel.log.
            'path' => storage_path('logs/laravel.log'),
            // Esta línea sirve para definir el nivel mínimo (debug por defecto).
            'level' => env('LOG_LEVEL', 'debug'),
            // Esta línea sirve para reemplazar los placeholders del mensaje.
            'replace_placeholders' => true,
        ],

        // Esta línea sirve para configurar el canal "daily" (un archivo por día).
        'daily' => [
            // Esta línea sirve para usar el driver daily.
            'driver' => 'daily',
            // Esta línea sirve para escribir en storage/logs/laravel.log.
            'path' => storage_path('logs/laravel.log'),
            // Esta línea sirve para definir el nivel mínimo.
            'level' => env('LOG_LEVEL', 'debug'),
            // Esta línea sirve para conservar 14 días por defecto.
            'days' => env('LOG_DAILY_DAYS', 14),
            // Esta línea sirve para reemplazar los placeholders del mensaje.
            'replace_placeholders' => true,
        ],

        // Esta línea sirve para configurar el canal de Slack.
        'slack' => [
            // Esta línea sirve para usar el driver slack.
            'driver' => 'slack',
            // Esta línea sirve para definir el webhook de Slack.
            'url' => env('LOG_SLACK_WEBHOOK_URL'),
            // Esta línea sirve para definir el nombre con el que se publica.
            'username' => env('LOG_SLACK_USERNAME', env('APP_NAME', 'Laravel')),
            // Esta línea sirve para definir el emoji.
            'emoji' => env('LOG_SLACK_EMOJI', ':boom:'),
            // Esta línea sirve para definir el nivel mínimo (critical por defecto).
            'level' => env('LOG_LEVEL', 'critical'),
            // Esta línea sirve para reemplazar los placeholders del mensaje.
            'replace_placeholders' => true,
        ],

        // Esta línea sirve para configurar Papertrail.
        'papertrail' => [
            // Esta línea sirve para usar el driver monolog.
            'driver' => 'monolog',
            // Esta línea sirve para definir el nivel mínimo.
            'level' => env('LOG_LEVEL', 'debug'),
            // Esta línea sirve para definir el handler (syslog UDP por defecto).
            'handler' => env('LOG_PAPERTRAIL_HANDLER', SyslogUdpHandler::class),
            // Esta línea sirve para definir los parámetros del handler.
            'handler_with' => [
                // Esta línea sirve para definir el host.
                'host' => env('PAPERTRAIL_URL'),
                // Esta línea sirve para definir el puerto.
                'port' => env('PAPERTRAIL_PORT'),
                // Esta línea sirve para armar la cadena de conexión TLS.
                'connectionString' => 'tls://'.env('PAPERTRAIL_URL').':'.env('PAPERTRAIL_PORT'),
            ],
            // Esta línea sirve para agregar el procesador de placeholders.
            'processors' => [PsrLogMessageProcessor::class],
        ],

        // Esta línea sirve para configurar el canal stderr.
        'stderr' => [
            // Esta línea sirve para usar el driver monolog.
            'driver' => 'monolog',
            // Esta línea sirve para definir el nivel mínimo.
            'level' => env('LOG_LEVEL', 'debug'),
            // Esta línea sirve para escribir con StreamHandler.
            'handler' => StreamHandler::class,
            // Esta línea sirve para definir los parámetros del handler.
            'handler_with' => [
                // Esta línea sirve para escribir en la salida de errores.
                'stream' => 'php://stderr',
            ],
            // Esta línea sirve para definir el formateador.
            'formatter' => env('LOG_STDERR_FORMATTER'),
            // Esta línea sirve para agregar el procesador de placeholders.
            'processors' => [PsrLogMessageProcessor::class],
        ],

        // Esta línea sirve para configurar syslog.
        'syslog' => [
            // Esta línea sirve para usar el driver syslog.
            'driver' => 'syslog',
            // Esta línea sirve para definir el nivel mínimo.
            'level' => env('LOG_LEVEL', 'debug'),
            // Esta línea sirve para definir la facility de syslog.
            'facility' => env('LOG_SYSLOG_FACILITY', LOG_USER),
            // Esta línea sirve para reemplazar los placeholders del mensaje.
            'replace_placeholders' => true,
        ],

        // Esta línea sirve para configurar errorlog.
        'errorlog' => [
            // Esta línea sirve para usar el driver errorlog.
            'driver' => 'errorlog',
            // Esta línea sirve para definir el nivel mínimo.
            'level' => env('LOG_LEVEL', 'debug'),
            // Esta línea sirve para reemplazar los placeholders del mensaje.
            'replace_placeholders' => true,
        ],

        // Esta línea sirve para configurar el canal "null" (descarta los logs).
        'null' => [
            // Esta línea sirve para usar el driver monolog.
            'driver' => 'monolog',
            // Esta línea sirve para usar el handler que descarta todo.
            'handler' => NullHandler::class,
        ],

        // Esta línea sirve para configurar el canal de emergencia.
        'emergency' => [
            // Esta línea sirve para escribir en storage/logs/laravel.log.
            'path' => storage_path('logs/laravel.log'),
        ],

    ],

];
