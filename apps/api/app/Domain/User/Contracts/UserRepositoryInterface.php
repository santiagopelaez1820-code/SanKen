<?php

// Esta línea sirve para ubicar esta interfaz en el espacio de nombres de los contratos de usuario.

namespace App\Domain\User\Contracts;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar el contrato del repositorio de usuarios.
interface UserRepositoryInterface
{
    // Esta línea sirve para exigir el método que busca un usuario por id.
    public function findById(int $id): ?User;

    // Esta línea sirve para exigir el método que busca un usuario por correo.
    public function findByEmail(string $email): ?User;

    // Esta línea sirve para exigir el método que busca un usuario por su id de Firebase.
    public function findByFirebaseUid(string $firebaseUid): ?User;

    // Esta línea sirve para exigir el método que cuenta los usuarios.
    public function count(): int;

    /**
     * @param  array<string, mixed>  $data
     */
    // Esta línea sirve para exigir el método que crea un usuario.
    public function create(array $data): User;
}
