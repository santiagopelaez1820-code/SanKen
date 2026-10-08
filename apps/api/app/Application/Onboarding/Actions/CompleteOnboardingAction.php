<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de onboarding.

namespace App\Application\Onboarding\Actions;

// Esta línea sirve para importar el evento que avisa que se completó el onboarding.
use App\Events\OnboardingCompleted;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la excepción de validación para responder errores 422.
use Illuminate\Validation\ValidationException;

// Esta línea sirve para declarar la acción que marca el onboarding como completo.
class CompleteOnboardingAction
{
    /**
     * Campos que deben existir antes de poder marcar el onboarding como completo.
     */
    // Esta línea sirve para definir los campos del perfil que son obligatorios.
    private const REQUIRED_PROFILE_FIELDS = ['age', 'sex', 'height_cm', 'weight_kg'];

    // Esta línea sirve para definir los campos del onboarding que son obligatorios.
    private const REQUIRED_ONBOARDING_FIELDS = [
        // Esta línea sirve para listar: nivel, objetivos y días por semana.
        'level', 'goals', 'frequency_days',
    ];

    // Esta línea sirve para declarar el método que completa el onboarding del usuario.
    public function execute(User $user): User
    {
        // Esta línea sirve para cargar el perfil y las respuestas del onboarding si faltan.
        $user->loadMissing('profile', 'onboardingResponse');

        // Esta línea sirve para iniciar la lista de campos que faltan.
        $missing = [];

        // Esta línea sirve para recorrer los campos obligatorios del perfil.
        foreach (self::REQUIRED_PROFILE_FIELDS as $field) {
            // Esta línea sirve para revisar si ese campo del perfil está vacío.
            if (blank($user->profile?->{$field})) {
                // Esta línea sirve para agregarlo a la lista de faltantes.
                $missing[] = $field;
            }
        }

        // Esta línea sirve para recorrer los campos obligatorios del onboarding.
        foreach (self::REQUIRED_ONBOARDING_FIELDS as $field) {
            // Esta línea sirve para revisar si ese campo del onboarding está vacío.
            if (blank($user->onboardingResponse?->{$field})) {
                // Esta línea sirve para agregarlo a la lista de faltantes.
                $missing[] = $field;
            }
        }

        // Esta línea sirve para revisar si falta algún campo.
        if ($missing !== []) {
            // Esta línea sirve para lanzar un error de validación.
            throw ValidationException::withMessages([
                // Esta línea sirve para indicar qué respuestas faltan por completar.
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
        // Esta línea sirve para completar el onboarding dentro de una transacción.
        DB::transaction(function () use ($user) {
            // Esta línea sirve para actualizar las respuestas del onboarding.
            $user->onboardingResponse->forceFill([
                // Esta línea sirve para marcar el onboarding como completado.
                'completed' => true,
                // Esta línea sirve para guardar la fecha en que se completó.
                'completed_at' => now(),
                // Esta línea sirve para guardar los cambios en la base de datos.
            ])->save();

            // Esta línea sirve para disparar el evento que genera la rutina del usuario.
            event(new OnboardingCompleted($user));
        });

        // Esta línea sirve para devolver el usuario recargado con su perfil y onboarding.
        return $user->fresh(['profile', 'onboardingResponse']);
    }
}
