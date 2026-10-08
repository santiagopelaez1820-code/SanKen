<?php

// Esta línea sirve para importar el helper Str para manejar textos.
use Illuminate\Support\Str;
// Esta línea sirve para importar la clase Mysql de PDO (PHP 8.5+).
use Pdo\Mysql;

// Esta línea sirve para devolver el arreglo de configuración de la base de datos.
return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for database operations. This is
    | the connection which will be utilized unless another connection
    | is explicitly specified when you execute a query / statement.
    |
    */

    // Esta línea sirve para definir la conexión por defecto (DB_CONNECTION, "sqlite" por defecto).
    'default' => env('DB_CONNECTION', 'sqlite'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Below are all of the database connections defined for your application.
    | An example configuration is provided for each database system which
    | is supported by Laravel. You're free to add / remove connections.
    |
    */

    // Esta línea sirve para definir las conexiones disponibles.
    'connections' => [

        // Esta línea sirve para configurar SQLite.
        'sqlite' => [
            // Esta línea sirve para usar el driver sqlite.
            'driver' => 'sqlite',
            // Esta línea sirve para definir la URL de conexión.
            'url' => env('DB_URL'),
            // Esta línea sirve para definir el archivo de la base de datos.
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            // Esta línea sirve para dejar las tablas sin prefijo.
            'prefix' => '',
            // Esta línea sirve para activar las claves foráneas.
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
            // Esta línea sirve para dejar el tiempo de espera por defecto.
            'busy_timeout' => null,
            // Esta línea sirve para dejar el modo de diario por defecto.
            'journal_mode' => null,
            // Esta línea sirve para dejar el modo de sincronización por defecto.
            'synchronous' => null,
            // Esta línea sirve para usar transacciones diferidas.
            'transaction_mode' => 'DEFERRED',
        ],

        // Esta línea sirve para configurar MySQL.
        'mysql' => [
            // Esta línea sirve para usar el driver mysql.
            'driver' => 'mysql',
            // Esta línea sirve para definir la URL de conexión.
            'url' => env('DB_URL'),
            // Esta línea sirve para definir el host.
            'host' => env('DB_HOST', '127.0.0.1'),
            // Esta línea sirve para definir el puerto.
            'port' => env('DB_PORT', '3306'),
            // Esta línea sirve para definir el nombre de la base de datos.
            'database' => env('DB_DATABASE', 'laravel'),
            // Esta línea sirve para definir el usuario.
            'username' => env('DB_USERNAME', 'root'),
            // Esta línea sirve para definir la contraseña.
            'password' => env('DB_PASSWORD', ''),
            // Esta línea sirve para definir el socket.
            'unix_socket' => env('DB_SOCKET', ''),
            // Esta línea sirve para definir el juego de caracteres.
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            // Esta línea sirve para definir la intercalación.
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            // Esta línea sirve para dejar las tablas sin prefijo.
            'prefix' => '',
            // Esta línea sirve para aplicar el prefijo también a los índices.
            'prefix_indexes' => true,
            // Esta línea sirve para activar el modo estricto.
            'strict' => true,
            // Esta línea sirve para dejar el motor por defecto.
            'engine' => null,
            // Esta línea sirve para definir las opciones de PDO si está la extensión pdo_mysql.
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                // Esta línea sirve para pasar el certificado SSL (con la constante según la versión de PHP).
                (PHP_VERSION_ID >= 80500 ? Mysql::ATTR_SSL_CA : PDO::MYSQL_ATTR_SSL_CA) => env('MYSQL_ATTR_SSL_CA'),
                // Esta línea sirve para usar opciones vacías si no está la extensión.
            ]) : [],
        ],

        // Esta línea sirve para configurar MariaDB.
        'mariadb' => [
            // Esta línea sirve para usar el driver mariadb.
            'driver' => 'mariadb',
            // Esta línea sirve para definir la URL de conexión.
            'url' => env('DB_URL'),
            // Esta línea sirve para definir el host.
            'host' => env('DB_HOST', '127.0.0.1'),
            // Esta línea sirve para definir el puerto.
            'port' => env('DB_PORT', '3306'),
            // Esta línea sirve para definir el nombre de la base de datos.
            'database' => env('DB_DATABASE', 'laravel'),
            // Esta línea sirve para definir el usuario.
            'username' => env('DB_USERNAME', 'root'),
            // Esta línea sirve para definir la contraseña.
            'password' => env('DB_PASSWORD', ''),
            // Esta línea sirve para definir el socket.
            'unix_socket' => env('DB_SOCKET', ''),
            // Esta línea sirve para definir el juego de caracteres.
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            // Esta línea sirve para definir la intercalación.
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            // Esta línea sirve para dejar las tablas sin prefijo.
            'prefix' => '',
            // Esta línea sirve para aplicar el prefijo también a los índices.
            'prefix_indexes' => true,
            // Esta línea sirve para activar el modo estricto.
            'strict' => true,
            // Esta línea sirve para dejar el motor por defecto.
            'engine' => null,
            // Esta línea sirve para definir las opciones de PDO si está la extensión pdo_mysql.
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                // Esta línea sirve para pasar el certificado SSL (con la constante según la versión de PHP).
                (PHP_VERSION_ID >= 80500 ? Mysql::ATTR_SSL_CA : PDO::MYSQL_ATTR_SSL_CA) => env('MYSQL_ATTR_SSL_CA'),
                // Esta línea sirve para usar opciones vacías si no está la extensión.
            ]) : [],
        ],

        // Esta línea sirve para configurar PostgreSQL.
        'pgsql' => [
            // Esta línea sirve para usar el driver pgsql.
            'driver' => 'pgsql',
            // Esta línea sirve para definir la URL de conexión.
            'url' => env('DB_URL'),
            // Esta línea sirve para definir el host.
            'host' => env('DB_HOST', '127.0.0.1'),
            // Esta línea sirve para definir el puerto.
            'port' => env('DB_PORT', '5432'),
            // Esta línea sirve para definir el nombre de la base de datos.
            'database' => env('DB_DATABASE', 'laravel'),
            // Esta línea sirve para definir el usuario.
            'username' => env('DB_USERNAME', 'root'),
            // Esta línea sirve para definir la contraseña.
            'password' => env('DB_PASSWORD', ''),
            // Esta línea sirve para definir el juego de caracteres.
            'charset' => env('DB_CHARSET', 'utf8'),
            // Esta línea sirve para dejar las tablas sin prefijo.
            'prefix' => '',
            // Esta línea sirve para aplicar el prefijo también a los índices.
            'prefix_indexes' => true,
            // Esta línea sirve para usar el esquema "public".
            'search_path' => 'public',
            // Esta línea sirve para definir el modo SSL.
            'sslmode' => env('DB_SSLMODE', 'prefer'),
        ],

        // Esta línea sirve para configurar SQL Server.
        'sqlsrv' => [
            // Esta línea sirve para usar el driver sqlsrv.
            'driver' => 'sqlsrv',
            // Esta línea sirve para definir la URL de conexión.
            'url' => env('DB_URL'),
            // Esta línea sirve para definir el host.
            'host' => env('DB_HOST', 'localhost'),
            // Esta línea sirve para definir el puerto.
            'port' => env('DB_PORT', '1433'),
            // Esta línea sirve para definir el nombre de la base de datos.
            'database' => env('DB_DATABASE', 'laravel'),
            // Esta línea sirve para definir el usuario.
            'username' => env('DB_USERNAME', 'root'),
            // Esta línea sirve para definir la contraseña.
            'password' => env('DB_PASSWORD', ''),
            // Esta línea sirve para definir el juego de caracteres.
            'charset' => env('DB_CHARSET', 'utf8'),
            // Esta línea sirve para dejar las tablas sin prefijo.
            'prefix' => '',
            // Esta línea sirve para aplicar el prefijo también a los índices.
            'prefix_indexes' => true,
            // 'encrypt' => env('DB_ENCRYPT', 'yes'),
            // 'trust_server_certificate' => env('DB_TRUST_SERVER_CERTIFICATE', 'false'),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run on the database.
    |
    */

    // Esta línea sirve para configurar la tabla de migraciones.
    'migrations' => [
        // Esta línea sirve para usar la tabla "migrations".
        'table' => 'migrations',
        // Esta línea sirve para actualizar la fecha de las migraciones publicadas.
        'update_date_on_publish' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer body of commands than a typical key-value system
    | such as Memcached. You may define your connection settings here.
    |
    */

    // Esta línea sirve para configurar Redis.
    'redis' => [

        // Esta línea sirve para definir el cliente de Redis (phpredis por defecto).
        'client' => env('REDIS_CLIENT', 'phpredis'),

        // Esta línea sirve para definir las opciones generales.
        'options' => [
            // Esta línea sirve para definir el modo de cluster.
            'cluster' => env('REDIS_CLUSTER', 'redis'),
            // Esta línea sirve para definir el prefijo de las claves.
            'prefix' => env('REDIS_PREFIX', Str::slug((string) env('APP_NAME', 'laravel')).'-database-'),
            // Esta línea sirve para definir si la conexión es persistente.
            'persistent' => env('REDIS_PERSISTENT', false),
        ],

        // Esta línea sirve para configurar la conexión "default".
        'default' => [
            // Esta línea sirve para definir la URL.
            'url' => env('REDIS_URL'),
            // Esta línea sirve para definir el host.
            'host' => env('REDIS_HOST', '127.0.0.1'),
            // Esta línea sirve para definir el usuario.
            'username' => env('REDIS_USERNAME'),
            // Esta línea sirve para definir la contraseña.
            'password' => env('REDIS_PASSWORD'),
            // Esta línea sirve para definir el puerto.
            'port' => env('REDIS_PORT', '6379'),
            // Esta línea sirve para usar la base de datos 0.
            'database' => env('REDIS_DB', '0'),
            // Esta línea sirve para definir los reintentos.
            'max_retries' => env('REDIS_MAX_RETRIES', 3),
            // Esta línea sirve para definir el algoritmo de espera entre reintentos.
            'backoff_algorithm' => env('REDIS_BACKOFF_ALGORITHM', 'decorrelated_jitter'),
            // Esta línea sirve para definir la espera base en milisegundos.
            'backoff_base' => env('REDIS_BACKOFF_BASE', 100),
            // Esta línea sirve para definir la espera máxima en milisegundos.
            'backoff_cap' => env('REDIS_BACKOFF_CAP', 1000),
        ],

        // Esta línea sirve para configurar la conexión "cache".
        'cache' => [
            // Esta línea sirve para definir la URL.
            'url' => env('REDIS_URL'),
            // Esta línea sirve para definir el host.
            'host' => env('REDIS_HOST', '127.0.0.1'),
            // Esta línea sirve para definir el usuario.
            'username' => env('REDIS_USERNAME'),
            // Esta línea sirve para definir la contraseña.
            'password' => env('REDIS_PASSWORD'),
            // Esta línea sirve para definir el puerto.
            'port' => env('REDIS_PORT', '6379'),
            // Esta línea sirve para usar la base de datos 1.
            'database' => env('REDIS_CACHE_DB', '1'),
            // Esta línea sirve para definir los reintentos.
            'max_retries' => env('REDIS_MAX_RETRIES', 3),
            // Esta línea sirve para definir el algoritmo de espera entre reintentos.
            'backoff_algorithm' => env('REDIS_BACKOFF_ALGORITHM', 'decorrelated_jitter'),
            // Esta línea sirve para definir la espera base en milisegundos.
            'backoff_base' => env('REDIS_BACKOFF_BASE', 100),
            // Esta línea sirve para definir la espera máxima en milisegundos.
            'backoff_cap' => env('REDIS_BACKOFF_CAP', 1000),
        ],

    ],

];
