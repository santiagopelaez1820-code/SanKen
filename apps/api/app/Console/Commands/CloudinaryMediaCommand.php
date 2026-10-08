<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los comandos de consola.

namespace App\Console\Commands;

// Esta línea sirve para importar el cliente de la API de Cloudinary.
use App\Infrastructure\Media\CloudinaryClient;
// Esta línea sirve para importar el helper que reconoce URLs de Cloudinary.
use App\Infrastructure\Media\CloudinaryUrl;
// Esta línea sirve para importar el almacenamiento local de archivos públicos.
use App\Infrastructure\Media\LocalPublicMediaStorage;
// Esta línea sirve para importar la lista de columnas de la base que guardan archivos.
use App\Infrastructure\Media\MediaColumns;
// Esta línea sirve para importar el mapa que registra el avance de la migración.
use App\Infrastructure\Media\MediaMap;
// Esta línea sirve para importar el proveedor de servicios para saber si Cloudinary está activo.
use App\Providers\AppServiceProvider;
// Esta línea sirve para importar la clase base de los comandos de Artisan.
use Illuminate\Console\Command;
// Esta línea sirve para importar la fachada DB para consultar la base de datos.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar el cliente HTTP para comprobar URLs.
use Illuminate\Support\Facades\Http;
// Esta línea sirve para importar la fachada Storage para manejar archivos del disco.
use Illuminate\Support\Facades\Storage;
// Esta línea sirve para importar Throwable para capturar cualquier error.
use Throwable;

/**
 * Migra a Cloudinary el multimedia que hoy vive en el disco 'public' del
 * servidor (avatares, imágenes de Tienda, videos de ejercicios y de PR) y
 * actualiza las columnas de la base con el secure_url. Ver docs/CLOUDINARY.md.
 *
 *   status   qué hay en cada columna (local / Cloudinary / externo / falta archivo)
 *   migrate  sube lo local y actualiza la fila (idempotente, reanudable)
 *   verify   comprueba que cada URL de Cloudinary responda
 *   cleanup  borra los archivos locales ya migrados y verificados (requiere --force)
 *
 * Nunca borra nada en migrate: AUDITAR → SUBIR → REEMPLAZAR → VALIDAR → LIMPIAR.
 */
// Esta línea sirve para declarar el comando que migra los archivos multimedia a Cloudinary.
class CloudinaryMediaCommand extends Command
{
    // Esta línea sirve para definir el nombre del comando, su acción y sus opciones.
    protected $signature = 'media:cloudinary
        {action=status : status | migrate | verify | cleanup}
        {--dry-run : Muestra qué haría, sin subir ni escribir nada}
        {--force : Necesario para que cleanup borre archivos locales}';

    // Esta línea sirve para definir la descripción que se muestra en la ayuda de Artisan.
    protected $description = 'Migra a Cloudinary el multimedia del disco public y actualiza la base.';

    // Esta línea sirve para declarar la propiedad que guarda el mapa de la migración.
    private MediaMap $map;

    // Esta línea sirve para declarar el contador de resultados por categoría.
    /** @var array<string, int> */
    private array $tally = [];

