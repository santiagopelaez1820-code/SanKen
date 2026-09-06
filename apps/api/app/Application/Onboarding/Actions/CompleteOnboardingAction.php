<?php

namespace App\Application\Onboarding\Actions;

use App\Events\OnboardingCompleted;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CompleteOnboardingAction
{
    /**
     * Campos que deben existir antes de poder marcar el onboarding como completo.
     */
    private const REQUIRED_PROFILE_FIELDS = ['age', 'sex', 'height_cm', 'weight_kg'];

    private const REQUIRED_ONBOARDING_FIELDS = [
        'level', 'goals', 'frequency_days',
    ];

    public function execute(User $user): User
    {
        $user->loadMissing('profile', 'onboardingResponse');

        $missing = [];

        foreach (self::REQUIRED_PROFILE_FIELDS as $field) {
            if (blank($user->profile?->{$field})) {
                $missing[] = $field;
            }
        }

        foreach (self::REQUIRED_ONBOARDING_FIELDS as $field) {
            if (blank($user->onboardingResponse?->{$field})) {
                $missing[] = $field;
            }
        }

        if ($missing !== []) {
            throw ValidationException::withMessages([
                'onboarding' => ['Faltan respuestas por completar: '.implode(', ', $missing)],
            ]);
        }

        // Transaccion: OnboardingCompleted dispara la generacion de la rutina
        // de forma SINCRONA (GenerateRoutineOnOnboardingCompleted -> dispatchSync).
        // RoutineTemplate::activeFrequencyDays() (usado para validar
        // frequency_days) no filtra por sexo/nivel, asi que un usuario puede
        // enviar una combinacion sexo+frecuencia+nivel para la que ningun
        // admin activo una plantilla — sin la transaccion, eso marcaba el
        // onboarding como completado y despues explotaba con un 500 sin
        // manejar (ver catch en OnboardingController::complete()), dejando
        // al usuario "completado" pero sin rutina.
        DB::transaction(function () use ($user) {
            $user->onboardingResponse->forceFill([
                'completed' => true,
                'completed_at' => now(),
            ])->save();

            event(new OnboardingCompleted($user));
        });

        return $user->fresh(['profile', 'onboardingResponse']);
    }
}
