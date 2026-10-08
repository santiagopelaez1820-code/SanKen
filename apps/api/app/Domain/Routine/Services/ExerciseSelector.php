<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los servicios de rutina.

namespace App\Domain\Routine\Services;

// Esta línea sirve para importar el objeto con los datos de un ejercicio.
use App\Domain\Routine\ValueObjects\ExerciseData;

/**
 * Filtra y selecciona ejercicios concretos de la biblioteca para un día de
 * rutina, respetando equipo disponible, nivel, lesiones y variedad respecto
 * a días anteriores de la misma rutina.
 */
// Esta línea sirve para declarar el servicio que selecciona los ejercicios de un día.
final class ExerciseSelector
{
    // Esta línea sirve para definir el orden de los niveles: principiante, intermedio y avanzado.
    private const LEVEL_RANK = ['beginner' => 1, 'intermediate' => 2, 'advanced' => 3];

    /**
     * Mapeo simple de palabras clave de lesiones a grupos musculares a
     * evitar. Best-effort: no reemplaza criterio médico ni de un entrenador.
     */
    // Esta línea sirve para definir qué músculos evitar según palabras clave de lesiones.
    private const INJURY_KEYWORDS = [
        // Esta línea sirve para evitar hombros, pecho y tríceps ante una lesión de hombro.
        'hombro' => ['shoulders', 'chest', 'triceps'],
        // Esta línea sirve para evitar hombros, pecho y tríceps ante una lesión de hombro (en inglés).
        'shoulder' => ['shoulders', 'chest', 'triceps'],
        // Esta línea sirve para evitar cuádriceps, isquios y glúteos ante una lesión de rodilla.
        'rodilla' => ['quads', 'hamstrings', 'glutes'],
        // Esta línea sirve para evitar cuádriceps, isquios y glúteos ante una lesión de rodilla (en inglés).
        'knee' => ['quads', 'hamstrings', 'glutes'],
        // Esta línea sirve para evitar espalda, isquios y glúteos ante una lesión de espalda.
        'espalda' => ['back', 'hamstrings', 'glutes'],
        // Esta línea sirve para evitar espalda, isquios y glúteos ante una lesión lumbar.
        'lumbar' => ['back', 'hamstrings', 'glutes'],
        // Esta línea sirve para evitar espalda, isquios y glúteos ante una lesión de espalda (en inglés).
        'back' => ['back', 'hamstrings', 'glutes'],
        // Esta línea sirve para evitar bíceps, tríceps, pecho y hombros ante una lesión de muñeca.
        'muñeca' => ['biceps', 'triceps', 'chest', 'shoulders'],
        // Esta línea sirve para evitar bíceps, tríceps, pecho y hombros ante una lesión de muñeca (en inglés).
        'wrist' => ['biceps', 'triceps', 'chest', 'shoulders'],
        // Esta línea sirve para evitar bíceps, tríceps y pecho ante una lesión de codo.
        'codo' => ['biceps', 'triceps', 'chest'],
        // Esta línea sirve para evitar bíceps, tríceps y pecho ante una lesión de codo (en inglés).
        'elbow' => ['biceps', 'triceps', 'chest'],
        // Esta línea sirve para evitar pantorrillas y cuádriceps ante una lesión de tobillo.
        'tobillo' => ['calves', 'quads'],
        // Esta línea sirve para evitar pantorrillas y cuádriceps ante una lesión de tobillo (en inglés).
        'ankle' => ['calves', 'quads'],
    ];

