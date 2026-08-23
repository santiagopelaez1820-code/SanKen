<?php

namespace App\Application\Routine\Actions;

use App\Domain\Routine\Contracts\RoutineGeneratorInterface;
use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
use App\Domain\Routine\ValueObjects\ExerciseData;
use App\Domain\Routine\ValueObjects\OnboardingProfile;
use App\Models\Exercise;
use App\Models\Routine;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Genera (o regenera) el plan de entrenamiento automático de un usuario.
 * Se dispara al completar el onboarding (ver OnboardingCompletedListener) o
 * manualmente vía POST /routines/generate. Corre en cola porque construir
 * un plan de varias semanas no debe bloquear el request HTTP.
 */
class GenerateRoutineAction implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, SerializesModels;

    public function __construct(
        public readonly User $user,
    ) {}

    public function handle(RoutineGeneratorInterface $generator, RoutineRepositoryInterface $routines): Routine
    {
        $this->user->loadMissing('profile', 'onboardingResponse');

        $profile = new OnboardingProfile(
            level: $this->user->onboardingResponse->level,
            goals: $this->user->onboardingResponse->goals ?? [],
            frequencyDays: $this->user->onboardingResponse->frequency_days,
            equipmentAvailable: $this->user->onboardingResponse->equipment_available ?? [],
            sex: $this->user->profile->sex,
        );

        $pool = Exercise::query()
            ->where('is_active', true)
            ->with('primaryMuscle', 'secondaryMuscles')
            ->get()
            ->map(fn (Exercise $exercise) => new ExerciseData(
                id: $exercise->id,
                name: $exercise->name,
                primaryMuscle: $exercise->primaryMuscle->slug,
                secondaryMuscles: $exercise->secondaryMuscles->pluck('slug')->all(),
                equipment: $exercise->equipment,
                level: $exercise->level,
                type: $exercise->type,
            ))
            ->all();

        $generated = $generator->generate($profile, $pool);

        return $routines->saveGenerated($this->user, $generated);
    }
}
