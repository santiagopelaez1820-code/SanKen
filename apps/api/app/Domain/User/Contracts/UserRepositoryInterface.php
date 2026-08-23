<?php

namespace App\Domain\User\Contracts;

use App\Models\User;

interface UserRepositoryInterface
{
    public function findById(int $id): ?User;

    public function findByEmail(string $email): ?User;

    public function count(): int;

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): User;
}
