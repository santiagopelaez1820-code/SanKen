<?php

use Illuminate\Database\Migrations\Migration;
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
return new class extends Migration
{
    public function up(): void
    {
        DB::table('exercises')
            ->where('video_url', 'like', 'http%/storage/%')
            ->orderBy('id')
            ->each(function (object $exercise): void {
                $marker = '/storage/';
                $position = strpos($exercise->video_url, $marker);
                if ($position === false) {
                    return;
                }

                DB::table('exercises')
                    ->where('id', $exercise->id)
                    ->update(['video_url' => substr($exercise->video_url, $position)]);
            });
    }

    public function down(): void
    {
        // Intencionalmente no reversible: no se guarda qué host tenía cada
        // fila antes, y reconstruirlo con el APP_URL actual sería incorrecto
        // para cualquier fila que se hubiera subido con un host distinto.
    }
};
