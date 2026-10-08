<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar la fachada DB para consultar y actualizar datos.
use Illuminate\Support\Facades\DB;

/**
 * Corrige exercises.video_url para las filas subidas antes del fix de
 * AdminExerciseController::uploadVideo (ver ese archivo): guardaban la URL
 * absoluta que arma Storage::disk('public')->url(), que antepone APP_URL
 * (en dev, "http://localhost:8000" — inalcanzable desde un celular físico).
 * Recorta todo lo anterior a "/storage/" dejando solo la ruta relativa, que
 * cada cliente resuelve contra su propio API baseUrl vía ApiClient::mediaUrl().
 * No toca video_url que ya sea relativo ni URLs externas (YouTube/Vimeo/CDN)
 * que un admin haya pegado a mano — esas no contienen "/storage/".
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para consultar los ejercicios.
        DB::table('exercises')
            // Esta línea sirve para filtrar los que tienen una URL absoluta con "/storage/".
            ->where('video_url', 'like', 'http%/storage/%')
            // Esta línea sirve para ordenar por id.
            ->orderBy('id')
            // Esta línea sirve para recorrerlos de a uno.
            ->each(function (object $exercise): void {
                // Esta línea sirve para definir el texto que marca el inicio de la ruta relativa.
                $marker = '/storage/';
                // Esta línea sirve para buscar dónde empieza "/storage/".
                $position = strpos($exercise->video_url, $marker);
                // Esta línea sirve para revisar si no está.
                if ($position === false) {
                    // Esta línea sirve para saltar este ejercicio.
                    return;
                }

                // Esta línea sirve para actualizar el ejercicio.
                DB::table('exercises')
                    // Esta línea sirve para filtrar por su id.
                    ->where('id', $exercise->id)
                    // Esta línea sirve para dejar solo la ruta relativa desde "/storage/".
                    ->update(['video_url' => substr($exercise->video_url, $position)]);
            });
    }

    // Esta línea sirve para declarar el método que revierte la migración (no hace nada).
    public function down(): void
    {
        // Intencionalmente no reversible: no se guarda qué host tenía cada
        // fila antes, y reconstruirlo con el APP_URL actual sería incorrecto
        // para cualquier fila que se hubiera subido con un host distinto.
    }
};
