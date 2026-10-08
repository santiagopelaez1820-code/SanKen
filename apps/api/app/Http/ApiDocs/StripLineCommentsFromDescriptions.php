<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de la documentación de la API.

namespace App\Http\ApiDocs;

// Esta línea sirve para importar la interfaz de los transformadores del documento de Scramble.
use Dedoc\Scramble\Contracts\DocumentTransformer;
// Esta línea sirve para importar el contexto de la generación de la documentación.
use Dedoc\Scramble\OpenApiContext;
// Esta línea sirve para importar la clase que representa el documento OpenAPI completo.
use Dedoc\Scramble\Support\Generator\OpenApi;
// Esta línea sirve para importar ReflectionObject para leer y cambiar las propiedades de cada objeto.
use ReflectionObject;
// Esta línea sirve para importar SplObjectStorage para recordar los objetos ya revisados.
use SplObjectStorage;

/**
 * Scramble usa como descripción de un campo cualquier comentario `//` que
 * tenga encima: claves de arreglos (respuestas y reglas de validación),
 * `return` y llamadas a $request->query(). Como el código lleva un
 * comentario "Esta línea sirve para ..." sobre cada línea (pensado para
 * quien lee el código, no para quien usa la API), sin esto Swagger mostraría
 * esos comentarios como descripción de cientos de campos.
 *
 * Recorre el documento ya generado y corta cada descripción donde empieza
 * ese comentario: siempre es el último, porque va justo encima de la línea.
 * Lo que había antes (un comentario que sí explica el campo) se conserva.
 * Registrado en AppServiceProvider::boot().
 */
// Esta línea sirve para declarar el transformador que limpia las descripciones del documento.
class StripLineCommentsFromDescriptions implements DocumentTransformer
{
    // Esta línea sirve para definir el texto con el que empieza cada comentario línea por línea.
    public const MARKER = 'Esta línea sirve para';

    // Esta línea sirve para declarar el método que Scramble llama con el documento ya generado.
    public function handle(OpenApi $document, OpenApiContext $context): void
    {
        // Esta línea sirve para recorrer todo el documento empezando por la raíz.
        $this->walk($document, new SplObjectStorage);
    }

    // Esta línea sirve para declarar el método que limpia una descripción.
    public static function clean(string $description): string
    {
        // Esta línea sirve para buscar dónde empieza el comentario línea por línea.
        $position = mb_strpos($description, self::MARKER);

        // Esta línea sirve para devolver la descripción sin cambios si no lo tiene, o solo el texto anterior.
        return $position === false ? $description : rtrim(mb_substr($description, 0, $position));
    }

    // Esta línea sirve para declarar el método que recorre el documento buscando descripciones.
    private function walk(mixed $value, SplObjectStorage $visited): void
    {
        // Esta línea sirve para revisar si el valor es un arreglo.
        if (is_array($value)) {
            // Esta línea sirve para recorrer cada elemento del arreglo.
            foreach ($value as $item) {
                // Esta línea sirve para revisar ese elemento.
                $this->walk($item, $visited);
            }

            // Esta línea sirve para terminar con el arreglo.
            return;
        }

        // Esta línea sirve para ignorar lo que no sea un objeto del documento de Scramble o ya se haya revisado.
        if (! is_object($value) || ! str_starts_with($value::class, 'Dedoc\\Scramble\\Support\\Generator\\') || $visited->contains($value)) {
            // Esta línea sirve para terminar sin revisar nada.
            return;
        }

        // Esta línea sirve para marcar el objeto como revisado (evita ciclos entre referencias).
        $visited->attach($value);

        // Esta línea sirve para recorrer las propiedades del objeto.
        foreach ((new ReflectionObject($value))->getProperties() as $property) {
            // Esta línea sirve para saltar las propiedades estáticas o sin valor asignado.
            if ($property->isStatic() || ! $property->isInitialized($value)) {
                // Esta línea sirve para pasar a la siguiente propiedad.
                continue;
            }

            // Esta línea sirve para leer el valor de la propiedad.
            $current = $property->getValue($value);

            // Esta línea sirve para revisar si es una descripción de texto que se puede cambiar.
            if ($property->getName() === 'description' && is_string($current) && ! $property->isReadOnly()) {
                // Esta línea sirve para guardar la descripción limpia.
                $property->setValue($value, self::clean($current));

                // Esta línea sirve para pasar a la siguiente propiedad.
                continue;
            }

            // Esta línea sirve para revisar también lo que contiene la propiedad.
            $this->walk($current, $visited);
        }
    }
}
