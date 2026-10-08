<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los service providers.

namespace App\Providers;

// Esta línea sirve para importar el contrato del repositorio de rutinas.
use App\Domain\Routine\Contracts\RoutineRepositoryInterface;
// Esta línea sirve para importar el contrato del repositorio de usuarios.
use App\Domain\User\Contracts\UserRepositoryInterface;
// Esta línea sirve para importar el repositorio de rutinas con Eloquent.
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentRoutineRepository;
// Esta línea sirve para importar el repositorio de usuarios con Eloquent.
use App\Infrastructure\Persistence\Eloquent\Repositories\EloquentUserRepository;
// Esta línea sirve para importar la clase base de los service providers.
use Illuminate\Support\ServiceProvider;

/**
 * Binds every Domain repository contract to its Infrastructure implementation.
 * New modules (Workout, Trainer, ...) register their bindings here as they're built.
 */
// Esta línea sirve para declarar el service provider que conecta los contratos de repositorios con sus implementaciones.
class RepositoryServiceProvider extends ServiceProvider
{
    // Esta línea sirve para declarar el método que registra los servicios en el contenedor.
    public function register(): void
    {
        // Esta línea sirve para usar el repositorio Eloquent cuando se pida el contrato de usuarios.
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        // Esta línea sirve para usar el repositorio Eloquent cuando se pida el contrato de rutinas.
        $this->app->bind(RoutineRepositoryInterface::class, EloquentRoutineRepository::class);
    }
}
