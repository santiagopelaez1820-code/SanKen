<?php

// Esta línea sirve para ubicar esta clase en el espacio de nombres de las policies (permisos).

namespace App\Policies;

// Esta línea sirve para importar el modelo User (usuario).
use App\Models\User;

// Esta línea sirve para declarar la policy de los usuarios.
class UserPolicy
{
    /**
     * Un usuario puede ver su propio perfil; un admin puede ver cualquiera.
     */
    // Esta línea sirve para declarar el permiso para ver un perfil.
    public function view(User $viewer, User $target): bool
    {
        // Esta línea sirve para permitirlo si es el propio perfil o si es super admin.
        return $viewer->is($target) || $viewer->isAdmin();
    }

    /**
     * Un usuario puede editar su propio perfil; un admin puede editar cualquiera.
     * Un entrenador NO puede editar el perfil de su cliente (solo sus rutinas).
     */
    // Esta línea sirve para declarar el permiso para editar un perfil.
    public function update(User $viewer, User $target): bool
    {
        // Esta línea sirve para permitirlo si es el propio perfil o si es super admin.
        return $viewer->is($target) || $viewer->isAdmin();
    }

    /**
     * Banear/desbanear es exclusivo de administradores.
     */
    // Esta línea sirve para declarar el permiso para banear o desbanear.
    public function ban(User $viewer, User $target): bool
    {
        // Esta línea sirve para permitirlo solo a super admin y nunca sobre sí mismo.
        return $viewer->isAdmin() && ! $viewer->is($target);
    }

    /**
     * Promover/degradar rol es exclusivo de Super Admin, y nunca sobre sí
     * mismo — el bloqueo de escalar a super_admin en sí vive en el
     * FormRequest (solo acepta 'user'/'trainer' como destino), esto es una
     * segunda barrera contra que un Super Admin se cambie su propio rol.
     */
    // Esta línea sirve para declarar el permiso para cambiar el rol.
    public function changeRole(User $viewer, User $target): bool
    {
        // Esta línea sirve para permitirlo solo a super admin y nunca sobre sí mismo.
        return $viewer->isAdmin() && ! $viewer->is($target);
    }

    /**
     * Activar/desactivar una cuenta es exclusivo de Super Admin.
     */
    // Esta línea sirve para declarar el permiso para activar o desactivar una cuenta.
    public function manageActivation(User $viewer, User $target): bool
    {
        // Esta línea sirve para permitirlo solo a super admin y nunca sobre sí mismo.
        return $viewer->isAdmin() && ! $viewer->is($target);
    }

    /**
     * Eliminar una cuenta es exclusivo de Super Admin, y nunca la propia.
     */
    // Esta línea sirve para declarar el permiso para eliminar una cuenta.
    public function delete(User $viewer, User $target): bool
    {
        // Esta línea sirve para permitirlo solo a super admin y nunca sobre la propia.
        return $viewer->isAdmin() && ! $viewer->is($target);
    }
}
