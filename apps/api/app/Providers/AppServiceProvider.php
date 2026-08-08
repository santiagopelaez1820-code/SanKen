<?php

namespace App\Providers;

use App\Domain\Routine\Contracts\RoutineGeneratorInterface;
use App\Domain\Routine\RoutineGenerator;
use App\Domain\Routine\Services\ExerciseSelector;
use App\Domain\Routine\Services\SetRepRestAssigner;
use App\Domain\Routine\Services\SplitSelector;
use App\Events\OnboardingCompleted;
use App\Listeners\GenerateRoutineOnOnboardingCompleted;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
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
