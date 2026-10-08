<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los controllers de la API v1.

namespace App\Http\Controllers\Api\V1;

// Esta línea sirve para importar el servicio que calcula niveles a partir de la XP.
use App\Domain\Gamification\Services\XpLevelCalculator;
// Esta línea sirve para importar el controller base.
use App\Http\Controllers\Controller;
// Esta línea sirve para importar el resource que da formato a un logro.
use App\Http\Resources\AchievementResource;
// Esta línea sirve para importar el modelo Achievement (logro).
use App\Models\Achievement;
// Esta línea sirve para importar el modelo UserXp (experiencia acumulada).
use App\Models\UserXp;
// Esta línea sirve para importar el atributo Group de Scramble para agrupar en Swagger.
use Dedoc\Scramble\Attributes\Group;
// Esta línea sirve para importar la respuesta JSON de Laravel.
use Illuminate\Http\JsonResponse;
// Esta línea sirve para importar la clase Request para leer la petición.
use Illuminate\Http\Request;

// Esta línea sirve para agrupar este controller en la sección "Gamificación" de Swagger.
#[Group('Gamificación', 'XP, niveles y logros.', weight: 10)]
// Esta línea sirve para declarar el controller de gamificación.
class GamificationController extends Controller
{
    /**
     * Ver mi XP, nivel y logros.
     *
     * XP total, nivel y progreso hacia el siguiente (`progress_pct` de 0 a
     * 1), más los logros desbloqueados y los que faltan.
     */
    // Esta línea sirve para declarar el endpoint que devuelve la XP, el nivel y los logros.
    public function index(Request $request, XpLevelCalculator $calculator): JsonResponse
    {
        // Esta línea sirve para obtener el usuario autenticado.
        $user = $request->user();
        // Esta línea sirve para obtener el registro de XP del usuario o crearlo en 0.
        $xp = UserXp::query()->firstOrCreate(['user_id' => $user->id], ['total_xp' => 0]);
        // Esta línea sirve para calcular el nivel y el progreso hacia el siguiente.
        $progress = $calculator->progress($xp->total_xp);

        // Esta línea sirve para obtener los logros desbloqueados por el usuario.
        $unlocked = $user->achievements()->orderBy('achievements.id')->get();
        // Esta línea sirve para consultar los logros que le faltan.
        $locked = Achievement::query()
            // Esta línea sirve para excluir los ya desbloqueados.
            ->whereNotIn('id', $unlocked->pluck('id')->all() ?: [0])
            // Esta línea sirve para ordenar por id.
            ->orderBy('id')
            // Esta línea sirve para ejecutar la consulta.
            ->get();

        // Esta línea sirve para responder con la gamificación del usuario.
        return response()->json([
            // Esta línea sirve para armar los datos.
            'data' => [
                // Esta línea sirve para incluir la XP total.
                'total_xp' => $xp->total_xp,
                // Esta línea sirve para incluir el nivel y su progreso.
                ...$progress,
                // Esta línea sirve para incluir los logros desbloqueados con su formato.
                'unlocked_achievements' => AchievementResource::collection($unlocked),
                // Esta línea sirve para incluir los logros pendientes con su formato.
                'locked_achievements' => AchievementResource::collection($locked),
            ],
        ]);
    }
}
