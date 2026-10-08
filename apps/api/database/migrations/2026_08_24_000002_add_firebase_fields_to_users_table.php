<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: `firebase_uid` vincula una cuenta SanKen a un usuario de Firebase
 * (Google/Facebook) — nullable porque la mayoría de las cuentas siguen
 * siendo email+password puro. `auth_provider` es solo informativo (qué
 * proveedor se usó la última vez); nunca se usa para decidir permisos.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla users.
        Schema::table('users', function (Blueprint $table) {
            // Esta línea sirve para agregar el uid de Firebase (opcional y único).
            $table->string('firebase_uid')->nullable()->unique()->after('phone');
            // Esta línea sirve para agregar el proveedor de login (opcional).
            $table->string('auth_provider')->nullable()->after('firebase_uid');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla users.
        Schema::table('users', function (Blueprint $table) {
            // Esta línea sirve para borrar las dos columnas.
            $table->dropColumn(['firebase_uid', 'auth_provider']);
        });
    }
};
