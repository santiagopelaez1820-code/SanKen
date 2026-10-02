<?php

namespace App\Infrastructure\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Disco 'public' de Laravel — el comportamiento previo a Cloudinary, que se
 * mantiene para dev y tests (y como respaldo si Cloudinary no está
 * configurado). Guarda rutas relativas ("/storage/...") y nunca
 * Storage::disk('public')->url(), que antepone APP_URL: eso es inalcanzable
 * desde un dispositivo físico y frágil si el dominio cambia.
 */
class LocalPublicMediaStorage implements MediaStorage
{
    public const URL_MARKER = '/storage/';

    public function store(UploadedFile $file, MediaSlot $slot, ?string $previousUrl, string $failureMessage): string
    {
        $path = $file->store($slot->localDirectory, 'public');

        abort_unless($path && Storage::disk('public')->exists($path), 500, $failureMessage);

        $this->delete($previousUrl);

        return self::URL_MARKER.$path;
    }

    public function delete(?string $url): void
    {
        $path = self::pathFromUrl($url);

        if ($path && Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }

    /**
     * Ruta dentro del disco 'public' de una URL "/storage/x/y.jpg" (relativa
     * o absoluta). Si no tiene ese marcador viene de algo que esta app no
     * subió: null a propósito, nunca se toca un archivo ajeno.
     */
    public static function pathFromUrl(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $position = strpos($url, self::URL_MARKER);

        return $position === false ? null : substr($url, $position + strlen(self::URL_MARKER));
    }
}
