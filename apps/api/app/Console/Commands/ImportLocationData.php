<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los comandos de consola.

namespace App\Console\Commands;

// Esta línea sirve para importar el modelo Country (país).
use App\Models\Country;
// Esta línea sirve para importar la clase base de los comandos de Artisan.
use Illuminate\Console\Command;
// Esta línea sirve para importar la fachada DB para consultar e insertar datos.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar el cliente HTTP para descargar los archivos.
use Illuminate\Support\Facades\Http;
// Esta línea sirve para importar la fachada Storage para guardar en caché los archivos descargados.
use Illuminate\Support\Facades\Storage;

/**
 * ETL de una sola vez (re-corrible) que reemplaza el placeholder "Nacional"
 * de StateSeeder con datos reales de departamentos/estados y ciudades para
 * TODOS los países, tomados de dr5hn/countries-states-cities-database
 * (MIT). Sin dependencia de red en runtime — esto puebla la DB local una
 * vez (o cada tanto), OnboardingController siempre lee de `states`/`cities`
 * locales.
 *
 * Estrictamente aditivo: nunca borra ni renombra un Country/State/City
 * existente. La única excepción es el placeholder "Nacional" que
 * StateSeeder creó para países sin datos reales — se borra por país SOLO
 * si, tras el import, ya no tiene ninguna ciudad apuntándole (se verifica
 * con una query antes de borrar, nunca se asume). Si un país no tiene
 * datos reales en la fuente, su "Nacional" queda intacto (sigue siendo la
 * única opción de estado para ese país) — más vale una opción de más que
 * perder la única que tenía.
 *
 * Cachea los JSON de ciudades descargados en storage/app/location-import/
 * para poder resumir sin re-descargar 223 archivos si el comando se corta
 * a la mitad; `--fresh` fuerza re-descarga.
 */
// Esta línea sirve para declarar el comando que importa países, departamentos y ciudades reales.
class ImportLocationData extends Command
{
    // Esta línea sirve para definir el nombre del comando y sus opciones.
    protected $signature = 'location:import
        {--only= : Lista de códigos ISO2 separados por coma (ej. CO,MX,ES) para limitar el import}
        {--skip-cities : Solo importar countries+states, saltar el import (lento) de ciudades}
        {--fresh : Forzar re-descarga de los JSON de ciudades aunque ya estén cacheados}';

    // Esta línea sirve para definir la descripción que se muestra en la ayuda de Artisan.
    protected $description = 'Importa países/estados/ciudades reales desde countries-states-cities-database hacia la DB local (reemplaza el placeholder "Nacional").';

    // Esta línea sirve para definir la URL del CSV de países.
    private const COUNTRIES_CSV_URL = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/csv/countries.csv';

    // Esta línea sirve para definir la URL del CSV de departamentos/estados.
    private const STATES_CSV_URL = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/csv/states.csv';

    // Esta línea sirve para definir la plantilla de URL del JSON de ciudades de cada país.
    private const CITY_JSON_URL = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/contributions/cities/%s.json';

    // Esta línea sirve para definir la carpeta donde se guardan los archivos descargados.
    private const CACHE_DIR = 'location-import';

