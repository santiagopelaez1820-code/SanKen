<?php

namespace Tests\Feature\Challenges;

use App\Models\Challenge;
use App\Models\ChallengeParticipant;
use App\Models\User;
use App\Models\WorkoutSession;
use Carbon\Carbon;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChallengeApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Carbon::setTestNow(Carbon::parse('2026-08-12'));
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function makeActiveWeeklyChallenge(int $target = 5): Challenge
    {
        return Challenge::query()->create([
            'code' => 'weekly_5_sessions', 'title' => 'Racha semanal', 'description' => 'Test',
            'type' => 'weekly', 'criteria' => ['metric' => 'workouts_count', 'target' => $target],
            'starts_at' => Carbon::now()->startOfWeek()->toDateString(),
            'ends_at' => Carbon::now()->endOfWeek()->toDateString(),
        ]);
    }

    public function test_unauthenticated_request_is_rejected(): void
    {
        $this->getJson('/api/v1/challenges')->assertUnauthorized();
    }

    public function test_index_only_lists_currently_active_challenges(): void
    {
        $active = $this->makeActiveWeeklyChallenge();
        $past = Challenge::query()->create([
            'code' => 'past', 'title' => 'Viejo', 'description' => 'Test', 'type' => 'weekly',
            'criteria' => ['metric' => 'workouts_count', 'target' => 5],
            'starts_at' => '2026-07-01', 'ends_at' => '2026-07-07',
        ]);
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/challenges');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $active->id);
    }

    public function test_index_marks_joined_status_and_progress_for_the_viewer(): void
    {
        $challenge = $this->makeActiveWeeklyChallenge();
        $user = User::factory()->create();
        ChallengeParticipant::query()->create([
            'challenge_id' => $challenge->id, 'user_id' => $user->id, 'progress_value' => 3, 'completed' => false,
        ]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/v1/challenges');

        $response->assertOk();
        $response->assertJsonPath('data.0.joined', true);
        $response->assertJsonPath('data.0.progress_value', 3);
    }

    public function test_join_creates_a_participant_and_is_idempotent(): void
    {
        $challenge = $this->makeActiveWeeklyChallenge();
        $user = User::factory()->create();
        $client = $this->actingAs($user, 'sanctum');

        $client->postJson("/api/v1/challenges/{$challenge->id}/join")->assertOk();
        $client->postJson("/api/v1/challenges/{$challenge->id}/join")->assertOk();

        $this->assertSame(1, ChallengeParticipant::query()
            ->where('challenge_id', $challenge->id)->where('user_id', $user->id)->count());
    }

    public function test_join_immediately_reflects_progress_already_made_this_week(): void
    {
        $challenge = $this->makeActiveWeeklyChallenge();
        $user = User::factory()->create();
        WorkoutSession::query()->create([
            'user_id' => $user->id, 'performed_at' => Carbon::now()->toDateString(), 'completed' => true,
        ]);

        $response = $this->actingAs($user, 'sanctum')->postJson("/api/v1/challenges/{$challenge->id}/join");

        $response->assertOk();
        $response->assertJsonPath('data.progress_value', 1);
    }

    public function test_joining_an_inactive_challenge_is_rejected(): void
    {
        $past = Challenge::query()->create([
            'code' => 'past', 'title' => 'Viejo', 'description' => 'Test', 'type' => 'weekly',
            'criteria' => ['metric' => 'workouts_count', 'target' => 5],
            'starts_at' => '2026-07-01', 'ends_at' => '2026-07-07',
        ]);
        $user = User::factory()->create();

        $this->actingAs($user, 'sanctum')
            ->postJson("/api/v1/challenges/{$past->id}/join")
            ->assertUnprocessable();
    }

    public function test_leaderboard_ranks_participants_by_progress_and_flags_the_viewer(): void
    {
        $challenge = $this->makeActiveWeeklyChallenge();
        $viewer = User::factory()->create();
        $leader = User::factory()->create();
        ChallengeParticipant::query()->create(['challenge_id' => $challenge->id, 'user_id' => $viewer->id, 'progress_value' => 2]);
        ChallengeParticipant::query()->create(['challenge_id' => $challenge->id, 'user_id' => $leader->id, 'progress_value' => 5]);

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/challenges/{$challenge->id}/leaderboard");

        $response->assertOk();
        $response->assertJsonPath('data.entries.0.user_id', $leader->id);
        $response->assertJsonPath('data.entries.0.rank', 1);
        $response->assertJsonPath('data.entries.1.user_id', $viewer->id);
        $response->assertJsonPath('data.entries.1.is_viewer', true);
    }

    public function test_leaderboard_includes_the_viewer_even_when_outside_the_top_ten(): void
    {
        $challenge = $this->makeActiveWeeklyChallenge();
        $viewer = User::factory()->create();
        ChallengeParticipant::query()->create(['challenge_id' => $challenge->id, 'user_id' => $viewer->id, 'progress_value' => 0]);

        for ($i = 0; $i < 10; $i++) {
            $other = User::factory()->create();
            ChallengeParticipant::query()->create([
                'challenge_id' => $challenge->id, 'user_id' => $other->id, 'progress_value' => 10 - $i,
            ]);
        }

        $response = $this->actingAs($viewer, 'sanctum')->getJson("/api/v1/challenges/{$challenge->id}/leaderboard");

        $response->assertOk();
        $response->assertJsonCount(11, 'data.entries');
        $this->assertTrue(collect($response->json('data.entries'))->contains(fn ($e) => $e['user_id'] === $viewer->id && $e['is_viewer'] === true));
    }
}
