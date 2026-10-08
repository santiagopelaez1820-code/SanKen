<?php

// Esta línea sirve para importar el service provider principal.
use App\Providers\AppServiceProvider;
// Esta línea sirve para importar el service provider de repositorios.
use App\Providers\RepositoryServiceProvider;

// Esta línea sirve para devolver la lista de service providers de la app.
return [
    // Esta línea sirve para registrar el service provider principal.
    AppServiceProvider::class,
    // Esta línea sirve para registrar el service provider de repositorios.
    RepositoryServiceProvider::class,
];
