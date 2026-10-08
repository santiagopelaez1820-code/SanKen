<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla users.
        Schema::table('users', function (Blueprint $table) {
            // Esta línea sirve para agregar el teléfono (opcional) después del correo.
            $table->string('phone')->nullable()->after('email');
            // Esta línea sirve para agregar el rol (user, trainer o admin; user por defecto).
            $table->enum('role', ['user', 'trainer', 'admin'])->default('user')->after('password');
            // Esta línea sirve para agregar si tiene la verificación en dos pasos.
            $table->boolean('two_factor_enabled')->default(false)->after('role');
            // Esta línea sirve para agregar el secreto de la verificación en dos pasos (opcional).
            $table->text('two_factor_secret')->nullable()->after('two_factor_enabled');
            // Esta línea sirve para agregar si el perfil es público.
            $table->boolean('is_public_profile')->default(false)->after('two_factor_secret');
            // Esta línea sirve para agregar si está baneado.
            $table->boolean('is_banned')->default(false)->after('is_public_profile');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla users.
        Schema::table('users', function (Blueprint $table) {
            // Esta línea sirve para borrar las columnas agregadas.
            $table->dropColumn([
                // Esta línea sirve para borrar el teléfono.
                'phone',
                // Esta línea sirve para borrar el rol.
                'role',
                // Esta línea sirve para borrar la marca de verificación en dos pasos.
                'two_factor_enabled',
                // Esta línea sirve para borrar el secreto de la verificación en dos pasos.
                'two_factor_secret',
                // Esta línea sirve para borrar la marca de perfil público.
                'is_public_profile',
                // Esta línea sirve para borrar la marca de baneado.
                'is_banned',
            ]);
        });
    }
};
