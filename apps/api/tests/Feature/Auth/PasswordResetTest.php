<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_forgot_password_sends_reset_link_for_an_existing_email(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email]);

        $response->assertOk()->assertJsonPath(
            'data.message',
            'Si el correo existe, se envió un enlace de recuperación.',
        );

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_forgot_password_returns_the_same_generic_response_for_an_unknown_email(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/auth/forgot-password', ['email' => 'nobody@example.com']);

        $response->assertOk()->assertJsonPath(
            'data.message',
            'Si el correo existe, se envió un enlace de recuperación.',
        );

        Notification::assertNothingSent();
    }

    public function test_reset_password_with_a_valid_token_updates_the_password(): void
    {
        $user = User::factory()->create(['password' => 'OldPassword!234']);
        $token = Password::broker()->createToken($user);

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'NewPassword!234',
            'password_confirmation' => 'NewPassword!234',
        ]);

        $response->assertOk();

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'NewPassword!234',
        ])->assertOk();
    }

    public function test_reset_password_with_an_invalid_token_fails(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/v1/auth/reset-password', [
            'token' => 'not-a-real-token',
            'email' => $user->email,
            'password' => 'NewPassword!234',
            'password_confirmation' => 'NewPassword!234',
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('email');
    }
}
