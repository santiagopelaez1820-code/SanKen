<?php

namespace App\Infrastructure\Media;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Guarda los archivos subidos en Cloudinary y devuelve el secure_url, que
 * es lo que queda en la columna (avatar_url, image, video_url…). Así los
 * clientes no cambian: ApiClient::mediaUrl() ya devuelve tal cual las URLs
 * absolutas, y le agrega las transformaciones de entrega (f_auto, q_auto,
 * ancho) a las de Cloudinary.
 *
 * No hace falta una columna extra con el public_id: es estable por fila
 * (MediaSlot) y además se puede leer de la propia URL (fromUrl), así que
 * reemplazar o borrar un archivo siempre encuentra el asset correcto.
 */
class CloudinaryMediaStorage implements MediaStorage
{
    public function __construct(
        private readonly CloudinaryClient $client,
        private readonly LocalPublicMediaStorage $local,
        private readonly string $rootFolder,
    ) {}

    public function store(UploadedFile $file, MediaSlot $slot, ?string $previousUrl, string $failureMessage): string
    {
        $publicId = $slot->publicId($this->rootFolder);

        try {
            $result = $this->client->upload($file->getRealPath(), [
                'public_id' => $publicId,
                'resource_type' => $slot->resourceType,
                'overwrite' => true,
                // Purga la versión vieja del CDN: quien la tenga cacheada
                // por URL igual recibe la nueva (cambia /vNNN/).
                'invalidate' => true,
            ]);
        } catch (Throwable $e) {
            Log::error('Cloudinary: falló la subida.', ['public_id' => $publicId, 'error' => $e->getMessage()]);
            abort(500, $failureMessage);
        }

        $secureUrl = $result['secure_url'] ?? null;
        abort_unless(is_string($secureUrl) && $secureUrl !== '', 500, $failureMessage);

        // El asset nuevo ya existe: recién ahora se limpia el anterior. Si
        // era el mismo public_id, el overwrite ya lo reemplazó.
        $previous = $this->ownAsset($previousUrl);
        if ($previous === null || $previous['public_id'] !== $publicId) {
            $this->delete($previousUrl);
        }

        return $secureUrl;
    }

    public function delete(?string $url): void
    {
        $asset = $this->ownAsset($url);

        if ($asset === null) {
            // Ruta "/storage/..." de antes de migrar (o URL ajena, que
            // LocalPublicMediaStorage ignora).
            $this->local->delete($url);

            return;
        }

        try {
            $this->client->destroy($asset['public_id'], $asset['resource_type']);
        } catch (Throwable $e) {
            // Best-effort: un asset huérfano en Cloudinary no debe impedir
            // borrar un avatar o una cuenta. Queda en el log.
            Log::warning('Cloudinary: no se pudo borrar el asset.', ['public_id' => $asset['public_id'], 'error' => $e->getMessage()]);
        }
    }

    /**
     * @return array{public_id: string, resource_type: string}|null
     */
    private function ownAsset(?string $url): ?array
    {
        $asset = CloudinaryUrl::parse($url, $this->client->cloudName());

        if ($asset === null || ! str_starts_with($asset['public_id'], trim($this->rootFolder, '/').'/')) {
            return null;
        }

        return $asset;
    }
}
