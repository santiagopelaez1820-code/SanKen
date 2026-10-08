<?php

// Esta línea sirve para importar el helper Str para manejar textos.
use Illuminate\Support\Str;

// Esta línea sirve para devolver el arreglo de configuración de la caché.
return [

    /*
    |--------------------------------------------------------------------------
    | Default Cache Store
    |--------------------------------------------------------------------------
    |
    | This option controls the default cache store that will be used by the
    | framework. This connection is utilized if another isn't explicitly
    | specified when running a cache operation inside the application.
    |
    */

    // Esta línea sirve para definir el almacén por defecto (CACHE_STORE, "database" por defecto).
    'default' => env('CACHE_STORE', 'database'),

    /*
    |--------------------------------------------------------------------------
    | Cache Stores
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the cache "stores" for your application as
    | well as their drivers. You may even define multiple stores for the
    | same cache driver to group types of items stored in your caches.
    |
    | Supported drivers: "array", "database", "file", "memcached",
    |                    "redis", "dynamodb", "octane",
    |                    "failover", "null"
    |
    */

    // Esta línea sirve para definir los almacenes disponibles.
    'stores' => [

        // Esta línea sirve para configurar el almacén en memoria.
        'array' => [
            // Esta línea sirve para usar el driver array.
            'driver' => 'array',
            // Esta línea sirve para guardar los valores sin serializar.
            'serialize' => false,
        ],

        // Esta línea sirve para configurar el almacén en base de datos.
        'database' => [
            // Esta línea sirve para usar el driver database.
            'driver' => 'database',
            // Esta línea sirve para definir la conexión de base de datos.
            'connection' => env('DB_CACHE_CONNECTION'),
            // Esta línea sirve para definir la tabla de caché.
            'table' => env('DB_CACHE_TABLE', 'cache'),
            // Esta línea sirve para definir la conexión de los bloqueos.
            'lock_connection' => env('DB_CACHE_LOCK_CONNECTION'),
            // Esta línea sirve para definir la tabla de los bloqueos.
            'lock_table' => env('DB_CACHE_LOCK_TABLE'),
        ],

        // Esta línea sirve para configurar el almacén en archivos.
        'file' => [
            // Esta línea sirve para usar el driver file.
            'driver' => 'file',
            // Esta línea sirve para definir la carpeta de la caché.
            'path' => storage_path('framework/cache/data'),
            // Esta línea sirve para definir la carpeta de los bloqueos.
            'lock_path' => storage_path('framework/cache/data'),
        ],

        // Esta línea sirve para configurar Memcached.
        'memcached' => [
            // Esta línea sirve para usar el driver memcached.
            'driver' => 'memcached',
            // Esta línea sirve para definir el id de conexión persistente.
            'persistent_id' => env('MEMCACHED_PERSISTENT_ID'),
            // Esta línea sirve para definir las credenciales SASL.
            'sasl' => [
                // Esta línea sirve para pasar el usuario.
                env('MEMCACHED_USERNAME'),
                // Esta línea sirve para pasar la contraseña.
                env('MEMCACHED_PASSWORD'),
            ],
            // Esta línea sirve para definir las opciones de Memcached.
            'options' => [
                // Memcached::OPT_CONNECT_TIMEOUT => 2000,
            ],
            // Esta línea sirve para definir los servidores.
            'servers' => [
                [
                    // Esta línea sirve para definir el host.
                    'host' => env('MEMCACHED_HOST', '127.0.0.1'),
                    // Esta línea sirve para definir el puerto.
                    'port' => env('MEMCACHED_PORT', 11211),
                    // Esta línea sirve para definir el peso del servidor.
                    'weight' => 100,
                ],
            ],
        ],

        // Esta línea sirve para configurar Redis.
        'redis' => [
            // Esta línea sirve para usar el driver redis.
            'driver' => 'redis',
            // Esta línea sirve para usar la conexión de Redis "cache".
            'connection' => env('REDIS_CACHE_CONNECTION', 'cache'),
            // Esta línea sirve para usar la conexión "default" para los bloqueos.
            'lock_connection' => env('REDIS_CACHE_LOCK_CONNECTION', 'default'),
        ],

        // Esta línea sirve para configurar DynamoDB.
        'dynamodb' => [
            // Esta línea sirve para usar el driver dynamodb.
            'driver' => 'dynamodb',
            // Esta línea sirve para definir la clave de AWS.
            'key' => env('AWS_ACCESS_KEY_ID'),
            // Esta línea sirve para definir el secreto de AWS.
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            // Esta línea sirve para definir la región.
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            // Esta línea sirve para definir la tabla.
            'table' => env('DYNAMODB_CACHE_TABLE', 'cache'),
            // Esta línea sirve para definir el endpoint.
            'endpoint' => env('DYNAMODB_ENDPOINT'),
        ],

        // Esta línea sirve para configurar Octane.
        'octane' => [
            // Esta línea sirve para usar el driver octane.
            'driver' => 'octane',
        ],

        // Esta línea sirve para configurar el almacén con respaldo.
        'failover' => [
            // Esta línea sirve para usar el driver failover.
            'driver' => 'failover',
            // Esta línea sirve para definir los almacenes en orden de preferencia.
            'stores' => [
                // Esta línea sirve para usar primero la base de datos.
                'database',
                // Esta línea sirve para usar la memoria si falla.
                'array',
            ],
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Key Prefix
    |--------------------------------------------------------------------------
    |
    | When utilizing the APC, database, memcached, Redis, and DynamoDB cache
    | stores, there might be other applications using the same cache. For
    | that reason, you may prefix every cache key to avoid collisions.
    |
    */

    // Esta línea sirve para definir el prefijo de las claves de caché.
    'prefix' => env('CACHE_PREFIX', Str::slug((string) env('APP_NAME', 'laravel')).'-cache-'),

];
