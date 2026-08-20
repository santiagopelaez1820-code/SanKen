<?php

namespace Database\Seeders;

use App\Models\Exercise;
use App\Models\RoutineTemplate;
use Illuminate\Database\Seeder;

/**
 * Siembra las 8 plantillas curadas (sexo x frecuencia) que usa
 * TemplateRoutineGenerator, y de paso sanken exercise_alternatives (bidireccional
 * para cada par A/B usado) — así "cambiar ejercicio" es reversible sin estado
 * extra (ver TemplateRoutineGenerator y RoutineController::swapExercise).
 *
 * Los bloques de día (pushA, pullA, etc.) se definen una sola vez y se
 * reutilizan/combinan para las 8 plantillas, tal como pide la especificación
 * para los splits de 5 y 6 días (reutilizar la estructura de 3/4 días en vez
 * de inventar una rutina distinta).
 */
class RoutineTemplateSeeder extends Seeder
{
    /** @var array<string, int> nombre de ejercicio -> id, cacheado para no repetir queries */
    private array $exerciseIds = [];

    public function run(): void
    {
        $this->exerciseIds = Exercise::query()->pluck('id', 'name')->all();

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
        $this->makeTemplate('male', 3, 'push_pull_legs', [
            ['Push', $pushA],
            ['Pull', $pullA],
            ['Legs', $legsMaleA],
        ]);
        $this->makeTemplate('female', 3, 'push_pull_legs', [
            ['Push', $pushA],
            ['Pull', $pullA],
            ['Legs', $legsFemaleA],
        ]);

        // -------- 4 días (upper_lower) --------
        $this->makeTemplate('male', 4, 'upper_lower', [
            ['Upper A', $upperMaleA],
            ['Lower A', $lowerMaleA],
            ['Upper B', $upperMaleB],
            ['Lower B', $lowerMaleB],
        ]);
        $this->makeTemplate('female', 4, 'upper_lower', [
            ['Lower A', $lowerFemaleA],
            ['Upper', $upperFemaleA],
            ['Lower B', $lowerFemaleB],
            ['Upper', $upperMaleB], // misma filosofía de Upper B masculino, ver seccion 11
        ]);

        // -------- 5 días (híbrido PPL + Upper/Lower) --------
        $this->makeTemplate('male', 5, 'ppl_upper_lower', [
            ['Push', $pushA],
            ['Pull', $pullA],
            ['Legs', $legsMaleA],
            ['Upper', $upperMaleA],
            ['Lower', $lowerMaleA],
        ]);
        $this->makeTemplate('female', 5, 'ppl_upper_lower', [
            ['Lower', $legsFemaleA],
            ['Upper', $upperFemaleA],
            ['Lower', $lowerFemaleB],
            ['Upper', $upperMaleB],
            ['Lower', $legsFemaleA],
        ]);

        // -------- 6 días (PPL x2) --------
        $this->makeTemplate('male', 6, 'push_pull_legs', [
            ['Push A', $pushA],
            ['Pull A', $pullA],
            ['Legs A', $legsMaleA],
            ['Push B', $this->swap($pushA)],
            ['Pull B', $this->swap($pullA)],
            ['Legs B', $this->swap($legsMaleA)],
        ]);
        $this->makeTemplate('female', 6, 'push_pull_legs', [
            ['Push A', $pushA],
            ['Pull A', $pullA],
            ['Legs A', $legsFemaleA],
            ['Push B', $this->swap($pushA)],
            ['Pull B', $this->swap($pullA)],
            ['Legs B', $lowerFemaleB],
        ]);
    }

