<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres del manejo de archivos multimedia.

namespace App\Infrastructure\Media;

// Esta línea sirve para importar la clase UploadedFile (archivo subido).
use Illuminate\Http\UploadedFile;
// Esta línea sirve para importar la fachada Storage para manejar archivos en disco.
use Illuminate\Support\Facades\Storage;

/**
 * Disco 'public' de Laravel — el comportamiento previo a Cloudinary, que se
 * mantiene para dev y tests (y como respaldo si Cloudinary no está
 * configurado). Guarda rutas relativas ("/storage/...") y nunca
 * Storage::disk('public')->url(), que antepone APP_URL: eso es inalcanzable
 * desde un dispositivo físico y frágil si el dominio cambia.
 */
// Esta línea sirve para declarar el almacenamiento de archivos en el disco público local.
class LocalPublicMediaStorage implements MediaStorage
{
    // Esta línea sirve para definir el prefijo de las URLs de los archivos locales.
    public const URL_MARKER = '/storage/';

    // Esta línea sirve para declarar el método que guarda un archivo y devuelve su URL.
    public function store(UploadedFile $file, MediaSlot $slot, ?string $previousUrl, string $failureMessage): string
    {
        // Esta línea sirve para guardar el archivo en la carpeta que le corresponde.
        $path = $file->store($slot->localDirectory, 'public');

        // Esta línea sirve para responder error 500 si no se pudo guardar.
        abort_unless($path && Storage::disk('public')->exists($path), 500, $failureMessage);

        // Esta línea sirve para borrar el archivo anterior.
        $this->delete($previousUrl);

        // Esta línea sirve para devolver la URL relativa del archivo.
        return self::URL_MARKER.$path;
    }

    // Esta línea sirve para declarar el método que borra un archivo a partir de su URL.
    public function delete(?string $url): void
    {
        // Esta línea sirve para obtener la ruta del archivo dentro del disco.
        $path = self::pathFromUrl($url);

        // Esta línea sirve para revisar si la ruta existe en el disco.
        if ($path && Storage::disk('public')->exists($path)) {
            // Esta línea sirve para borrar el archivo.
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Ruta dentro del disco 'public' de una URL "/storage/x/y.jpg" (relativa
     * o absoluta). Si no tiene ese marcador viene de algo que esta app no
     * subió: null a propósito, nunca se toca un archivo ajeno.
     */
    // Esta línea sirve para declarar el método que obtiene la ruta del archivo a partir de su URL.
    public static function pathFromUrl(?string $url): ?string
    {
        // Esta línea sirve para revisar si no hay URL.
        if (! $url) {
            // Esta línea sirve para devolver null.
            return null;
        }

        // Esta línea sirve para buscar dónde está el prefijo "/storage/".
        $position = strpos($url, self::URL_MARKER);

        // Esta línea sirve para devolver null si no está, o la ruta que sigue al prefijo.
        return $position === false ? null : substr($url, $position + strlen(self::URL_MARKER));
    }
}
