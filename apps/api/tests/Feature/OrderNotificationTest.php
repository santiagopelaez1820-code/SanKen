<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres Tests\Feature.

namespace Tests\Feature;

// Esta línea sirve para importar el modelo Product.
use App\Models\Product;
// Esta línea sirve para importar el modelo User.
use App\Models\User;
// Esta línea sirve para importar la clase NewOrderNotification.
use App\Notifications\NewOrderNotification;
// Esta línea sirve para importar el trait que reinicia la base de datos en cada test.
use Illuminate\Foundation\Testing\RefreshDatabase;
// Esta línea sirve para importar la fachada Notification.
use Illuminate\Support\Facades\Notification;
// Esta línea sirve para importar la clase base de los tests.
use Tests\TestCase;

// Esta línea sirve para declarar la clase de tests OrderNotificationTest.
class OrderNotificationTest extends TestCase
{
    // Esta línea sirve para reiniciar la base de datos en cada test.
    use RefreshDatabase;

    // Esta línea sirve para declarar el método auxiliar que arma los datos del checkout.
    private function checkoutPayload(array $items, array $overrides = []): array
    {
        // Esta línea sirve para devolver los datos por defecto mezclados con los recibidos.
        return array_merge([
            // Esta línea sirve para asignar 'Juan Pérez' al campo "customer_name".
            'customer_name' => 'Juan Pérez',
            // Esta línea sirve para asignar 'juan@example.com' al campo "customer_email".
            'customer_email' => 'juan@example.com',
            // Esta línea sirve para asignar '3000000000' al campo "customer_phone".
            'customer_phone' => '3000000000',
            // Esta línea sirve para asignar '3000000000' al campo "customer_whatsapp".
            'customer_whatsapp' => '3000000000',
            // Esta línea sirve para asignar 'Antioquia' al campo "department".
            'department' => 'Antioquia',
            // Esta línea sirve para asignar 'Medellín' al campo "city".
            'city' => 'Medellín',
            // Esta línea sirve para asignar 'Calle 10 # 20-30' al campo "address".
            'address' => 'Calle 10 # 20-30',
            // Esta línea sirve para asignar null al campo "additional_info".
            'additional_info' => null,
            // Esta línea sirve para asignar $items al campo "items".
            'items' => $items,
            // Esta línea sirve para aplicar los datos recibidos encima de los por defecto.
        ], $overrides);
    }

    /** Junta introLines/outroLines (algunas son HtmlString) en un solo string plano para buscar substrings. */
    // Esta línea sirve para declarar el método auxiliar que obtiene el texto del correo.
    private function renderedText(NewOrderNotification $notification): string
    {
        // Esta línea sirve para armar el correo de la notificación.
        $mail = $notification->toMail(User::factory()->make());

        // Esta línea sirve para juntar las líneas de introducción y de cierre.
        return collect([...$mail->introLines, ...$mail->outroLines])
            // Esta línea sirve para convertir cada línea en texto.
            ->map(fn ($line) => (string) $line)
            // Esta línea sirve para unirlas separadas por " | ".
            ->implode(' | ');
    }