    // Esta línea sirve para declarar el método principal del comando.
    public function handle(): int
    {
        // El JSON de ciudades de países grandes (US, ID, BR...) pesa varios
        // MB decodificado en memoria — sin límite para no abortar a mitad
        // de país (procesamos y liberamos país por país, no acumulamos).
        // Esta línea sirve para quitar el límite de memoria para procesar archivos grandes.
        ini_set('memory_limit', '-1');
        // Esta línea sirve para quitar el límite de tiempo de ejecución.
        set_time_limit(0);

        // Esta línea sirve para leer la opción --only con los países a importar.
        $only = $this->option('only')
            // Esta línea sirve para convertirla en una lista de códigos en mayúsculas.
            ? array_map(fn (string $c) => strtoupper(trim($c)), explode(',', $this->option('only')))
            // Esta línea sirve para dejar null si no se usó la opción.
            : null;

        // Esta línea sirve para mostrar que empieza el paso 1.
        $this->info('Paso 1/3 — países y departamentos/estados desde el CSV maestro...');
        // Esta línea sirve para importar los países y obtener sus ids por código.
        $countryIdByCode = $this->importCountries();
        // Esta línea sirve para importar los departamentos/estados y obtener sus ids.
        $stateIdByCountryAndCode = $this->importStates($countryIdByCode);

        // Esta línea sirve para revisar si se pidió saltar las ciudades.
        if ($this->option('skip-cities')) {
            // Esta línea sirve para avisar que se omiten las ciudades.
            $this->info('--skip-cities: se omite el import de ciudades.');

            // Esta línea sirve para terminar con éxito.
            return self::SUCCESS;
        }

        // Esta línea sirve para mostrar que empieza el paso 2.
        $this->info('Paso 2/3 — ciudades por país (esto tarda varios minutos)...');
        // Esta línea sirve para importar las ciudades de cada país.
        $this->importCities($countryIdByCode, $stateIdByCountryAndCode, $only);

        // Esta línea sirve para mostrar que empieza el paso 3.
        $this->info('Paso 3/3 — limpiando placeholders "Nacional" que quedaron huérfanos...');
        // Esta línea sirve para borrar los "Nacional" que quedaron sin ciudades.
        $this->cleanupOrphanedNacionalStates();

        // Esta línea sirve para mostrar que terminó.
        $this->info('Listo.');

        // Esta línea sirve para terminar con éxito.
        return self::SUCCESS;
    }

    /**
     * @return array<string, int> iso2 (mayúsculas) => id local
     */
    // Esta línea sirve para declarar el método que importa los países.
    private function importCountries(): array
    {
        // Esta línea sirve para leer las filas del CSV de países.
        $rows = $this->readCsv(self::COUNTRIES_CSV_URL, 'countries.csv');

        // Esta línea sirve para obtener los países que ya existen (código => id).
        $existing = Country::query()->pluck('id', 'code')->all(); // 'CO' => 1
        // Esta línea sirve para iniciar el mapa de países existentes en mayúsculas.
        $existingByCode = [];
        // Esta línea sirve para recorrer los países existentes.
        foreach ($existing as $code => $id) {
            // Esta línea sirve para guardarlos con el código en mayúsculas.
            $existingByCode[strtoupper((string) $code)] = $id;
        }

        // Esta línea sirve para iniciar la lista de países a insertar.
        $toInsert = [];
        // Esta línea sirve para recorrer cada fila del CSV.
        foreach ($rows as $row) {
            // Esta línea sirve para obtener el código ISO2 en mayúsculas.
            $code = strtoupper(trim($row['iso2'] ?? ''));
            // Esta línea sirve para obtener el nombre del país.
            $name = trim($row['name'] ?? '');
            // Esta línea sirve para revisar si falta código o nombre, o el país ya existe.
            if ($code === '' || $name === '' || isset($existingByCode[$code])) {
                // Esta línea sirve para saltar a la siguiente fila.
                continue;
            }
            // Esta línea sirve para agregar el país a la lista de inserción.
            $toInsert[$code] = $name;
        }

        // Esta línea sirve para revisar si hay países para insertar.
        if ($toInsert !== []) {
            // Esta línea sirve para guardar la fecha y hora actual.
            $now = now();
            // Esta línea sirve para armar las filas a insertar.
            $rowsToInsert = array_map(fn (string $code, string $name) => [
                // Esta línea sirve para guardar el código del país.
                'code' => $code,
                // Esta línea sirve para guardar el nombre del país.
                'name' => $name,
                // Esta línea sirve para guardar la fecha de creación.
                'created_at' => $now,
                // Esta línea sirve para guardar la fecha de actualización.
                'updated_at' => $now,
                // Esta línea sirve para combinar la lista de códigos con la de nombres.
            ], array_keys($toInsert), array_values($toInsert));

            // Esta línea sirve para recorrer las filas en bloques de 200.
            foreach (array_chunk($rowsToInsert, 200) as $chunk) {
                // Esta línea sirve para insertar el bloque ignorando duplicados.
                DB::table('countries')->insertOrIgnore($chunk);
            }
            // Esta línea sirve para mostrar cuántos países se insertaron.
            $this->line('  '.count($toInsert).' países nuevos insertados (faltaban en la base local).');
            // Esta línea sirve para manejar el caso en que no hubo países nuevos.
        } else {
            // Esta línea sirve para mostrar que no hubo países nuevos.
            $this->line('  Sin países nuevos — la base local ya cubre todo lo que trae el CSV.');
        }

        // Esta línea sirve para iniciar el mapa final de países.
        $map = [];
        // Esta línea sirve para recorrer todos los países de la base.
        foreach (Country::query()->pluck('id', 'code') as $code => $id) {
            // Esta línea sirve para guardar su id con el código en mayúsculas.
            $map[strtoupper((string) $code)] = $id;
        }

        // Esta línea sirve para devolver el mapa de código a id.
        return $map;
    }

