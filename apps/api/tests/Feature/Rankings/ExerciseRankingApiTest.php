<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Rankings.

namespace Tests\Feature\Rankings;

// Esta línea sirve para importar el modelo City.
use App\Models\City;
// Esta línea sirve para importar el modelo Country.
use App\Models\Country;
// Esta línea sirve para importar el modelo Exercise.
use App\Models\Exercise;
// Esta línea sirve para importar el modelo PrSubmission.
use App\Models\PrSubmission;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase ExerciseSeeder.
use Database\Seeders\ExerciseSeeder;
// Esta línea sirve para importar la clase MuscleGroupSeeder.
use Database\Seeders\MuscleGroupSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests ExerciseRankingApiTest.
class ExerciseRankingApiTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
    }

    // Esta línea sirve para declarar el método auxiliar que crea un usuario con perfil público y un PR aprobado.
    private function makeOptedInUserWithApprovedPr(int $exerciseId, float $value, array $profileAttrs = []): User
    {
        // Esta línea sirve para crear un usuario con perfil público.
        $user = User::factory()->create(['is_public_profile' => true]);
        // Esta línea sirve para crearle el perfil mezclando los datos por defecto con los recibidos.
        $user->profile()->create(array_merge(['age' => 30, 'sex' => 'male', 'weight_kg' => 80], $profileAttrs));
        // Esta línea sirve para crear la postulación aprobada.
        PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $user->id, 'exercise_id' => $exerciseId,
            // Esta línea sirve para asignar peso, repeticiones y 1RM.
            'weight_kg' => $value, 'reps' => 1, 'estimated_1rm' => $value,
            // Esta línea sirve para asignar el estado aprobado y el video.
            'status' => 'approved', 'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        // Esta línea sirve para devolver el usuario.
        return $user;
    }

    // Esta línea sirve para declarar el test que comprueba que una petición sin sesión se rechaza.
    public function test_unauthenticated_request_is_rejected(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');

        // Esta línea sirve para hacer la petición a /api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male sin sesión y exigir que responda 401.
        $this->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male")->assertUnauthorized();
    }

    // Esta línea sirve para declarar el test que comprueba que un alcance inválido se rechaza.
    public function test_invalid_scope_is_rejected(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/exercises/{$exerciseId}/rankings?scope=made_up&sex=male.
            ->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=made_up&sex=male")
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que el sexo es obligatorio.
    public function test_sex_is_required(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para preparar la petición autenticada como user.
        $this->actingAs($user, 'sanctum')
            // Esta línea sirve para hacer GET a /api/v1/exercises/{$exerciseId}/rankings?scope=global.
            ->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global")
            // Esta línea sirve para exigir que la respuesta sea 422 (datos inválidos).
            ->assertUnprocessable();
    }

    // Esta línea sirve para declarar el test que comprueba que el alcance global ordena por mejor 1RM con empates por competencia.
    public function test_global_scope_ranks_by_best_1rm_with_competition_tie_breaking(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear al espectador con 150.
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150);
        // Esta línea sirve para crear un usuario con 200.
        $this->makeOptedInUserWithApprovedPr($exerciseId, 200);
        // Esta línea sirve para crear otro usuario con 200.
        $this->makeOptedInUserWithApprovedPr($exerciseId, 200);

        // Esta línea sirve para hacer GET a /api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.entries" tenga 3 elementos.
        $response->assertJsonCount(3, 'data.entries');
        // Esta línea sirve para exigir que "data.entries.0.rank" sea 1.
        $response->assertJsonPath('data.entries.0.rank', 1);
        // Esta línea sirve para exigir que "data.entries.1.rank" sea 1.
        $response->assertJsonPath('data.entries.1.rank', 1);
        // Esta línea sirve para exigir que "data.entries.2.rank" sea 3.
        $response->assertJsonPath('data.entries.2.rank', 3);
        // Esta línea sirve para exigir que "data.viewer.rank" sea 3.
        $response->assertJsonPath('data.viewer.rank', 3);
        // Esta línea sirve para exigir que "data.viewer.is_viewer" sea true.
        $response->assertJsonPath('data.viewer.is_viewer', true);
    }

    // Esta línea sirve para declarar el test que comprueba que solo se rankea el ejercicio seleccionado.
    public function test_only_ranks_the_selected_exercise(): void
    {
        // Esta línea sirve para obtener los ids de dos ejercicios.
        $exercises = Exercise::query()->limit(2)->pluck('id');
        // Esta línea sirve para crear al espectador en el primer ejercicio.
        $viewer = $this->makeOptedInUserWithApprovedPr($exercises[0], 100);
        // Esta línea sirve para crear un usuario con un valor alto en el segundo ejercicio.
        $this->makeOptedInUserWithApprovedPr($exercises[1], 999);

        // Esta línea sirve para hacer GET a /api/v1/exercises/{$exercises[0]}/rankings?scope=global&sex=male autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exercises[0]}/rankings?scope=global&sex=male");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.entries" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.entries');
        // Esta línea sirve para exigir que "data.entries.0.metric_value" sea 100.
        $response->assertJsonPath('data.entries.0.metric_value', 100);
    }

    // Esta línea sirve para declarar el test que comprueba que el alcance de ciudad usa el nombre de la ciudad y filtra por ella.
    public function test_city_scope_returns_city_name_as_label_and_filters_by_city(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear la ciudad Rosario.
        $city = City::factory()->create(['name' => 'Rosario']);
        // Esta línea sirve para crear la ciudad Córdoba.
        $otherCity = City::factory()->create(['name' => 'Cordoba']);
        // Esta línea sirve para crear al espectador en Rosario.
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150, ['city_id' => $city->id]);
        // Esta línea sirve para crear un usuario con valor alto en Córdoba.
        $this->makeOptedInUserWithApprovedPr($exerciseId, 999, ['city_id' => $otherCity->id]);

        // Esta línea sirve para hacer GET a /api/v1/exercises/{$exerciseId}/rankings?scope=city&sex=male autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=city&sex=male");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.scope_label" sea 'Rosario'.
        $response->assertJsonPath('data.scope_label', 'Rosario');
        // Esta línea sirve para exigir que "data.entries" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.entries');
        // Esta línea sirve para exigir que "data.entries.0.user_id" sea $viewer->id.
        $response->assertJsonPath('data.entries.0.user_id', $viewer->id);
    }

    // Esta línea sirve para declarar el test que comprueba que el alcance de país agrupa las ciudades del mismo país.
    public function test_country_scope_groups_across_cities_in_the_same_country(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear el país Argentina.
        $country = Country::factory()->create(['name' => 'Argentina']);
        // Esta línea sirve para crear una ciudad del país.
        $cityA = City::factory()->create(['country_id' => $country->id]);
        // Esta línea sirve para crear otra ciudad del país.
        $cityB = City::factory()->create(['country_id' => $country->id]);
        // Esta línea sirve para crear al espectador en la primera ciudad.
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150, ['city_id' => $cityA->id]);
        // Esta línea sirve para crear un usuario en la segunda ciudad.
        $this->makeOptedInUserWithApprovedPr($exerciseId, 180, ['city_id' => $cityB->id]);

        // Esta línea sirve para hacer GET a /api/v1/exercises/{$exerciseId}/rankings?scope=country&sex=male autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=country&sex=male");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.scope_label" sea 'Argentina'.
        $response->assertJsonPath('data.scope_label', 'Argentina');
        // Esta línea sirve para exigir que "data.entries" tenga 2 elementos.
        $response->assertJsonCount(2, 'data.entries');
    }

    // Esta línea sirve para declarar el test que comprueba que un espectador sin ciudad recibe un resultado vacío en el alcance de ciudad.
    public function test_viewer_without_a_city_gets_an_empty_result_for_city_scope(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear al espectador sin ciudad.
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150, ['city_id' => null]);

        // Esta línea sirve para hacer GET a /api/v1/exercises/{$exerciseId}/rankings?scope=city&sex=male autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=city&sex=male");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.entries" sea [].
        $response->assertJsonPath('data.entries', []);
        // Esta línea sirve para exigir que "data.viewer" sea null.
        $response->assertJsonPath('data.viewer', null);
    }

    // Esta línea sirve para declarar el test que comprueba que los usuarios con perfil privado quedan fuera de los rankings.
    public function test_opted_out_users_are_excluded_from_rankings(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear al espectador.
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150);
        // Esta línea sirve para crear un usuario con perfil privado.
        $optedOut = User::factory()->create(['is_public_profile' => false]);
        // Esta línea sirve para crearle el perfil.
        $optedOut->profile()->create(['age' => 30, 'sex' => 'male', 'weight_kg' => 80]);
        // Esta línea sirve para crear su postulación aprobada.
        PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $optedOut->id, 'exercise_id' => $exerciseId,
            // Esta línea sirve para asignar peso, repeticiones y 1RM altos.
            'weight_kg' => 999, 'reps' => 1, 'estimated_1rm' => 999,
            // Esta línea sirve para asignar el estado aprobado y el video.
            'status' => 'approved', 'video_url' => '/storage/pr-submission-videos/proof.mp4',
        ]);

        // Esta línea sirve para hacer GET a /api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.entries" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.entries');
    }

    // Esta línea sirve para declarar el test que comprueba que el filtro de sexo excluye al otro sexo.
    public function test_sex_filters_out_the_other_sex(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear al espectador hombre.
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 150, ['sex' => 'male']);
        // Esta línea sirve para crear un usuario mujer con valor alto.
        $this->makeOptedInUserWithApprovedPr($exerciseId, 999, ['sex' => 'female']);

        // Esta línea sirve para hacer GET a /api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.entries" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.entries');
        // Esta línea sirve para exigir que "data.entries.0.metric_value" sea 150.
        $response->assertJsonPath('data.entries.0.metric_value', 150);
    }

    // Esta línea sirve para declarar el test que comprueba que las postulaciones pendientes y rechazadas nunca aparecen.
    public function test_pending_and_rejected_submissions_never_appear_in_rankings(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear al espectador.
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 100);

        // Esta línea sirve para crear un usuario con una postulación pendiente.
        $pendingUser = User::factory()->create(['is_public_profile' => true]);
        // Esta línea sirve para crearle el perfil.
        $pendingUser->profile()->create(['age' => 30, 'sex' => 'male', 'weight_kg' => 80]);
        // Esta línea sirve para crear su postulación pendiente.
        PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $pendingUser->id, 'exercise_id' => $exerciseId,
            // Esta línea sirve para asignar peso, repeticiones, 1RM y estado pendiente.
            'weight_kg' => 999, 'reps' => 1, 'estimated_1rm' => 999, 'status' => 'pending',
        ]);

        // Esta línea sirve para crear un usuario con una postulación rechazada.
        $rejectedUser = User::factory()->create(['is_public_profile' => true]);
        // Esta línea sirve para crearle el perfil.
        $rejectedUser->profile()->create(['age' => 30, 'sex' => 'male', 'weight_kg' => 80]);
        // Esta línea sirve para crear su postulación rechazada.
        PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $rejectedUser->id, 'exercise_id' => $exerciseId,
            // Esta línea sirve para asignar peso, repeticiones, 1RM y estado rechazado.
            'weight_kg' => 999, 'reps' => 1, 'estimated_1rm' => 999, 'status' => 'rejected',
        ]);

        // Esta línea sirve para hacer GET a /api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.entries" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.entries');
        // Esta línea sirve para exigir que "data.entries.0.user_id" sea $viewer->id.
        $response->assertJsonPath('data.entries.0.user_id', $viewer->id);
    }

    // Esta línea sirve para declarar el test que comprueba que solo cuenta la mejor postulación aprobada de cada usuario.
    public function test_only_the_best_approved_submission_per_user_counts(): void
    {
        // Esta línea sirve para obtener el id de un ejercicio.
        $exerciseId = Exercise::query()->value('id');
        // Esta línea sirve para crear al espectador con 100.
        $viewer = $this->makeOptedInUserWithApprovedPr($exerciseId, 100);
        // Una segunda postulación aprobada, mejor que la primera, del mismo usuario.
        // Esta línea sirve para crear una segunda postulación aprobada mejor.
        PrSubmission::query()->create([
            // Esta línea sirve para asignar el usuario y el ejercicio.
            'user_id' => $viewer->id, 'exercise_id' => $exerciseId,
            // Esta línea sirve para asignar peso, repeticiones y 1RM de 130.
            'weight_kg' => 130, 'reps' => 1, 'estimated_1rm' => 130,
            // Esta línea sirve para asignar el estado aprobado y otro video.
            'status' => 'approved', 'video_url' => '/storage/pr-submission-videos/proof2.mp4',
        ]);

        // Esta línea sirve para hacer GET a /api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male autenticado como viewer.
        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/exercises/{$exerciseId}/rankings?scope=global&sex=male");

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que "data.entries" tenga 1 elementos.
        $response->assertJsonCount(1, 'data.entries');
        // Esta línea sirve para exigir que "data.entries.0.metric_value" sea 130.
        $response->assertJsonPath('data.entries.0.metric_value', 130);
    }
}
