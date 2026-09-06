<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
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

        Notification::assertSentTo($user, ResetPasswordNotification::class);
    }

    public function test_the_reset_email_links_to_the_frontend_with_the_token_and_email(): void
    {
        Notification::fake();
        config(['app.frontend_url' => 'http://localhost:5173']);

        $user = User::factory()->create();

        $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email])->assertOk();

        Notification::assertSentTo($user, ResetPasswordNotification::class, function (ResetPasswordNotification $notification) use ($user) {
            $mail = $notification->toMail($user);

            return str_starts_with($mail->actionUrl, 'http://localhost:5173/reset-password?')
                && str_contains($mail->actionUrl, 'email='.urlencode($user->email));
        });
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
        // Esta app no tiene archivos de idioma — sin este mapeo a mano el
        // mensaje sale en inglés (__($status) de Laravel), el único lugar
        // que rompería el resto de la app, que está toda en español.
        $response->assertJsonPath('errors.email.0', 'Este enlace de recuperación no es válido o ya expiró.');
    }

    public function test_a_reset_token_cannot_be_reused_after_a_successful_reset(): void
    {
        $user = User::factory()->create(['password' => 'OldPassword!234']);
        $token = Password::broker()->createToken($user);

        $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'NewPassword!234',
            'password_confirmation' => 'NewPassword!234',
        ])->assertOk();

        $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'AnotherPassword!234',
            'password_confirmation' => 'AnotherPassword!234',
        ])->assertUnprocessable()->assertJsonPath(
            'errors.email.0',
            'Este enlace de recuperación no es válido o ya expiró.',
        );
    }
}