    /**
     * @param  ExerciseData[]  $pool
     * @param  string[]  $targetMuscles  slugs en orden de prioridad
     * @param  string[]  $equipmentAvailable
     * @param  string[]  $injuries
     * @param  int[]  $excludeIds  ejercicios ya usados en días previos de la rutina (se evitan si hay alternativa)
     * @return int[] IDs de ejercicio en orden de ejecución (compuestos primero)
     */
    // Esta línea sirve para declarar el método que selecciona los ejercicios del día.
    public function select(
        // Esta línea sirve para recibir todos los ejercicios disponibles.
        array $pool,
        // Esta línea sirve para recibir los músculos objetivo en orden de prioridad.
        array $targetMuscles,
        // Esta línea sirve para recibir el nivel del usuario.
        string $level,
        // Esta línea sirve para recibir el equipamiento disponible.
        array $equipmentAvailable,
        // Esta línea sirve para recibir las lesiones del usuario.
        array $injuries,
        // Esta línea sirve para recibir cuántos ejercicios elegir por músculo.
        int $perMuscle,
        // Esta línea sirve para recibir el máximo de ejercicios del día.
        int $maxTotal,
        // Esta línea sirve para recibir la proporción de compuestos deseada.
        float $compoundRatio,
        // Esta línea sirve para recibir los ejercicios ya usados en días anteriores.
        array $excludeIds = [],
        // Esta línea sirve para indicar que el método devuelve un arreglo de ids.
    ): array {
        // Esta línea sirve para filtrar los ejercicios elegibles.
        $eligible = array_values(array_filter(
            // Esta línea sirve para partir de todos los ejercicios disponibles.
            $pool,
            // Esta línea sirve para exigir que tengan el equipamiento disponible.
            fn (ExerciseData $e) => $this->isEquipmentAvailable($e, $equipmentAvailable)
                // Esta línea sirve para exigir que sean del nivel adecuado.
                && $this->isLevelAppropriate($e, $level)
                // Esta línea sirve para exigir que no estén contraindicados por una lesión.
                && ! $this->isContraindicated($e, $injuries),
        ));

        // Esta línea sirve para iniciar la lista de ejercicios elegidos.
        $picked = [];

        // Esta línea sirve para recorrer cada músculo objetivo.
        foreach ($targetMuscles as $muscle) {
            // Esta línea sirve para buscar los candidatos de ese músculo.
            $candidates = array_values(array_filter(
                // Esta línea sirve para buscar entre los elegibles.
                $eligible,
                // Esta línea sirve para exigir que trabajen ese músculo y que no estén ya elegidos.
                fn (ExerciseData $e) => $e->primaryMuscle === $muscle && ! in_array($e->id, $picked, true),
            ));

            // Esta línea sirve para revisar si no hay candidatos.
            if ($candidates === []) {
                // Esta línea sirve para saltar al siguiente músculo.
                continue;
            }

            // Esta línea sirve para ordenar los candidatos por prioridad.
            $ranked = $this->rank($candidates, $excludeIds, $compoundRatio, $muscle, $targetMuscles);

            // Esta línea sirve para tomar los primeros según la cantidad por músculo.
            foreach (array_slice($ranked, 0, $perMuscle) as $exercise) {
                // Esta línea sirve para agregar cada uno a los elegidos.
                $picked[] = $exercise->id;
            }
        }

        // Esta línea sirve para revisar si se pasó del máximo del día.
        if (count($picked) > $maxTotal) {
            // Esta línea sirve para recortar la lista al máximo.
            $picked = array_slice($picked, 0, $maxTotal);
        }

        // Esta línea sirve para devolver los elegidos con los compuestos primero.
        return $this->compoundsFirst($eligible, $picked);
    }

    // Esta línea sirve para declarar el método privado que revisa si hay equipamiento para el ejercicio.
    private function isEquipmentAvailable(ExerciseData $exercise, array $equipmentAvailable): bool
    {
        // Esta línea sirve para aceptar si es de peso corporal o si el equipamiento está disponible.
        return $exercise->equipment === 'bodyweight_only' || in_array($exercise->equipment, $equipmentAvailable, true);
    }

    // Esta línea sirve para declarar el método privado que revisa si el nivel del ejercicio es adecuado.
    private function isLevelAppropriate(ExerciseData $exercise, string $userLevel): bool
    {
        // Esta línea sirve para aceptar si el nivel del ejercicio no supera el del usuario.
        return self::LEVEL_RANK[$exercise->level] <= self::LEVEL_RANK[$userLevel];
    }

