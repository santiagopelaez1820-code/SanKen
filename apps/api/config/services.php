<?php

// Esta línea sirve para devolver el arreglo de credenciales de servicios externos.
return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    // Esta línea sirve para configurar Postmark.
    'postmark' => [
        // Esta línea sirve para definir la API key de Postmark.
        'key' => env('POSTMARK_API_KEY'),
    ],

    // Esta línea sirve para configurar Resend.
    'resend' => [
        // Esta línea sirve para definir la API key de Resend.
        'key' => env('RESEND_API_KEY'),
    ],

    // Esta línea sirve para configurar Amazon SES.
    'ses' => [
        // Esta línea sirve para definir la clave de AWS.
        'key' => env('AWS_ACCESS_KEY_ID'),
        // Esta línea sirve para definir el secreto de AWS.
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        // Esta línea sirve para definir la región.
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    // Esta línea sirve para configurar Slack.
    'slack' => [
        // Esta línea sirve para configurar las notificaciones de Slack.
        'notifications' => [
            // Esta línea sirve para definir el token del bot.
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            // Esta línea sirve para definir el canal por defecto.
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /*
    | Login social (Google/Facebook vía Firebase Authentication). El backend
    | nunca ve la contraseña del proveedor — solo verifica el Firebase ID
    | Token con el Admin SDK usando esta service account. Sin
    | FIREBASE_CREDENTIALS configurado, FirebaseTokenVerifier falla cerrado
    | (ver App\Infrastructure\Firebase\FirebaseTokenVerifier).
    */
    // Esta línea sirve para configurar Firebase (login social).
    'firebase' => [
        // Esta línea sirve para definir el id del proyecto de Firebase.
        'project_id' => env('FIREBASE_PROJECT_ID'),
        // Esta línea sirve para definir las credenciales de la cuenta de servicio.
        'credentials' => env('FIREBASE_CREDENTIALS'),
    ],

    // Multimedia subida por usuarios/admins. El API secret solo vive acá
    // (backend) — nunca en apps/mobile ni apps/web. Ver docs/CLOUDINARY.md.
    // Esta línea sirve para configurar Cloudinary (archivos multimedia).
    'cloudinary' => [
        // 'cloudinary' | 'local' (disco public de Laravel). Por defecto
        // Cloudinary: toda subida va ahí siempre que haya credenciales; sin
        // ellas (dev sin configurar) cae al disco local.
        // Esta línea sirve para definir dónde se guardan los archivos: cloudinary o local.
        'storage' => env('MEDIA_STORAGE', 'cloudinary'),
        // Esta línea sirve para definir el nombre de la cuenta.
        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
        // Esta línea sirve para definir la API key.
        'api_key' => env('CLOUDINARY_API_KEY'),
        // Esta línea sirve para definir el API secret.
        'api_secret' => env('CLOUDINARY_API_SECRET'),
        // Carpeta raíz de todos los public_id (sanken/users/avatars/user_1…).
        // Esta línea sirve para definir la carpeta raíz en Cloudinary.
        'folder' => env('CLOUDINARY_FOLDER', 'sanken'),
        // Registro de la migración (media:cloudinary): qué se subió, con qué
        // hash y a qué public_id. Fuera de git (storage/ está ignorado).
        // Esta línea sirve para definir dónde se guarda el registro de la migración a Cloudinary.
        'map_path' => env('CLOUDINARY_MAP_PATH', storage_path('app/private/cloudinary/media-map.json')),
    ],

];
