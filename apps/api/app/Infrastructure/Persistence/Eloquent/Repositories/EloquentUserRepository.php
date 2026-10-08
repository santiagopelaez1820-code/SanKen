<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de los repositorios Eloquent.

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

// Esta línea sirve para importar el contrato del repositorio de usuarios.
use App\Domain\User\Contracts\UserRepositoryInterface;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar el repositorio de usuarios que usa Eloquent.
class EloquentUserRepository implements UserRepositoryInterface
{
    // Esta línea sirve para declarar el método que busca un usuario por id.
    public function findById(int $id): ?User
    {
        // Esta línea sirve para buscar el usuario por id (o null).
        return User::query()->find($id);
    }

    // Esta línea sirve para declarar el método que busca un usuario por correo.
    public function findByEmail(string $email): ?User
    {
        // Esta línea sirve para buscar el primer usuario con ese correo.
        return User::query()->where('email', $email)->first();
    }

    // Esta línea sirve para declarar el método que busca un usuario por su uid de Firebase.
    public function findByFirebaseUid(string $firebaseUid): ?User
    {
        // Esta línea sirve para buscar el primer usuario con ese uid.
        return User::query()->where('firebase_uid', $firebaseUid)->first();
    }

    // Esta línea sirve para declarar el método que cuenta los usuarios.
    public function count(): int
    {
        // Esta línea sirve para contar los usuarios.
        return User::query()->count();
    }

    // Esta línea sirve para declarar el método que crea un usuario.
    public function create(array $data): User
    {
        // Esta línea sirve para crear el usuario con los datos recibidos.
        return User::query()->create($data);
    }
}