    // Esta línea sirve para declarar el método privado que revisa si una lesión contraindica el ejercicio.
    private function isContraindicated(ExerciseData $exercise, array $injuries): bool
    {
        // Esta línea sirve para recorrer cada lesión del usuario.
        foreach ($injuries as $injury) {
            // Esta línea sirve para normalizar la lesión a minúsculas y sin espacios.
            $injury = mb_strtolower(trim($injury));

            // Esta línea sirve para recorrer cada palabra clave de lesión.
            foreach (self::INJURY_KEYWORDS as $keyword => $avoidMuscles) {
                // Esta línea sirve para revisar si la lesión contiene la palabra y el ejercicio trabaja un músculo a evitar.
                if ($injury !== '' && str_contains($injury, $keyword) && in_array($exercise->primaryMuscle, $avoidMuscles, true)) {
                    // Esta línea sirve para devolver verdadero porque está contraindicado.
                    return true;
                }
            }
        }

        // Esta línea sirve para devolver falso porque no está contraindicado.
        return false;
    }

    /**
     * Prioriza: no usados en días previos > relación compuesto/aislamiento
     * objetivo de la estrategia. El orden de $targetMuscles no afecta el
     * ranking dentro de un músculo, solo se usa como contexto.
     *
     * @param  ExerciseData[]  $candidates
     * @param  int[]  $excludeIds
     * @return ExerciseData[]
     */
    // Esta línea sirve para declarar el método privado que ordena los candidatos por prioridad.
    private function rank(array $candidates, array $excludeIds, float $compoundRatio, string $muscle, array $targetMuscles): array
    {
        // Esta línea sirve para separar los que no se usaron en días anteriores.
        $unused = array_values(array_filter($candidates, fn (ExerciseData $e) => ! in_array($e->id, $excludeIds, true)));
        // Esta línea sirve para separar los que ya se usaron.
        $used = array_values(array_filter($candidates, fn (ExerciseData $e) => in_array($e->id, $excludeIds, true)));

        // Esta línea sirve para decidir si se prefieren compuestos según la proporción.
        $preferCompound = $compoundRatio >= 0.5;
        // Esta línea sirve para declarar la función que compara dos ejercicios.
        $sorter = function (ExerciseData $a, ExerciseData $b) use ($preferCompound) {
            // Esta línea sirve para revisar si el primero es compuesto.
            $aCompound = $a->type === 'compound';
            // Esta línea sirve para revisar si el segundo es compuesto.
            $bCompound = $b->type === 'compound';

            // Esta línea sirve para revisar si ambos son del mismo tipo.
            if ($aCompound === $bCompound) {
                // Esta línea sirve para dejarlos en el mismo orden.
                return 0;
            }

            // Esta línea sirve para poner primero el del tipo preferido.
            return ($aCompound === $preferCompound) ? -1 : 1;
        };

        // Esta línea sirve para ordenar los no usados.
        usort($unused, $sorter);
        // Esta línea sirve para ordenar los ya usados.
        usort($used, $sorter);

        // Esta línea sirve para devolver primero los no usados y luego los usados.
        return [...$unused, ...$used];
    }

    /**
     * Reordena la selección final: compuestos primero (se ejecutan con más
     * frescura), preservando el orden relativo dentro de cada grupo.
     *
     * @param  ExerciseData[]  $pool
     * @param  int[]  $pickedIds
     * @return int[]
     */
    // Esta línea sirve para declarar el método privado que pone los compuestos primero.
    private function compoundsFirst(array $pool, array $pickedIds): array
    {
        // Esta línea sirve para iniciar el índice de ejercicios por id.
        $byId = [];
        // Esta línea sirve para recorrer todos los ejercicios.
        foreach ($pool as $exercise) {
            // Esta línea sirve para guardarlos indexados por su id.
            $byId[$exercise->id] = $exercise;
        }

        // Esta línea sirve para obtener los elegidos que son compuestos.
        $compounds = array_values(array_filter($pickedIds, fn (int $id) => ($byId[$id]->type ?? null) === 'compound'));
        // Esta línea sirve para obtener los elegidos que no son compuestos.
        $others = array_values(array_filter($pickedIds, fn (int $id) => ($byId[$id]->type ?? null) !== 'compound'));

        // Esta línea sirve para devolver primero los compuestos y luego el resto.
        return [...$compounds, ...$others];
    }
}
