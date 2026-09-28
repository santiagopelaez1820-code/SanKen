<?php

namespace Database\Factories;

use App\Application\Legal\Actions\RecordUserConsentsAction;
use App\Domain\Legal\Services\LegalConsentCatalog;
use App\Models\User;
use App\Models\UserConsent;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Por defecto un usuario de factory ya aceptó la versión vigente de los
     * documentos legales — como cualquier cuenta real creada por el registro.
     * Sin esto, EnsureLegalConsentsAccepted respondería 403 en todos los
     * tests que no tienen nada que ver con lo legal. Los tests del sistema
     * legal lo apagan para probar cuentas sin consentimientos.
     */
    public static bool $acceptLegalConsents = true;

    public function configure(): static
    {
        return $this->afterCreating(function (User $user) {
            if (static::$acceptLegalConsents) {
                app(RecordUserConsentsAction::class)->execute(
                    $user,
                    app(LegalConsentCatalog::class)->consentTypes(),
                    UserConsent::SOURCE_REGISTRATION,
                );
            }
        });
    }

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
