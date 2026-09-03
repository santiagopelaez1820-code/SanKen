<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * "Subir un archivo al disco público, reemplazando el anterior" era la
 * misma secuencia copiada en AuthController::updateAvatar,
 * AdminExerciseController::uploadVideo y PrSubmissionController::uploadVideo
 * — store → confirmar que quedó guardado → borrar el archivo viejo. Se
 * extrajo acá una sola vez.
 */
trait ReplacesPublicFile
{
    /**
     * Guarda $file en $directory del disco 'public' y borra el archivo
     * apuntado por $previousUrl si existía. Devuelve la ruta relativa
     * ("/storage/...") lista para guardar en la columna correspondiente —
     * nunca Storage::disk('public')->url(), que antepone APP_URL: eso es
     * inalcanzable desde un dispositivo físico y frágil si el dominio
     * cambia. Cada cliente resuelve esta ruta contra su propio baseUrl vía
     * ApiClient::mediaUrl() (ver packages/core/src/api/client.ts).
     */
    private function storePublicFileReplacing(
        UploadedFile $file,
        string $directory,
        ?string $previousUrl,
        string $failureMessage,
    ): string {
        $path = $file->store($directory, 'public');

        abort_unless(Storage::disk('public')->exists($path), 500, $failureMessage);

        $this->deletePublicFileByUrl($previousUrl);

        return '/storage/'.$path;
    }

    private function deletePublicFileByUrl(?string $url): void
    {
        $path = $this->publicPathFromUrl($url);

        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Las rutas guardadas son relativas ("/storage/avatars/x.jpg"), así que
     * para volver a encontrar el archivo en disco alcanza con recortar todo
     * lo anterior a ese marcador. Si la URL no lo tiene (viene de algo que
     * esta app no subió), devuelve null a propósito: nunca se intenta
     * borrar un archivo ajeno.
     */
    private function publicPathFromUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $marker = '/storage/';
        $position = strpos($url, $marker);

        return $position === false ? null : substr($url, $position + strlen($marker));
    }
}
