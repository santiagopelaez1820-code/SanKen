<?php

namespace Tests\Unit\Policies;

use App\Models\Exercise;
use App\Models\User;
use App\Models\WorkoutExercise;
use App\Models\WorkoutSession;
use App\Models\WorkoutSet;
use App\Policies\WorkoutSetPolicy;
use Database\Seeders\ExerciseSeeder;
use Database\Seeders\MuscleGroupSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkoutSetPolicyTest extends TestCase
{
    use RefreshDatabase;

    private WorkoutSetPolicy $policy;

    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new WorkoutSetPolicy;
        $this->seed(MuscleGroupSeeder::class);
        $this->seed(ExerciseSeeder::class);
    }

    private function makeSet(User $owner): WorkoutSet
    {
        $session = WorkoutSession::query()->create(['user_id' => $owner->id, 'performed_at' => now()]);
        $exercise = WorkoutExercise::query()->create([
            'workout_session_id' => $session->id,
            'exercise_id' => Exercise::query()->first()->id,
            'order' => 1,
        ]);

        return WorkoutSet::query()->create([
            'workout_exercise_id' => $exercise->id,
            'set_number' => 1,
            'weight_kg' => 50,
            'reps' => 10,
        ]);
    }

    public function test_owner_can_update_their_set(): void
    {
        $user = User::factory()->create();
        $set = $this->makeSet($user);

        $this->assertTrue($this->policy->update($user, $set));
    }

    public function test_another_user_cannot_update_the_set(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $set = $this->makeSet($user);

        $this->assertFalse($this->policy->update($other, $set));
    }
}
