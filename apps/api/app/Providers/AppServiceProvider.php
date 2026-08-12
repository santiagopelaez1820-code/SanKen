<?php

namespace App\Providers;

use App\Domain\Routine\Contracts\RoutineGeneratorInterface;
use App\Domain\Routine\RoutineGenerator;
use App\Domain\Routine\Services\ExerciseSelector;
use App\Domain\Routine\Services\SetRepRestAssigner;
use App\Domain\Routine\Services\SplitSelector;
use App\Events\OnboardingCompleted;
use App\Events\PRBroken;
use App\Events\StreakMilestone;
use App\Events\WorkoutCompleted;
use App\Listeners\AwardXpForPrBroken;
use App\Listeners\AwardXpForWorkoutCompleted;
use App\Listeners\EvaluateStreakAchievement;
use App\Listeners\GenerateRoutineOnOnboardingCompleted;
use App\Listeners\UpdateChallengeProgressOnWorkoutCompleted;
use App\Models\ChatMessage;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(RoutineGeneratorInterface::class, function () {
            return new RoutineGenerator(
                splitSelector: new SplitSelector(config('routine_engine.splits')),
                exerciseSelector: new ExerciseSelector,
                assigner: new SetRepRestAssigner,
                goalParametersConfig: config('routine_engine.goal_parameters'),
                exercisesPerMuscleByLevel: config('routine_engine.exercises_per_muscle_by_level'),
                maxExercisesBySessionMinutes: config('routine_engine.max_exercises_by_session_minutes'),
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(Registered::class, SendEmailVerificationNotification::class);
        Event::listen(OnboardingCompleted::class, GenerateRoutineOnOnboardingCompleted::class);
        Event::listen(WorkoutCompleted::class, AwardXpForWorkoutCompleted::class);
        // Registrado después de AwardXpForWorkoutCompleted a propósito: ese
        // listener sigue siendo el único cuyo valor de retorno lee
        // CompleteWorkoutSessionAction (índice [0] del array que devuelve
        // Event::dispatch()); este no devuelve nada, así que el orden no
        // cambia el contrato de la respuesta HTTP.
        Event::listen(WorkoutCompleted::class, UpdateChallengeProgressOnWorkoutCompleted::class);
        Event::listen(PRBroken::class, AwardXpForPrBroken::class);
        Event::listen(StreakMilestone::class, EvaluateStreakAchievement::class);

        // API-only, autenticada por Bearer token (Sanctum guard "sanctum")
        // en vez de cookie de sesión: el endpoint de auth de canales
        // privados (POST /broadcasting/auth, primer uso en la app —
        // Sprint 10, retos) tiene que exigir el mismo guard que el resto
        // de la API, no el "web" por defecto de Broadcast::routes().
        Broadcast::routes(['middleware' => ['auth:sanctum']]);

        // Primer uso propio de relación polimórfica en la app
        // (reports.reportable) — pero NO es la primera polimórfica del
        // proyecto: activity_log (Spatie: causer/subject) y las
        // notifications de Laravel (notifiable) ya usan morphs con el
        // FQCN crudo. enforceMorphMap() es GLOBAL y estricto — exige que
        // TODO morph de la app esté en el mapa o tira
        // ClassMorphViolationException, lo que rompía esas dos relaciones
        // preexistentes (confirmado: 217 tests caían con "No morph map
        // defined for model [App\Models\User]"). morphMap() (no
        // "enforce") solo registra el alias corto para 'chat_message' sin
        // tocar el resto — la validación de "qué tipos se aceptan" queda
        // en el allow-list de StoreReportRequest (Rule::in), no acá.
        Relation::morphMap([
            'chat_message' => ChatMessage::class,
        ]);

        // Piso global para todo el grupo `api` (ver bootstrap/app.php: throttleApi()).
        // Se apila con los throttle específicos ya existentes en rutas de auth.
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(120)->by($request->user()?->id ?: $request->ip()));

        // Límite más estricto para endpoints de escritura sin throttle propio.
        RateLimiter::for('writes', fn (Request $request) => Limit::perMinute(30)->by($request->user()?->id ?: $request->ip()));

        // API-only app: el enlace del correo apunta a un endpoint firmado de la propia API
        // en lugar de a una ruta web (que no existe en esta aplicación).
        VerifyEmail::createUrlUsing(function ($notifiable) {
            return URL::temporarySignedRoute(
                'api.v1.auth.email.verify',
                now()->addMinutes(60),
                [
                    'id' => $notifiable->getKey(),
                    'hash' => sha1($notifiable->getEmailForVerification()),
                ],
            );
        });
    }
}
