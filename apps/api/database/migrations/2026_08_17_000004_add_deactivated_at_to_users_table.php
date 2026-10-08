<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: `deactivated_at` es independiente de `is_banned` — desactivar es
 * una acción administrativa reversible (Super Admin), mientras que
 * is_banned queda para el flujo de moderación/reportes existente.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla users.
        Schema::table('users', function (Blueprint $table) {
            // Esta línea sirve para agregar la fecha de desactivación (opcional).
            $table->timestamp('deactivated_at')->nullable()->after('is_banned');
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla users.
        Schema::table('users', function (Blueprint $table) {
            // Esta línea sirve para borrar la columna deactivated_at.
            $table->dropColumn('deactivated_at');
        });
    }
};
