<?php

namespace App\Application\Auth\Actions;

use App\Application\Legal\Actions\RecordUserConsentsAction;
use App\Domain\Legal\Services\LegalConsentCatalog;
use App\Domain\User\Contracts\UserRepositoryInterface;
use App\Models\User;
use App\Models\UserConsent;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RegisterUserAction
{
    public function __construct(
        private readonly UserRepositoryInterface $users,
        private readonly LegalConsentCatalog $legal,
        private readonly RecordUserConsentsAction $recordConsents,
    ) {}

    /**
     * Los consentimientos ya llegan validados como aceptados (RegisterRequest
     * los exige a todos) — se registran en la misma transacción que la
     * cuenta: nunca existe un usuario sin su aceptación registrada.
     *
     * @param  array{name: string, email: string, password: string, phone?: string|null}  $data
     */
    public function execute(array $data): User
    {
        $user = DB::transaction(function () use ($data) {
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

            $this->recordConsents->execute($user, $this->legal->consentTypes(), UserConsent::SOURCE_REGISTRATION);

            return $user;
        });

        event(new Registered($user));

        return $user;
    }
}