    // Esta línea sirve para declarar el método principal que se ejecuta al correr el comando.
    public function handle(): int
    {
        // Esta línea sirve para leer la acción pedida.
        $action = (string) $this->argument('action');
        // Esta línea sirve para revisar si la acción no es una de las válidas.
        if (! in_array($action, ['status', 'migrate', 'verify', 'cleanup'], true)) {
            // Esta línea sirve para mostrar un error con las acciones permitidas.
            $this->error("Acción desconocida: {$action}. Usa status, migrate, verify o cleanup.");

            // Esta línea sirve para terminar indicando uso inválido.
            return self::INVALID;
        }

        // Esta línea sirve para revisar si la acción necesita Cloudinary y faltan credenciales.
        if (in_array($action, ['migrate', 'verify', 'cleanup'], true) && ! $this->option('dry-run') && ! $this->credentialsPresent()) {
            // Esta línea sirve para mostrar qué variables de entorno faltan.
            $this->error('Faltan CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET en el .env del servidor.');

            // Esta línea sirve para terminar indicando falla.
            return self::FAILURE;
        }

        // Esta línea sirve para cargar el mapa de la migración desde su archivo.
        $this->map = new MediaMap((string) config('services.cloudinary.map_path'));

        // Esta línea sirve para ejecutar la acción pedida y guardar su resultado.
        $result = match ($action) {
            // Esta línea sirve para ejecutar la acción status, que muestra el estado.
            'status' => $this->status(),
            // Esta línea sirve para ejecutar la acción migrate, que sube los archivos.
            'migrate' => $this->migrate(),
            // Esta línea sirve para ejecutar la acción verify, que comprueba las URLs.
            'verify' => $this->verify(),
            // Esta línea sirve para ejecutar la acción cleanup, que borra los archivos locales migrados.
            'cleanup' => $this->cleanup(),
        };

        // Esta línea sirve para dejar una línea en blanco en la consola.
        $this->newLine();
        // Esta línea sirve para recorrer el contador de resultados.
        foreach ($this->tally as $label => $count) {
            // Esta línea sirve para mostrar cada categoría con su cantidad.
            $this->line(sprintf('  %-34s %d', $label, $count));
        }
        // Esta línea sirve para mostrar la ruta del archivo del mapa.
        $this->line("  Mapa: {$this->map->path()}");

        // Esta línea sirve para devolver el código de salida de la acción.
        return $result;
    }

    // Esta línea sirve para declarar el método que muestra el estado de cada archivo.
    private function status(): int
    {
        // Esta línea sirve para recorrer cada fila con archivos de la base.
        foreach ($this->rows() as $row) {
            // Esta línea sirve para contar la fila según su estado.
            $this->count($this->classify($row['value'])['state']);
        }

        // Esta línea sirve para revisar si las subidas nuevas todavía no van a Cloudinary.
        if (! AppServiceProvider::cloudinaryEnabled()) {
            // Esta línea sirve para mostrar una advertencia indicando que siguen yendo al disco local.
            $this->warn('MEDIA_STORAGE no está en "cloudinary" (o faltan credenciales): las subidas nuevas siguen yendo al disco local.');
        }

        // Esta línea sirve para terminar con éxito.
        return self::SUCCESS;
    }

