<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las policies (permisos).

namespace App\Policies;

// Esta línea sirve para importar el modelo Order (pedido).
use App\Models\Order;
// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar la policy de los pedidos.
class OrderPolicy
{
    /**
     * El dueño del pedido puede verlo (mis pedidos). Un super_admin también,
     * mismo criterio que el resto del panel — ya tiene acceso total vía
     * /admin/orders, esto solo evita un 403 innecesario si entra por acá.
     */
    // Esta línea sirve para declarar el permiso para ver un pedido.
    public function view(User $user, Order $order): bool
    {
        // Esta línea sirve para permitirlo si el pedido es del usuario o si es super admin.
        return $user->is($order->user) || $user->isAdmin();
    }
}
