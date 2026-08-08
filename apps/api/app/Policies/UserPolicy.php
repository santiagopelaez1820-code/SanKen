<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Un usuario puede ver su propio perfil; un admin puede ver cualquiera.
     */
    public function view(User $viewer, User $target): bool
    {
        return $viewer->is($target) || $viewer->isAdmin();
    }

    /**
     * Un usuario puede editar su propio perfil; un admin puede editar cualquiera.
     * Un entrenador NO puede editar el perfil de su cliente (solo sus rutinas).
     */
    public function update(User $viewer, User $target): bool
    {
        return $viewer->is($target) || $viewer->isAdmin();
    }

    /**
     * Banear/desbanear es exclusivo de administradores.
     */
    public function ban(User $viewer, User $target): bool
    {
        return $viewer->isAdmin() && ! $viewer->is($target);
    }
}
