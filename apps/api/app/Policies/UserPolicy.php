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

    /**
     * Promover/degradar rol es exclusivo de Super Admin, y nunca sobre sí
     * mismo — el bloqueo de escalar a super_admin en sí vive en el
     * FormRequest (solo acepta 'user'/'trainer' como destino), esto es una
     * segunda barrera contra que un Super Admin se cambie su propio rol.
     */
    public function changeRole(User $viewer, User $target): bool
    {
        return $viewer->isAdmin() && ! $viewer->is($target);
    }

    /**
     * Activar/desactivar una cuenta es exclusivo de Super Admin.
     */
    public function manageActivation(User $viewer, User $target): bool
    {
        return $viewer->isAdmin() && ! $viewer->is($target);
    }

    /**
     * Eliminar una cuenta es exclusivo de Super Admin, y nunca la propia.
     */
    public function delete(User $viewer, User $target): bool
    {
        return $viewer->isAdmin() && ! $viewer->is($target);
    }
}