    /**
     * @param  array<string, int>  $countryIdByCode
     * @return array<string, array<string, int>> country_code => [state_code (iso2 del state) => state_id local]
     */
    // Esta línea sirve para declarar el método que importa los departamentos/estados.
    private function importStates(array $countryIdByCode): array
    {
        // Esta línea sirve para leer las filas del CSV de estados.
        $rows = $this->readCsv(self::STATES_CSV_URL, 'states.csv');

        // Agrupar filas de la fuente por country_code para no reconsultar
        // la DB fila por fila.
        // Esta línea sirve para iniciar el agrupamiento de filas por país.
        $byCountry = [];
        // Esta línea sirve para recorrer cada fila del CSV.
        foreach ($rows as $row) {
            // Esta línea sirve para obtener el código del país en mayúsculas.
            $countryCode = strtoupper(trim($row['country_code'] ?? ''));
            // Esta línea sirve para revisar si falta el código o el país no existe localmente.
            if ($countryCode === '' || ! isset($countryIdByCode[$countryCode])) {
                // Esta línea sirve para saltar a la siguiente fila.
                continue;
            }
            // Esta línea sirve para agregar la fila al grupo de su país.
            $byCountry[$countryCode][] = $row;
        }

        // Esta línea sirve para iniciar el mapa de estados por país y código.
        $stateIdByCountryAndCode = [];
        // Esta línea sirve para iniciar el contador de estados insertados.
        $totalInserted = 0;
        // Esta línea sirve para guardar la fecha y hora actual.
        $now = now();

        // Esta línea sirve para recorrer cada país con sus filas.
        foreach ($byCountry as $countryCode => $countryRows) {
            // Esta línea sirve para obtener el id local del país.
            $countryId = $countryIdByCode[$countryCode];

            // Esta línea sirve para obtener los estados que ya existen en ese país (nombre => id).
            $existingByName = DB::table('states')->where('country_id', $countryId)->pluck('id', 'name')->all();

            // Esta línea sirve para iniciar la lista de estados a insertar.
            $toInsert = [];
            // Esta línea sirve para recorrer cada fila del país.
            foreach ($countryRows as $row) {
                // Esta línea sirve para obtener el nombre del estado.
                $name = trim($row['name'] ?? '');
                // Esta línea sirve para revisar si falta el nombre o ya existe.
                if ($name === '' || isset($existingByName[$name])) {
                    // Esta línea sirve para saltar a la siguiente fila.
                    continue;
                }
                // Puede haber states.csv con nombres duplicados dentro del
                // mismo país en casos raros de la fuente — nos quedamos con
                // el primero.
                // Esta línea sirve para revisar si el nombre ya estaba en la lista (duplicado de la fuente).
                if (isset($toInsert[$name])) {
                    // Esta línea sirve para saltar a la siguiente fila.
                    continue;
                }
                // Esta línea sirve para agregar el estado a la lista de inserción.
                $toInsert[$name] = [
                    // Esta línea sirve para guardar el id del país.
                    'country_id' => $countryId,
                    // Esta línea sirve para guardar el nombre del estado.
                    'name' => $name,
                    // Esta línea sirve para guardar la fecha de creación.
                    'created_at' => $now,
                    // Esta línea sirve para guardar la fecha de actualización.
                    'updated_at' => $now,
                ];
            }

            // Esta línea sirve para revisar si hay estados para insertar.
            if ($toInsert !== []) {
                // Esta línea sirve para recorrer los estados en bloques de 200.
                foreach (array_chunk(array_values($toInsert), 200) as $chunk) {
                    // Esta línea sirve para insertar el bloque ignorando duplicados.
                    DB::table('states')->insertOrIgnore($chunk);
                }
                // Esta línea sirve para sumar los insertados al total.
                $totalInserted += count($toInsert);
            }

            // Releer para tener id local de TODOS los states del país
            // (los que ya existían + los recién insertados).
            // Esta línea sirve para volver a leer todos los estados del país (nombre => id).
            $nameToId = DB::table('states')->where('country_id', $countryId)->pluck('id', 'name');

            // Esta línea sirve para iniciar el mapa de código de estado a id.
            $codeMap = [];
            // Esta línea sirve para recorrer cada fila del país.
            foreach ($countryRows as $row) {
                // Esta línea sirve para obtener el nombre del estado.
                $name = trim($row['name'] ?? '');
                // Esta línea sirve para obtener el código ISO2 del estado en mayúsculas.
                $stateCode = strtoupper(trim($row['iso2'] ?? ''));
                // Esta línea sirve para revisar si falta el código o el estado no está en la base.
                if ($stateCode === '' || ! isset($nameToId[$name])) {
                    // Esta línea sirve para saltar a la siguiente fila.
                    continue;
                }
                // Esta línea sirve para guardar el id del estado por su código.
                $codeMap[$stateCode] = $nameToId[$name];
            }
            // Esta línea sirve para guardar el mapa de códigos de este país.
            $stateIdByCountryAndCode[$countryCode] = $codeMap;
        }

        // Esta línea sirve para mostrar cuántos estados se insertaron y en cuántos países.
        $this->line("  {$totalInserted} departamentos/estados nuevos insertados en ".count($byCountry).' países.');

        // Esta línea sirve para devolver el mapa de estados por país.
        return $stateIdByCountryAndCode;
    }

