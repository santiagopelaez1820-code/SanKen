<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de onboarding.

namespace App\Application\Onboarding\Actions;

// Esta línea sirve para importar el modelo OnboardingResponse (respuestas del onboarding).
use App\Models\OnboardingResponse;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar la acción que guarda las respuestas del onboarding.
class SubmitOnboardingAction
{
    /**
     * Guarda (parcial o totalmente) las respuestas de onboarding de un usuario.
     * Separa los campos de perfil físico/ubicación (user_profiles) de los campos
     * de preferencias de entrenamiento (onboarding_responses).
     *
     * @param  array<string, mixed>  $data
     */
    // Esta línea sirve para declarar el método que recibe al usuario y sus respuestas.
    public function execute(User $user, array $data): OnboardingResponse
    {
        // Esta línea sirve para separar de los datos los campos que pertenecen al perfil.
        $profileFields = array_intersect_key($data, array_flip([
            // Esta línea sirve para listar los campos del perfil: edad, sexo, altura, peso, ciudad y gimnasio.
            'age', 'sex', 'height_cm', 'weight_kg', 'city_id', 'gym_id',
        ]));

        // Esta línea sirve para revisar si llegó algún campo del perfil.
        if ($profileFields !== []) {
            // Esta línea sirve para crear o actualizar el perfil del usuario con esos campos.
            $user->profile()->updateOrCreate(['user_id' => $user->id], $profileFields);
        }

        // Esta línea sirve para separar de los datos los campos de preferencias de entrenamiento.
        $onboardingFields = array_intersect_key($data, array_flip([
            // Esta línea sirve para listar los campos del onboarding: nivel, objetivos, frecuencia y equipamiento.
            'level', 'goals', 'frequency_days', 'equipment_available',
        ]));

        // Esta línea sirve para crear o actualizar las respuestas del onboarding del usuario.
        /** @var OnboardingResponse $response */
        $response = $user->onboardingResponse()->updateOrCreate(
            // Esta línea sirve para buscar por el id del usuario.
            ['user_id' => $user->id],
            // Esta línea sirve para guardar los campos del onboarding.
            $onboardingFields,
        );

        // Esta línea sirve para devolver las respuestas guardadas.
        return $response;
    }
}
