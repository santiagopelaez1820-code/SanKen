<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    private function signedVerifyUrl(User $user, ?string $hashOverride = null): string
    {
        return URL::signedRoute('api.v1.auth.email.verify', [
            'id' => $user->id,
            'hash' => $hashOverride ?? sha1($user->email),
        ]);
    }

    public function test_verifying_with_a_valid_signed_url_marks_the_email_verified(): void
    {
        Event::fake();
        $user = User::factory()->unverified()->create();

        $response = $this->getJson($this->signedVerifyUrl($user));

        $response->assertOk()->assertJsonPath('data.message', 'Correo verificado.');
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        Event::assertDispatched(Verified::class);
    }

    public function test_verifying_with_an_invalid_hash_fails(): void
    {
        $user = User::factory()->unverified()->create();

        $response = $this->getJson($this->signedVerifyUrl($user, sha1('someone-else@example.com')));

        $response->assertForbidden();
        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }

    public function test_verifying_an_already_verified_email_is_idempotent(): void
    {
        Event::fake();
        $user = User::factory()->create();

        $response = $this->getJson($this->signedVerifyUrl($user));

        $response->assertOk();
        Event::assertNotDispatched(Verified::class);
    }

    public function test_resend_when_already_verified_does_not_send_a_notification(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/email/resend');

        $response->assertOk()->assertJsonPath('data.message', 'El correo ya está verificado.');
        Notification::assertNothingSent();
    }

    public function test_resend_when_unverified_sends_the_verification_notification(): void
    {
        Notification::fake();
        $user = User::factory()->unverified()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/email/resend');

        $response->assertOk();
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_resend_is_rate_limited_after_three_attempts(): void
    {
        Notification::fake();
        $user = User::factory()->unverified()->create();
        $client = $this->actingAs($user, 'sanctum');

        for ($i = 0; $i < 3; $i++) {
            $client->postJson('/api/v1/auth/email/resend')->assertOk();
        }

        $client->postJson('/api/v1/auth/email/resend')->assertStatus(429);
    }
}
