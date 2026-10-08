<?php

// Esta línea sirve para ubicar este trait en el espacio de nombres de utilidades de los seeders.

namespace Database\Seeders\Concerns;

// Esta línea sirve para importar el modelo Exercise (ejercicio).
use App\Models\Exercise;
// Esta línea sirve para importar el modelo RoutineTemplate (plantilla de rutina).
use App\Models\RoutineTemplate;

/**
 * Infraestructura compartida por los 3 seeders de plantillas de rutina (uno
 * por nivel: Beginner/Intermediate/Advanced) — antes vivía duplicada
 * conceptualmente en un solo `RoutineTemplateSeeder`; al separar el
 * contenido por nivel en 3 archivos (para poder revisar/editar cada uno sin
 * scrollear entre niveles), este trait evita triplicar `makeTemplate()`,
 * `linkAlternatives()`, `id()` y `swap()`.
 */
// Esta línea sirve para declarar el trait compartido por los seeders de plantillas de rutina.
trait SeedsRoutineTemplates
{
    // Esta línea sirve para guardar en memoria los ids de los ejercicios por nombre.
    /** @var array<string, int> nombre de ejercicio -> id, cacheado para no repetir queries */
    private array $exerciseIds = [];

    // Cada seeder de nivel (Beginner/Intermediate/Advanced) define estos 11
    // bloques con SU catálogo de ejercicios — el contenido es lo único que
    // legítimamente difiere entre niveles. seedAllCombos() de acá abajo es
    // la combinatoria sexo x frecuencia x split que antes vivía retipeada
    // idéntica en los 3 seeders.
    // Esta línea sirve para declarar el bloque de empuje A que define cada seeder.
    abstract private function pushA(): array;

    // Esta línea sirve para declarar el bloque de tirón A que define cada seeder.
    abstract private function pullA(): array;

    // Esta línea sirve para declarar el bloque de pierna A para hombres.
    abstract private function legsMaleA(): array;

    // Esta línea sirve para declarar el bloque de pierna A para mujeres.
    abstract private function legsFemaleA(): array;

    // Esta línea sirve para declarar el bloque de tren superior A para hombres.
    abstract private function upperMaleA(): array;

    // Esta línea sirve para declarar el bloque de tren inferior A para hombres.
    abstract private function lowerMaleA(): array;

    // Esta línea sirve para declarar el bloque de tren superior B para hombres.
    abstract private function upperMaleB(): array;

    // Esta línea sirve para declarar el bloque de tren inferior B para hombres.
    abstract private function lowerMaleB(): array;

    // Esta línea sirve para declarar el bloque de tren inferior A para mujeres.
    abstract private function lowerFemaleA(): array;

    // Esta línea sirve para declarar el bloque de tren superior A para mujeres.
    abstract private function upperFemaleA(): array;

    // Esta línea sirve para declarar el bloque de tren inferior B para mujeres.
    abstract private function lowerFemaleB(): array;

    // Esta línea sirve para declarar el método que carga los ids de los ejercicios.
    private function loadExerciseIds(): void
    {
        // Esta línea sirve para revisar si todavía no se cargaron.
        if ($this->exerciseIds === []) {
            // Esta línea sirve para cargar los ids indexados por nombre del ejercicio.
            $this->exerciseIds = Exercise::query()->pluck('id', 'name')->all();
        }
    }

