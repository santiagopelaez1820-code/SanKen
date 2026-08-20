<?php

namespace Tests\Feature\Challenges;

use App\Application\Challenges\Actions\GenerateChallengesAction;
use App\Models\Challenge;
use App\Models\ChallengeTemplate;
use Carbon\Carbon;
use Database\Seeders\ChallengeTemplateSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GenerateChallengesCommandTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ChallengeTemplateSeeder::class);
    }

    public function test_creates_one_challenge_per_active_template(): void
    {
        $created = GenerateChallengesAction::dispatchSync();

        $this->assertSame(ChallengeTemplate::active()->count(), $created);
        $this->assertDatabaseCount('challenges', ChallengeTemplate::active()->count());
    }

    public function test_inactive_templates_never_generate_a_challenge(): void
    {
        ChallengeTemplate::query()->where('code', 'monthly_volume_10000')->update(['is_active' => false]);

        GenerateChallengesAction::dispatchSync();

        $this->assertDatabaseMissing('challenges', ['code' => 'monthly_volume_10000']);
        $this->assertDatabaseHas('challenges', ['code' => 'weekly_5_sessions']);
    }

    public function test_running_it_twice_does_not_duplicate_the_current_periods_challenges(): void
    {
        GenerateChallengesAction::dispatchSync();
        $firstCount = Challenge::query()->count();

        $secondCreated = GenerateChallengesAction::dispatchSync();
        $secondCount = Challenge::query()->count();

        $this->assertSame(0, $secondCreated);
        $this->assertSame($firstCount, $secondCount);
    }

    public function test_weekly_challenge_spans_monday_to_sunday_of_the_current_week(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-08-12')); // un miércoles

        GenerateChallengesAction::dispatchSync();

        $weekly = Challenge::query()->where('code', 'weekly_5_sessions')->first();

        $this->assertSame('2026-08-10', $weekly->starts_at->toDateString());
        $this->assertSame('2026-08-16', $weekly->ends_at->toDateString());

        Carbon::setTestNow();
    }

    public function test_monthly_challenge_spans_the_full_calendar_month(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-08-12'));

        GenerateChallengesAction::dispatchSync();

        $monthly = Challenge::query()->where('code', 'monthly_volume_10000')->first();

        $this->assertSame('2026-08-01', $monthly->starts_at->toDateString());
        $this->assertSame('2026-08-31', $monthly->ends_at->toDateString());

        Carbon::setTestNow();
    }

    public function test_a_new_week_creates_a_new_weekly_challenge_without_touching_the_old_one(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-08-12'));
        GenerateChallengesAction::dispatchSync();

        Carbon::setTestNow(Carbon::parse('2026-08-19'));
        GenerateChallengesAction::dispatchSync();

        $this->assertDatabaseCount('challenges', ChallengeTemplate::active()->count() + 1);
        $weeklyStarts = Challenge::query()->where('code', 'weekly_5_sessions')->pluck('starts_at')
            ->map(fn ($date) => $date->toDateString())->sort()->values();
        $this->assertSame(['2026-08-10', '2026-08-17'], $weeklyStarts->all());

        Carbon::setTestNow();
    }

    public function test_a_newly_created_template_starts_generating_challenges_without_deploy(): void
    {
        ChallengeTemplate::query()->create([
            'code' => 'weekly_new_pr', 'title' => 'Nuevo PR', 'description' => 'Consigue un PR esta semana.',
            'type' => 'weekly', 'metric' => 'workouts_count', 'target' => 1,
        ]);

        GenerateChallengesAction::dispatchSync();

        $this->assertDatabaseHas('challenges', ['code' => 'weekly_new_pr']);
    }
}
