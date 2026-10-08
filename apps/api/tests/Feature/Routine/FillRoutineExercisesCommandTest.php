<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Routine.

namespace Tests\Feature\Routine;

// Esta línea sirve para importar el modelo Routine.
use App\Models\Routine;
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

// Esta línea sirve para declarar la clase de tests FillRoutineExercisesCommandTest.
class FillRoutineExercisesCommandTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que crea una rutina del motor para un usuario.
    private function engineRoutineFor(int $sessionMinutes = 90): Routine
    {
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
        // Esta línea sirve para sembrar los datos de RoutineTemplateSeeder.
        $this->seed(RoutineTemplateSeeder::class);

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear el perfil del usuario.
        $user->profile()->create(['age' => 28, 'sex' => 'male', 'height_cm' => 175, 'weight_kg' => 75]);
        // Esta línea sirve para crear las respuestas del onboarding.
        $user->onboardingResponse()->create([
            // Esta línea sirve para asignar el nivel, los objetivos y la frecuencia.
            'level' => 'intermediate', 'goals' => ['gain_muscle'], 'frequency_days' => 3,
            // Esta línea sirve para asignar la duración de la sesión y marcarlo como completo.
            'session_minutes' => $sessionMinutes, 'completed' => true, 'completed_at' => now(),
        ]);

        // Esta línea sirve para generar la rutina y exigir 201.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate')->assertCreated();

        // Esta línea sirve para devolver la rutina activa con sus días y ejercicios.
        return Routine::query()->where('user_id', $user->id)->where('is_active', true)->with('days.exercises')->firstOrFail();
    }

    /** Simula una rutina vieja (generada cuando el motor armaba 4-5 ejercicios por día). */
    // Esta línea sirve para declarar el método auxiliar que recorta los ejercicios de cada día.
    private function trimTo(Routine $routine, int $perDay): void
    {
        // Esta línea sirve para recorrer cada día.
        foreach ($routine->days as $day) {
            // Esta línea sirve para borrar los ejercicios que superan el máximo por día.
            $day->exercises()->where('order', '>', $perDay)->delete();
        }
    }

    // Esta línea sirve para declarar el test que comprueba que solo agrega los ejercicios faltantes y conserva los existentes con su configuración.
    public function test_adds_only_the_missing_exercises_keeping_existing_ones_and_their_settings(): void
    {
        // Esta línea sirve para crear una rutina del motor.
        $routine = $this->engineRoutineFor();
        // Esta línea sirve para guardar los ejercicios esperados de cada día.
        $expected = $routine->days->mapWithKeys(fn ($day) => [$day->id => $day->exercises->pluck('exercise_id')->all()]);
        // Esta línea sirve para recortar cada día a 4 ejercicios.
        $this->trimTo($routine, 4);

        // Un ejercicio cambiado por su alternativa no debe volver a agregarse duplicado.
        // Esta línea sirve para tomar el primer día.
        $firstDay = $routine->days->first();
        // Esta línea sirve para tomar su primer ejercicio.
        $swapped = $firstDay->exercises()->where('order', 1)->first();
        // Esta línea sirve para obtener la alternativa de ese ejercicio.
        $alternativeId = $swapped->exercise->alternatives()->value('exercises.id');
        // Esta línea sirve para cambiar el ejercicio por su alternativa y ponerle 3 series.
        $swapped->update(['exercise_id' => $alternativeId, 'target_sets' => 3]);

        // Esta línea sirve para ejecutar el comando que completa los ejercicios y exigir que termine bien.
        $this->artisan('routines:fill-exercises')->assertSuccessful();

        // Esta línea sirve para recorrer los días recargados.
        foreach ($routine->fresh('days.exercises')->days as $day) {
            // Esta línea sirve para obtener los ids de los ejercicios del día.
            $ids = $day->exercises->pluck('exercise_id')->all();
            // Esta línea sirve para exigir que el día tenga los mismos ejercicios que antes.
            $this->assertSame(count($expected[$day->id]), count($ids), "Día '{$day->label}' no quedó completo.");
            // Esta línea sirve para exigir que no haya ejercicios repetidos.
            $this->assertSame(count($ids), count(array_unique($ids)));
            // Esta línea sirve para exigir que el orden sea consecutivo desde 1.
            $this->assertSame(range(1, count($ids)), $day->exercises->pluck('order')->all());
            // Esta línea sirve para exigir que todos tengan la misma configuración de series, repeticiones y descanso.
            $this->assertCount(1, $day->exercises->unique(fn ($e) => $e->target_sets.'|'.$e->target_reps.'|'.$e->rest_seconds));
        }

        // Esta línea sirve para exigir que el ejercicio cambiado se conserve.
        $this->assertSame($alternativeId, $firstDay->exercises()->where('order', 1)->value('exercise_id'));
    }

    /**
     * Regresión: "Curl predicador en máquina" figura como alternativa de
     * "Curl bayesiano en polea" en otra plantilla (alternativas globales);
     * eso no debe impedir completar el día de Tirón con su 6.º ejercicio.
     */
    // Esta línea sirve para declarar el test que comprueba que completa un día de tirón aunque el faltante sea alternativa global de otro.
    public function test_completes_a_pull_day_even_when_the_missing_exercise_is_a_global_alternative_of_an_existing_one(): void
    {
        // Esta línea sirve para crear una rutina del motor.
        $routine = $this->engineRoutineFor();
        // Esta línea sirve para recortar cada día a 5 ejercicios.
        $this->trimTo($routine, 5);
        // Esta línea sirve para buscar el día de tirón.
        $pullDay = $routine->days->firstWhere('label', 'Tirón');

        // Esta línea sirve para ejecutar el comando que completa los ejercicios.
        $this->artisan('routines:fill-exercises')->assertSuccessful();

        // Esta línea sirve para obtener los nombres de los ejercicios del día.
        $names = $pullDay->exercises()->with('exercise')->get()->pluck('exercise.name');
        // Esta línea sirve para exigir que haya 6 ejercicios.
        $this->assertCount(6, $names);
        // Esta línea sirve para exigir que el último sea el curl predicador en máquina.
        $this->assertSame('Curl predicador en máquina', $names->last());
    }

    // Esta línea sirve para declarar el test que comprueba que es idempotente e ignora las rutinas de entrenadores.
    public function test_is_idempotent_and_ignores_trainer_routines(): void
    {
        // Esta línea sirve para crear una rutina del motor.
        $routine = $this->engineRoutineFor();
        // Esta línea sirve para recortar cada día a 4 ejercicios.
        $this->trimTo($routine, 4);
        // Esta línea sirve para marcar la rutina como de entrenador.
        $routine->update(['source' => 'trainer']);

        // Esta línea sirve para ejecutar el comando.
        $this->artisan('routines:fill-exercises')->assertSuccessful();
        // Esta línea sirve para exigir que la rutina de entrenador no cambie (4 ejercicios).
        $this->assertSame(4, $routine->days->first()->exercises()->count());

        // Esta línea sirve para marcar la rutina como del motor.
        $routine->update(['source' => 'engine']);
        // Esta línea sirve para ejecutar el comando.
        $this->artisan('routines:fill-exercises')->assertSuccessful();
        // Esta línea sirve para contar los ejercicios del primer día.
        $count = $routine->days->first()->exercises()->count();
        // Esta línea sirve para ejecutar el comando otra vez.
        $this->artisan('routines:fill-exercises')->assertSuccessful();

        // Esta línea sirve para exigir que el primer día tenga al menos 6 ejercicios.
        $this->assertGreaterThanOrEqual(6, $count);
        // Esta línea sirve para exigir que la segunda corrida no cambie la cantidad.
        $this->assertSame($count, $routine->days->first()->exercises()->count());
    }
}
