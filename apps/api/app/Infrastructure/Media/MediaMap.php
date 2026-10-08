<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres del manejo de archivos multimedia.

namespace App\Infrastructure\Media;

// Esta línea sirve para importar la fachada File para leer y escribir archivos.
use Illuminate\Support\Facades\File;

/**
 * Registro local de lo que ya se migró (JSON). Hace la migración
 * idempotente y reanudable: cada entrada guarda el SHA-256 del archivo
 * local, así que volver a correr el comando no re-sube lo que no cambió.
 *
 * Solo datos públicos del asset (public_id, secure_url, formato…) — nunca
 * credenciales.
 */
// Esta línea sirve para declarar el registro local de los archivos ya migrados.
class MediaMap
{
    // Esta línea sirve para guardar las entradas del registro.
    /** @var array<string, array<string, mixed>> */
    private array $entries;

    // Esta línea sirve para declarar el constructor que recibe la ruta del archivo JSON.
    public function __construct(private readonly string $path)
    {
        // Esta línea sirve para cargar las entradas revisando si el archivo existe.
        $this->entries = File::exists($path)
            // Esta línea sirve para leer y decodificar el JSON (o usar un arreglo vacío si está dañado).
            ? (json_decode(File::get($path), true) ?: [])
            // Esta línea sirve para usar un arreglo vacío si el archivo no existe.
            : [];
    }

    /** @return array<string, mixed>|null */
    // Esta línea sirve para declarar el método que devuelve una entrada.
    public function get(string $key): ?array
    {
        // Esta línea sirve para devolver la entrada o null si no existe.
        return $this->entries[$key] ?? null;
    }

    /** @return array<string, array<string, mixed>> */
    // Esta línea sirve para declarar el método que devuelve todas las entradas.
    public function all(): array
    {
        // Esta línea sirve para devolver las entradas.
        return $this->entries;
    }

    /**
     * Mezcla $data en la entrada y la escribe a disco en el acto: si el
     * proceso se corta en el archivo 40, los 39 anteriores ya quedaron.
     *
     * @param  array<string, mixed>  $data
     */
    // Esta línea sirve para declarar el método que guarda datos en una entrada.
    public function put(string $key, array $data): void
    {
        // Esta línea sirve para mezclar los datos nuevos con los que ya tenía la entrada.
        $this->entries[$key] = array_merge($this->entries[$key] ?? [], $data);
        // Esta línea sirve para ordenar las entradas por clave.
        ksort($this->entries);

        // Esta línea sirve para crear la carpeta del archivo si no existe.
        File::ensureDirectoryExists(dirname($this->path));
        // Esta línea sirve para escribir el JSON en disco.
        File::put($this->path, json_encode($this->entries, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n");
    }

    // Esta línea sirve para declarar el método que devuelve la ruta del archivo.
    public function path(): string
    {
        // Esta línea sirve para devolver la ruta.
        return $this->path;
    }
}
