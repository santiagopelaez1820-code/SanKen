<?php

namespace App\Application\Onboarding\Actions;

use App\Models\OnboardingResponse;
use App\Models\User;

class SubmitOnboardingAction
{
    /**
     * Guarda (parcial o totalmente) las respuestas de onboarding de un usuario.
     * Separa los campos de perfil físico/ubicación (user_profiles) de los campos
     * de preferencias de entrenamiento (onboarding_responses).
     *
     * @param  array<string, mixed>  $data
     */
    public function execute(User $user, array $data): OnboardingResponse
    {
        $profileFields = array_intersect_key($data, array_flip([
            'age', 'sex', 'height_cm', 'weight_kg', 'city_id', 'gym_id',
        ]));

        if ($profileFields !== []) {
            $user->profile()->updateOrCreate(['user_id' => $user->id], $profileFields);
        }

        $onboardingFields = array_intersect_key($data, array_flip([
            'level', 'goals', 'frequency_days', 'session_minutes',
            'place', 'equipment_available', 'injuries', 'experience_notes',
        ]));

        /** @var OnboardingResponse $response */
        $response = $user->onboardingResponse()->updateOrCreate(
            ['user_id' => $user->id],
            $onboardingFields,
        );

        return $response;
    }
}
