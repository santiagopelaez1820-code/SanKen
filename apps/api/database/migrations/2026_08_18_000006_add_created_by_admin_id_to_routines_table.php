<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: paralela a created_by_trainer_id, no la reemplaza. Nullable —
 * solo se completa cuando source='admin' (ver AssignPersonalRoutineAction).
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla routines.
        Schema::table('routines', function (Blueprint $table) {
            // Esta línea sirve para agregar el admin que la creó (opcional) después del entrenador.
            $table->foreignId('created_by_admin_id')->nullable()->after('created_by_trainer_id')
                // Esta línea sirve para enlazarlo con la tabla users (queda en null si se borra el admin).
                ->constrained('users')->nullOnDelete();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla routines.
        Schema::table('routines', function (Blueprint $table) {
            // Esta línea sirve para borrar la clave foránea y la columna created_by_admin_id.
            $table->dropConstrainedForeignId('created_by_admin_id');
        });
    }
};
