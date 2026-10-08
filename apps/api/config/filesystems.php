<?php

// Esta línea sirve para devolver el arreglo de configuración de los discos.
return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application for file storage.
    |
    */

    // Esta línea sirve para definir el disco por defecto (FILESYSTEM_DISK, "local" por defecto).
    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Below you may configure as many filesystem disks as necessary, and you
    | may even configure multiple disks for the same driver. Examples for
    | most supported storage drivers are configured here for reference.
    |
    | Supported drivers: "local", "ftp", "sftp", "s3"
    |
    */

    // Esta línea sirve para definir los discos disponibles.
    'disks' => [

        // Esta línea sirve para configurar el disco privado "local".
        'local' => [
            // Esta línea sirve para usar el driver local.
            'driver' => 'local',
            // Esta línea sirve para guardar en storage/app/private.
            'root' => storage_path('app/private'),
            // Esta línea sirve para permitir servir los archivos con URLs temporales.
            'serve' => true,
            // Esta línea sirve para evitar lanzar excepciones al fallar.
            'throw' => false,
            // Esta línea sirve para evitar reportar los errores.
            'report' => false,
        ],

        // Esta línea sirve para configurar el disco "public".
        'public' => [
            // Esta línea sirve para usar el driver local.
            'driver' => 'local',
            // Esta línea sirve para guardar en storage/app/public.
            'root' => storage_path('app/public'),
            // Esta línea sirve para armar la URL pública con APP_URL y /storage.
            'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/storage',
            // Esta línea sirve para hacer públicos los archivos.
            'visibility' => 'public',
            // Esta línea sirve para evitar lanzar excepciones al fallar.
            'throw' => false,
            // Esta línea sirve para evitar reportar los errores.
            'report' => false,
        ],

        // Esta línea sirve para configurar Amazon S3.
        's3' => [
            // Esta línea sirve para usar el driver s3.
            'driver' => 's3',
            // Esta línea sirve para definir la clave de AWS.
            'key' => env('AWS_ACCESS_KEY_ID'),
            // Esta línea sirve para definir el secreto de AWS.
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            // Esta línea sirve para definir la región.
            'region' => env('AWS_DEFAULT_REGION'),
            // Esta línea sirve para definir el bucket.
            'bucket' => env('AWS_BUCKET'),
            // Esta línea sirve para definir la URL.
            'url' => env('AWS_URL'),
            // Esta línea sirve para definir el endpoint.
            'endpoint' => env('AWS_ENDPOINT'),
            // Esta línea sirve para definir si se usan rutas de estilo path.
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            // Esta línea sirve para evitar lanzar excepciones al fallar.
            'throw' => false,
            // Esta línea sirve para evitar reportar los errores.
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Here you may configure the symbolic links that will be created when the
    | `storage:link` Artisan command is executed. The array keys should be
    | the locations of the links and the values should be their targets.
    |
    */

    // Esta línea sirve para definir los enlaces simbólicos.
    'links' => [
        // Esta línea sirve para enlazar public/storage con storage/app/public.
        public_path('storage') => storage_path('app/public'),
    ],

];