    /**
     * Las 8 combinaciones sexo x frecuencia (3/4/5/6 días) para un nivel —
     * misma estructura de días/splits para los 3 niveles, solo cambia qué
     * bloques de ejercicio usa cada uno (ver los abstract de arriba).
     */
    // Esta línea sirve para declarar el método que crea las 8 plantillas de un nivel.
    protected function seedAllCombos(string $level): void
    {
        // Esta línea sirve para obtener el bloque de empuje A.
        $pushA = $this->pushA();
        // Esta línea sirve para obtener el bloque de tirón A.
        $pullA = $this->pullA();
        // Esta línea sirve para obtener el bloque de pierna A de hombres.
        $legsMaleA = $this->legsMaleA();
        // Esta línea sirve para obtener el bloque de pierna A de mujeres.
        $legsFemaleA = $this->legsFemaleA();
        // Esta línea sirve para obtener el bloque de tren superior A de hombres.
        $upperMaleA = $this->upperMaleA();
        // Esta línea sirve para obtener el bloque de tren inferior A de hombres.
        $lowerMaleA = $this->lowerMaleA();
        // Esta línea sirve para obtener el bloque de tren superior B de hombres.
        $upperMaleB = $this->upperMaleB();
        // Esta línea sirve para obtener el bloque de tren inferior B de hombres.
        $lowerMaleB = $this->lowerMaleB();
        // Esta línea sirve para obtener el bloque de tren inferior A de mujeres.
        $lowerFemaleA = $this->lowerFemaleA();
        // Esta línea sirve para obtener el bloque de tren superior A de mujeres.
        $upperFemaleA = $this->upperFemaleA();
        // Esta línea sirve para obtener el bloque de tren inferior B de mujeres.
        $lowerFemaleB = $this->lowerFemaleB();

        // -------- 3 días (push_pull_legs) --------
        // Esta línea sirve para crear la plantilla de 3 días para hombres.
        $this->makeTemplate('male', 3, $level, 'push_pull_legs', [
            // Esta línea sirve para agregar el día de empuje.
            ['Empuje', $pushA],
            // Esta línea sirve para agregar el día de tirón.
            ['Tirón', $pullA],
            // Esta línea sirve para agregar el día de pierna.
            ['Pierna', $legsMaleA],
        ]);
        // Esta línea sirve para crear la plantilla de 3 días para mujeres.
        $this->makeTemplate('female', 3, $level, 'push_pull_legs', [
            // Esta línea sirve para agregar el día de empuje.
            ['Empuje', $pushA],
            // Esta línea sirve para agregar el día de tirón.
            ['Tirón', $pullA],
            // Esta línea sirve para agregar el día de pierna.
            ['Pierna', $legsFemaleA],
        ]);

        // -------- 4 días --------
        // Antes era "upper_lower" (Tren Superior = pecho+espalda+hombros+
        // bíceps+tríceps en una sola sesión, 5 grupos musculares principales
        // de un saque) -- viola la regla de máximo 2-3 grupos/día. Se
        // reemplaza por Empuje/Pierna/Tirón/Pierna(B): cada día entrena como
        // mucho 3 grupos (Empuje = pecho+hombros+tríceps, Tirón =
        // espalda+bíceps, Pierna = tren inferior), y ningún día consecutivo
        // -- incluyendo el que cierra el ciclo contra el que lo abre --
        // repite grupo muscular. Reusa los mismos bloques Push/Pull/Legs de
        // siempre, sin ejercicios nuevos.
        // Esta línea sirve para crear la plantilla de 4 días para hombres.
        $this->makeTemplate('male', 4, $level, 'push_pull_legs', [
            // Esta línea sirve para agregar el día de empuje.
            ['Empuje', $pushA],
            // Esta línea sirve para agregar el día de pierna A.
            ['Pierna A', $legsMaleA],
            // Esta línea sirve para agregar el día de tirón.
            ['Tirón', $pullA],
            // Esta línea sirve para agregar el día de pierna B (con los ejercicios invertidos).
            ['Pierna B', $this->swap($legsMaleA)],
        ]);
        // Esta línea sirve para crear la plantilla de 4 días para mujeres.
        $this->makeTemplate('female', 4, $level, 'push_pull_legs', [
            // Esta línea sirve para agregar el día de empuje.
            ['Empuje', $pushA],
            // Esta línea sirve para agregar el día de pierna A.
            ['Pierna A', $legsFemaleA],
            // Esta línea sirve para agregar el día de tirón.
            ['Tirón', $pullA],
            // Esta línea sirve para agregar el día de pierna B (con los ejercicios invertidos).
            ['Pierna B', $this->swap($legsFemaleA)],
        ]);

        // -------- 5 días --------
        // Mismo motivo que arriba: "Tren Superior"/"Tren Inferior" quedan
        // afuera. Empuje x2 + Tirón x2 + Pierna x1 -- balancea frecuencia de
        // empuje/tirón sin repetir grupo muscular en días consecutivos (ni
        // en el cierre del ciclo).
        // Esta línea sirve para crear la plantilla de 5 días para hombres.
        $this->makeTemplate('male', 5, $level, 'push_pull_legs', [
            // Esta línea sirve para agregar el día de empuje A.
            ['Empuje A', $pushA],
            // Esta línea sirve para agregar el día de tirón A.
            ['Tirón A', $pullA],
            // Esta línea sirve para agregar el día de pierna.
            ['Pierna', $legsMaleA],
            // Esta línea sirve para agregar el día de empuje B (con los ejercicios invertidos).
            ['Empuje B', $this->swap($pushA)],
            // Esta línea sirve para agregar el día de tirón B (con los ejercicios invertidos).
            ['Tirón B', $this->swap($pullA)],
        ]);
        // Esta línea sirve para crear la plantilla de 5 días para mujeres.
        $this->makeTemplate('female', 5, $level, 'push_pull_legs', [
            // Esta línea sirve para agregar el día de empuje A.
            ['Empuje A', $pushA],
            // Esta línea sirve para agregar el día de tirón A.
            ['Tirón A', $pullA],
            // Esta línea sirve para agregar el día de pierna.
            ['Pierna', $legsFemaleA],
            // Esta línea sirve para agregar el día de empuje B (con los ejercicios invertidos).
            ['Empuje B', $this->swap($pushA)],
            // Esta línea sirve para agregar el día de tirón B (con los ejercicios invertidos).
            ['Tirón B', $this->swap($pullA)],
        ]);

        // -------- 6 días (PPL x2) --------
        // Esta línea sirve para crear la plantilla de 6 días para hombres.
        $this->makeTemplate('male', 6, $level, 'push_pull_legs', [
            // Esta línea sirve para agregar el día de empuje A.
            ['Empuje A', $pushA],
            // Esta línea sirve para agregar el día de tirón A.
            ['Tirón A', $pullA],
            // Esta línea sirve para agregar el día de pierna A.
            ['Pierna A', $legsMaleA],
            // Esta línea sirve para agregar el día de empuje B (con los ejercicios invertidos).
            ['Empuje B', $this->swap($pushA)],
            // Esta línea sirve para agregar el día de tirón B (con los ejercicios invertidos).
            ['Tirón B', $this->swap($pullA)],
            // Esta línea sirve para agregar el día de pierna B (con los ejercicios invertidos).
            ['Pierna B', $this->swap($legsMaleA)],
        ]);
        // Esta línea sirve para crear la plantilla de 6 días para mujeres.
        $this->makeTemplate('female', 6, $level, 'push_pull_legs', [
            // Esta línea sirve para agregar el día de empuje A.
            ['Empuje A', $pushA],
            // Esta línea sirve para agregar el día de tirón A.
            ['Tirón A', $pullA],
            // Esta línea sirve para agregar el día de pierna A.
            ['Pierna A', $legsFemaleA],
            // Esta línea sirve para agregar el día de empuje B (con los ejercicios invertidos).
            ['Empuje B', $this->swap($pushA)],
            // Esta línea sirve para agregar el día de tirón B (con los ejercicios invertidos).
            ['Tirón B', $this->swap($pullA)],
            // Esta línea sirve para agregar el día de pierna B (bloque de tren inferior B).
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
    // Esta línea sirve para declarar el método que crea una plantilla con sus días y ejercicios.
    private function makeTemplate(string $sex, int $frequencyDays, string $level, string $splitType, array $days): void
    {
        // Esta línea sirve para crear la plantilla, o actualizarla si ya existía.
        $template = RoutineTemplate::query()->updateOrCreate(
            // Esta línea sirve para buscarla por sexo, frecuencia y nivel.
            ['sex' => $sex, 'frequency_days' => $frequencyDays, 'level' => $level],
            // Esta línea sirve para guardar el tipo de división.
            ['split_type' => $splitType],
        );

        // Reemplaza días/ejercicios existentes de esta plantilla (idempotente
        // ante re-seed) sin tocar routine_templates.id — nada referencia esto
        // por FK desde fuera del árbol de plantillas.
        // Esta línea sirve para borrar los días que tenía (y sus ejercicios).
        $template->days()->delete();

        // Esta línea sirve para recorrer los días recibidos.
        foreach ($days as $order => [$label, $pairs]) {
            // Esta línea sirve para crear el día con su orden y nombre.
            $day = $template->days()->create(['day_order' => $order + 1, 'label' => $label]);

            // Esta línea sirve para recorrer los pares de ejercicio principal y alternativo.
            foreach ($pairs as $exOrder => [$mainName, $altName]) {
                // Esta línea sirve para crear el ejercicio del día.
                $day->exercises()->create([
                    // Esta línea sirve para guardar el ejercicio principal.
                    'exercise_id' => $this->id($mainName),
                    // Esta línea sirve para guardar el orden.
                    'order' => $exOrder + 1,
                    // Esta línea sirve para usar 3 series por defecto.
                    'default_sets' => 3,
                    // Esta línea sirve para usar 12 repeticiones por defecto.
                    'default_reps' => '12',
                    // Esta línea sirve para usar 90 segundos de descanso.
                    'rest_seconds' => 90,
                ]);

                // Esta línea sirve para revisar si hay ejercicio alternativo.
                if ($altName !== null) {
                    // Esta línea sirve para enlazar el principal con su alternativa.
                    $this->linkAlternatives($mainName, $altName);
                }
            }
        }
    }

    // Esta línea sirve para declarar el método que enlaza dos ejercicios como alternativas.
    private function linkAlternatives(string $a, string $b): void
    {
        // Esta línea sirve para obtener el id del primer ejercicio.
        $aId = $this->id($a);
        // Esta línea sirve para obtener el id del segundo ejercicio.
        $bId = $this->id($b);

        // Esta línea sirve para agregar el segundo como alternativa del primero.
        Exercise::find($aId)->alternatives()->syncWithoutDetaching([$bId]);
        // Esta línea sirve para agregar el primero como alternativa del segundo.
        Exercise::find($bId)->alternatives()->syncWithoutDetaching([$aId]);
    }

    // Esta línea sirve para declarar el método que obtiene el id de un ejercicio por nombre.
    private function id(string $name): int
    {
        // Esta línea sirve para devolver el id guardado en memoria.
        return $this->exerciseIds[$name]
            // Esta línea sirve para lanzar un error si el ejercicio no está en el catálogo.
            ?? throw new \RuntimeException("Ejercicio no encontrado en el catálogo: {$name}");
    }

    /**
     * Invierte cada par [main, alt] -> [alt, main] para generar la versión
     * "B" de un bloque de día a partir de su "A", sin repetir contenido.
     *
     * @param  array<int, array{0: string, 1: ?string}>  $pairs
     * @return array<int, array{0: string, 1: ?string}>
     */
    // Esta línea sirve para declarar el método que invierte los pares de ejercicios.
    private function swap(array $pairs): array
    {
        // Esta línea sirve para cambiar [principal, alternativa] por [alternativa, principal] cuando hay alternativa.
        return array_map(fn (array $pair) => $pair[1] !== null ? [$pair[1], $pair[0]] : $pair, $pairs);
    }
}
