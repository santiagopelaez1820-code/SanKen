<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Support.

namespace Tests\Support;

// Esta línea sirve para importar la clase CloudinaryClient.
use App\Infrastructure\Media\CloudinaryClient;
// Esta línea sirve para importar la clase RuntimeException.
use RuntimeException;

/**
 * Doble de CloudinaryClient para tests: guarda los "assets" en memoria y
 * registra cada llamada, sin red ni credenciales reales.
 */
// Esta línea sirve para declarar el cliente falso de Cloudinary para los tests.
class FakeCloudinaryClient extends CloudinaryClient
{
    // Esta línea sirve para guardar los archivos "subidos" en memoria.
    /** @var array<string, array<string, mixed>> public_id => asset */
    public array $assets = [];

    // Esta línea sirve para registrar las subidas hechas.
    /** @var list<array{public_id: string, resource_type: string}> */
    public array $uploads = [];

    // Esta línea sirve para registrar los archivos borrados.
    /** @var list<string> */
    public array $destroyed = [];

    // Esta línea sirve para indicar si las subidas deben fallar.
    public bool $failUploads = false;

    // Esta línea sirve para guardar la versión que se asigna a cada archivo.
    private int $version = 1000;

    // Esta línea sirve para declarar el constructor.
    public function __construct()
    {
        // Esta línea sirve para llamar al constructor del cliente real con datos de prueba.
        parent::__construct('demo-cloud', 'test-key', 'test-secret');
    }

    // Esta línea sirve para declarar el método que simula una subida.
    public function upload(string $localPath, array $options): array
    {
        // Esta línea sirve para revisar si se pidió simular un fallo.
        if ($this->failUploads) {
            // Esta línea sirve para lanzar el error de Cloudinary caído.
            throw new RuntimeException('Cloudinary caído');
        }

        // Esta línea sirve para leer el tipo de archivo (imagen por defecto).
        $type = $options['resource_type'] ?? 'image';
        // Esta línea sirve para leer el identificador del archivo.
        $publicId = $options['public_id'];
        // Esta línea sirve para elegir el formato según el tipo.
        $format = $type === 'video' ? 'mp4' : 'jpg';
        // Esta línea sirve para registrar la subida.
        $this->uploads[] = ['public_id' => $publicId, 'resource_type' => $type];

        // Esta línea sirve para guardar y devolver los datos del archivo.
        return $this->assets[$publicId] = [
            // Esta línea sirve para asignar $publicId al campo "public_id".
            'public_id' => $publicId,
            // Esta línea sirve para asignar $type al campo "resource_type".
            'resource_type' => $type,
            // Esta línea sirve para asignar $format al campo "format".
            'format' => $format,
            // Esta línea sirve para asignar 'https://res.cloudinary.com/demo-cloud/'.$type.'/upload/v'.(++$this->version)."/{$publicId}.{$format}" al campo "secure_url".
            'secure_url' => 'https://res.cloudinary.com/demo-cloud/'.$type.'/upload/v'.(++$this->version)."/{$publicId}.{$format}",
            // Esta línea sirve para asignar md5_file($localPath) al campo "etag".
            'etag' => md5_file($localPath),
            // Esta línea sirve para asignar filesize($localPath) al campo "bytes".
            'bytes' => filesize($localPath),
            // Esta línea sirve para asignar 100 al campo "width".
            'width' => 100,
            // Esta línea sirve para asignar 100 al campo "height".
            'height' => 100,
            // Esta línea sirve para asignar $type === 'video' ? 4.2 : null al campo "duration".
            'duration' => $type === 'video' ? 4.2 : null,
        ];
    }

    // Esta línea sirve para declarar el método que simula un borrado.
    public function destroy(string $publicId, string $resourceType): void
    {
        // Esta línea sirve para registrar el borrado.
        $this->destroyed[] = $publicId;
        // Esta línea sirve para quitar el archivo de la memoria.
        unset($this->assets[$publicId]);
    }

    // Esta línea sirve para declarar el método que simula la búsqueda de un archivo.
    public function find(string $publicId, string $resourceType): ?array
    {
        // Esta línea sirve para devolver los datos del archivo o null.
        return $this->assets[$publicId] ?? null;
    }
}
