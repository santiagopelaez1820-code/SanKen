<?php

namespace App\Http\Controllers\Api\V1;

use App\Application\Onboarding\Actions\CompleteOnboardingAction;
use App\Application\Onboarding\Actions\SubmitOnboardingAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Onboarding\OnboardingRequest;
use App\Http\Resources\OnboardingResource;
use App\Models\City;
use App\Models\Country;
use App\Models\RoutineTemplate;
use App\Models\State;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    public function questions(): JsonResponse
    {
        return response()->json([
            'data' => [
                'levels' => config('onboarding.levels'),
                'goals' => config('onboarding.goals'),
                // Reemplaza el config estático — una frecuencia solo aparece
                // acá si existe al menos una plantilla activa para ella (ver
                // RoutineTemplate::activeFrequencyDays), así que agregar una
                // plantilla nueva desde Super Admin la habilita sin deploy.
                'frequency_days' => RoutineTemplate::activeFrequencyDays(),
                'equipment' => config('onboarding.equipment'),
                // Solo id/name — las ciudades de cada país (potencialmente
                // miles en total) se piden bajo demanda vía cities() una vez
                // que el usuario elige un país, no todas de una.
                'countries' => Country::query()
                    ->orderBy('name')
                    ->get(['id', 'name'])
                    ->map(fn (Country $country) => [
                        'id' => $country->id,
                        'name' => $country->name,
                    ]),
            ],
        ]);
    }

    public function cities(Country $country): JsonResponse
    {
        return response()->json([
            'data' => City::query()
                ->where('country_id', $country->id)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (City $city) => ['id' => $city->id, 'name' => $city->name]),
        ]);
    }

    /**
     * Departamentos/estados/provincias de un país — nivel intermedio entre
     * país y ciudad.
     *
     * "Nacional" es el placeholder que StateSeeder creaba antes de que
     * ImportLocationData trajera departamentos/estados reales para casi
     * todos los países — ver el docblock de ese comando para por qué esas
     * filas viejas siguen existiendo en la tabla (no se borran mientras
     * alguna ciudad las siga referenciando, por seguridad). Acá, en cambio,
     * es seguro ocultarlo de la lista que ve el usuario apenas hay
     * alternativas reales: no se toca ningún dato, solo se filtra qué se
     * muestra. Si "Nacional" es la ÚNICA fila para ese país (no hay datos
     * reales en la fuente), se sigue mostrando — mejor esa opción que
     * ninguna.
     */
    public function states(Country $country): JsonResponse
    {
        $states = State::query()
            ->where('country_id', $country->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        if ($states->count() > 1) {
            $states = $states->reject(fn (State $state) => $state->name === 'Nacional')->values();
        }

        return response()->json([
            'data' => $states->map(fn (State $state) => ['id' => $state->id, 'name' => $state->name]),
        ]);
    }

    /**
     * Con datos reales importados, un solo estado puede tener miles de
     * ciudades (ver ImportLocationData) — nunca se devuelven todas de una.
     * `search` filtra por coincidencia parcial case-insensitive sobre el
     * nombre; `limit` topea el tamaño de página (default 50, tope 100 para
     * no volver a habilitar el "traer todo" por la puerta de atrás).
     */
    public function citiesByState(Request $request, State $state): JsonResponse
    {
        $search = trim((string) $request->query('search', ''));
        $limit = (int) $request->query('limit', 50);
        $limit = max(1, min($limit, 100));

        return response()->json([
            'data' => City::query()
                ->where('state_id', $state->id)
                ->when($search !== '', fn ($query) => $query->where('name', 'like', '%'.$search.'%'))
                ->orderBy('name')
                ->limit($limit)
                ->get(['id', 'name'])
                ->map(fn (City $city) => ['id' => $city->id, 'name' => $city->name]),
        ]);
    }

    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'data' => new OnboardingResource($request->user()->loadMissing('profile.city', 'onboardingResponse')),
        ]);
    }

    public function store(OnboardingRequest $request, SubmitOnboardingAction $action): JsonResponse
    {
        $action->execute($request->user(), $request->validated());

        return response()->json([
            'data' => new OnboardingResource($request->user()->fresh(['profile', 'onboardingResponse'])),
        ], 201);
    }

    public function update(OnboardingRequest $request, SubmitOnboardingAction $action): JsonResponse
    {
        $action->execute($request->user(), $request->validated());

        return response()->json([
            'data' => new OnboardingResource($request->user()->fresh(['profile', 'onboardingResponse'])),
        ]);
    }

    public function complete(Request $request, CompleteOnboardingAction $action): JsonResponse
    {
        $user = $action->execute($request->user());

        return response()->json([
            'data' => new OnboardingResource($user),
        ]);
    }
}
