<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Routine.

namespace Tests\Feature\Routine;

// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar la clase RoutineTemplateSeeder.
use Database\Seeders\RoutineTemplateSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

/**
 * Cubre el motor de plantillas (TemplateRoutineGenerator) que reemplazo al
 * algoritmico (RoutineGenerator, ver RoutineGeneratorTest — sigue intacto y
 * pasando, solo que ya no es el binding activo de RoutineGeneratorInterface).
 */
// Esta línea sirve para declarar la clase de tests RoutineTemplateGenerationTest.
class RoutineTemplateGenerationTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que siembra el catálogo.
    private function seedCatalog(): void
    {
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
        // Esta línea sirve para sembrar los datos de RoutineTemplateSeeder.
        $this->seed(RoutineTemplateSeeder::class);
    }

    // Esta línea sirve para declarar el método auxiliar que completa el onboarding con los datos indicados.
    private function completeOnboardingFor(
        // Esta línea sirve para recibir el usuario.
        User $user,
        // Esta línea sirve para recibir el sexo.
        string $sex,
        // Esta línea sirve para recibir la frecuencia semanal.
        int $frequencyDays,
        // Esta línea sirve para recibir el nivel.
        string $level = 'intermediate',
        // Esta línea sirve para recibir el objetivo.
        string $goal = 'gain_muscle',
        // Esta línea sirve para recibir los minutos de sesión.
        ?int $sessionMinutes = null,
        // Esta línea sirve para indicar que el método no devuelve nada.
    ): void {
        // Esta línea sirve para crear el perfil del usuario.
        $user->profile()->create(['age' => 28, 'sex' => $sex, 'height_cm' => 175, 'weight_kg' => 75]);
        // Esta línea sirve para crear las respuestas del onboarding.
        $user->onboardingResponse()->create([
            // Esta línea sirve para asignar el nivel, los objetivos y la frecuencia.
            'level' => $level, 'goals' => [$goal], 'frequency_days' => $frequencyDays,
            // Esta línea sirve para asignar $sessionMinutes al campo "session_minutes".
            'session_minutes' => $sessionMinutes,
            // Esta línea sirve para marcarlas como completas.
            'completed' => true, 'completed_at' => now(),
        ]);
    }

    /**
     * "Familias" de grupo muscular más amplias que los slugs crudos de la
     * tabla muscle_groups (quads/hamstrings/glutes son los 3 "piernas" de
     * un mismo día de pierna; biceps/triceps son "brazos" del mismo modo).
     * La regla de "máximo 2-3 grupos musculares por día" (sección 4 del
     * pedido) se refiere a esto, no a contar cada slug fino por separado --
     * un día de pierna con cuádriceps+isquios+glúteos sigue siendo UN día
     * de pierna, no 3 grupos distintos. Solo se usa acá, en el test: la API
     * sigue devolviendo los slugs crudos (target_muscle_groups) tal cual,
     * porque CalendarController los resuelve contra la tabla real por slug.
     */
    // Esta línea sirve para definir qué grupos musculares cuentan como la misma familia.
    private const MUSCLE_FAMILIES = [
        // Esta línea sirve para asignar 'legs' al campo "quads".
        'quads' => 'legs',
        // Esta línea sirve para asignar 'legs' al campo "hamstrings".
        'hamstrings' => 'legs',
        // Esta línea sirve para asignar 'legs' al campo "glutes".
        'glutes' => 'legs',
        // Esta línea sirve para asignar 'arms' al campo "biceps".
        'biceps' => 'arms',
        // Esta línea sirve para asignar 'arms' al campo "triceps".
        'triceps' => 'arms',
    ];

    /** Familias de grupo muscular de un día generado, sin duplicados. */
    // Esta línea sirve para declarar el método auxiliar que obtiene las familias musculares de un día.
    private function muscleGroupsOf(array $day): array
    {
        // Esta línea sirve para devolver las familias del día.
        return collect($day['target_muscle_groups'] ?? [])
            // Esta línea sirve para convertir cada músculo en su familia.
            ->map(fn (string $slug) => self::MUSCLE_FAMILIES[$slug] ?? $slug)
            // Esta línea sirve para quitar repetidos.
            ->unique()
            // Esta línea sirve para reindexar la lista.
            ->values()
            // Esta línea sirve para convertir la colección en arreglo.
            ->all();
    }

    // Esta línea sirve para declarar el proveedor de datos con las combinaciones de sexo y frecuencia.
    public static function sexFrequencyCombos(): array
    {
        // Esta línea sirve para devolver las combinaciones.
        return [
            // Esta línea sirve para incluir hombre con 3 días.
            'male 3 days' => ['male', 3],
            // Esta línea sirve para incluir hombre con 4 días.
            'male 4 days' => ['male', 4],
            // Esta línea sirve para incluir hombre con 5 días.
            'male 5 days' => ['male', 5],
            // Esta línea sirve para incluir hombre con 6 días.
            'male 6 days' => ['male', 6],
            // Esta línea sirve para incluir mujer con 3 días.
            'female 3 days' => ['female', 3],
            // Esta línea sirve para incluir mujer con 4 días.
            'female 4 days' => ['female', 4],
            // Esta línea sirve para incluir mujer con 5 días.
            'female 5 days' => ['female', 5],
            // Esta línea sirve para incluir mujer con 6 días.
            'female 6 days' => ['female', 6],
        ];
    }

    /**
     * Las 24 plantillas reales (sexo x frecuencia x nivel) — a diferencia de
     * sexFrequencyCombos() (que fija level=intermediate), este provider
     * habria detectado si RoutineTemplateBeginnerSeeder o
     * RoutineTemplateAdvancedSeeder hubieran quedado incompletos.
     */
    // Esta línea sirve para declarar el proveedor de datos con las combinaciones de sexo, frecuencia y nivel.
    public static function sexFrequencyLevelCombos(): array
    {
        // Esta línea sirve para empezar con la lista de combinaciones vacía.
        $combos = [];
        // Esta línea sirve para recorrer cada sexo.
        foreach (['male', 'female'] as $sex) {
            // Esta línea sirve para recorrer cada frecuencia.
            foreach ([3, 4, 5, 6] as $frequencyDays) {
                // Esta línea sirve para recorrer cada nivel.
                foreach (['beginner', 'intermediate', 'advanced'] as $level) {
                    // Esta línea sirve para agregar la combinación con un nombre descriptivo.
                    $combos["{$sex} {$frequencyDays} days {$level}"] = [$sex, $frequencyDays, $level];
                }
            }
        }

        // Esta línea sirve para devolver las combinaciones.
        return $combos;
    }

    /** @dataProvider sexFrequencyCombos */
    // Esta línea sirve para declarar el test que comprueba que se genera una rutina para cada combinación de sexo y frecuencia.
    public function test_generates_a_routine_for_every_sex_and_frequency_combination(string $sex, int $frequencyDays): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user, $sex, $frequencyDays);

        // Esta línea sirve para hacer POST a /api/v1/routines/generate autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.source" sea 'engine'.
            ->assertJsonPath('data.source', 'engine')
            // Esta línea sirve para exigir que haya un día por cada día de frecuencia.
            ->assertJsonCount($frequencyDays, 'data.days');

        // Nivel intermediate (default de completeOnboardingFor) + objetivo
        // gain_muscle -> RoutineVolumeCalculator: entre 6 y 8 ejercicios/día,
        // 3 series, reps "8-12" (ver RoutineVolumeCalculator::volumeForLevel/intensityForGoal).
        // Cada ejercicio resuelve a un ejercicio real del catálogo, y ningún
        // día pasa de 3 grupos musculares principales (sección 4 del pedido).
        // Esta línea sirve para obtener los días de la rutina.
        $days = $response->json('data.days');
        // Esta línea sirve para recorrer cada día.
        foreach ($days as $day) {
            // Esta línea sirve para exigir al menos 6 ejercicios por día.
            $this->assertGreaterThanOrEqual(6, count($day['exercises']));
            // Esta línea sirve para exigir como máximo 8 ejercicios por día.
            $this->assertLessThanOrEqual(8, count($day['exercises']));
            // Esta línea sirve para exigir como máximo 3 grupos musculares por día.
            $this->assertLessThanOrEqual(3, count($this->muscleGroupsOf($day)));
            // Esta línea sirve para recorrer cada ejercicio del día.
            foreach ($day['exercises'] as $exercise) {
                // Esta línea sirve para exigir 3 series.
                $this->assertSame(3, $exercise['target_sets']);
                // Esta línea sirve para exigir repeticiones de 8 a 12.
                $this->assertSame('8-12', $exercise['target_reps']);
                // Esta línea sirve para exigir que el ejercicio tenga nombre.
                $this->assertNotEmpty($exercise['exercise']['name']);
            }
        }
    }

    /** @dataProvider sexFrequencyCombos */
    // Esta línea sirve para declarar el test que comprueba que ningún día supera los tres grupos musculares principales.
    public function test_no_day_ever_exceeds_three_main_muscle_groups(string $sex, int $frequencyDays): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user, $sex, $frequencyDays);

        // Esta línea sirve para hacer POST a /api/v1/routines/generate autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');
        // Esta línea sirve para obtener los días de la rutina.
        $days = $response->json('data.days');

        // Esta línea sirve para recorrer cada día.
        foreach ($days as $day) {
            // Esta línea sirve para obtener las familias musculares del día.
            $groups = $this->muscleGroupsOf($day);
            // Esta línea sirve para exigir como máximo 3 grupos y mostrar cuáles entrena si falla.
            $this->assertLessThanOrEqual(3, count($groups), "Día '{$day['label']}' entrena ".count($groups).' grupos musculares: '.implode(', ', $groups));
        }
    }

    /**
     * @dataProvider sexFrequencyCombos
     *
     * No exige CERO superposición entre días consecutivos (un día de tirón
     * legítimamente toca algo de "shoulders" vía deltoide posterior, sin
     * competir con el trabajo de empuje) -- exige que el grupo PRINCIPAL
     * (familia del primer ejercicio, el compuesto del día, ver
     * SeedsRoutineTemplates) nunca se repita entre un día y el siguiente,
     * incluyendo el cierre del ciclo. Eso es lo que pide la sección 10:
     * no "Pecho lunes, Pecho martes" sin motivo, no "cero contacto con
     * cualquier músculo que haya tocado el día anterior".
     */
    // Esta línea sirve para declarar el test que comprueba que el grupo muscular principal no se repite en el día siguiente.
    public function test_the_main_muscle_group_never_repeats_on_the_immediately_next_day(string $sex, int $frequencyDays): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user, $sex, $frequencyDays);

        // Esta línea sirve para hacer POST a /api/v1/routines/generate autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');
        // Esta línea sirve para obtener los días de la rutina.
        $days = $response->json('data.days');
        // Esta línea sirve para definir cómo obtener el grupo principal de un día.
        $mainFamily = fn (array $day) => $this->muscleGroupsOf($day)[0] ?? null;

        // Esta línea sirve para recorrer cada día.
        for ($i = 0; $i < count($days); $i++) {
            // Esta línea sirve para calcular el día siguiente (el último vuelve al primero).
            $next = ($i + 1) % count($days);
            // Esta línea sirve para exigir que sean distintos.
            $this->assertNotSame(
                // Esta línea sirve para pasar el grupo principal del día actual.
                $mainFamily($days[$i]),
                // Esta línea sirve para pasar el grupo principal del día siguiente.
                $mainFamily($days[$next]),
                // Esta línea sirve para mostrar este mensaje si falla.
                "'{$days[$i]['label']}' y '{$days[$next]['label']}' tienen el mismo grupo muscular principal"
            );
        }
    }

    // Esta línea sirve para declarar el test que comprueba que un principiante recibe menos volumen que un avanzado.
    public function test_beginner_gets_less_volume_than_advanced_for_the_same_split(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();

        // 90 min para que el techo por tiempo no iguale a todos en el mínimo de 6.
        // Esta línea sirve para crear un usuario de prueba.
        $beginner = User::factory()->create();
        // Esta línea sirve para completar el onboarding del principiante.
        $this->completeOnboardingFor($beginner, 'male', 3, 'beginner', 'gain_muscle', 90);
        // Esta línea sirve para generar su rutina y obtener los días.
        $beginnerDays = $this->actingAs($beginner, 'sanctum')->postJson('/api/v1/routines/generate')->json('data.days');

        // Esta línea sirve para crear un usuario de prueba.
        $advanced = User::factory()->create();
        // Esta línea sirve para completar el onboarding del avanzado.
        $this->completeOnboardingFor($advanced, 'male', 3, 'advanced', 'gain_muscle', 90);
        // Esta línea sirve para generar su rutina y obtener los días.
        $advancedDays = $this->actingAs($advanced, 'sanctum')->postJson('/api/v1/routines/generate')->json('data.days');

        // Esta línea sirve para definir cómo sumar las series de una rutina.
        $totalSets = fn (array $days) => collect($days)->flatMap(fn ($d) => $d['exercises'])->sum('target_sets');
        // Esta línea sirve para definir cómo contar los ejercicios de una rutina.
        $exerciseCount = fn (array $days) => collect($days)->flatMap(fn ($d) => $d['exercises'])->count();

        // Esta línea sirve para exigir que el principiante tenga menos series que el avanzado.
        $this->assertLessThan($totalSets($advancedDays), $totalSets($beginnerDays));
        // "Avanzado" no debe significar simplemente más ejercicios (sección 5):
        // misma cantidad de movimientos que intermedio, más series cada uno.
        // Esta línea sirve para crear un usuario de prueba.
        $intermediate = User::factory()->create();
        // Esta línea sirve para completar el onboarding del intermedio.
        $this->completeOnboardingFor($intermediate, 'male', 3, 'intermediate', 'gain_muscle', 90);
        // Esta línea sirve para generar su rutina y obtener los días.
        $intermediateDays = $this->actingAs($intermediate, 'sanctum')->postJson('/api/v1/routines/generate')->json('data.days');
        // Esta línea sirve para exigir que el intermedio y el avanzado tengan los mismos ejercicios.
        $this->assertSame($exerciseCount($intermediateDays), $exerciseCount($advancedDays));
        // Esta línea sirve para exigir que el principiante tenga menos ejercicios que el intermedio.
        $this->assertLessThan($exerciseCount($intermediateDays), $exerciseCount($beginnerDays));
    }

    // Esta línea sirve para declarar el proveedor de datos con repeticiones y descanso por objetivo.
    public static function goalRepRanges(): array
    {
        // Esta línea sirve para devolver los casos.
        return [
            // Esta línea sirve para incluir fuerza: repeticiones bajas y descanso largo.
            'strength -> reps bajas, descanso largo' => ['strength', '4-6', 150],
            // Esta línea sirve para ganar músculo: repeticiones moderadas.
            'gain_muscle -> reps moderadas' => ['gain_muscle', '8-12', 90],
            // Esta línea sirve para perder grasa: repeticiones altas y descanso corto.
            'lose_fat -> reps altas, descanso corto' => ['lose_fat', '12-15', 45],
            // Esta línea sirve para incluir resistencia: repeticiones muy altas.
            'endurance -> reps muy altas' => ['endurance', '15-20', 45],
        ];
    }

    /** @dataProvider goalRepRanges */
    // Esta línea sirve para declarar el test que comprueba que las repeticiones y el descanso siguen el objetivo del usuario.
    public function test_reps_and_rest_follow_the_users_goal(string $goal, string $expectedReps, int $expectedRest): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding con ese objetivo.
        $this->completeOnboardingFor($user, 'male', 3, 'intermediate', $goal);

        // Esta línea sirve para generar la rutina y obtener los días.
        $days = $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate')->json('data.days');

        // Esta línea sirve para exigir las repeticiones esperadas.
        $this->assertSame($expectedReps, $days[0]['exercises'][0]['target_reps']);
        // Esta línea sirve para exigir el descanso esperado.
        $this->assertSame($expectedRest, $days[0]['exercises'][0]['rest_seconds']);
    }

    // Esta línea sirve para declarar el test que comprueba que una sesión corta recorta ejercicios pero una larga no los infla.
    public function test_a_short_session_time_trims_exercises_but_a_long_one_does_not_inflate_them(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();

        // Esta línea sirve para crear un usuario de prueba.
        $short = User::factory()->create();
        // Esta línea sirve para completar el onboarding con sesión de 30 minutos.
        $this->completeOnboardingFor($short, 'male', 3, 'intermediate', 'gain_muscle', 30);
        // Esta línea sirve para generar la rutina y obtener los días.
        $shortDays = $this->actingAs($short, 'sanctum')->postJson('/api/v1/routines/generate')->json('data.days');

        // Esta línea sirve para crear un usuario de prueba.
        $long = User::factory()->create();
        // Esta línea sirve para completar el onboarding con sesión de 90 minutos.
        $this->completeOnboardingFor($long, 'male', 3, 'intermediate', 'gain_muscle', 90);
        // Esta línea sirve para generar la rutina y obtener los días.
        $longDays = $this->actingAs($long, 'sanctum')->postJson('/api/v1/routines/generate')->json('data.days');

        // 30 min a 3 series x (45s + 90s descanso) por ejercicio ~= 6.75min/ejercicio -> entrarían 4,
        // pero nunca se baja del mínimo de 6 ejercicios por día.
        // Esta línea sirve para exigir 6 ejercicios con la sesión corta.
        $this->assertCount(6, $shortDays[0]['exercises']);
        // 90 min: el día de Empuje intermedio trae toda su plantilla (7), sin pasar del máximo de 8.
        // Esta línea sirve para exigir 7 ejercicios con la sesión larga.
        $this->assertCount(7, $longDays[0]['exercises']);
    }

    /** @dataProvider sexFrequencyLevelCombos */
    // Esta línea sirve para declarar el test que comprueba que cada día tiene entre seis y ocho ejercicios.
    public function test_every_day_has_between_six_and_eight_exercises(string $sex, int $frequencyDays, string $level): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();

        // Esta línea sirve para recorrer sesiones de 30 y 90 minutos.
        foreach ([30, 90] as $sessionMinutes) {
            // Esta línea sirve para crear un usuario de prueba.
            $user = User::factory()->create();
            // Esta línea sirve para completar el onboarding con esos minutos.
            $this->completeOnboardingFor($user, $sex, $frequencyDays, $level, 'gain_muscle', $sessionMinutes);
            // Esta línea sirve para generar la rutina y obtener los días.
            $days = $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate')->json('data.days');

            // Esta línea sirve para recorrer cada día.
            foreach ($days as $day) {
                // Esta línea sirve para contar los ejercicios del día.
                $count = count($day['exercises']);
                // Esta línea sirve para exigir que sean entre 6 y 8 y mostrar el detalle si falla.
                $this->assertTrue($count >= 6 && $count <= 8, "Día '{$day['label']}' ({$sessionMinutes} min) tiene {$count} ejercicios.");
            }
        }
    }

    /** @dataProvider sexFrequencyLevelCombos */
    // Esta línea sirve para declarar el test que comprueba que se genera rutina para cada combinación de sexo, frecuencia y nivel.
    public function test_generates_a_routine_for_every_sex_frequency_and_level_combination(string $sex, int $frequencyDays, string $level): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user, $sex, $frequencyDays, $level);

        // Esta línea sirve para hacer POST a /api/v1/routines/generate autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.source" sea 'engine'.
            ->assertJsonPath('data.source', 'engine')
            // Esta línea sirve para exigir que haya un día por cada día de frecuencia.
            ->assertJsonCount($frequencyDays, 'data.days');
    }

    // Esta línea sirve para declarar el test que comprueba que principiante y avanzado usan ejercicios distintos.
    public function test_beginner_and_advanced_templates_use_different_exercises_for_the_same_sex_and_frequency(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();

        // Esta línea sirve para crear un usuario de prueba.
        $beginner = User::factory()->create();
        // Esta línea sirve para completar el onboarding del principiante.
        $this->completeOnboardingFor($beginner, 'male', 3, 'beginner');
        // Esta línea sirve para generar su rutina.
        $beginnerRoutine = $this->actingAs($beginner, 'sanctum')->postJson('/api/v1/routines/generate')->json('data');

        // Esta línea sirve para crear un usuario de prueba.
        $advanced = User::factory()->create();
        // Esta línea sirve para completar el onboarding del avanzado.
        $this->completeOnboardingFor($advanced, 'male', 3, 'advanced');
        // Esta línea sirve para generar su rutina.
        $advancedRoutine = $this->actingAs($advanced, 'sanctum')->postJson('/api/v1/routines/generate')->json('data');

        // Esta línea sirve para obtener los ids de ejercicios del principiante.
        $beginnerExerciseIds = collect($beginnerRoutine['days'])
            // Esta línea sirve para juntar los ejercicios de todos los días.
            ->flatMap(fn ($day) => collect($day['exercises'])->pluck('exercise.id'));
        // Esta línea sirve para obtener los ids de ejercicios del avanzado.
        $advancedExerciseIds = collect($advancedRoutine['days'])
            // Esta línea sirve para juntar los ejercicios de todos los días.
            ->flatMap(fn ($day) => collect($day['exercises'])->pluck('exercise.id'));

        // Esta línea sirve para exigir que los conjuntos de ejercicios sean distintos.
        $this->assertNotSame($beginnerExerciseIds->sort()->values()->all(), $advancedExerciseIds->sort()->values()->all());
    }

    // Esta línea sirve para declarar el test que comprueba que la generación es rápida y no necesita un worker de colas.
    public function test_generation_is_fast_and_does_not_require_a_queue_worker(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear el perfil del usuario.
        $user->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 80]);

        // Esta línea sirve para guardar el momento de inicio.
        $start = microtime(true);
        // Esta línea sirve para hacer la petición a /api/v1/onboarding como user con estos datos.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding', [
            // Esta línea sirve para asignar el nivel, los objetivos y la frecuencia.
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 4,
        ]);
        // Esta línea sirve para hacer la petición a /api/v1/onboarding/complete como user y exigir que responda 200.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/onboarding/complete')->assertOk();
        // Esta línea sirve para calcular los milisegundos que tardó.
        $elapsedMs = (microtime(true) - $start) * 1000;

        // La rutina debe existir YA (dispatchSync, ver GenerateRoutineOnOnboardingCompleted)
        // sin depender de que un queue worker la procese despues.
        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/routines/active.
            ->getJson('/api/v1/routines/active')
            // Esta línea sirve para exigir que la respuesta sea 200 (OK).
            ->assertOk()
            // Esta línea sirve para exigir que "data.is_active" sea true.
            ->assertJsonPath('data.is_active', true);

        // Esta línea sirve para exigir que haya tardado menos de 2 segundos.
        $this->assertLessThan(2000, $elapsedMs, 'La generacion no deberia tardar segundos.');
    }

    // Esta línea sirve para declarar el test que comprueba que las plantillas de mujer y hombre difieren en el día de pierna.
    public function test_female_and_male_templates_differ_in_leg_day_content(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();

        // Esta línea sirve para crear un usuario de prueba.
        $male = User::factory()->create();
        // Esta línea sirve para completar el onboarding del hombre.
        $this->completeOnboardingFor($male, 'male', 3);
        // Esta línea sirve para generar su rutina.
        $maleRoutine = $this->actingAs($male, 'sanctum')->postJson('/api/v1/routines/generate')->json('data');

        // Esta línea sirve para crear un usuario de prueba.
        $female = User::factory()->create();
        // Esta línea sirve para completar el onboarding de la mujer.
        $this->completeOnboardingFor($female, 'female', 3);
        // Esta línea sirve para generar su rutina.
        $femaleRoutine = $this->actingAs($female, 'sanctum')->postJson('/api/v1/routines/generate')->json('data');

        // Esta línea sirve para obtener los nombres del día de pierna del hombre.
        $maleLegNames = collect($maleRoutine['days'][2]['exercises'])->pluck('exercise.name');
        // Esta línea sirve para obtener los nombres del día de pierna de la mujer.
        $femaleLegNames = collect($femaleRoutine['days'][2]['exercises'])->pluck('exercise.name');

        // Esta línea sirve para exigir que los ejercicios sean distintos.
        $this->assertNotSame($maleLegNames->all(), $femaleLegNames->all());
        // Esta línea sirve para exigir que el día de la mujer incluya hip thrust en máquina.
        $this->assertTrue($femaleLegNames->contains('Hip Thrust en máquina'), 'El dia de pierna femenino deberia priorizar gluteo.');
    }
}
