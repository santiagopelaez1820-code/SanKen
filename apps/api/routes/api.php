<?php

use App\Http\Controllers\Api\V1\Admin\AdminAuditLogController;
use App\Http\Controllers\Api\V1\Admin\AdminExerciseController;
use App\Http\Controllers\Api\V1\Admin\AdminNewsController;
use App\Http\Controllers\Api\V1\Admin\AdminReportController;
use App\Http\Controllers\Api\V1\Admin\AdminStatsController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Auth\EmailVerificationController;
use App\Http\Controllers\Api\V1\Auth\TwoFactorController;
use App\Http\Controllers\Api\V1\BodyMeasurementController;
use App\Http\Controllers\Api\V1\CalendarController;
use App\Http\Controllers\Api\V1\ChallengeController;
use App\Http\Controllers\Api\V1\ChatController;
use App\Http\Controllers\Api\V1\ExerciseController;
use App\Http\Controllers\Api\V1\GamificationController;
use App\Http\Controllers\Api\V1\MyTrainerController;
use App\Http\Controllers\Api\V1\NewsController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\NutritionController;
use App\Http\Controllers\Api\V1\OnboardingController;
use App\Http\Controllers\Api\V1\PingController;
use App\Http\Controllers\Api\V1\PushController;
use App\Http\Controllers\Api\V1\RankingController;
use App\Http\Controllers\Api\V1\ReportController;
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

    Route::middleware('auth:sanctum')->prefix('gamification')->name('gamification.')->group(function () {
        Route::get('/', [GamificationController::class, 'index'])->name('index');
    });

    Route::middleware('auth:sanctum')->prefix('rankings')->name('rankings.')->group(function () {
        Route::get('/', [RankingController::class, 'index'])->name('index');
        Route::post('/opt-in', [RankingController::class, 'optIn'])->middleware('throttle:writes')->name('opt-in');
        Route::post('/opt-out', [RankingController::class, 'optOut'])->middleware('throttle:writes')->name('opt-out');
    });

    Route::middleware('auth:sanctum')->prefix('challenges')->name('challenges.')->group(function () {
        Route::get('/', [ChallengeController::class, 'index'])->name('index');
        Route::post('/{challenge}/join', [ChallengeController::class, 'join'])->middleware('throttle:writes')->name('join');
        Route::get('/{challenge}/leaderboard', [ChallengeController::class, 'leaderboard'])->name('leaderboard');
    });

    Route::middleware('auth:sanctum')->prefix('calendar')->name('calendar.')->group(function () {
        Route::get('/', [CalendarController::class, 'index'])->name('index');
        Route::post('/reminders', [CalendarController::class, 'storeReminder'])->middleware('throttle:writes')->name('reminders.store');
        Route::delete('/reminders/{reminder}', [CalendarController::class, 'destroyReminder'])->middleware('throttle:writes')->name('reminders.destroy');
    });

    Route::middleware('auth:sanctum')->get('/me/trainers', [MyTrainerController::class, 'index'])->name('me.trainers');

    Route::middleware('auth:sanctum')->prefix('trainer-clients')->name('trainer-clients.')->group(function () {
        Route::get('/{trainerClient}/conversation', [ChatController::class, 'conversation'])->name('conversation');
    });

    Route::middleware('auth:sanctum')->prefix('conversations')->name('conversations.')->group(function () {
        Route::get('/', [ChatController::class, 'index'])->name('index');
        Route::get('/{conversation}/messages', [ChatController::class, 'messages'])->name('messages.index');
        Route::post('/{conversation}/messages', [ChatController::class, 'sendMessage'])->middleware('throttle:writes')->name('messages.store');
    });

    Route::middleware('auth:sanctum')->prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::post('/{notification}/read', [NotificationController::class, 'markRead'])->middleware('throttle:writes')->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllRead'])->middleware('throttle:writes')->name('read-all');
    });

    Route::middleware('auth:sanctum')->prefix('push')->name('push.')->group(function () {
        Route::post('/expo-token', [PushController::class, 'storeExpoToken'])->middleware('throttle:writes')->name('expo-token.store');
        Route::delete('/expo-token', [PushController::class, 'destroyExpoToken'])->middleware('throttle:writes')->name('expo-token.destroy');
        Route::post('/web-subscription', [PushController::class, 'storeWebSubscription'])->middleware('throttle:writes')->name('web-subscription.store');
        Route::delete('/web-subscription', [PushController::class, 'destroyWebSubscription'])->middleware('throttle:writes')->name('web-subscription.destroy');
    });

    Route::middleware('auth:sanctum')->prefix('nutrition')->name('nutrition.')->group(function () {
        Route::get('/targets', [NutritionController::class, 'targets'])->name('targets');
        Route::get('/meals', [NutritionController::class, 'meals'])->name('meals.index');
        Route::post('/meals', [NutritionController::class, 'logMeal'])->middleware('throttle:writes')->name('meals.store');
        Route::delete('/meals/{meal}', [NutritionController::class, 'destroyMeal'])->middleware('throttle:writes')->name('meals.destroy');
        Route::get('/foods', [NutritionController::class, 'searchFoods'])->name('foods.index');
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

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/reports', [ReportController::class, 'store'])->middleware('throttle:writes')->name('reports.store');
        Route::get('/news', [NewsController::class, 'index'])->name('news.index');
    });

    Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::patch('/users/{user}/ban', [AdminUserController::class, 'ban'])->middleware('throttle:writes')->name('users.ban');
        Route::patch('/users/{user}/verify-trainer', [AdminUserController::class, 'verifyTrainer'])->middleware('throttle:writes')->name('users.verify-trainer');

        Route::prefix('exercises')->name('exercises.')->group(function () {
            Route::get('/', [AdminExerciseController::class, 'index'])->name('index');
            Route::post('/', [AdminExerciseController::class, 'store'])->middleware('throttle:writes')->name('store');
            Route::patch('/{exercise}', [AdminExerciseController::class, 'update'])->middleware('throttle:writes')->name('update');
            Route::delete('/{exercise}', [AdminExerciseController::class, 'destroy'])->middleware('throttle:writes')->name('destroy');
        });

        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');
        Route::patch('/reports/{report}/resolve', [AdminReportController::class, 'resolve'])->middleware('throttle:writes')->name('reports.resolve');

        Route::prefix('news')->name('news.')->group(function () {
            Route::get('/', [AdminNewsController::class, 'index'])->name('index');
            Route::post('/', [AdminNewsController::class, 'store'])->middleware('throttle:writes')->name('store');
            Route::patch('/{news}', [AdminNewsController::class, 'update'])->middleware('throttle:writes')->name('update');
            Route::delete('/{news}', [AdminNewsController::class, 'destroy'])->middleware('throttle:writes')->name('destroy');
        });

        Route::get('/stats', [AdminStatsController::class, 'index'])->name('stats');
        Route::get('/audit-logs', [AdminAuditLogController::class, 'index'])->name('audit-logs.index');
    });
});
