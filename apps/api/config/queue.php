<?php

// Esta línea sirve para devolver el arreglo de configuración de las colas.
return [

    /*
    |--------------------------------------------------------------------------
    | Default Queue Connection Name
    |--------------------------------------------------------------------------
    |
    | Laravel's queue supports a variety of backends via a single, unified
    | API, giving you convenient access to each backend using identical
    | syntax for each. The default queue connection is defined below.
    |
    */

    // Esta línea sirve para definir la conexión por defecto (QUEUE_CONNECTION, "database" por defecto).
    'default' => env('QUEUE_CONNECTION', 'database'),

    /*
    |--------------------------------------------------------------------------
    | Queue Connections
    |--------------------------------------------------------------------------
    |
    | Here you may configure the connection options for every queue backend
    | used by your application. An example configuration is provided for
    | each backend supported by Laravel. You're also free to add more.
    |
    | Drivers: "sync", "database", "beanstalkd", "sqs", "redis",
    |          "deferred", "background", "failover", "null"
    |
    */

    // Esta línea sirve para definir las conexiones disponibles.
    'connections' => [

        // Esta línea sirve para configurar la cola sincrónica (ejecuta los trabajos en el momento).
        'sync' => [
            // Esta línea sirve para usar el driver sync.
            'driver' => 'sync',
        ],

        // Esta línea sirve para configurar la cola en base de datos.
        'database' => [
            // Esta línea sirve para usar el driver database.
            'driver' => 'database',
            // Esta línea sirve para definir la conexión de base de datos.
            'connection' => env('DB_QUEUE_CONNECTION'),
            // Esta línea sirve para definir la tabla de trabajos.
            'table' => env('DB_QUEUE_TABLE', 'jobs'),
            // Esta línea sirve para definir el nombre de la cola.
            'queue' => env('DB_QUEUE', 'default'),
            // Esta línea sirve para reintentar un trabajo si tarda más de 90 segundos.
            'retry_after' => (int) env('DB_QUEUE_RETRY_AFTER', 90),
            // Esta línea sirve para despachar los trabajos sin esperar a que termine la transacción.
            'after_commit' => false,
        ],

        // Esta línea sirve para configurar Beanstalkd.
        'beanstalkd' => [
            // Esta línea sirve para usar el driver beanstalkd.
            'driver' => 'beanstalkd',
            // Esta línea sirve para definir el host.
            'host' => env('BEANSTALKD_QUEUE_HOST', 'localhost'),
            // Esta línea sirve para definir el nombre de la cola.
            'queue' => env('BEANSTALKD_QUEUE', 'default'),
            // Esta línea sirve para reintentar un trabajo si tarda más de 90 segundos.
            'retry_after' => (int) env('BEANSTALKD_QUEUE_RETRY_AFTER', 90),
            // Esta línea sirve para evitar esperar por trabajos nuevos.
            'block_for' => 0,
            // Esta línea sirve para despachar los trabajos sin esperar a que termine la transacción.
            'after_commit' => false,
        ],

        // Esta línea sirve para configurar Amazon SQS.
        'sqs' => [
            // Esta línea sirve para usar el driver sqs.
            'driver' => 'sqs',
            // Esta línea sirve para definir la clave de AWS.
            'key' => env('AWS_ACCESS_KEY_ID'),
            // Esta línea sirve para definir el secreto de AWS.
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            // Esta línea sirve para definir el prefijo de la URL de la cola.
            'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
            // Esta línea sirve para definir el nombre de la cola.
            'queue' => env('SQS_QUEUE', 'default'),
            // Esta línea sirve para definir el sufijo.
            'suffix' => env('SQS_SUFFIX'),
            // Esta línea sirve para definir la región.
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            // Esta línea sirve para despachar los trabajos sin esperar a que termine la transacción.
            'after_commit' => false,
        ],

        // Esta línea sirve para configurar Redis.
        'redis' => [
            // Esta línea sirve para usar el driver redis.
            'driver' => 'redis',
            // Esta línea sirve para usar la conexión "default" de Redis.
            'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
            // Esta línea sirve para definir el nombre de la cola.
            'queue' => env('REDIS_QUEUE', 'default'),
            // Esta línea sirve para reintentar un trabajo si tarda más de 90 segundos.
            'retry_after' => (int) env('REDIS_QUEUE_RETRY_AFTER', 90),
            // Esta línea sirve para dejar sin tiempo de espera por trabajos nuevos.
            'block_for' => null,
            // Esta línea sirve para despachar los trabajos sin esperar a que termine la transacción.
            'after_commit' => false,
        ],

        // Esta línea sirve para configurar la cola diferida (corre después de enviar la respuesta).
        'deferred' => [
            // Esta línea sirve para usar el driver deferred.
            'driver' => 'deferred',
        ],

        // Esta línea sirve para configurar la cola en segundo plano.
        'background' => [
            // Esta línea sirve para usar el driver background.
            'driver' => 'background',
        ],

        // Esta línea sirve para configurar la cola con respaldo.
        'failover' => [
            // Esta línea sirve para usar el driver failover.
            'driver' => 'failover',
            // Esta línea sirve para definir las conexiones en orden de preferencia.
            'connections' => [
                // Esta línea sirve para usar primero la base de datos.
                'database',
                // Esta línea sirve para usar la cola diferida si falla.
                'deferred',
            ],
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Job Batching
    |--------------------------------------------------------------------------
    |
    | The following options configure the database and table that store job
    | batching information. These options can be updated to any database
    | connection and table which has been defined by your application.
    |
    */

    // Esta línea sirve para configurar los lotes de trabajos.
    'batching' => [
        // Esta línea sirve para definir la base de datos.
        'database' => env('DB_CONNECTION', 'sqlite'),
        // Esta línea sirve para usar la tabla job_batches.
        'table' => 'job_batches',
    ],

    /*
    |--------------------------------------------------------------------------
    | Failed Queue Jobs
    |--------------------------------------------------------------------------
    |
    | These options configure the behavior of failed queue job logging so you
    | can control how and where failed jobs are stored. Laravel ships with
    | support for storing failed jobs in a simple file or in a database.
    |
    | Supported drivers: "database-uuids", "dynamodb", "file", "null"
    |
    */

    // Esta línea sirve para configurar los trabajos fallidos.
    'failed' => [
        // Esta línea sirve para definir el driver (database-uuids por defecto).
        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        // Esta línea sirve para definir la base de datos.
        'database' => env('DB_CONNECTION', 'sqlite'),
        // Esta línea sirve para usar la tabla failed_jobs.
        'table' => 'failed_jobs',
    ],

];
