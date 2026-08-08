<?php

namespace Tests\Feature\Auth;

use App\Domain\Auth\Services\RecoveryCodeService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PragmaRX\Google2FA\Google2FA;
use Tests\TestCase;

class TwoFactorChallengeTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_for_two_factor_user_returns_challenge_instead_of_token(): void
    {
        ['user' => $user] = $this->makeTwoFactorUser();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'Password!234',
        ]);

        $response->assertOk()
            ->assertJsonPath('data.requires_two_factor', true)
            ->assertJsonStructure(['data' => ['challenge_token']])
            ->assertJsonMissingPath('data.token');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_login_for_non_two_factor_user_is_unchanged(): void
    {
        $user = User::factory()->create(['password' => 'Password!234']);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'Password!234',
        ]);

        $response->assertOk()->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_challenge_with_valid_totp_code_returns_token(): void
    {
        ['user' => $user, 'secret' => $secret] = $this->makeTwoFactorUser();
        $challengeToken = $this->obtainChallengeToken($user);

        $response = $this->postJson('/api/v1/auth/2fa/challenge', [
            'challenge_token' => $challengeToken,
            'code' => (new Google2FA)->getCurrentOtp($secret),
        ]);

        $response->assertOk()->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_challenge_with_valid_recovery_code_consumes_it(): void
    {
        ['user' => $user, 'recoveryCodes' => $recoveryCodes] = $this->makeTwoFactorUser();
        $challengeToken = $this->obtainChallengeToken($user);

        $response = $this->postJson('/api/v1/auth/2fa/challenge', [
            'challenge_token' => $challengeToken,
            'code' => $recoveryCodes[0],
        ]);

        $response->assertOk();
        $user->refresh();
        $this->assertCount(7, $user->two_factor_recovery_codes);
    }

    public function test_challenge_with_already_used_recovery_code_fails(): void
    {
        ['user' => $user, 'recoveryCodes' => $recoveryCodes] = $this->makeTwoFactorUser();

        $firstToken = $this->obtainChallengeToken($user);
        $this->postJson('/api/v1/auth/2fa/challenge', [
            'challenge_token' => $firstToken,
            'code' => $recoveryCodes[0],
        ])->assertOk();

        $secondToken = $this->obtainChallengeToken($user);
        $response = $this->postJson('/api/v1/auth/2fa/challenge', [
            'challenge_token' => $secondToken,
            'code' => $recoveryCodes[0],
        ]);

        $response->assertUnprocessable();
    }

    public function test_challenge_with_invalid_challenge_token_fails(): void
    {
        $response = $this->postJson('/api/v1/auth/2fa/challenge', [
            'challenge_token' => 'not-a-real-token',
            'code' => '123456',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('challenge_token');
    }

    public function test_challenge_burns_after_max_attempts(): void
    {
        ['user' => $user, 'secret' => $secret] = $this->makeTwoFactorUser();
        $challengeToken = $this->obtainChallengeToken($user);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/2fa/challenge', [
                'challenge_token' => $challengeToken,
                'code' => '000000',
            ])->assertUnprocessable();
        }

        $response = $this->postJson('/api/v1/auth/2fa/challenge', [
            'challenge_token' => $challengeToken,
            'code' => (new Google2FA)->getCurrentOtp($secret),
        ]);

        $response->assertUnprocessable();
    }

    private function makeTwoFactorUser(): array
    {
        $user = User::factory()->create(['password' => 'Password!234']);
        $secret = (new Google2FA)->generateSecretKey();
        $recoveryCodeService = new RecoveryCodeService;
        $plainRecoveryCodes = $recoveryCodeService->generate();

        $user->forceFill([
            'two_factor_enabled' => true,
            'two_factor_secret' => $secret,
            'two_factor_recovery_codes' => array_map(
                fn (string $code) => $recoveryCodeService->hash($code),
                $plainRecoveryCodes,
            ),
        ])->save();

        return ['user' => $user->refresh(), 'secret' => $secret, 'recoveryCodes' => $plainRecoveryCodes];
    }

    private function obtainChallengeToken(User $user): string
    {
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'Password!234',
        ]);

        return $response->json('data.challenge_token');
    }
}