    // Esta línea sirve para declarar el método que migra los archivos locales a Cloudinary.
    private function migrate(): int
    {
        // Esta línea sirve para leer si es una simulación.
        $dryRun = (bool) $this->option('dry-run');
        // Esta línea sirve para obtener el cliente de Cloudinary.
        $client = app(CloudinaryClient::class);
        // Esta línea sirve para obtener todas las filas con archivos como arreglo.
        $rows = iterator_to_array($this->rows(), false);
        // Esta línea sirve para crear una barra de progreso con el total de filas.
        $bar = $this->output->createProgressBar(count($rows));

        // Esta línea sirve para recorrer cada fila.
        foreach ($rows as $row) {
            // Esta línea sirve para avanzar la barra de progreso.
            $bar->advance();
            // Esta línea sirve para clasificar el valor de la fila.
            $info = $this->classify($row['value']);

            // Esta línea sirve para revisar si el archivo no es local.
            if ($info['state'] !== 'local') {
                // Esta línea sirve para contarlo según su estado.
                $this->count($info['state']);

                // Esta línea sirve para saltar a la siguiente fila.
                continue;
            }

            // Esta línea sirve para armar una clave única para la fila (tabla.columna#id).
            $key = "{$row['table']}.{$row['column']}#{$row['id']}";
            // Esta línea sirve para obtener el destino (slot) del archivo para esa fila.
            $slot = ($row['slot'])($row['id']);
            // Esta línea sirve para calcular el public_id que tendrá en Cloudinary.
            $publicId = $slot->publicId((string) config('services.cloudinary.folder'));

            // Esta línea sirve para revisar si es una simulación.
            if ($dryRun) {
                // Esta línea sirve para contar que se subiría.
                $this->count('se subiría (dry-run)');
                // Esta línea sirve para mostrar qué archivo se subiría y a dónde (modo detallado).
                $this->line("\n  {$key}: {$info['path']} → {$publicId}", verbosity: 'v');

                // Esta línea sirve para saltar a la siguiente fila.
                continue;
            }

            // Esta línea sirve para intentar subir el archivo.
            try {
                // Esta línea sirve para subir el archivo una sola vez y obtener sus datos.
                $asset = $this->uploadOnce($client, $key, $info['absolute'], $publicId, $slot->resourceType, $info['path']);

                // Solo si la fila sigue apuntando al mismo archivo: si
                // alguien subió otro mientras corría, no se lo pisa.
                // Esta línea sirve para actualizar la fila con la URL de Cloudinary.
                $updated = DB::table($row['table'])
                    // Esta línea sirve para buscar por el id de la fila.
                    ->where('id', $row['id'])
                    // Esta línea sirve para exigir que la columna siga apuntando al mismo archivo.
                    ->where($row['column'], $row['value'])
                    // Esta línea sirve para guardar la URL segura de Cloudinary.
                    ->update([$row['column'] => $asset['secureUrl']]);

                // Esta línea sirve para registrar en el mapa si se aplicó o solo se subió.
                $this->map->put($key, ['status' => $updated ? 'applied' : 'uploaded', 'appliedAt' => now()->toIso8601String()]);
                // Esta línea sirve para contar el resultado.
                $this->count($updated ? 'migrado' : 'subido (la fila cambió, no se tocó)');
                // Esta línea sirve para capturar cualquier error en la subida.
            } catch (Throwable $e) {
                // Esta línea sirve para registrar el error en el mapa.
                $this->map->put($key, ['status' => 'failed', 'error' => $e->getMessage(), 'localPath' => $info['path']]);
                // Esta línea sirve para contar el error.
                $this->count('error');
                // Esta línea sirve para dejar una línea en blanco.
                $this->newLine();
                // Esta línea sirve para mostrar el error en la consola.
                $this->error("  {$key}: {$e->getMessage()}");
            }
        }

        // Esta línea sirve para terminar la barra de progreso.
        $bar->finish();
        // Esta línea sirve para dejar una línea en blanco.
        $this->newLine();

        // Esta línea sirve para devolver falla si hubo errores, si no éxito.
        return ($this->tally['error'] ?? 0) > 0 ? self::FAILURE : self::SUCCESS;
    }

