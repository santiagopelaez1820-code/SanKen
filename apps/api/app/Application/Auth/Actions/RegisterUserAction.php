<?php

namespace App\Application\Auth\Actions;

use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
    ) {}

    /**
     * @param  array{name: string, email: string, password: string, phone?: string|null}  $data
     */
    public function execute(array $data): User
    {
        $user = $this->users->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role' => 'user',
            'is_public_profile' => false,
            'is_banned' => false,
            'two_factor_enabled' => false,
        ]);

        event(new Registered($user));

        return $user;
    }
}
