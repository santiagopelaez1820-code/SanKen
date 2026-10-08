<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Challenges.

namespace Tests\Feature\Challenges;

// Esta línea sirve para importar el modelo Challenge.
use App\Models\Challenge;
// Esta línea sirve para importar el modelo ChallengeParticipant.
use App\Models\ChallengeParticipant;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar el modelo WorkoutSession.
use App\Models\WorkoutSession;
// Esta línea sirve para importar la clase Carbon.
use Carbon\Carbon;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests ChallengeApiTest.
class ChallengeApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para fijar la fecha actual en 2026-08-12.
        Carbon::setTestNow(Carbon::parse('2026-08-12'));
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
    }

    // Esta línea sirve para declarar la limpieza que corre después de cada test.
    protected function tearDown(): void
    {
        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
        // Esta línea sirve para ejecutar la limpieza base de Laravel.
        parent::tearDown();
    }

    // Esta línea sirve para declarar el método auxiliar que crea un reto semanal activo.
    private function makeActiveWeeklyChallenge(int $target = 5): Challenge
    {
        // Esta línea sirve para crear y devolver el reto.
        return Challenge::query()->create([
            // Esta línea sirve para asignar el código, el título y la descripción.
            'code' => 'weekly_5_sessions', 'title' => 'Racha semanal', 'description' => 'Test',
            // Esta línea sirve para asignar el tipo y los criterios (métrica y meta).
            'type' => 'weekly', 'criteria' => ['metric' => 'workouts_count', 'target' => $target],
            // Esta línea sirve para asignar Carbon::now()->startOfWeek()->toDateString() al campo "starts_at".
            'starts_at' => Carbon::now()->startOfWeek()->toDateString(),
            // Esta línea sirve para asignar Carbon::now()->endOfWeek()->toDateString() al campo "ends_at".
            'ends_at' => Carbon::now()->endOfWeek()->toDateString(),
        ]);
    }

    // Esta línea sirve para declarar el test que comprueba que una petición sin sesión se rechaza.
    public function test_unauthenticated_request_is_rejected(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/challenges sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/challenges')->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que el listado solo trae los retos vigentes.
    public function test_index_only_lists_currently_active_challenges(): void
    {
        // Esta línea sirve para crear un reto semanal vigente.
        $active = $this->makeActiveWeeklyChallenge();
        // Esta línea sirve para crear un reto ya vencido.
        $past = Challenge::query()->create([
            // Esta línea sirve para asignar el código, el título, la descripción y el tipo.
            'code' => 'past', 'title' => 'Viejo', 'description' => 'Test', 'type' => 'weekly',
            // Esta línea sirve para asignar los criterios.
            'criteria' => ['metric' => 'workouts_count', 'target' => 5],
            // Esta línea sirve para asignar las fechas de un período pasado.
            'starts_at' => '2026-07-01', 'ends_at' => '2026-07-07',
        ]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/challenges autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/challenges');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data" tenga 1 elementos.
        $response->assertJsonCount(1, 'data');
        // Esta línea sirve para exigir que "data.0.id" sea $active->id.
        $response->assertJsonPath('data.0.id', $active->id);
    }

    // Esta línea sirve para declarar el test que comprueba que el listado marca si el usuario se unió y su progreso.
    public function test_index_marks_joined_status_and_progress_for_the_viewer(): void
    {
        // Esta línea sirve para crear un reto semanal vigente.
        $challenge = $this->makeActiveWeeklyChallenge();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para registrar al usuario como participante.
        ChallengeParticipant::query()->create([
            // Esta línea sirve para asignar el reto, el usuario, el progreso y que no está completado.
            'challenge_id' => $challenge->id, 'user_id' => $user->id, 'progress_value' => 3, 'completed' => false,
        ]);

        // Esta línea sirve para hacer GET a /api/v1/challenges autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/challenges');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.0.joined" sea true.
        $response->assertJsonPath('data.0.joined', true);
        // Esta línea sirve para exigir que "data.0.progress_value" sea 3.
        $response->assertJsonPath('data.0.progress_value', 3);
    }

    // Esta línea sirve para declarar el test que comprueba que unirse crea la participación y es idempotente.
    public function test_join_creates_a_participant_and_is_idempotent(): void
    {
        // Esta línea sirve para crear un reto semanal vigente.
        $challenge = $this->makeActiveWeeklyChallenge();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para guardar el cliente HTTP autenticado como user.
        $client = $this->actingAs($user, 'sanctum');

        // Esta línea sirve para unirse al reto y exigir 200.
        $client->postJson("/api/v1/challenges/{$challenge->id}/join")->assertOk();
        // Esta línea sirve para unirse otra vez y exigir 200.
        $client->postJson("/api/v1/challenges/{$challenge->id}/join")->assertOk();

        // Esta línea sirve para exigir que exista una sola participación.
        $this->assertSame(1, ChallengeParticipant::query()
            // Esta línea sirve para contar las participaciones de ese reto y usuario.
            ->where('challenge_id', $challenge->id)->where('user_id', $user->id)->count());
    }

    // Esta línea sirve para declarar el test que comprueba que al unirse se refleja el progreso ya logrado esta semana.
    public function test_join_immediately_reflects_progress_already_made_this_week(): void
    {
        // Esta línea sirve para crear un reto semanal vigente.
        $challenge = $this->makeActiveWeeklyChallenge();
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear una sesión completada hoy.
        WorkoutSession::query()->create([
            // Esta línea sirve para asignar el usuario, la fecha de hoy y que está completada.
            'user_id' => $user->id, 'performed_at' => Carbon::now()->toDateString(), 'completed' => true,
        ]);

        // Esta línea sirve para hacer POST a /api/v1/challenges/{$challenge->id}/join autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->postJson("/api/v1/challenges/{$challenge->id}/join");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.progress_value" sea 1.
        $response->assertJsonPath('data.progress_value', 1);
    }

    // Esta línea sirve para declarar el test que comprueba que no se puede unir a un reto inactivo.
    public function test_joining_an_inactive_challenge_is_rejected(): void
    {
        // Esta línea sirve para crear un reto ya vencido.
        $past = Challenge::query()->create([
            // Esta línea sirve para asignar el código, el título, la descripción y el tipo.
            'code' => 'past', 'title' => 'Viejo', 'description' => 'Test', 'type' => 'weekly',
            // Esta línea sirve para asignar los criterios.
            'criteria' => ['metric' => 'workouts_count', 'target' => 5],
            // Esta línea sirve para asignar las fechas de un período pasado.
            'starts_at' => '2026-07-01', 'ends_at' => '2026-07-07',
        ]);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer POST a /api/v1/challenges/{$past->id}/join.
            ->postJson("/api/v1/challenges/{$past->id}/join")
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que la tabla ordena por progreso y marca al usuario que mira.
    public function test_leaderboard_ranks_participants_by_progress_and_flags_the_viewer(): void
    {
        // Esta línea sirve para crear un reto semanal vigente.
        $challenge = $this->makeActiveWeeklyChallenge();
        // Esta línea sirve para crear un usuario de prueba.
        $viewer = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $leader = User::factory()->create();
        // Esta línea sirve para registrar al espectador con progreso 2.
        ChallengeParticipant::query()->create(['challenge_id' => $challenge->id, 'user_id' => $viewer->id, 'progress_value' => 2]);
        // Esta línea sirve para registrar al líder con progreso 5.
        ChallengeParticipant::query()->create(['challenge_id' => $challenge->id, 'user_id' => $leader->id, 'progress_value' => 5]);

        // Esta línea sirve para hacer GET a /api/v1/challenges/{$challenge->id}/leaderboard autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/challenges/{$challenge->id}/leaderboard");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.entries.0.user_id" sea $leader->id.
        $response->assertJsonPath('data.entries.0.user_id', $leader->id);
        // Esta línea sirve para exigir que "data.entries.0.rank" sea 1.
        $response->assertJsonPath('data.entries.0.rank', 1);
        // Esta línea sirve para exigir que "data.entries.1.user_id" sea $viewer->id.
        $response->assertJsonPath('data.entries.1.user_id', $viewer->id);
        // Esta línea sirve para exigir que "data.entries.1.is_viewer" sea true.
        $response->assertJsonPath('data.entries.1.is_viewer', true);
    }

    // Esta línea sirve para declarar el test que comprueba que la tabla incluye al espectador aunque esté fuera del top diez.
    public function test_leaderboard_includes_the_viewer_even_when_outside_the_top_ten(): void
    {
        // Esta línea sirve para crear un reto semanal vigente.
        $challenge = $this->makeActiveWeeklyChallenge();
        // Esta línea sirve para crear un usuario de prueba.
        $viewer = User::factory()->create();
        // Esta línea sirve para registrar al espectador con progreso 0.
        ChallengeParticipant::query()->create(['challenge_id' => $challenge->id, 'user_id' => $viewer->id, 'progress_value' => 0]);

        // Esta línea sirve para repetir 10 veces.
        for ($i = 0; $i < 10; $i++) {
            // Esta línea sirve para crear un usuario de prueba.
            $other = User::factory()->create();
            // Esta línea sirve para registrar a otro participante.
            ChallengeParticipant::query()->create([
                // Esta línea sirve para asignar el reto, el usuario y un progreso decreciente.
                'challenge_id' => $challenge->id, 'user_id' => $other->id, 'progress_value' => 10 - $i,
            ]);
        }

        // Esta línea sirve para hacer GET a /api/v1/challenges/{$challenge->id}/leaderboard autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/challenges/{$challenge->id}/leaderboard");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.entries" tenga 11 elementos.
        $response->assertJsonCount(11, 'data.entries');
        // Esta línea sirve para exigir que las entradas incluyan al espectador marcado como tal.
        $this->assertTrue(collect($response->json('data.entries'))->contains(fn ($e) => $e['user_id'] === $viewer->id && $e['is_viewer'] === true));
    }
}