    /**
     * Sube el archivo salvo que ya esté: mismo SHA-256 en el mapa, o el
     * asset ya existe en Cloudinary con el mismo contenido (etag = MD5) —
     * el caso de una corrida que se cortó entre la subida y el registro.
     *
     * @return array<string, mixed> la entrada del mapa
     */
    // Esta línea sirve para declarar el método que sube un archivo solo si no estaba ya subido.
    private function uploadOnce(CloudinaryClient $client, string $key, string $absolute, string $publicId, string $resourceType, string $relative): array
    {
        // Esta línea sirve para calcular el hash SHA-256 del archivo.
        $sha256 = hash_file('sha256', $absolute);
        // Esta línea sirve para buscar la entrada de este archivo en el mapa.
        $entry = $this->map->get($key);

        // Esta línea sirve para revisar si el mapa ya tiene este mismo archivo subido.
        if ($entry && ($entry['sha256'] ?? null) === $sha256 && ($entry['publicId'] ?? null) === $publicId && ! empty($entry['secureUrl'])) {
            // Esta línea sirve para contar que ya estaba subido.
            $this->count('ya estaba subido (mapa)');

            // Esta línea sirve para devolver la entrada del mapa sin volver a subir.
            return $entry;
        }

        // Esta línea sirve para buscar si el archivo ya existe en Cloudinary.
        $existing = $client->find($publicId, $resourceType);
        // Esta línea sirve para usar el existente si su contenido coincide (mismo MD5).
        $response = ($existing && ($existing['etag'] ?? null) === md5_file($absolute))
            // Esta línea sirve para reutilizar el archivo existente sin subir nada.
            ? $existing
            // Esta línea sirve para subir el archivo a Cloudinary en caso contrario.
            : $client->upload($absolute, [
                // Esta línea sirve para indicar el public_id calculado.
                'public_id' => $publicId,
                // Esta línea sirve para indicar el tipo de recurso (imagen o video).
                'resource_type' => $resourceType,
                // Esta línea sirve para sobrescribir el archivo si ya existía.
                'overwrite' => true,
            ]);

        // Esta línea sirve para revisar si se usó el archivo que ya estaba en Cloudinary.
        if ($response === $existing) {
            // Esta línea sirve para contar que ya estaba en Cloudinary.
            $this->count('ya estaba en Cloudinary');
        }

        // Esta línea sirve para guardar en el mapa los datos de la subida.
        $this->map->put($key, $data = [
            // Esta línea sirve para guardar la ruta local original.
            'localPath' => $relative,
            // Esta línea sirve para guardar el hash SHA-256.
            'sha256' => $sha256,
            // Esta línea sirve para guardar el public_id.
            'publicId' => $response['public_id'] ?? $publicId,
            // Esta línea sirve para guardar el tipo de recurso.
            'resourceType' => $response['resource_type'] ?? $resourceType,
            // Esta línea sirve para guardar la URL segura.
            'secureUrl' => $response['secure_url'],
            // Esta línea sirve para guardar el formato del archivo.
            'format' => $response['format'] ?? null,
            // Esta línea sirve para guardar el ancho.
            'width' => $response['width'] ?? null,
            // Esta línea sirve para guardar el alto.
            'height' => $response['height'] ?? null,
            // Esta línea sirve para guardar la duración (videos).
            'duration' => $response['duration'] ?? null,
            // Esta línea sirve para guardar el tamaño en bytes.
            'bytes' => $response['bytes'] ?? null,
            // Esta línea sirve para marcar el estado como subido.
            'status' => 'uploaded',
            // Esta línea sirve para guardar la fecha de subida.
            'uploadedAt' => now()->toIso8601String(),
        ]);

        // Esta línea sirve para devolver los datos guardados en el mapa.
        return $data;
    }

    // Esta línea sirve para declarar el método que comprueba que las URLs de Cloudinary respondan.
    private function verify(): int
    {
        // Esta línea sirve para iniciar la lista de URLs a comprobar.
        $urls = [];
        // Esta línea sirve para recorrer cada fila con archivos.
        foreach ($this->rows() as $row) {
            // Esta línea sirve para revisar si la URL es de Cloudinary.
            if (CloudinaryUrl::isCloudinary($row['value'])) {
                // Esta línea sirve para agregarla a la lista con su clave.
                $urls["{$row['table']}.{$row['column']}#{$row['id']}"] = $row['value'];
            }
        }

        // Esta línea sirve para recorrer cada URL a comprobar.
        foreach ($urls as $key => $url) {
            // Esta línea sirve para comprobar si la URL responde.
            $ok = $this->urlResponds($url);
            // Esta línea sirve para contar si responde o no.
            $this->count($ok ? 'responde' : 'NO responde');
            // Esta línea sirve para revisar si el archivo está en el mapa.
            if ($this->map->get($key)) {
                // Esta línea sirve para guardar en el mapa el resultado de la verificación.
                $this->map->put($key, ['verifiedAt' => $ok ? now()->toIso8601String() : null, 'verifyOk' => $ok]);
            }
            // Esta línea sirve para revisar si la URL no responde.
            if (! $ok) {
                // Esta línea sirve para mostrar el error con la URL.
                $this->error("  {$key}: {$url}");
            }
        }

        // Esta línea sirve para devolver falla si alguna URL no respondió, si no éxito.
        return ($this->tally['NO responde'] ?? 0) > 0 ? self::FAILURE : self::SUCCESS;
    }