    /**
     * @param  array<string, int>  $countryIdByCode
     * @param  array<string, array<string, int>>  $stateIdByCountryAndCode
     * @param  array<int, string>|null  $only
     */
    // Esta línea sirve para declarar el método que importa las ciudades.
    private function importCities(array $countryIdByCode, array $stateIdByCountryAndCode, ?array $only): void
    {
        // Esta línea sirve para obtener los códigos de todos los países.
        $codes = array_keys($countryIdByCode);
        // Esta línea sirve para ordenarlos alfabéticamente.
        sort($codes);
        // Esta línea sirve para revisar si se limitó a algunos países.
        if ($only !== null) {
            // Esta línea sirve para quedarse solo con esos países.
            $codes = array_values(array_intersect($codes, $only));
        }

        // Esta línea sirve para guardar el total de países a procesar.
        $total = count($codes);
        // Esta línea sirve para iniciar el contador de países procesados.
        $i = 0;

        // Esta línea sirve para recorrer cada país.
        foreach ($codes as $code) {
            // Esta línea sirve para aumentar el contador.
            $i++;
            // Esta línea sirve para obtener el id local del país.
            $countryId = $countryIdByCode[$code];
            // Esta línea sirve para obtener el mapa de estados del país.
            $codeMap = $stateIdByCountryAndCode[$code] ?? [];

            // Esta línea sirve para intentar descargar las ciudades del país.
            try {
                // Esta línea sirve para obtener el JSON de ciudades (de la caché o de internet).
                $json = $this->fetchCityJson($code);
                // Esta línea sirve para capturar cualquier error de red.
            } catch (\Throwable $e) {
                // Un solo país con problema de red (timeout, DNS, etc.) no
                // debe tirar abajo horas de progreso ya hecho — se loguea
                // y se sigue; el comando es re-corrible, así que una
                // segunda pasada retoma justo los que fallaron (los que ya
                // se cachearon en storage/app/location-import/cities/ se
                // saltan la descarga y son casi instantáneos).
                // Esta línea sirve para avisar del error y que se puede reintentar.
                $this->warn("  [{$i}/{$total}] {$code}: error de red ({$e->getMessage()}), se omite — reintentar con otra corrida del comando.");

                // Esta línea sirve para saltar al siguiente país.
                continue;
            }
            // Esta línea sirve para revisar si la fuente no tiene archivo de ciudades.
            if ($json === null) {
                // Esta línea sirve para avisar que se omite el país.
                $this->line("  [{$i}/{$total}] {$code}: sin archivo de ciudades en la fuente, se omite.");

                // Esta línea sirve para saltar al siguiente país.
                continue;
            }

            // Esta línea sirve para revisar si el país no tiene estados reales.
            if ($codeMap === []) {
                // Esta línea sirve para avisar que se omite el país.
                $this->line("  [{$i}/{$total}] {$code}: sin estados reales resueltos, se omite (quedan las ciudades ya existentes).");
                // Esta línea sirve para liberar el JSON de la memoria.
                unset($json);

                // Esta línea sirve para saltar al siguiente país.
                continue;
            }

            // Esta línea sirve para convertir el JSON en un arreglo (ids grandes como texto).
            $decoded = json_decode($json, true, flags: JSON_BIGINT_AS_STRING);
            // Esta línea sirve para liberar el texto JSON de la memoria.
            unset($json);

            // Esta línea sirve para revisar si el JSON no es válido.
            if (! is_array($decoded)) {
                // Esta línea sirve para avisar que el JSON es inválido.
                $this->warn("  [{$i}/{$total}] {$code}: JSON inválido, se omite.");

                // Esta línea sirve para saltar al siguiente país.
                continue;
            }

            // Esta línea sirve para guardar la fecha y hora actual.
            $now = now();
            // Esta línea sirve para iniciar el lote de filas a insertar.
            $rows = [];
            // Esta línea sirve para iniciar el registro de ciudades ya vistas en el lote.
            $seenInBatch = [];
            // Esta línea sirve para iniciar el contador de ciudades importadas.
            $matched = 0;
            // Esta línea sirve para iniciar el contador de ciudades omitidas.
            $skippedNoState = 0;

            // Esta línea sirve para recorrer cada ciudad del JSON.
            foreach ($decoded as $city) {
                // Esta línea sirve para obtener el nombre de la ciudad.
                $name = trim((string) ($city['name'] ?? ''));
                // Esta línea sirve para obtener el código del estado de la ciudad.
                $stateCode = strtoupper(trim((string) ($city['state_code'] ?? '')));
                // Esta línea sirve para revisar si falta el nombre, el código o el estado no existe.
                if ($name === '' || $stateCode === '' || ! isset($codeMap[$stateCode])) {
                    // Esta línea sirve para sumar una ciudad omitida.
                    $skippedNoState++;

                    // Esta línea sirve para saltar a la siguiente ciudad.
                    continue;
                }
                // Esta línea sirve para obtener el id local del estado.
                $stateId = $codeMap[$stateCode];

                // El propio JSON fuente trae algún duplicado exacto
                // (mismo estado + mismo nombre) en un puñado de países —
                // el upsert lo tolera igual, pero evitamos filas repetidas
                // en el mismo lote de insert.
                // Esta línea sirve para armar una clave única con estado y nombre.
                $key = $stateId.'|'.$name;
                // Esta línea sirve para revisar si la ciudad ya estaba en el lote.
                if (isset($seenInBatch[$key])) {
                    // Esta línea sirve para saltar a la siguiente ciudad.
                    continue;
                }
                // Esta línea sirve para marcar la ciudad como vista.
                $seenInBatch[$key] = true;

                // Esta línea sirve para agregar la ciudad al lote.
                $rows[] = [
                    // Esta línea sirve para guardar el id del país.
                    'country_id' => $countryId,
                    // Esta línea sirve para guardar el id del estado.
                    'state_id' => $stateId,
                    // Esta línea sirve para guardar el nombre de la ciudad.
                    'name' => $name,
                    // Esta línea sirve para guardar la fecha de creación.
                    'created_at' => $now,
                    // Esta línea sirve para guardar la fecha de actualización.
                    'updated_at' => $now,
                ];
                // Esta línea sirve para sumar una ciudad importada.
                $matched++;

                // Esta línea sirve para revisar si el lote llegó a 500 filas.
                if (count($rows) >= 500) {
                    // Esta línea sirve para insertar o actualizar el lote (único por estado y nombre).
                    DB::table('cities')->upsert($rows, ['state_id', 'name'], ['country_id', 'updated_at']);
                    // Esta línea sirve para vaciar el lote.
                    $rows = [];
                }
            }

            // Esta línea sirve para revisar si quedaron filas sin insertar.
            if ($rows !== []) {
                // Esta línea sirve para insertar o actualizar las filas restantes.
                DB::table('cities')->upsert($rows, ['state_id', 'name'], ['country_id', 'updated_at']);
            }

            // Esta línea sirve para liberar de la memoria los datos del país.
            unset($decoded, $seenInBatch);

            // Esta línea sirve para mostrar el resultado del país.
            $this->line("  [{$i}/{$total}] {$code}: {$matched} ciudades importadas, {$skippedNoState} omitidas (sin estado resuelto).");
        }
    }

