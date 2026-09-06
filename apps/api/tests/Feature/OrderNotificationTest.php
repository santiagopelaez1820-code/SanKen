<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class OrderNotificationTest extends TestCase
{
    use RefreshDatabase;

    private function checkoutPayload(array $items, array $overrides = []): array
    {
        return array_merge([
            'customer_name' => 'Juan Pérez',
            'customer_email' => 'juan@example.com',
            'customer_phone' => '3000000000',
            'customer_whatsapp' => '3000000000',
            'department' => 'Antioquia',
            'city' => 'Medellín',
            'address' => 'Calle 10 # 20-30',
            'additional_info' => null,
            'items' => $items,
        ], $overrides);
    }

    /** Junta introLines/outroLines (algunas son HtmlString) en un solo string plano para buscar substrings. */
    private function renderedText(NewOrderNotification $notification): string
    {
        $mail = $notification->toMail(User::factory()->make());

        return collect([...$mail->introLines, ...$mail->outroLines])
            ->map(fn ($line) => (string) $line)
            ->implode(' | ');
    }

    public function test_creating_an_order_dispatches_a_notification_to_the_super_admin(): void
    {
        Notification::fake();

        $user = User::factory()->create();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $product = Product::factory()->create(['price' => 50000]);

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 2],
        ]))->assertCreated();

        Notification::assertSentTo($admin, NewOrderNotification::class);
    }

    public function test_all_super_admins_receive_the_notification(): void
    {
        Notification::fake();

        $user = User::factory()->create();
        $adminA = User::factory()->create(['role' => 'super_admin']);
        $adminB = User::factory()->create(['role' => 'super_admin']);
        $product = Product::factory()->create(['price' => 50000]);

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 1],
        ]))->assertCreated();

        Notification::assertSentTo($adminA, NewOrderNotification::class);
        Notification::assertSentTo($adminB, NewOrderNotification::class);
        Notification::assertCount(2);
    }

    public function test_a_normal_user_never_receives_the_admin_notification(): void
    {
        Notification::fake();

        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        User::factory()->create(['role' => 'super_admin']);
        $product = Product::factory()->create(['price' => 50000]);

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 1],
        ]))->assertCreated();

        Notification::assertNotSentTo($user, NewOrderNotification::class);
        Notification::assertNotSentTo($otherUser, NewOrderNotification::class);
    }

    public function test_the_email_contains_order_number_customer_products_and_total(): void
    {
        Notification::fake();

        $user = User::factory()->create();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $product = Product::factory()->create(['name' => 'Creatina Monohidratada', 'price' => 50000]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 2],
        ]));
        $response->assertCreated();
        $orderNumber = str_pad((string) $response->json('data.id'), 6, '0', STR_PAD_LEFT);

        Notification::assertSentTo(
            $admin,
            NewOrderNotification::class,
            function (NewOrderNotification $notification) use ($orderNumber, $product) {
                $mail = $notification->toMail($notification->order->user);
                $text = $this->renderedText($notification);

                return str_contains($mail->subject, $orderNumber)
                    && str_contains($text, $orderNumber)
                    && str_contains($text, 'Juan Pérez')
                    && str_contains($text, $product->name)
                    && str_contains($text, '100.000') // 50000 * 2
                    && str_contains($mail->actionUrl, "/admin/orders/{$notification->order->id}");
            }
        );
    }

    /**
     * Caso de seguridad clave: aunque el request mande un unit_price
     * manipulado, el correo debe mostrar el total real calculado por el
     * backend (ya persistido en el pedido), nunca el que mandó el cliente.
     */
    public function test_manipulating_unit_price_in_the_request_does_not_alter_the_email_total(): void
    {
        Notification::fake();

        $user = User::factory()->create();
        $admin = User::factory()->create(['role' => 'super_admin']);
        $product = Product::factory()->create(['price' => 90000]);

        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 1, 'unit_price' => 1, 'price' => 1],
        ]))->assertCreated();

        Notification::assertSentTo($admin, NewOrderNotification::class, function (NewOrderNotification $notification) {
            $text = $this->renderedText($notification);

            return str_contains($text, '90.000') && ! str_contains($text, '$1 COP');
        });
    }

    public function test_the_order_still_exists_even_if_the_notification_channel_fails(): void
    {
        Notification::shouldReceive('send')->andThrow(new \RuntimeException('SMTP caído'));

        $user = User::factory()->create();
        User::factory()->create(['role' => 'super_admin']);
        $product = Product::factory()->create(['price' => 50000]);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            ['product_id' => $product->id, 'quantity' => 1],
        ]));

        $response->assertCreated();
        $this->assertDatabaseHas('orders', ['id' => $response->json('data.id')]);
    }
}
