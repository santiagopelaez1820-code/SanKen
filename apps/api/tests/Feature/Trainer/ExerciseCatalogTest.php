<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Trainer.

namespace Tests\Feature\Trainer;

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

// Esta línea sirve para declarar la clase de tests ExerciseCatalogTest.
class ExerciseCatalogTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el test que comprueba que un usuario autenticado puede listar el catálogo de ejercicios.
    public function test_authenticated_user_can_list_the_exercise_catalog(): void
    {
        // Esta línea sirve para sembrar los datos de MuscleGroupSeeder.
        $this->seed(MuscleGroupSeeder::class);
        // Esta línea sirve para sembrar los datos de ExerciseSeeder.
        $this->seed(ExerciseSeeder::class);
        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();

        // Esta línea sirve para hacer GET a /api/v1/exercises autenticado como user.
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/exercises');

        // Esta línea sirve para exigir que la respuesta sea 200 (OK).
        $response->assertOk();
        // Esta línea sirve para exigir que haya al menos un ejercicio.
        $this->assertGreaterThan(0, count($response->json('data')));
        // Esta línea sirve para exigir que cada ejercicio incluya el músculo principal.
        $this->assertArrayHasKey('primary_muscle', $response->json('data.0'));
    }

    // Esta línea sirve para declarar el test que comprueba que un invitado no puede listar el catálogo.
    public function test_guest_cannot_list_the_exercise_catalog(): void
    {
        // Esta línea sirve para hacer la petición a /api/v1/exercises sin sesión y exigir que responda 401.
        $this->getJson('/api/v1/exercises')->assertUnauthorized();
    }
}