    // Esta línea sirve para declarar el método que borra los "Nacional" sin ciudades.
    private function cleanupOrphanedNacionalStates(): void
    {
        // Esta línea sirve para consultar los países que ya tienen estados reales.
        $countriesWithRealStates = DB::table('states')
            // Esta línea sirve para excluir los estados que se llaman "Nacional".
            ->where('name', '!=', 'Nacional')
            // Esta línea sirve para quitar los repetidos.
            ->distinct()
            // Esta línea sirve para obtener los ids de los países.
            ->pluck('country_id');

        // Esta línea sirve para consultar los estados "Nacional" candidatos a borrar.
        $candidates = DB::table('states')
            // Esta línea sirve para filtrar los estados que se llaman "Nacional".
            ->where('name', 'Nacional')
            // Esta línea sirve para filtrar los de países que ya tienen estados reales.
            ->whereIn('country_id', $countriesWithRealStates)
            // Esta línea sirve para obtener su id y país.
            ->get(['id', 'country_id']);

        // Esta línea sirve para iniciar el contador de borrados.
        $deleted = 0;
        // Esta línea sirve para recorrer cada candidato.
        foreach ($candidates as $state) {
            // Confirmar (no asumir) que ninguna ciudad sigue apuntando a
            // este "Nacional" antes de borrarlo.
            // Esta línea sirve para revisar si alguna ciudad todavía apunta a ese estado.
            $stillReferenced = DB::table('cities')->where('state_id', $state->id)->exists();
            // Esta línea sirve para revisar si todavía se usa.
            if ($stillReferenced) {
                // Esta línea sirve para saltar al siguiente candidato.
                continue;
            }
            // Esta línea sirve para borrar el estado "Nacional".
            DB::table('states')->where('id', $state->id)->delete();
            // Esta línea sirve para sumar uno a los borrados.
            $deleted++;
        }

        // Esta línea sirve para mostrar cuántos "Nacional" se borraron.
        $this->line("  {$deleted} placeholders \"Nacional\" huérfanos eliminados (de ".count($candidates).' candidatos con estados reales disponibles).');
    }

