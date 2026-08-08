<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\V1\Auth\TwoFactorController;
use App\Http\Controllers\Api\V1\BodyMeasurementController;
use App\Http\Controllers\Api\V1\ExerciseController;
use App\Http\Controllers\Api\V1\OnboardingController;
use App\Http\Controllers\Api\V1\PingController;
use App\Http\Controllers\Api\V1\RoutineController;
use App\Http\Controllers\Api\V1\StatsController;
use App\Http\Controllers\Api\V1\Trainer\TrainerClientController;
use App\Http\Controllers\Api\V1\Trainer\TrainerRoutineController;
use App\Http\Controllers\Api\V1\WorkoutSessionController;
use App\Http\Controllers\Api\V1\WorkoutSetController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->name('api.v1.')->group(function () {
    Route::get('/ping', PingController::class)->name('ping');

    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('/register', [AuthController::class, 'register'])
            ->middleware('throttle:5,1')
            ->name('register');

        Route::post('/login', [AuthController::class, 'login'])
            ->middleware('throttle:5,1')
            ->name('login');

        Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
            ->middleware('throttle:5,1')
            ->name('forgot-password');

        Route::post('/reset-password', [AuthController::class, 'resetPassword'])
            ->middleware('throttle:5,1')
            ->name('reset-password');

        Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->middleware('signed')
            ->name('email.verify');

        Route::post('/2fa/challenge', [TwoFactorController::class, 'challenge'])
            ->middleware('throttle:10,1')
            ->name('2fa.challenge');

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
            Route::get('/me', [AuthController::class, 'me'])->name('me');
            Route::post('/email/resend', [EmailVerificationController::class, 'resend'])
                ->middleware('throttle:3,5')
                ->name('email.resend');

            Route::post('/2fa/enable', [TwoFactorController::class, 'enable'])->name('2fa.enable');
            Route::post('/2fa/confirm', [TwoFactorController::class, 'confirm'])
                ->middleware('throttle:writes')
                ->name('2fa.confirm');
            Route::post('/2fa/disable', [TwoFactorController::class, 'disable'])
                ->middleware('throttle:writes')
                ->name('2fa.disable');
        });
    });

    Route::middleware('auth:sanctum')->prefix('onboarding')->name('onboarding.')->group(function () {
        Route::get('/questions', [OnboardingController::class, 'questions'])->name('questions');
        Route::get('/', [OnboardingController::class, 'show'])->name('show');
        Route::post('/', [OnboardingController::class, 'store'])->name('store');
        Route::patch('/', [OnboardingController::class, 'update'])->name('update');
        Route::post('/complete', [OnboardingController::class, 'complete'])->name('complete');
    });

    Route::middleware('auth:sanctum')->get('/exercises', [ExerciseController::class, 'index'])->name('exercises.index');

    Route::middleware('auth:sanctum')->prefix('routines')->name('routines.')->group(function () {
        Route::get('/active', [RoutineController::class, 'active'])->name('active');
        Route::post('/generate', [RoutineController::class, 'generate'])
            ->middleware('throttle:10,1')
            ->name('generate');
        Route::get('/{routine}', [RoutineController::class, 'show'])->name('show');
    });

    Route::middleware('auth:sanctum')->prefix('workout-sessions')->name('workout-sessions.')->group(function () {
        Route::get('/', [WorkoutSessionController::class, 'index'])->name('index');
        Route::post('/', [WorkoutSessionController::class, 'store'])->middleware('throttle:writes')->name('store');
        Route::get('/{workoutSession}', [WorkoutSessionController::class, 'show'])->name('show');
        Route::patch('/{workoutSession}', [WorkoutSessionController::class, 'update'])->middleware('throttle:writes')->name('update');
        Route::post('/{workoutSession}/complete', [WorkoutSessionController::class, 'complete'])->middleware('throttle:writes')->name('complete');
        Route::post('/{workoutSession}/feedback', [WorkoutSessionController::class, 'feedback'])->middleware('throttle:writes')->name('feedback');
        Route::post('/{workoutSession}/exercises', [WorkoutSessionController::class, 'addExercise'])->middleware('throttle:writes')->name('exercises.store');
        Route::patch('/{workoutSession}/exercises/{workoutExercise}', [WorkoutSessionController::class, 'updateExercise'])->middleware('throttle:writes')->name('exercises.update');
        Route::post('/{workoutSession}/exercises/{workoutExercise}/sets', [WorkoutSessionController::class, 'logSet'])->middleware('throttle:writes')->name('exercises.sets.store');
    });

    Route::middleware('auth:sanctum')->prefix('workout-sets')->name('workout-sets.')->group(function () {
        Route::patch('/{workoutSet}', [WorkoutSetController::class, 'update'])->middleware('throttle:writes')->name('update');
    });

    Route::middleware('auth:sanctum')->prefix('body-measurements')->name('body-measurements.')->group(function () {
        Route::get('/', [BodyMeasurementController::class, 'index'])->name('index');
        Route::post('/', [BodyMeasurementController::class, 'store'])->middleware('throttle:writes')->name('store');
    });

    Route::middleware('auth:sanctum')->prefix('stats')->name('stats.')->group(function () {
        Route::get('/dashboard', [StatsController::class, 'dashboard'])->name('dashboard');
        Route::get('/volume', [StatsController::class, 'volume'])->name('volume');
        Route::get('/personal-records', [StatsController::class, 'personalRecords'])->name('personal-records');
        Route::get('/progress', [StatsController::class, 'progress'])->name('progress');
    });

    Route::middleware(['auth:sanctum', 'role:trainer'])->prefix('trainer')->name('trainer.')->group(function () {
        Route::prefix('clients')->name('clients.')->group(function () {
            Route::get('/', [TrainerClientController::class, 'index'])->name('index');
            Route::post('/', [TrainerClientController::class, 'store'])->middleware('throttle:writes')->name('store');
            Route::get('/{trainerClient}', [TrainerClientController::class, 'show'])->name('show');
            Route::patch('/{trainerClient}', [TrainerClientController::class, 'update'])->middleware('throttle:writes')->name('update');
            Route::post('/{trainerClient}/routines', [TrainerRoutineController::class, 'store'])->middleware('throttle:writes')->name('routines.store');
        });

        Route::prefix('routines')->name('routines.')->group(function () {
            Route::get('/{routine}', [TrainerRoutineController::class, 'show'])->name('show');
            Route::patch('/{routine}', [TrainerRoutineController::class, 'update'])->middleware('throttle:writes')->name('update');
        });
    });
});
