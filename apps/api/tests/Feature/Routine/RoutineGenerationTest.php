<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Routine.

namespace Tests\Feature\Routine;

// Esta línea sirve para importar la clase OnboardingCompleted.
use App\Events\OnboardingCompleted;
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
// Esta línea sirve para importar la fachada DB.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests RoutineGenerationTest.
class RoutineGenerationTest extends TestCase
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
        // El motor activo es TemplateRoutineGenerator (ver AppServiceProvider) —
        // sin las plantillas, generar una rutina para male/4d (fixture de este
        // archivo) no encuentra combinacion sexo+frecuencia y tira excepcion.
        // Esta línea sirve para sembrar los datos de RoutineTemplateSeeder.
        $this->seed(RoutineTemplateSeeder::class);
    }

    // Esta línea sirve para declarar el método auxiliar que completa el onboarding de un usuario.
    private function completeOnboardingFor(User $user): void
    {
        // Esta línea sirve para crear el perfil del usuario.
        $user->profile()->create([
            // Esta línea sirve para asignar edad, sexo, altura y peso.
            'age' => 28, 'sex' => 'male', 'height_cm' => 178, 'weight_kg' => 82,
        ]);
        // Esta línea sirve para crear las respuestas del onboarding.
        $user->onboardingResponse()->create([
            // Esta línea sirve para asignar 'intermediate' al campo "level".
            'level' => 'intermediate',
            // Esta línea sirve para asignar ['gain_muscle'] al campo "goals".
            'goals' => ['gain_muscle'],
            // Esta línea sirve para asignar 4 al campo "frequency_days".
            'frequency_days' => 4,
            // Esta línea sirve para asignar 60 al campo "session_minutes".
            'session_minutes' => 60,
            // Esta línea sirve para asignar 'gym' al campo "place".
            'place' => 'gym',
            // Esta línea sirve para asignar ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'] al campo "equipment_available".
            'equipment_available' => ['barbell', 'dumbbells', 'machines', 'cables', 'pull_up_bar', 'squat_rack'],
            // Esta línea sirve para asignar [] al campo "injuries".
            'injuries' => [],
            // Esta línea sirve para asignar true al campo "completed".
            'completed' => true,
            // Esta línea sirve para asignar now() al campo "completed_at".
            'completed_at' => now(),
        ]);
    }

    /**
     * GenerateRoutineOnOnboardingCompleted usa dispatchSync (no dispatch) a
     * proposito — con el motor de plantillas, generar es una sola query, ya
     * no hace falta cola. Por eso esto ya no se puede probar con Queue::fake()
     * + assertPushed (dispatchSync nunca pasa por la cola): se verifica el
     * efecto real, que la rutina exista apenas termina de dispararse el evento.
     */
    // Esta línea sirve para declarar el test que comprueba que completar el onboarding genera la rutina de forma síncrona.
    public function test_completing_onboarding_generates_a_routine_synchronously(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user);

        // Esta línea sirve para disparar el evento de onboarding completado.
        event(new OnboardingCompleted($user->fresh()));

        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['user_id' => $user->id, 'source' => 'engine', 'is_active' => true]);
    }

    // Esta línea sirve para declarar el test que comprueba que la rutina activa responde 404 si no existe.
    public function test_active_routine_returns_404_when_none_exists(): void
    {
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/routines/active.
            ->getJson('/api/v1/routines/active')
            // Esta línea sirve para exigir que la respuesta sea 404 (no encontrado).
            ->assertNotFound();
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario puede generar su rutina tras completar el onboarding.
    public function test_user_can_generate_a_routine_after_completing_onboarding(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user);

        // Esta línea sirve para hacer POST a /api/v1/routines/generate autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated()
            // Esta línea sirve para exigir que "data.source" sea 'engine'.
            ->assertJsonPath('data.source', 'engine')
            // Esta línea sirve para exigir que "data.goal" sea 'gain_muscle'.
            ->assertJsonPath('data.goal', 'gain_muscle')
            // Esta línea sirve para exigir que "data.is_active" sea true.
            ->assertJsonPath('data.is_active', true)
            // Esta línea sirve para exigir que "data.days" tenga 4 elementos.
            ->assertJsonCount(4, 'data.days');

        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['user_id' => $user->id, 'is_active' => true]);
    }

    // Esta línea sirve para declarar el test que comprueba que generar sin onboarding completo falla.
    public function test_generating_without_completed_onboarding_fails(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/routines/generate.
            ->postJson('/api/v1/routines/generate')
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable()
            // Esta línea sirve para exigir errores de validación en 'onboarding'.
            ->assertJsonValidationErrors('onboarding');
    }

    // Esta línea sirve para declarar el test que comprueba que la rutina activa devuelve el plan generado.
    public function test_active_routine_endpoint_returns_the_generated_plan(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user);
        // Esta línea sirve para generar la rutina.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');

        // Esta línea sirve para hacer GET a /api/v1/routines/active autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/routines/active');

        // Esta línea sirve para exigir 200 y que "data.is_active" sea true.
        $response->assertOk()->assertJsonPath('data.is_active', true);
    }

    // Esta línea sirve para declarar el test que comprueba que regenerar desactiva la rutina anterior del motor.
    public function test_regenerating_deactivates_the_previous_engine_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para generar la primera rutina y guardar su id.
        $first = $client->postJson('/api/v1/routines/generate')->json('data.id');
        // Esta línea sirve para generar la rutina otra vez.
        $client->postJson('/api/v1/routines/generate');

        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['id' => $first, 'is_active' => false]);
        // Esta línea sirve para exigir que haya una sola rutina activa.
        $this->assertSame(1, Routine::query()->where('user_id', $user->id)->where('is_active', true)->count());
    }

    // Esta línea sirve para declarar el test que comprueba que el motor nunca reemplaza una rutina creada por un entrenador.
    public function test_engine_never_overwrites_a_trainer_authored_active_routine(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user);
        // Esta línea sirve para crear un usuario entrenador.
        $trainer = User::factory()->create(['role' => 'trainer']);

        // Esta línea sirve para crear una rutina activa creada por un entrenador.
        $trainerRoutine = Routine::query()->create([
            // Esta línea sirve para asignar $user->id al campo "user_id".
            'user_id' => $user->id,
            // Esta línea sirve para asignar $trainer->id al campo "created_by_trainer_id".
            'created_by_trainer_id' => $trainer->id,
            // Esta línea sirve para asignar 'trainer' al campo "source".
            'source' => 'trainer',
            // Esta línea sirve para asignar 'strength' al campo "goal".
            'goal' => 'strength',
            // Esta línea sirve para asignar 'upper_lower' al campo "split_type".
            'split_type' => 'upper_lower',
            // Esta línea sirve para asignar 4 al campo "frequency_days".
            'frequency_days' => 4,
            // Esta línea sirve para asignar 6 al campo "duration_weeks".
            'duration_weeks' => 6,
            // Esta línea sirve para asignar true al campo "is_active".
            'is_active' => true,
        ]);

        // Esta línea sirve para intentar generar la rutina del motor.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/routines/generate');

        // Esta línea sirve para exigir que la tabla routines tenga ese registro.
        $this->assertDatabaseHas('routines', ['id' => $trainerRoutine->id, 'is_active' => true]);
        // Esta línea sirve para exigir que el usuario siga teniendo una sola rutina.
        $this->assertSame(1, Routine::query()->where('user_id', $user->id)->count());
    }

    // Esta línea sirve para declarar el test que comprueba que una segunda consulta de la rutina activa no vuelve a leer sus ejercicios.
    public function test_a_second_request_for_the_active_routine_does_not_requery_its_exercises(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para generar la rutina.
        $client->postJson('/api/v1/routines/generate');
        // Esta línea sirve para pedir la rutina activa y exigir 200.
        $client->getJson('/api/v1/routines/active')->assertOk();

        // Esta línea sirve para activar el registro de consultas SQL.
        DB::enableQueryLog();
        // Esta línea sirve para pedir la rutina activa otra vez y exigir 200.
        $client->getJson('/api/v1/routines/active')->assertOk();
        // Esta línea sirve para juntar las consultas ejecutadas en un texto.
        $queries = collect(DB::getQueryLog())->pluck('query')->implode(' | ');
        // Esta línea sirve para desactivar el registro de consultas.
        DB::disableQueryLog();

        // Esta línea sirve para exigir que no se haya consultado la tabla de ejercicios de rutina.
        $this->assertStringNotContainsString('routine_exercises', $queries);
        // Esta línea sirve para exigir que no se haya consultado la tabla de ejercicios.
        $this->assertStringNotContainsString('"exercises"', $queries);
    }

    // Esta línea sirve para declarar el test que comprueba que regenerar la rutina invalida la caché de la rutina activa.
    public function test_regenerating_a_routine_busts_the_active_routine_cache(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para generar la rutina.
        $client->postJson('/api/v1/routines/generate');
        // Esta línea sirve para pedir la rutina activa y exigir 200.
        $client->getJson('/api/v1/routines/active')->assertOk();

        // Esta línea sirve para generar la rutina otra vez y guardar su id.
        $second = $client->postJson('/api/v1/routines/generate')->json('data.id');

        // Esta línea sirve para pedir la rutina activa.
        $response = $client->getJson('/api/v1/routines/active');
        // Esta línea sirve para exigir 200 y que "data.id" sea $second.
        $response->assertOk()->assertJsonPath('data.id', $second);
    }

    // Esta línea sirve para declarar el test que comprueba que el próximo día se actualiza tras completar una sesión aunque la rutina esté en caché.
    public function test_next_day_id_still_updates_after_completing_a_session_even_though_the_routine_payload_is_cached(): void
    {
        // Esta línea sirve para sembrar el catálogo.
        $this->seedCatalog();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para completar el onboarding del usuario.
        $this->completeOnboardingFor($user);
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');
        // Esta línea sirve para generar la rutina.
        $client->postJson('/api/v1/routines/generate');

        // Esta línea sirve para pedir la rutina activa y exigir 200.
        $first = $client->getJson('/api/v1/routines/active')->assertOk();
        // Esta línea sirve para guardar el id del próximo día.
        $firstNextDayId = $first->json('meta.next_day_id');
        // Esta línea sirve para guardar los días de la rutina.
        $firstDaysPayload = $first->json('data.days');

        // Esta línea sirve para obtener el id de ese día.
        $dayId = collect($first->json('data.days'))->firstWhere('id', $firstNextDayId)['id'];
        // Esta línea sirve para iniciar un entrenamiento de ese día.
        $session = $client->postJson('/api/v1/workout-sessions', ['routine_day_id' => $dayId])->json('data');
        // Esta línea sirve para completar el entrenamiento.
        $client->postJson("/api/v1/workout-sessions/{$session['id']}/complete", []);

        // Esta línea sirve para pedir la rutina activa otra vez.
        $second = $client->getJson('/api/v1/routines/active')->assertOk();

        // Esta línea sirve para exigir que el próximo día haya cambiado.
        $this->assertNotSame($firstNextDayId, $second->json('meta.next_day_id'));
        // Esta línea sirve para exigir que "data.days" sea exactamente $firstDaysPayload.
        $this->assertSame($firstDaysPayload, $second->json('data.days'));
    }
}
