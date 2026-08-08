<?php

namespace Tests\Feature\Auth;

use App\Domain\Auth\Services\RecoveryCodeService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;

class TwoFactorSetupTest extends TestCase
{
    use RefreshDatabase;

    public function test_enabling_two_factor_returns_secret_and_qr_without_activating(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/2fa/enable');

        $response->assertOk()->assertJsonStructure(['data' => ['secret', 'otpauth_uri', 'qr_svg']]);
        $this->assertStringContainsString('<svg', $response->json('data.qr_svg'));

        $user->refresh();
        $this->assertNotNull($user->two_factor_secret);
        $this->assertFalse($user->two_factor_enabled);
    }

    public function test_confirming_two_factor_with_valid_code_activates_and_returns_recovery_codes(): void
    {
        $user = User::factory()->create();
        $secret = (new Google2FA)->generateSecretKey();
        $user->forceFill(['two_factor_secret' => $secret])->save();

        $code = (new Google2FA)->getCurrentOtp($secret);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/2fa/confirm', ['code' => $code]);

        $response->assertOk();
        $recoveryCodes = $response->json('data.recovery_codes');
        $this->assertCount(8, $recoveryCodes);

        $user->refresh();
        $this->assertTrue($user->two_factor_enabled);
        $this->assertCount(8, $user->two_factor_recovery_codes);
        $this->assertNotEquals($recoveryCodes[0], $user->two_factor_recovery_codes[0]);
    }

    public function test_confirming_two_factor_with_invalid_code_fails(): void
    {
        $user = User::factory()->create();
        $user->forceFill(['two_factor_secret' => (new Google2FA)->generateSecretKey()])->save();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/2fa/confirm', ['code' => '000000']);

        $response->assertUnprocessable()->assertJsonValidationErrors('code');

        $user->refresh();
        $this->assertFalse($user->two_factor_enabled);
    }

    public function test_disabling_two_factor_with_correct_password_clears_columns(): void
    {
        $user = $this->makeTwoFactorUser();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/auth/2fa/disable', ['password' => 'Password!234']);

        $response->assertOk();

        $user->refresh();
        $this->assertFalse($user->two_factor_enabled);
        $this->assertNull($user->two_factor_secret);
        $this->assertNull($user->two_factor_recovery_codes);
    }

    public function test_disabling_two_factor_with_incorrect_password_fails(): void
    {
        $user = $this->makeTwoFactorUser();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/v1/auth/2fa/disable', ['password' => 'wrong-password']);

        $response->assertUnprocessable()->assertJsonValidationErrors('password');

        $user->refresh();
        $this->assertTrue($user->two_factor_enabled);
    }

    public function test_two_factor_setup_routes_require_authentication(): void
    {
        $this->postJson('/api/v1/auth/2fa/enable')->assertUnauthorized();
        $this->postJson('/api/v1/auth/2fa/confirm', ['code' => '123456'])->assertUnauthorized();
        $this->postJson('/api/v1/auth/2fa/disable', ['password' => 'x'])->assertUnauthorized();
    }

    private function makeTwoFactorUser(): User
    {
        $user = User::factory()->create(['password' => 'Password!234']);
        $secret = (new Google2FA)->generateSecretKey();
        $recoveryCodes = new RecoveryCodeService;

        $user->forceFill([
            'two_factor_enabled' => true,
            'two_factor_secret' => $secret,
            'two_factor_recovery_codes' => array_map(
                fn (string $code) => $recoveryCodes->hash($code),
                $recoveryCodes->generate(),
            ),
        ])->save();

        return $user->refresh();
    }
}
