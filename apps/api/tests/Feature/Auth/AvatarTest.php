<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AvatarTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_upload_an_avatar(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ]);

        $response->assertOk();
        $url = $response->json('data.avatar_url');
        $this->assertNotNull($url);
        $this->assertStringStartsWith('/storage/avatars/', $url);

        $path = str_replace('/storage/', '', $url);
        Storage::disk('public')->assertExists($path);

        $this->assertSame($url, $user->fresh()->avatar_url);
    }

    public function test_uploading_a_new_avatar_deletes_the_previous_file(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $first = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            'avatar' => UploadedFile::fake()->image('first.jpg'),
        ]);
        $firstPath = str_replace('/storage/', '', $first->json('data.avatar_url'));

        $second = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            'avatar' => UploadedFile::fake()->image('second.jpg'),
        ]);
        $secondPath = str_replace('/storage/', '', $second->json('data.avatar_url'));

        Storage::disk('public')->assertMissing($firstPath);
        Storage::disk('public')->assertExists($secondPath);
    }

    public function test_user_can_delete_their_avatar(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $upload = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ]);
        $path = str_replace('/storage/', '', $upload->json('data.avatar_url'));

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/v1/auth/me/avatar');

        $response->assertOk()->assertJsonPath('data.avatar_url', null);
        Storage::disk('public')->assertMissing($path);
        $this->assertNull($user->fresh()->avatar_url);
    }

    public function test_avatar_upload_rejects_non_image_files(): void
    {
        Storage::fake('public');
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            'avatar' => UploadedFile::fake()->create('document.pdf', 100, 'application/pdf'),
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('avatar');
    }

    public function test_avatar_upload_requires_authentication(): void
    {
        Storage::fake('public');

        $response = $this->postJson('/api/v1/auth/me/avatar', [
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ]);

        $response->assertUnauthorized();
    }

    public function test_user_cannot_change_another_users_avatar(): void
    {
        Storage::fake('public');
        $owner = User::factory()->create();
        $attacker = User::factory()->create();

        $this->actingAs($attacker, 'sanctum')->postJson('/api/v1/auth/me/avatar', [
            'avatar' => UploadedFile::fake()->image('avatar.jpg'),
        ])->assertOk();

        $this->assertNull($owner->fresh()->avatar_url);
        $this->assertNotNull($attacker->fresh()->avatar_url);
    }
}
