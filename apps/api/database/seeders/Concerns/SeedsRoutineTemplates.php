<?php

namespace Database\Seeders\Concerns;

use App\Models\Exercise;
use App\Models\RoutineTemplate;

/**
 * Infraestructura compartida por los 3 seeders de plantillas de rutina (uno
 * por nivel: Beginner/Intermediate/Advanced) — antes vivía duplicada
 * conceptualmente en un solo `RoutineTemplateSeeder`; al separar el
 * contenido por nivel en 3 archivos (para poder revisar/editar cada uno sin
 * scrollear entre niveles), este trait evita triplicar `makeTemplate()`,
 * `linkAlternatives()`, `id()` y `swap()`.
 */
trait SeedsRoutineTemplates
{
    /** @var array<string, int> nombre de ejercicio -> id, cacheado para no repetir queries */
    private array $exerciseIds = [];

    private function loadExerciseIds(): void
    {
        if ($this->exerciseIds === []) {
            $this->exerciseIds = Exercise::query()->pluck('id', 'name')->all();
        }
    }

    /**
     * Crea (o reemplaza) la plantilla para sex+frequencyDays+level con sus
     * días y ejercicios, y siembra exercise_alternatives bidireccional para
     * cada par [main, alt] usado.
     *
     * @param  array<int, array{0: string, 1: array<int, array{0: string, 1: ?string}>}>  $days  [label, pairs][]
     */
    private function makeTemplate(string $sex, int $frequencyDays, string $level, string $splitType, array $days): void
    {
        $template = RoutineTemplate::query()->updateOrCreate(
            ['sex' => $sex, 'frequency_days' => $frequencyDays, 'level' => $level],
            ['split_type' => $splitType],
        );

        // Reemplaza días/ejercicios existentes de esta plantilla (idempotente
        // ante re-seed) sin tocar routine_templates.id — nada referencia esto
        // por FK desde fuera del árbol de plantillas.
        $template->days()->delete();

        foreach ($days as $order => [$label, $pairs]) {
            $day = $template->days()->create(['day_order' => $order + 1, 'label' => $label]);

            foreach ($pairs as $exOrder => [$mainName, $altName]) {
                $day->exercises()->create([
                    'exercise_id' => $this->id($mainName),
                    'order' => $exOrder + 1,
                    'default_sets' => 3,
                    'default_reps' => '12',
                    'rest_seconds' => 90,
                ]);

                if ($altName !== null) {
                    $this->linkAlternatives($mainName, $altName);
                }
            }
        }
    }

    private function linkAlternatives(string $a, string $b): void
    {
        $aId = $this->id($a);
        $bId = $this->id($b);

        Exercise::find($aId)->alternatives()->syncWithoutDetaching([$bId]);
        Exercise::find($bId)->alternatives()->syncWithoutDetaching([$aId]);
    }

    private function id(string $name): int
    {
        return $this->exerciseIds[$name]
            ?? throw new \RuntimeException("Ejercicio no encontrado en el catálogo: {$name}");
    }

    /**
     * Invierte cada par [main, alt] -> [alt, main] para generar la versión
     * "B" de un bloque de día a partir de su "A", sin repetir contenido.
     *
     * @param  array<int, array{0: string, 1: ?string}>  $pairs
     * @return array<int, array{0: string, 1: ?string}>
     */
    private function swap(array $pairs): array
    {
        return array_map(fn (array $pair) => $pair[1] !== null ? [$pair[1], $pair[0]] : $pair, $pairs);
    }
}
