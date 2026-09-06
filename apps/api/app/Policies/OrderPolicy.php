<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * El dueño del pedido puede verlo (mis pedidos). Un super_admin también,
     * mismo criterio que el resto del panel — ya tiene acceso total vía
     * /admin/orders, esto solo evita un 403 innecesario si entra por acá.
     */
    public function view(User $user, Order $order): bool
    {
        return $user->is($order->user) || $user->role === 'super_admin';
    }
}
