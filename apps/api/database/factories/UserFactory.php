<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las factories.

namespace Database\Factories;

// Esta línea sirve para importar la acción que registra consentimientos.
use App\Application\Legal\Actions\RecordUserConsentsAction;
// Esta línea sirve para importar el catálogo legal.
use App\Domain\Legal\Services\LegalConsentCatalog;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;
// Esta línea sirve para importar el modelo UserConsent (consentimiento).
use App\Models\UserConsent;
// Esta línea sirve para importar la clase base de las factories.
use Illuminate\Database\Eloquent\Factories\Factory;
// Esta línea sirve para importar la fachada Hash para hashear la contraseña.
use Illuminate\Support\Facades\Hash;
// Esta línea sirve para importar el helper Str para generar textos al azar.
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
// Esta línea sirve para declarar la factory que crea usuarios de prueba.
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    // Esta línea sirve para guardar la contraseña hasheada para reutilizarla.
    protected static ?string $password;

    /**
     * Por defecto un usuario de factory ya aceptó la versión vigente de los
     * documentos legales — como cualquier cuenta real creada por el registro.
     * Sin esto, EnsureLegalConsentsAccepted respondería 403 en todos los
     * tests que no tienen nada que ver con lo legal. Los tests del sistema
     * legal lo apagan para probar cuentas sin consentimientos.
     */
    // Esta línea sirve para definir si los usuarios creados aceptan los documentos legales.
    public static bool $acceptLegalConsents = true;

    // Esta línea sirve para declarar el método que configura la factory.
    public function configure(): static
    {
        // Esta línea sirve para ejecutar algo después de crear cada usuario.
        return $this->afterCreating(function (User $user) {
            // Esta línea sirve para revisar si hay que aceptar los documentos legales.
            if (static::$acceptLegalConsents) {
                // Esta línea sirve para registrar los consentimientos del usuario.
                app(RecordUserConsentsAction::class)->execute(
                    // Esta línea sirve para pasar el usuario.
                    $user,
                    // Esta línea sirve para pasar todos los tipos de consentimiento.
                    app(LegalConsentCatalog::class)->consentTypes(),
                    // Esta línea sirve para indicar que se registraron al crear la cuenta.
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
    // Esta línea sirve para declarar el método que define los datos por defecto.
    public function definition(): array
    {
        // Esta línea sirve para devolver los datos.
        return [
            // Esta línea sirve para usar un nombre falso.
            'name' => fake()->name(),
            // Esta línea sirve para usar un correo falso que no se repita.
            'email' => fake()->unique()->safeEmail(),
            // Esta línea sirve para marcar el correo como verificado.
            'email_verified_at' => now(),
            // Esta línea sirve para usar la contraseña "password" hasheada una sola vez.
            'password' => static::$password ??= Hash::make('password'),
            // Esta línea sirve para generar un token de "recordarme" al azar.
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    // Esta línea sirve para declarar el estado de usuario sin correo verificado.
    public function unverified(): static
    {
        // Esta línea sirve para devolver el estado con los datos a cambiar.
        return $this->state(fn (array $attributes) => [
            // Esta línea sirve para dejar el correo sin verificar.
            'email_verified_at' => null,
        ]);
    }
}
