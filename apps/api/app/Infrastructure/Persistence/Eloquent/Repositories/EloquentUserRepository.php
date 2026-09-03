<?php

namespace App\Infrastructure\Persistence\Eloquent\Repositories;

use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Models\User;

class EloquentUserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::query()->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::query()->where('email', $email)->first();
    }

    public function findByFirebaseUid(string $firebaseUid): ?User
    {
        return User::query()->where('firebase_uid', $firebaseUid)->first();
    }

    public function count(): int
    {
        return User::query()->count();
    }

    public function create(array $data): User
    {
        return User::query()->create($data);
    }
}