    /**
     * @return array<int, array<string, string>>
     */
    // Esta línea sirve para declarar el método que lee un CSV (descargándolo si hace falta).
    private function readCsv(string $url, string $cacheName): array
    {
        // Esta línea sirve para armar la ruta del archivo en la caché.
        $path = self::CACHE_DIR.'/'.$cacheName;
        // Esta línea sirve para revisar si se pidió re-descargar o el archivo no está en caché.
        if ($this->option('fresh') || ! Storage::exists($path)) {
            // Esta línea sirve para descargar el CSV con 60 segundos de espera.
            $response = Http::timeout(60)->get($url);
            // Esta línea sirve para lanzar un error si la descarga falló.
            $response->throw();
            // Esta línea sirve para guardar el CSV en la caché.
            Storage::put($path, $response->body());
        }

        // Vía archivo real (no php://memory + split manual de líneas): los
        // CSV fuente tienen campos entrecomillados que pueden contener
        // comas y, en algún caso raro, saltos de línea — fgetcsv() sobre
        // un stream de archivo real los maneja correctamente; partir el
        // contenido por línea a mano de antemano los rompería.
        // Esta línea sirve para abrir el archivo CSV para leerlo.
        $handle = fopen(Storage::path($path), 'r');

        // Esta línea sirve para leer la primera fila como encabezado.
        $header = fgetcsv($handle);
        // Esta línea sirve para iniciar la lista de filas.
        $rows = [];
        // Esta línea sirve para leer cada fila hasta el final del archivo.
        while (($data = fgetcsv($handle)) !== false) {
            // Esta línea sirve para revisar si la fila no tiene la misma cantidad de columnas que el encabezado.
            if (count($data) !== count($header)) {
                // Esta línea sirve para saltar la fila inválida.
                continue;
            }
            // Esta línea sirve para combinar encabezado y valores en un arreglo asociativo.
            $rows[] = array_combine($header, $data);
        }
        // Esta línea sirve para cerrar el archivo.
        fclose($handle);

        // Esta línea sirve para devolver las filas leídas.
        return $rows;
    }

