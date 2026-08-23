<?php

namespace App\Providers;

use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentRoutineRepository;
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentUserRepository;
use Illuminate\Support\ServiceProvider;

/**
 * Binds every Domain repository contract to its Infrastructure implementation.
 * New modules (Workout, Trainer, ...) register their bindings here as they're built.
 */
class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        $this->app->bind(RoutineRepositoryInterface::class, EloquentRoutineRepository::class);
    }
}
