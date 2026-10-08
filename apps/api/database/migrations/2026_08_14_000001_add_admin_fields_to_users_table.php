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
            // Esta línea sirve para agregar la última actividad (opcional).
            $table->timestamp('last_active_at')->nullable()->after('is_banned');
            // Esta línea sirve para agregar la fecha de verificación como entrenador (opcional).
            $table->timestamp('trainer_verified_at')->nullable()->after('last_active_at');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla users.
        Schema::table('users', function (Blueprint $table) {
            // Esta línea sirve para borrar las dos columnas.
            $table->dropColumn(['last_active_at', 'trainer_verified_at']);
        });
    }
};
