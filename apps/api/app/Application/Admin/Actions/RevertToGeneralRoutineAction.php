<?php

namespace App\Application\Admin\Actions;

use App\Application\Routine\Actions\GenerateRoutineAction;
use App\Models\Routine;
use App\Models\User;
use App\Support\CacheKeys;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Desactiva la rutina personalizada activa de un usuario y regenera su
 * plantilla general correspondiente (misma lógica que el onboarding, ver
 * GenerateRoutineAction) — sin perder el historial de la rutina personalizada,
 * que sigue en la base de datos solo con is_active=false.
 */
class RevertToGeneralRoutineAction
{
    public function execute(User $targetUser): Routine
    {
        $active = $targetUser->routines()->where('is_active', true)->first();

        abort_unless($active && $active->source === 'admin', 422, 'El usuario no tiene una rutina personalizada activa para revertir.');

        // GenerateRoutineAction asume onboarding completo (lee nivel/objetivos/frecuencia
        // de onboarding_responses). A diferencia del flujo normal (que solo se dispara
        // tras completar el onboarding), Super Admin puede llegar acá para cualquier
        // usuario — sin este guard, un usuario sin onboarding completo produciría un 500.
        abort_unless(
            $targetUser->onboardingResponse?->completed,
            422,
            'El usuario no completó el onboarding — no se puede generar su rutina general todavía.'
        );

        DB::transaction(function () use ($active) {
            $active->update(['is_active' => false]);
        });

        Cache::forget(CacheKeys::activeRoutine($targetUser->id));

        return GenerateRoutineAction::dispatchSync($targetUser);
    }
}
