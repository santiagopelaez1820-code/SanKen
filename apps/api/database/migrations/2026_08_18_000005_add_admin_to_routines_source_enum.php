<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar la fachada DB para ejecutar SQL.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la fachada Schema para modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: agrega 'admin' al enum de routines.source para que Super Admin
 * pueda asignar rutinas personalizadas por usuario (ver AssignPersonalRoutineAction),
 * mismo patrón sqlite-safe usado en 2026_08_16_000001_add_ppl_upper_lower_to_routines_split_type.
 * No reescribe filas existentes — 'engine' y 'trainer' siguen siendo válidos.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para revisar si la base de datos es SQLite.
        if (DB::connection()->getDriverName() === 'sqlite') {
            // Esta línea sirve para modificar la tabla routines.
            Schema::table('routines', function ($table) {
                // Esta línea sirve para agregar una columna temporal de texto.
                $table->string('source_tmp', 20)->nullable();
            });
            // Esta línea sirve para copiar los valores actuales a la columna temporal.
            DB::statement('UPDATE routines SET source_tmp = source');
            // Esta línea sirve para modificar la tabla routines.
            Schema::table('routines', function ($table) {
                // Esta línea sirve para borrar la columna original.
                $table->dropColumn('source');
            });
            // Esta línea sirve para modificar la tabla routines.
            Schema::table('routines', function ($table) {
                // Esta línea sirve para renombrar la columna temporal como "source".
                $table->renameColumn('source_tmp', 'source');
            });

            // Esta línea sirve para terminar (en SQLite no hay más que hacer).
            return;
        }

        // Esta línea sirve para agregar 'admin' a los valores permitidos del enum (MySQL).
        DB::statement("ALTER TABLE routines MODIFY source ENUM('engine', 'trainer', 'admin') DEFAULT 'engine'");
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para revisar si la base de datos es SQLite.
        if (DB::connection()->getDriverName() === 'sqlite') {
            // Esta línea sirve para terminar sin cambios en SQLite.
            return;
        }

        // Esta línea sirve para quitar 'admin' de los valores permitidos (MySQL).
        DB::statement("ALTER TABLE routines MODIFY source ENUM('engine', 'trainer') DEFAULT 'engine'");
    }
};
