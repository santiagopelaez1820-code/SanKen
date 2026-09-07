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

    // Cada seeder de nivel (Beginner/Intermediate/Advanced) define estos 11
    // bloques con SU catálogo de ejercicios — el contenido es lo único que
    // legítimamente difiere entre niveles. seedAllCombos() de acá abajo es
    // la combinatoria sexo x frecuencia x split que antes vivía retipeada
    // idéntica en los 3 seeders.
    abstract private function pushA(): array;

    abstract private function pullA(): array;

    abstract private function legsMaleA(): array;

    abstract private function legsFemaleA(): array;

    abstract private function upperMaleA(): array;

    abstract private function lowerMaleA(): array;

    abstract private function upperMaleB(): array;

    abstract private function lowerMaleB(): array;

    abstract private function lowerFemaleA(): array;

    abstract private function upperFemaleA(): array;

    abstract private function lowerFemaleB(): array;

    private function loadExerciseIds(): void
    {
        if ($this->exerciseIds === []) {
            $this->exerciseIds = Exercise::query()->pluck('id', 'name')->all();
        }
    }

    /**
     * Las 8 combinaciones sexo x frecuencia (3/4/5/6 días) para un nivel —
     * misma estructura de días/splits para los 3 niveles, solo cambia qué
     * bloques de ejercicio usa cada uno (ver los abstract de arriba).
     */
    protected function seedAllCombos(string $level): void
    {
        $pushA = $this->pushA();
        $pullA = $this->pullA();
        $legsMaleA = $this->legsMaleA();
        $legsFemaleA = $this->legsFemaleA();
        $upperMaleA = $this->upperMaleA();
        $lowerMaleA = $this->lowerMaleA();
        $upperMaleB = $this->upperMaleB();
        $lowerMaleB = $this->lowerMaleB();
        $lowerFemaleA = $this->lowerFemaleA();
        $upperFemaleA = $this->upperFemaleA();
        $lowerFemaleB = $this->lowerFemaleB();

        // -------- 3 días (push_pull_legs) --------
        $this->makeTemplate('male', 3, $level, 'push_pull_legs', [
            ['Empuje', $pushA],
            ['Tirón', $pullA],
            ['Pierna', $legsMaleA],
        ]);
        $this->makeTemplate('female', 3, $level, 'push_pull_legs', [
            ['Empuje', $pushA],
            ['Tirón', $pullA],
            ['Pierna', $legsFemaleA],
        ]);

        // -------- 4 días (upper_lower) --------
        $this->makeTemplate('male', 4, $level, 'upper_lower', [
            ['Tren Superior A', $upperMaleA],
            ['Tren Inferior A', $lowerMaleA],
            ['Tren Superior B', $upperMaleB],
            ['Tren Inferior B', $lowerMaleB],
        ]);
        $this->makeTemplate('female', 4, $level, 'upper_lower', [
            ['Tren Inferior A', $lowerFemaleA],
            ['Tren Superior', $upperFemaleA],
            ['Tren Inferior B', $lowerFemaleB],
            ['Tren Superior', $upperMaleB], // misma filosofía de Upper B masculino, ver seccion 11
        ]);

        // -------- 5 días (híbrido PPL + Upper/Lower) --------
        $this->makeTemplate('male', 5, $level, 'ppl_upper_lower', [
            ['Empuje', $pushA],
            ['Tirón', $pullA],
            ['Pierna', $legsMaleA],
            ['Tren Superior', $upperMaleA],
            ['Tren Inferior', $lowerMaleA],
        ]);
        $this->makeTemplate('female', 5, $level, 'ppl_upper_lower', [
            ['Tren Inferior', $legsFemaleA],
            ['Tren Superior', $upperFemaleA],
            ['Tren Inferior', $lowerFemaleB],
            ['Tren Superior', $upperMaleB],
            ['Tren Inferior', $legsFemaleA],
        ]);

        // -------- 6 días (PPL x2) --------
        $this->makeTemplate('male', 6, $level, 'push_pull_legs', [
            ['Empuje A', $pushA],
            ['Tirón A', $pullA],
            ['Pierna A', $legsMaleA],
            ['Empuje B', $this->swap($pushA)],
            ['Tirón B', $this->swap($pullA)],
            ['Pierna B', $this->swap($legsMaleA)],
        ]);
        $this->makeTemplate('female', 6, $level, 'push_pull_legs', [
            ['Empuje A', $pushA],
            ['Tirón A', $pullA],
            ['Pierna A', $legsFemaleA],
            ['Empuje B', $this->swap($pushA)],
            ['Tirón B', $this->swap($pullA)],
            ['Pierna B', $lowerFemaleB],
        ]);
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
