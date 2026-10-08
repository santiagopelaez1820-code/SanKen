<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de administración.

namespace App\Application\Admin\Actions;

// Esta línea sirve para importar la acción que genera la rutina general con el motor.
use App\Application\Routine\Actions\GenerateRoutineAction;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la clase que arma las claves de caché.
use App\Support\CacheKeys;
// Esta línea sirve para importar la fachada Cache para borrar la caché.
use Illuminate\Support\Facades\Cache;
// Esta línea sirve para importar la fachada DB para usar transacciones.
use Illuminate\Support\Facades\DB;

/**
 * Desactiva la rutina personalizada activa de un usuario y regenera su
 * plantilla general correspondiente (misma lógica que el onboarding, ver
 * GenerateRoutineAction) — sin perder el historial de la rutina personalizada,
 * que sigue en la base de datos solo con is_active=false.
 */
// Esta línea sirve para declarar la acción que devuelve a un usuario a su rutina general.
class RevertToGeneralRoutineAction
{
    // Esta línea sirve para declarar el método que recibe al usuario y devuelve su nueva rutina.
    public function execute(User $targetUser): Routine
    {
        // Esta línea sirve para buscar la rutina activa actual del usuario.
        $active = $targetUser->routines()->where('is_active', true)->first();

        // Esta línea sirve para cortar con error 422 si no tiene una rutina personalizada (de admin) activa.
        abort_unless($active && $active->source === 'admin', 422, 'El usuario no tiene una rutina personalizada activa para revertir.');

        // GenerateRoutineAction asume onboarding completo (lee nivel/objetivos/frecuencia
        // de onboarding_responses). A diferencia del flujo normal (que solo se dispara
        // tras completar el onboarding), Super Admin puede llegar acá para cualquier
        // usuario — sin este guard, un usuario sin onboarding completo produciría un 500.
        // Esta línea sirve para cortar con error si el usuario no completó el onboarding.
        abort_unless(
            // Esta línea sirve para exigir como condición que el onboarding del usuario esté completo.
            $targetUser->onboardingResponse?->completed,
            // Esta línea sirve para indicar el código HTTP 422 que se devuelve si no se cumple.
            422,
            // Esta línea sirve para indicar el mensaje de error que se devuelve si no se cumple.
            'El usuario no completó el onboarding — no se puede generar su rutina general todavía.'
        );

        // Esta línea sirve para desactivar la rutina personalizada dentro de una transacción.
        DB::transaction(function () use ($active) {
            // Esta línea sirve para marcar la rutina personalizada como inactiva (queda en el historial).
            $active->update(['is_active' => false]);
        });

        // Esta línea sirve para borrar de la caché la rutina activa del usuario.
        Cache::forget(CacheKeys::activeRoutine($targetUser->id));

        // Esta línea sirve para generar en el momento la rutina general del usuario y devolverla.
        return GenerateRoutineAction::dispatchSync($targetUser);
    }
}
