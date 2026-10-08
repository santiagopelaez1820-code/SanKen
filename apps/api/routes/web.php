<?php

// Esta línea sirve para importar la fachada Route para definir rutas.
use Illuminate\Support\Facades\Route;

// Esta línea sirve para definir la ruta raíz "/".
Route::get('/', function () {
    // Esta línea sirve para mostrar la vista de bienvenida.
    return view('welcome');
});
