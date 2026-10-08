<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres del manejo de archivos multimedia.

namespace App\Infrastructure\Media;

// Esta línea sirve para importar la clase UploadedFile (archivo subido).
use Illuminate\Http\UploadedFile;
// Esta línea sirve para importar la fachada Log para escribir en el log.
use Illuminate\Support\Facades\Log;
// Esta línea sirve para importar Throwable para capturar cualquier error.
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
// Esta línea sirve para declarar el almacenamiento de archivos en Cloudinary.
class CloudinaryMediaStorage implements MediaStorage
{
    // Esta línea sirve para declarar el constructor.
    public function __construct(
        // Esta línea sirve para recibir el cliente de Cloudinary.
        private readonly CloudinaryClient $client,
        // Esta línea sirve para recibir el almacenamiento local (para archivos viejos en disco).
        private readonly LocalPublicMediaStorage $local,
        // Esta línea sirve para recibir la carpeta raíz de la app en Cloudinary.
        private readonly string $rootFolder,
    ) {}

    // Esta línea sirve para declarar el método que guarda un archivo y devuelve su URL.
    public function store(UploadedFile $file, MediaSlot $slot, ?string $previousUrl, string $failureMessage): string
    {
        // Esta línea sirve para calcular el public_id del archivo.
        $publicId = $slot->publicId($this->rootFolder);

        // Esta línea sirve para intentar subir el archivo.
        try {
            // Esta línea sirve para subir el archivo con sus opciones.
            $result = $this->client->upload($file->getRealPath(), [
                // Esta línea sirve para usar el public_id calculado.
                'public_id' => $publicId,
                // Esta línea sirve para indicar si es imagen o video.
                'resource_type' => $slot->resourceType,
                // Esta línea sirve para reemplazar el archivo si ya existe.
                'overwrite' => true,
                // Purga la versión vieja del CDN: quien la tenga cacheada
                // por URL igual recibe la nueva (cambia /vNNN/).
                // Esta línea sirve para purgar la versión vieja del CDN.
                'invalidate' => true,
            ]);
            // Esta línea sirve para capturar cualquier error de la subida.
        } catch (Throwable $e) {
            // Esta línea sirve para registrar el error en el log.
            Log::error('Cloudinary: falló la subida.', ['public_id' => $publicId, 'error' => $e->getMessage()]);
            // Esta línea sirve para responder error 500 con el mensaje recibido.
            abort(500, $failureMessage);
        }

        // Esta línea sirve para leer la URL segura del archivo subido.
        $secureUrl = $result['secure_url'] ?? null;
        // Esta línea sirve para responder error 500 si no vino una URL.
        abort_unless(is_string($secureUrl) && $secureUrl !== '', 500, $failureMessage);

        // El asset nuevo ya existe: recién ahora se limpia el anterior. Si
        // era el mismo public_id, el overwrite ya lo reemplazó.
        // Esta línea sirve para obtener los datos del archivo anterior si es de esta app.
        $previous = $this->ownAsset($previousUrl);
        // Esta línea sirve para revisar si el anterior no existe o tiene otro public_id.
        if ($previous === null || $previous['public_id'] !== $publicId) {
            // Esta línea sirve para borrar el archivo anterior.
            $this->delete($previousUrl);
        }

        // Esta línea sirve para devolver la URL del archivo nuevo.
        return $secureUrl;
    }

    // Esta línea sirve para declarar el método que borra un archivo a partir de su URL.
    public function delete(?string $url): void
    {
        // Esta línea sirve para obtener los datos del archivo si es de esta app.
        $asset = $this->ownAsset($url);

        // Esta línea sirve para revisar si no es un archivo de Cloudinary de esta app.
        if ($asset === null) {
            // Ruta "/storage/..." de antes de migrar (o URL ajena, que
            // LocalPublicMediaStorage ignora).
            // Esta línea sirve para intentar borrarlo del disco local.
            $this->local->delete($url);

            // Esta línea sirve para terminar.
            return;
        }

        // Esta línea sirve para intentar borrar el archivo en Cloudinary.
        try {
            // Esta línea sirve para borrar el archivo.
            $this->client->destroy($asset['public_id'], $asset['resource_type']);
            // Esta línea sirve para capturar cualquier error.
        } catch (Throwable $e) {
            // Best-effort: un asset huérfano en Cloudinary no debe impedir
            // borrar un avatar o una cuenta. Queda en el log.
            // Esta línea sirve para registrar una advertencia en el log.
            Log::warning('Cloudinary: no se pudo borrar el asset.', ['public_id' => $asset['public_id'], 'error' => $e->getMessage()]);
        }
    }

    /**
     * @return array{public_id: string, resource_type: string}|null
     */
    // Esta línea sirve para declarar el método privado que devuelve los datos del archivo si es de esta app.
    private function ownAsset(?string $url): ?array
    {
        // Esta línea sirve para leer el public_id y el tipo desde la URL.
        $asset = CloudinaryUrl::parse($url, $this->client->cloudName());

        // Esta línea sirve para revisar si no se pudo leer o si está fuera de la carpeta de la app.
        if ($asset === null || ! str_starts_with($asset['public_id'], trim($this->rootFolder, '/').'/')) {
            // Esta línea sirve para devolver null.
            return null;
        }

        // Esta línea sirve para devolver los datos del archivo.
        return $asset;
    }
}
