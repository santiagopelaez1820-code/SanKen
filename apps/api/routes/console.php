<?php

// Esta línea sirve para importar la clase con frases inspiradoras.
use Illuminate\Foundation\Inspiring;
// Esta línea sirve para importar la fachada Artisan para definir comandos.
use Illuminate\Support\Facades\Artisan;

// Esta línea sirve para definir el comando "inspire".
Artisan::command('inspire', function () {
    // Esta línea sirve para mostrar una frase inspiradora.
    $this->comment(Inspiring::quote());
    // Esta línea sirve para describir para qué sirve el comando.
})->purpose('Display an inspiring quote');