    /**
     * Borra del disco public solo lo que cumple TODO: migrado y aplicado,
     * la URL de Cloudinary responde ahora mismo, y ninguna columna de la
     * base sigue apuntando a esa ruta local.
     */
    // Esta línea sirve para declarar el método que borra los archivos locales ya migrados.
    private function cleanup(): int
    {
        // Esta línea sirve para leer si se pidió borrar de verdad (--force y sin simulación).
        $force = (bool) $this->option('force') && ! $this->option('dry-run');
        // Esta línea sirve para revisar si no se va a borrar de verdad.
        if (! $force) {
            // Esta línea sirve para avisar que es una simulación.
            $this->warn('Simulación: agrega --force para borrar de verdad.');
        }

        // Esta línea sirve para recorrer cada entrada del mapa.
        foreach ($this->map->all() as $key => $entry) {
            // Esta línea sirve para obtener la ruta local del archivo.
            $path = $entry['localPath'] ?? null;
            // Esta línea sirve para revisar si no está aplicado o no tiene ruta.
            if (($entry['status'] ?? null) !== 'applied' || ! $path) {
                // Esta línea sirve para saltar a la siguiente entrada.
                continue;
            }
            // Esta línea sirve para revisar si el archivo local ya no existe.
            if (! Storage::disk('public')->exists($path)) {
                // Esta línea sirve para contar que ya no existe.
                $this->count('ya no existe localmente');

                // Esta línea sirve para saltar a la siguiente entrada.
                continue;
            }
            // Esta línea sirve para revisar si alguna fila de la base todavía usa esa ruta.
            if ($this->stillReferenced($path)) {
                // Esta línea sirve para contar que se conserva.
                $this->count('se conserva: la base aún la usa');

                // Esta línea sirve para saltar a la siguiente entrada.
                continue;
            }
            // Esta línea sirve para revisar si la URL de Cloudinary no responde.
            if (! $this->urlResponds((string) $entry['secureUrl'])) {
                // Esta línea sirve para contar que se conserva.
                $this->count('se conserva: Cloudinary no responde');

                // Esta línea sirve para saltar a la siguiente entrada.
                continue;
            }

            // Esta línea sirve para revisar si hay que borrar de verdad.
            if ($force) {
                // Esta línea sirve para borrar el archivo local.
                Storage::disk('public')->delete($path);
                // Esta línea sirve para registrar en el mapa la fecha de borrado.
                $this->map->put($key, ['localDeletedAt' => now()->toIso8601String()]);
                // Esta línea sirve para contar el archivo borrado.
                $this->count('archivo local borrado');
                // Esta línea sirve para manejar el caso de una simulación.
            } else {
                // Esta línea sirve para contar que se borraría.
                $this->count('se borraría (usa --force)');
                // Esta línea sirve para mostrar la ruta (modo detallado).
                $this->line("  {$path}", verbosity: 'v');
            }
        }

        // Esta línea sirve para terminar con éxito.
        return self::SUCCESS;
    }