    // Esta línea sirve para declarar el test que comprueba que crear un pedido notifica al super admin.
    public function test_creating_an_order_dispatches_a_notification_to_the_super_admin(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un producto de 50.000.
        $product = Product::factory()->create(['price' => 50000]);

        // Esta línea sirve para crear el pedido como el usuario.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar 2 unidades del producto.
            ['product_id' => $product->id, 'quantity' => 2],
            // Esta línea sirve para cerrar los datos y exigir 201.
        ]))->assertCreated();

        // Esta línea sirve para exigir que se le haya enviado la notificación NewOrderNotification.
        Notification::assertSentTo($admin, NewOrderNotification::class);
    }

    // Esta línea sirve para declarar el test que comprueba que todos los super admins reciben la notificación.
    public function test_all_super_admins_receive_the_notification(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario super admin.
        $adminA = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un usuario super admin.
        $adminB = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un producto de 50.000.
        $product = Product::factory()->create(['price' => 50000]);

        // Esta línea sirve para crear el pedido como el usuario.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar una unidad del producto.
            ['product_id' => $product->id, 'quantity' => 1],
            // Esta línea sirve para cerrar los datos y exigir 201.
        ]))->assertCreated();

        // Esta línea sirve para exigir que se le haya enviado la notificación NewOrderNotification.
        Notification::assertSentTo($adminA, NewOrderNotification::class);
        // Esta línea sirve para exigir que se le haya enviado la notificación NewOrderNotification.
        Notification::assertSentTo($adminB, NewOrderNotification::class);
        // Esta línea sirve para exigir que se hayan enviado 2 notificaciones.
        Notification::assertCount(2);
    }

    // Esta línea sirve para declarar el test que comprueba que un usuario normal nunca recibe la notificación del admin.
    public function test_a_normal_user_never_receives_the_admin_notification(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario de prueba.
        $otherUser = User::factory()->create();
        // Esta línea sirve para crear un super admin.
        User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un producto de 50.000.
        $product = Product::factory()->create(['price' => 50000]);

        // Esta línea sirve para crear el pedido como el usuario.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar una unidad del producto.
            ['product_id' => $product->id, 'quantity' => 1],
            // Esta línea sirve para cerrar los datos y exigir 201.
        ]))->assertCreated();

        // Esta línea sirve para exigir que el usuario no haya recibido la notificación.
        Notification::assertNotSentTo($user, NewOrderNotification::class);
        // Esta línea sirve para exigir que el otro usuario no la haya recibido.
        Notification::assertNotSentTo($otherUser, NewOrderNotification::class);
    }

    // Esta línea sirve para declarar el test que comprueba que el correo trae número de pedido, cliente, productos y total.
    public function test_the_email_contains_order_number_customer_products_and_total(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un producto con nombre y precio conocidos.
        $product = Product::factory()->create(['name' => 'Creatina Monohidratada', 'price' => 50000]);

        // Esta línea sirve para crear el pedido como el usuario.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar 2 unidades del producto.
            ['product_id' => $product->id, 'quantity' => 2],
        ]));
        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para calcular el número de pedido con ceros a la izquierda.
        $orderNumber = str_pad((string) $response->json('data.id'), 6, '0', STR_PAD_LEFT);

        // Esta línea sirve para exigir que el admin haya recibido la notificación con esta condición.
        Notification::assertSentTo(
            // Esta línea sirve para pasar el admin.
            $admin,
            // Esta línea sirve para indicar la notificación esperada.
            NewOrderNotification::class,
            // Esta línea sirve para abrir la comprobación del correo.
            function (NewOrderNotification $notification) use ($orderNumber, $product) {
                // Esta línea sirve para armar el correo de la notificación.
                $mail = $notification->toMail($notification->order->user);
                // Esta línea sirve para obtener el texto del correo.
                $text = $this->renderedText($notification);

                // Esta línea sirve para exigir que el asunto incluya el número de pedido.
                return str_contains($mail->subject, $orderNumber)
                    // Esta línea sirve para exigir que el texto incluya el número de pedido.
                    && str_contains($text, $orderNumber)
                    // Esta línea sirve para exigir que incluya el nombre del cliente.
                    && str_contains($text, 'Juan Pérez')
                    // Esta línea sirve para exigir que incluya el nombre del producto.
                    && str_contains($text, $product->name)
                    // Esta línea sirve para exigir que incluya el total de 100.000.
                    && str_contains($text, '100.000') // 50000 * 2
                    // Esta línea sirve para exigir que el botón apunte al pedido en el panel.
                    && str_contains($mail->actionUrl, "/admin/orders/{$notification->order->id}");
            }
        );
    }

    /**
     * Caso de seguridad clave: aunque el request mande un unit_price
     * manipulado, el correo debe mostrar el total real calculado por el
     * backend (ya persistido en el pedido), nunca el que mandó el cliente.
     */
    // Esta línea sirve para declarar el test que comprueba que manipular el precio en la petición no altera el total del correo.
    public function test_manipulating_unit_price_in_the_request_does_not_alter_the_email_total(): void
    {
        // Esta línea sirve para simular las notificaciones para no enviarlas de verdad.
        Notification::fake();

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un usuario super admin.
        $admin = User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un producto de 90.000.
        $product = Product::factory()->create(['price' => 90000]);

        // Esta línea sirve para crear el pedido como el usuario.
        $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para enviar el producto con un precio falso de 1.
            ['product_id' => $product->id, 'quantity' => 1, 'unit_price' => 1, 'price' => 1],
            // Esta línea sirve para cerrar los datos y exigir 201.
        ]))->assertCreated();

        // Esta línea sirve para exigir que el admin haya recibido la notificación con esta condición.
        Notification::assertSentTo($admin, NewOrderNotification::class, function (NewOrderNotification $notification) {
            // Esta línea sirve para obtener el texto del correo.
            $text = $this->renderedText($notification);

            // Esta línea sirve para exigir que el total sea 90.000 y no aparezca el precio falso.
            return str_contains($text, '90.000') && ! str_contains($text, '$1 COP');
        });
    }

    // Esta línea sirve para declarar el test que comprueba que el pedido existe aunque falle el canal de notificación.
    public function test_the_order_still_exists_even_if_the_notification_channel_fails(): void
    {
        // Esta línea sirve para simular que el envío de notificaciones lanza un error SMTP.
        Notification::shouldReceive('send')->andThrow(new \RuntimeException('SMTP caído'));

        // Esta línea sirve para crear un usuario de prueba.
        $user = User::factory()->create();
        // Esta línea sirve para crear un super admin.
        User::factory()->create(['role' => 'super_admin']);
        // Esta línea sirve para crear un producto de 50.000.
        $product = Product::factory()->create(['price' => 50000]);

        // Esta línea sirve para crear el pedido como el usuario.
        $response = $this->actingAs($user, 'sanctum')->postJson('/api/v1/orders', $this->checkoutPayload([
            // Esta línea sirve para agregar una unidad del producto.
            ['product_id' => $product->id, 'quantity' => 1],
        ]));

        // Esta línea sirve para exigir que la respuesta sea 201 (creado).
        $response->assertCreated();
        // Esta línea sirve para exigir que la tabla orders tenga ese registro.
        $this->assertDatabaseHas('orders', ['id' => $response->json('data.id')]);
    }
}