    /**
     * Crea (o reemplaza) la plantilla para sex+frequencyDays con sus días y
     * ejercicios, y siembra exercise_alternatives bidireccional para cada
     * par [main, alt] usado.
     *
     * @param  array<int, array{0: string, 1: array<int, array{0: string, 1: ?string}>}>  $days  [label, pairs][]
     */
    private function makeTemplate(string $sex, int $frequencyDays, string $splitType, array $days): void
    {
        $template = RoutineTemplate::query()->updateOrCreate(
            ['sex' => $sex, 'frequency_days' => $frequencyDays],
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
     * "B" de un bloque de día a partir de su "A", sin repetir contenido
     * (secciones 12-15: los dias B deben variar respecto de los A).
     *
     * @param  array<int, array{0: string, 1: ?string}>  $pairs
     * @return array<int, array{0: string, 1: ?string}>
     */
    private function swap(array $pairs): array
    {
        return array_map(fn (array $pair) => $pair[1] !== null ? [$pair[1], $pair[0]] : $pair, $pairs);
    }

    // ---- Bloques de día (sección 8-11) ----

    private function pushA(): array
    {
        return [
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            ['Press de pecho en máquina', 'Press banca con barra'],
            ['Aperturas en máquina', 'Cruce de poleas'],
            ['Press de hombro en máquina', 'Press de hombro con mancuernas'],
            ['Elevaciones laterales en polea', 'Elevaciones laterales'],
            ['Extensión de tríceps en polea', 'Tríceps en máquina'],
            ['Katana en polea', 'Rompecráneos a dos manos con mancuerna'],
        ];
    }

    private function pullA(): array
    {
        return [
            ['Jalón en polea alta', 'Jalón al pecho'],
            ['Remo en T', 'Remo en polea sentado'],
            ['Pull over en polea', 'Jalón en polea con agarre cerrado'],
            ['Vuelos posteriores en polea', 'Pájaros (deltoide posterior)'],
            ['Curl bayesiano en polea', 'Curl bayesiano con mancuerna en banco'],
            ['Curl predicador en máquina', 'Curl predicador con mancuerna en banco'],
        ];
    }

    private function legsMaleA(): array
    {
        return [
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano con barra'],
            ['Abducción de cadera en máquina', null],
            ['Aductores en máquina', null],
            ['Pantorrilla sentado en prensa', null],
        ];
    }

    private function legsFemaleA(): array
    {
        return [
            ['Hip Thrust en máquina', 'Hip thrust'],
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            ['Prensa de piernas', 'Prensa horizontal'],
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            ['Patada de glúteo en polea', 'Patada de glúteo en máquina'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Pantorrilla sentado en prensa', 'Elevación de talones de pie'],
        ];
    }

    private function upperMaleA(): array
    {
        return [
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            ['Press de pecho en máquina', 'Press banca con barra'],
            ['Aperturas en máquina', 'Cruce de poleas'],
            ['Jalón en polea alta', 'Jalón al pecho'],
            ['Remo en T', 'Remo en polea sentado'],
            ['Press de hombro en máquina', 'Press de hombro con mancuernas'],
            ['Elevaciones laterales en polea', 'Elevaciones laterales'],
            ['Curl predicador en máquina', 'Curl predicador con mancuerna en banco'],
            ['Extensión de tríceps en polea', 'Tríceps en máquina'],
        ];
    }

    private function lowerMaleA(): array
    {
        return [
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            ['Prensa de piernas', 'Prensa horizontal'],
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            ['Hip Thrust en máquina', 'Hip thrust'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Aductores en máquina', null],
            ['Pantorrilla sentado en prensa', 'Elevación de talones de pie'],
        ];
    }

    private function upperMaleB(): array
    {
        return [
            ['Press inclinado en máquina', 'Press inclinado con barra'],
            ['Press banca con mancuernas', 'Press de pecho en máquina'],
            ['Cruce de poleas', 'Aperturas en máquina'],
            ['Jalón en polea con agarre cerrado', 'Pull over en polea'],
            ['Remo en polea sentado', 'Remo en T'],
            ['Press de hombro con mancuernas', 'Press de hombro en máquina'],
            ['Elevaciones laterales', 'Elevaciones laterales en polea'],
            ['Pájaros (deltoide posterior)', 'Vuelos posteriores en polea'],
            ['Curl bayesiano en polea', 'Curl bayesiano con mancuerna en banco'],
            ['Katana en polea', 'Rompecráneos a dos manos con mancuerna'],
        ];
    }

    private function lowerMaleB(): array
    {
        return [
            ['Sentadilla Hack', 'Sentadilla en Smith'],
            ['Prensa horizontal', 'Prensa de piernas'],
            ['Extensión de cuádriceps', null],
            ['Femoral sentado en máquina', 'Curl femoral'],
            ['Peso muerto rumano en Smith', 'Peso muerto rumano con mancuernas'],
            ['Puente de glúteos', 'Hip Thrust en máquina'],
            ['Abducción en polea', 'Abducción de cadera en máquina'],
            ['Aductores en máquina', null],
            ['Elevación de talones de pie', 'Pantorrilla sentado en prensa'],
        ];
    }

    private function lowerFemaleA(): array
    {
        return [
            ['Hip Thrust en máquina', 'Hip thrust'],
            ['Sentadilla en Smith', 'Sentadilla Hack'],
            ['Prensa de piernas', 'Prensa horizontal'],
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            ['Curl femoral', 'Femoral sentado en máquina'],
            ['Patada de glúteo en máquina', 'Patada de glúteo en polea'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Elevación de talones de pie', 'Pantorrilla sentado en prensa'],
        ];
    }

    private function upperFemaleA(): array
    {
        return [
            ['Jalón en polea alta', 'Jalón al pecho'],
            ['Remo en T', 'Remo en polea sentado'],
            ['Press inclinado con mancuernas', 'Press inclinado en máquina'],
            ['Press de pecho en máquina', 'Press banca con barra'],
            ['Elevaciones laterales', 'Elevaciones laterales en polea'],
            ['Pájaros (deltoide posterior)', 'Vuelos posteriores en polea'],
            ['Curl predicador en máquina', 'Curl bayesiano en polea'],
            ['Extensión de tríceps en polea', 'Tríceps en máquina'],
        ];
    }

    private function lowerFemaleB(): array
    {
        return [
            ['Puente de glúteos', 'Hip Thrust en máquina'],
            ['Peso muerto rumano con mancuernas', 'Peso muerto rumano en Smith'],
            ['Sentadilla búlgara', 'Zancada en Smith'],
            ['Extensión de cuádriceps', 'Sentadilla Sissy'],
            ['Femoral sentado en máquina', 'Curl femoral'],
            ['Patada de glúteo en polea', 'Patada de glúteo en máquina'],
            ['Abducción de cadera en máquina', 'Abducción en polea'],
            ['Aductores en máquina', null],
            ['Pantorrilla sentado en prensa', 'Elevación de talones de pie'],
        ];
    }
}
