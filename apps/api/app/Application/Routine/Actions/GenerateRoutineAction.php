<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las acciones de rutina.

namespace App\Application\Routine\Actions;

// Esta línea sirve para importar el contrato del motor que genera rutinas.
use App\Domain\Routine\Contracts\RoutineGeneratorInterface;
// Esta línea sirve para importar el contrato del repositorio de rutinas.
use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
// Esta línea sirve para importar el objeto con los datos de un ejercicio para el motor.
use App\Domain\Routine\ValueObjects\ExerciseData;
// Esta línea sirve para importar el objeto con el perfil del onboarding para el motor.
use App\Domain\Routine\ValueObjects\OnboardingProfile;
// Esta línea sirve para importar el modelo Exercise (ejercicio).
use App\Models\Exercise;
// Esta línea sirve para importar el modelo Routine (rutina).
use App\Models\Routine;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar la interfaz que permite ejecutar esta acción en cola.
use Illuminate\Contracts\Queue\ShouldQueue;
// Esta línea sirve para importar el trait que permite despachar la acción.
use Illuminate\Foundation\Bus\Dispatchable;
// Esta línea sirve para importar el trait para interactuar con la cola.
use Illuminate\Queue\InteractsWithQueue;
// Esta línea sirve para importar el trait que serializa modelos al encolar.
use Illuminate\Queue\SerializesModels;

/**
 * Genera (o regenera) el plan de entrenamiento automático de un usuario.
 * Se dispara al completar el onboarding (ver OnboardingCompletedListener) o
 * manualmente vía POST /routines/generate. Corre en cola porque construir
 * un plan de varias semanas no debe bloquear el request HTTP.
 */
// Esta línea sirve para declarar la acción que genera la rutina automática de un usuario.
class GenerateRoutineAction implements ShouldQueue
{
    // Esta línea sirve para incluir los traits para poder despacharla y encolarla.
    use Dispatchable, InteractsWithQueue, SerializesModels;

    // Esta línea sirve para declarar el constructor que recibe al usuario.
    public function __construct(
        // Esta línea sirve para guardar el usuario al que se le genera la rutina.
        public readonly User $user,
    ) {}

    // Esta línea sirve para declarar el método que genera la rutina usando el motor y el repositorio.
    public function handle(RoutineGeneratorInterface $generator, RoutineRepositoryInterface $routines): Routine
    {
        // Esta línea sirve para cargar el perfil y las respuestas del onboarding si faltan.
        $this->user->loadMissing('profile', 'onboardingResponse');

        // Esta línea sirve para armar el perfil que necesita el motor de rutinas.
        $profile = new OnboardingProfile(
            // Esta línea sirve para pasar el nivel del usuario.
            level: $this->user->onboardingResponse->level,
            // Esta línea sirve para pasar los objetivos (o ninguno).
            goals: $this->user->onboardingResponse->goals ?? [],
            // Esta línea sirve para pasar los días de entrenamiento por semana.
            frequencyDays: $this->user->onboardingResponse->frequency_days,
            // Esta línea sirve para pasar el equipamiento disponible (o ninguno).
            equipmentAvailable: $this->user->onboardingResponse->equipment_available ?? [],
            // Esta línea sirve para pasar el sexo del usuario.
            sex: $this->user->profile->sex,
            // Antes quedaba en el default (45) siempre -- el onboarding SÍ
            // pregunta y guarda esto (session_minutes), pero nunca se leía
            // acá. Sin esto RoutineVolumeCalculator nunca podía recortar por
            // tiempo disponible (sección 12 del pedido).
            // Esta línea sirve para pasar los minutos por sesión (45 por defecto).
            sessionMinutes: $this->user->onboardingResponse->session_minutes ?? 45,
        );

        // Esta línea sirve para consultar los ejercicios disponibles para el motor.
        $pool = Exercise::query()
            // Esta línea sirve para filtrar solo los ejercicios activos.
            ->where('is_active', true)
            // Esta línea sirve para cargar sus músculos principal y secundarios.
            ->with('primaryMuscle', 'secondaryMuscles')
            // Esta línea sirve para ejecutar la consulta.
            ->get()
            // Esta línea sirve para convertir cada ejercicio en el objeto que entiende el motor.
            ->map(fn (Exercise $exercise) => new ExerciseData(
                // Esta línea sirve para pasar el id del ejercicio.
                id: $exercise->id,
                // Esta línea sirve para pasar el nombre.
                name: $exercise->name,
                // Esta línea sirve para pasar el músculo principal.
                primaryMuscle: $exercise->primaryMuscle->slug,
                // Esta línea sirve para pasar los músculos secundarios.
                secondaryMuscles: $exercise->secondaryMuscles->pluck('slug')->all(),
                // Esta línea sirve para pasar el equipamiento que requiere.
                equipment: $exercise->equipment,
                // Esta línea sirve para pasar el nivel del ejercicio.
                level: $exercise->level,
                // Esta línea sirve para pasar el tipo (compuesto, aislado...).
                type: $exercise->type,
            ))
            // Esta línea sirve para convertir la colección en un arreglo simple.
            ->all();

        // Esta línea sirve para generar la rutina con el motor.
        $generated = $generator->generate($profile, $pool);

        // Esta línea sirve para guardar la rutina generada y devolverla.
        return $routines->saveGenerated($this->user, $generated);
    }
}
