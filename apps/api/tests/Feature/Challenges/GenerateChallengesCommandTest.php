<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature\Challenges.

namespace Tests\Feature\Challenges;

// Esta línea sirve para importar la acción GenerateChallengesAction.
use App\Application\Challenges\Actions\GenerateChallengesAction;
// Esta línea sirve para importar el modelo Challenge.
use App\Models\Challenge;
// Esta línea sirve para importar el modelo ChallengeTemplate.
use App\Models\ChallengeTemplate;
// Esta línea sirve para importar la clase Carbon.
use Carbon\Carbon;
// Esta línea sirve para importar la clase ChallengeTemplateSeeder.
use Database\Seeders\ChallengeTemplateSeeder;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests GenerateChallengesCommandTest.
class GenerateChallengesCommandTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar la preparación que corre antes de cada test.
    protected function setUp(): void
    {
        // Esta línea sirve para ejecutar la preparación base de Laravel.
        parent::setUp();
        // Esta línea sirve para sembrar los datos de ChallengeTemplateSeeder.
        $this->seed(ChallengeTemplateSeeder::class);
    }

    // Esta línea sirve para declarar el test que comprueba que se crea un reto por cada plantilla activa.
    public function test_creates_one_challenge_per_active_template(): void
    {
        // Esta línea sirve para generar los retos en el momento y guardar cuántos se crearon.
        $created = GenerateChallengesAction::dispatchSync();

        // Esta línea sirve para exigir que se hayan creado tantos como plantillas activas.
        $this->assertSame(ChallengeTemplate::active()->count(), $created);
        // Esta línea sirve para exigir que la tabla de retos tenga ese mismo número.
        $this->assertDatabaseCount('challenges', ChallengeTemplate::active()->count());
    }

    // Esta línea sirve para declarar el test que comprueba que las plantillas inactivas no generan retos.
    public function test_inactive_templates_never_generate_a_challenge(): void
    {
        // Esta línea sirve para desactivar la plantilla mensual.
        ChallengeTemplate::query()->where('code', 'monthly_volume_10000')->update(['is_active' => false]);

        // Esta línea sirve para generar los retos en el momento.
        GenerateChallengesAction::dispatchSync();

        // Esta línea sirve para exigir que la tabla challenges no tenga ese registro.
        $this->assertDatabaseMissing('challenges', ['code' => 'monthly_volume_10000']);
        // Esta línea sirve para exigir que la tabla challenges tenga ese registro.
        $this->assertDatabaseHas('challenges', ['code' => 'weekly_5_sessions']);
    }

    // Esta línea sirve para declarar el test que comprueba que correrlo dos veces no duplica los retos del período.
    public function test_running_it_twice_does_not_duplicate_the_current_periods_challenges(): void
    {
        // Esta línea sirve para generar los retos por primera vez.
        GenerateChallengesAction::dispatchSync();
        // Esta línea sirve para contar los retos creados.
        $firstCount = Challenge::query()->count();

        // Esta línea sirve para generar los retos por segunda vez.
        $secondCreated = GenerateChallengesAction::dispatchSync();
        // Esta línea sirve para contar los retos otra vez.
        $secondCount = Challenge::query()->count();

        // Esta línea sirve para exigir que la segunda vez no cree ninguno.
        $this->assertSame(0, $secondCreated);
        // Esta línea sirve para exigir que el total no haya cambiado.
        $this->assertSame($firstCount, $secondCount);
    }

    // Esta línea sirve para declarar el test que comprueba que el reto semanal va de lunes a domingo.
    public function test_weekly_challenge_spans_monday_to_sunday_of_the_current_week(): void
    {
        // Esta línea sirve para fijar la fecha en un miércoles.
        Carbon::setTestNow(Carbon::parse('2026-08-12')); // un miércoles

        // Esta línea sirve para generar los retos en el momento.
        GenerateChallengesAction::dispatchSync();

        // Esta línea sirve para buscar el reto semanal.
        $weekly = Challenge::query()->where('code', 'weekly_5_sessions')->first();

        // Esta línea sirve para exigir que empiece el lunes 10.
        $this->assertSame('2026-08-10', $weekly->starts_at->toDateString());
        // Esta línea sirve para exigir que termine el domingo 16.
        $this->assertSame('2026-08-16', $weekly->ends_at->toDateString());

        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
    }

    // Esta línea sirve para declarar el test que comprueba que el reto mensual cubre todo el mes calendario.
    public function test_monthly_challenge_spans_the_full_calendar_month(): void
    {
        // Esta línea sirve para fijar la fecha actual en 2026-08-12.
        Carbon::setTestNow(Carbon::parse('2026-08-12'));

        // Esta línea sirve para generar los retos en el momento.
        GenerateChallengesAction::dispatchSync();

        // Esta línea sirve para buscar el reto mensual.
        $monthly = Challenge::query()->where('code', 'monthly_volume_10000')->first();

        // Esta línea sirve para exigir que empiece el día 1.
        $this->assertSame('2026-08-01', $monthly->starts_at->toDateString());
        // Esta línea sirve para exigir que termine el día 31.
        $this->assertSame('2026-08-31', $monthly->ends_at->toDateString());

        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
    }

    // Esta línea sirve para declarar el test que comprueba que una semana nueva crea un reto nuevo sin tocar el anterior.
    public function test_a_new_week_creates_a_new_weekly_challenge_without_touching_the_old_one(): void
    {
        // Esta línea sirve para fijar la fecha actual en 2026-08-12.
        Carbon::setTestNow(Carbon::parse('2026-08-12'));
        // Esta línea sirve para generar los retos de la primera semana.
        GenerateChallengesAction::dispatchSync();

        // Esta línea sirve para fijar la fecha actual en 2026-08-19.
        Carbon::setTestNow(Carbon::parse('2026-08-19'));
        // Esta línea sirve para generar los retos de la semana siguiente.
        GenerateChallengesAction::dispatchSync();

        // Esta línea sirve para exigir que haya un reto más que plantillas activas.
        $this->assertDatabaseCount('challenges', ChallengeTemplate::active()->count() + 1);
        // Esta línea sirve para obtener las fechas de inicio de los retos semanales.
        $weeklyStarts = Challenge::query()->where('code', 'weekly_5_sessions')->pluck('starts_at')
            // Esta línea sirve para convertirlas a texto y ordenarlas.
            ->map(fn ($date) => $date->toDateString())->sort()->values();
        // Esta línea sirve para exigir que sean las dos semanas esperadas.
        $this->assertSame(['2026-08-10', '2026-08-17'], $weeklyStarts->all());

        // Esta línea sirve para volver a la fecha real.
        Carbon::setTestNow();
    }

    // Esta línea sirve para declarar el test que comprueba que una plantilla nueva genera retos sin necesidad de deploy.
    public function test_a_newly_created_template_starts_generating_challenges_without_deploy(): void
    {
        // Esta línea sirve para crear una plantilla nueva.
        ChallengeTemplate::query()->create([
            // Esta línea sirve para asignar el código, el título y la descripción.
            'code' => 'weekly_new_pr', 'title' => 'Nuevo PR', 'description' => 'Consigue un PR esta semana.',
            // Esta línea sirve para asignar el tipo, la métrica y la meta.
            'type' => 'weekly', 'metric' => 'workouts_count', 'target' => 1,
        ]);

        // Esta línea sirve para generar los retos en el momento.
        GenerateChallengesAction::dispatchSync();

        // Esta línea sirve para exigir que la tabla challenges tenga ese registro.
        $this->assertDatabaseHas('challenges', ['code' => 'weekly_new_pr']);
    }
}
