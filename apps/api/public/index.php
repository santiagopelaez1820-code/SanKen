<?php

// Esta línea sirve para importar la clase Application de Laravel.
use Illuminate\Foundation\Application;
// Esta línea sirve para importar la clase Request para capturar la petición.
use Illuminate\Http\Request;

// Esta línea sirve para guardar el momento en que empezó la petición.
define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
// Esta línea sirve para revisar si la app está en modo mantenimiento.
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    // Esta línea sirve para cargar el archivo de mantenimiento.
    require $maintenance;
}

// Register the Composer autoloader...
// Esta línea sirve para cargar el autoloader de Composer.
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
// Esta línea sirve para crear la aplicación de Laravel.
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

// Esta línea sirve para atender la petición HTTP actual.
$app->handleRequest(Request::capture());