    // Esta línea sirve para declarar el método que obtiene el JSON de ciudades de un país.
    private function fetchCityJson(string $isoCode): ?string
    {
        // Esta línea sirve para armar la ruta del archivo en la caché.
        $path = self::CACHE_DIR.'/cities/'.$isoCode.'.json';

        // Esta línea sirve para revisar si no se pidió re-descargar y el archivo está en caché.
        if (! $this->option('fresh') && Storage::exists($path)) {
            // Esta línea sirve para devolver el contenido guardado.
            return Storage::get($path);
        }

        // Esta línea sirve para armar la URL del JSON del país.
        $url = sprintf(self::CITY_JSON_URL, $isoCode);
        // Esta línea sirve para descargarlo con 120 segundos de espera y hasta 3 reintentos.
        $response = Http::timeout(120)->retry(3, 2000, throw: false)->get($url);

        // Esta línea sirve para revisar si la fuente respondió 404 (no existe).
        if ($response->status() === 404) {
            // Esta línea sirve para devolver null porque el país no tiene archivo.
            return null;
        }
        // Esta línea sirve para lanzar un error si la descarga falló.
        $response->throw();

        // Esta línea sirve para obtener el contenido descargado.
        $body = $response->body();
        // Esta línea sirve para guardarlo en la caché.
        Storage::put($path, $body);

        // Esta línea sirve para devolver el contenido.
        return $body;
    }
}
