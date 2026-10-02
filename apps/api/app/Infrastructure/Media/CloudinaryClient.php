<?php

namespace App\Infrastructure\Media;

use Cloudinary\Cloudinary;

/**
 * Envoltorio mínimo sobre el SDK oficial (cloudinary/cloudinary_php) con
 * las tres operaciones que usa SanKen. Existe para que los tests puedan
 * reemplazarlo sin tocar la red, y para que las credenciales se lean en un
 * solo lugar: el API secret vive solo acá (backend), nunca en un cliente.
 */
class CloudinaryClient
{
    /** Por encima de esto se sube en partes (límite de upload() simple: 100 MB). */
    private const CHUNKED_UPLOAD_THRESHOLD = 20 * 1024 * 1024;

    private ?Cloudinary $sdk = null;

    public function __construct(
        private readonly string $cloudName,
        private readonly string $apiKey,
        private readonly string $apiSecret,
    ) {}

    public function cloudName(): string
    {
        return $this->cloudName;
    }

    /**
     * @param  array<string, mixed>  $options
     * @return array<string, mixed> respuesta de Cloudinary (public_id, secure_url, resource_type, format, width, height, duration, bytes, etag…)
     */
    public function upload(string $localPath, array $options): array
    {
        $api = $this->sdk()->uploadApi();
        $response = filesize($localPath) > self::CHUNKED_UPLOAD_THRESHOLD
            ? $api->uploadLarge($localPath, $options)
            : $api->upload($localPath, $options);

        return $response->getArrayCopy();
    }

    public function destroy(string $publicId, string $resourceType): void
    {
        $this->sdk()->uploadApi()->destroy($publicId, ['resource_type' => $resourceType, 'invalidate' => true]);
    }

    /**
     * Datos del asset si existe, null si no. Se usa para no volver a subir
     * algo que ya está (migración reanudada).
     *
     * @return array<string, mixed>|null
     */
    public function find(string $publicId, string $resourceType): ?array
    {
        try {
            return $this->sdk()->adminApi()->asset($publicId, ['resource_type' => $resourceType])->getArrayCopy();
        } catch (\Cloudinary\Api\Exception\NotFound) {
            return null;
        }
    }

    private function sdk(): Cloudinary
    {
        return $this->sdk ??= new Cloudinary([
            'cloud' => [
                'cloud_name' => $this->cloudName,
                'api_key' => $this->apiKey,
                'api_secret' => $this->apiSecret,
            ],
            'url' => ['secure' => true],
        ]);
    }
}
