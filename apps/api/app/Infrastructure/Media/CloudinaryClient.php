<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres del manejo de archivos multimedia.

namespace App\Infrastructure\Media;

// Esta línea sirve para importar la excepción de Cloudinary cuando un archivo no existe.
use Cloudinary\Api\Exception\NotFound;
// Esta línea sirve para importar el SDK oficial de Cloudinary.
use Cloudinary\Cloudinary;

/**
 * Envoltorio mínimo sobre el SDK oficial (cloudinary/cloudinary_php) con
 * las tres operaciones que usa SanKen. Existe para que los tests puedan
 * reemplazarlo sin tocar la red, y para que las credenciales se lean en un
 * solo lugar: el API secret vive solo acá (backend), nunca en un cliente.
 */
// Esta línea sirve para declarar el cliente que envuelve el SDK de Cloudinary.
class CloudinaryClient
{
    // Esta línea sirve para guardar la instancia del SDK (se crea la primera vez que se usa).
    private ?Cloudinary $sdk = null;

    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir el nombre de la cuenta (cloud name).
        private readonly string $cloudName,
        // Esta línea sirve para recibir la API key.
        private readonly string $apiKey,
        // Esta línea sirve para recibir el API secret.
        private readonly string $apiSecret,
    ) {}

    // Esta línea sirve para declarar el método que devuelve el nombre de la cuenta.
    public function cloudName(): string
    {
        // Esta línea sirve para devolver el nombre de la cuenta.
        return $this->cloudName;
    }

    /**
     * El SDK sube en partes solo los archivos locales grandes (videos de
     * hasta 100 MB), no hace falta elegir otro método.
     *
     * @param  array<string, mixed>  $options
     * @return array<string, mixed> respuesta de Cloudinary (public_id, secure_url, resource_type, format, width, height, duration, bytes, etag…)
     */
    // Esta línea sirve para declarar el método que sube un archivo.
    public function upload(string $localPath, array $options): array
    {
        // Esta línea sirve para subir el archivo y devolver la respuesta como arreglo.
        return $this->sdk()->uploadApi()->upload($localPath, $options)->getArrayCopy();
    }

    // Esta línea sirve para declarar el método que borra un archivo.
    public function destroy(string $publicId, string $resourceType): void
    {
        // Esta línea sirve para borrar el archivo y purgarlo del CDN.
        $this->sdk()->uploadApi()->destroy($publicId, ['resource_type' => $resourceType, 'invalidate' => true]);
    }

    /**
     * Datos del asset si existe, null si no. Se usa para no volver a subir
     * algo que ya está (migración reanudada).
     *
     * @return array<string, mixed>|null
     */
    // Esta línea sirve para declarar el método que busca un archivo.
    public function find(string $publicId, string $resourceType): ?array
    {
        // Esta línea sirve para intentar buscarlo.
        try {
            // Esta línea sirve para devolver los datos del archivo como arreglo.
            return $this->sdk()->adminApi()->asset($publicId, ['resource_type' => $resourceType])->getArrayCopy();
            // Esta línea sirve para capturar el error de archivo inexistente.
        } catch (NotFound) {
            // Esta línea sirve para devolver null.
            return null;
        }
    }

    // Esta línea sirve para declarar el método privado que devuelve el SDK.
    private function sdk(): Cloudinary
    {
        // Esta línea sirve para crear el SDK la primera vez y reutilizarlo después.
        return $this->sdk ??= new Cloudinary([
            // Esta línea sirve para configurar la cuenta.
            'cloud' => [
                // Esta línea sirve para pasar el nombre de la cuenta.
                'cloud_name' => $this->cloudName,
                // Esta línea sirve para pasar la API key.
                'api_key' => $this->apiKey,
                // Esta línea sirve para pasar el API secret.
                'api_secret' => $this->apiSecret,
            ],
            // Esta línea sirve para usar siempre URLs https.
            'url' => ['secure' => true],
        ]);
    }
}