    /**
     * @return \Generator<array{table: string, column: string, slot: callable, id: int, value: string}>
     */
    // Esta línea sirve para declarar el método que recorre las filas de la base que tienen archivos.
    private function rows(): \Generator
    {
        // Esta línea sirve para recorrer cada tabla y columna que guarda archivos.
        foreach (MediaColumns::all() as $target) {
            // Esta línea sirve para armar la consulta de esa tabla.
            $query = DB::table($target['table'])
                // Esta línea sirve para exigir que la columna no sea null.
                ->whereNotNull($target['column'])
                // Esta línea sirve para exigir que la columna no esté vacía.
                ->where($target['column'], '!=', '')
                // Esta línea sirve para ordenar por id.
                ->orderBy('id');

            // Esta línea sirve para recorrer los registros uno por uno sin cargarlos todos en memoria.
            foreach ($query->cursor() as $record) {
                // Esta línea sirve para entregar la fila con su tabla, columna, id y valor.
                yield [...$target, 'id' => (int) $record->id, 'value' => (string) $record->{$target['column']}];
            }
        }
    }

    /**
     * @return array{state: string, path?: string, absolute?: string}
     */
    // Esta línea sirve para declarar el método que clasifica el valor de una columna.
    private function classify(string $value): array
    {
        // Esta línea sirve para revisar si ya es una URL de Cloudinary.
        if (CloudinaryUrl::isCloudinary($value)) {
            // Esta línea sirve para devolver el estado "ya en Cloudinary".
            return ['state' => 'ya en Cloudinary'];
        }

        // Esta línea sirve para obtener la ruta local a partir de la URL.
        $path = LocalPublicMediaStorage::pathFromUrl($value);
        // Esta línea sirve para revisar si no es una URL del disco local.
        if ($path === null) {
            // Esta línea sirve para devolver el estado "link externo".
            return ['state' => 'link externo (se deja igual)'];
        }

        // Esta línea sirve para revisar si el archivo local no existe.
        if (! Storage::disk('public')->exists($path)) {
            // Esta línea sirve para devolver el estado "falta el archivo local".
            return ['state' => 'falta el archivo local'];
        }

        // Esta línea sirve para devolver el estado "local" con su ruta relativa y absoluta.
        return ['state' => 'local', 'path' => $path, 'absolute' => Storage::disk('public')->path($path)];
    }

    // Esta línea sirve para declarar el método que revisa si alguna fila sigue usando una ruta.
    private function stillReferenced(string $path): bool
    {
        // Esta línea sirve para recorrer cada tabla y columna que guarda archivos.
        foreach (MediaColumns::all() as $target) {
            // Esta línea sirve para revisar si alguna fila apunta a esa ruta local.
            if (DB::table($target['table'])->where($target['column'], 'like', '%/storage/'.$path)->exists()) {
                // Esta línea sirve para devolver verdadero porque todavía se usa.
                return true;
            }
        }

        // Esta línea sirve para devolver falso porque nadie la usa.
        return false;
    }

    // Esta línea sirve para declarar el método que comprueba si una URL responde.
    private function urlResponds(string $url): bool
    {
        // Esta línea sirve para intentar la petición.
        try {
            // Esta línea sirve para hacer una petición HEAD con 15 segundos de espera y ver si fue exitosa.
            return Http::timeout(15)->head($url)->successful();
            // Esta línea sirve para capturar cualquier error de red.
        } catch (Throwable) {
            // Esta línea sirve para devolver falso porque no respondió.
            return false;
        }
    }

    // Esta línea sirve para declarar el método que revisa si están las credenciales de Cloudinary.
    private function credentialsPresent(): bool
    {
        // Esta línea sirve para revisar que exista el nombre de la cuenta.
        return filled(config('services.cloudinary.cloud_name'))
            // Esta línea sirve para exigir también la API key.
            && filled(config('services.cloudinary.api_key'))
            // Esta línea sirve para exigir también el API secret.
            && filled(config('services.cloudinary.api_secret'));
    }

    // Esta línea sirve para declarar el método que suma uno al contador de una categoría.
    private function count(string $label): void
    {
        // Esta línea sirve para sumar uno a esa categoría (empezando en 0).
        $this->tally[$label] = ($this->tally[$label] ?? 0) + 1;
    }
}
