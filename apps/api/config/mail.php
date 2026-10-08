<?php

// Esta línea sirve para devolver el arreglo de configuración del correo.
return [

    /*
    |--------------------------------------------------------------------------
    | Default Mailer
    |--------------------------------------------------------------------------
    |
    | This option controls the default mailer that is used to send all email
    | messages unless another mailer is explicitly specified when sending
    | the message. All additional mailers can be configured within the
    | "mailers" array. Examples of each type of mailer are provided.
    |
    */

    // Esta línea sirve para definir el mailer por defecto (MAIL_MAILER, "log" por defecto).
    'default' => env('MAIL_MAILER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | Mailer Configurations
    |--------------------------------------------------------------------------
    |
    | Here you may configure all of the mailers used by your application plus
    | their respective settings. Several examples have been configured for
    | you and you are free to add your own as your application requires.
    |
    | Laravel supports a variety of mail "transport" drivers that can be used
    | when delivering an email. You may specify which one you're using for
    | your mailers below. You may also add additional mailers if needed.
    |
    | Supported: "smtp", "sendmail", "mailgun", "ses", "ses-v2",
    |            "postmark", "resend", "log", "array",
    |            "failover", "roundrobin"
    |
    */

    // Esta línea sirve para definir los mailers disponibles.
    'mailers' => [

        // Esta línea sirve para configurar SMTP.
        'smtp' => [
            // Esta línea sirve para usar el transporte smtp.
            'transport' => 'smtp',
            // Esta línea sirve para definir el esquema (smtp o smtps).
            'scheme' => env('MAIL_SCHEME'),
            // Esta línea sirve para definir la URL de conexión.
            'url' => env('MAIL_URL'),
            // Esta línea sirve para definir el host.
            'host' => env('MAIL_HOST', '127.0.0.1'),
            // Esta línea sirve para definir el puerto.
            'port' => env('MAIL_PORT', 2525),
            // Esta línea sirve para definir el usuario.
            'username' => env('MAIL_USERNAME'),
            // Esta línea sirve para definir la contraseña.
            'password' => env('MAIL_PASSWORD'),
            // Esta línea sirve para dejar el tiempo de espera por defecto.
            'timeout' => null,
            // Esta línea sirve para definir el dominio con el que se presenta el servidor (EHLO).
            'local_domain' => env('MAIL_EHLO_DOMAIN', parse_url((string) env('APP_URL', 'http://localhost'), PHP_URL_HOST)),
        ],

        // Esta línea sirve para configurar Amazon SES.
        'ses' => [
            // Esta línea sirve para usar el transporte ses.
            'transport' => 'ses',
        ],

        // Esta línea sirve para configurar Postmark.
        'postmark' => [
            // Esta línea sirve para usar el transporte postmark.
            'transport' => 'postmark',
            // 'message_stream_id' => env('POSTMARK_MESSAGE_STREAM_ID'),
            // 'client' => [
            //     'timeout' => 5,
            // ],
        ],

        // Esta línea sirve para configurar Resend.
        'resend' => [
            // Esta línea sirve para usar el transporte resend.
            'transport' => 'resend',
        ],

        // Esta línea sirve para configurar sendmail.
        'sendmail' => [
            // Esta línea sirve para usar el transporte sendmail.
            'transport' => 'sendmail',
            // Esta línea sirve para definir la ruta del programa sendmail.
            'path' => env('MAIL_SENDMAIL_PATH', '/usr/sbin/sendmail -bs -i'),
        ],

        // Esta línea sirve para configurar el mailer "log" (escribe los correos en el log).
        'log' => [
            // Esta línea sirve para usar el transporte log.
            'transport' => 'log',
            // Esta línea sirve para definir el canal de log.
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        // Esta línea sirve para configurar el mailer "array" (guarda los correos en memoria).
        'array' => [
            // Esta línea sirve para usar el transporte array.
            'transport' => 'array',
        ],

        // Esta línea sirve para configurar el mailer con respaldo.
        'failover' => [
            // Esta línea sirve para usar el transporte failover.
            'transport' => 'failover',
            // Esta línea sirve para definir los mailers en orden de preferencia.
            'mailers' => [
                // Esta línea sirve para usar primero SMTP.
                'smtp',
                // Esta línea sirve para usar el log si SMTP falla.
                'log',
            ],
            // Esta línea sirve para esperar 60 segundos antes de reintentar.
            'retry_after' => 60,
        ],

        // Esta línea sirve para configurar el mailer que reparte los envíos.
        'roundrobin' => [
            // Esta línea sirve para usar el transporte roundrobin.
            'transport' => 'roundrobin',
            // Esta línea sirve para definir los mailers que se alternan.
            'mailers' => [
                // Esta línea sirve para usar SES.
                'ses',
                // Esta línea sirve para usar Postmark.
                'postmark',
            ],
            // Esta línea sirve para esperar 60 segundos antes de reintentar.
            'retry_after' => 60,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Global "From" Address
    |--------------------------------------------------------------------------
    |
    | You may wish for all emails sent by your application to be sent from
    | the same address. Here you may specify a name and address that is
    | used globally for all emails that are sent by your application.
    |
    */

    // Esta línea sirve para definir el remitente global.
    'from' => [
        // Esta línea sirve para definir el correo del remitente.
        'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        // Esta línea sirve para definir el nombre del remitente.
        'name' => env('MAIL_FROM_NAME', env('APP_NAME', 'Laravel')),
    ],

];
