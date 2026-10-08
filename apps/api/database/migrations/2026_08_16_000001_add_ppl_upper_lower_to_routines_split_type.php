<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar la fachada DB para ejecutar SQL.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la fachada Schema para modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: agrega 'ppl_upper_lower' al enum de routines.split_type para el
 * split híbrido de 5 días del motor de plantillas (ver TemplateRoutineGenerator).
 * No reescribe ni toca filas existentes — los 4 valores previos siguen
 * siendo válidos.
 *
 * MySQL soporta ALTER...MODIFY sobre el enum directamente. SQLite (usado en
 * tests, ver phpunit.xml) implementa enum() como CHECK constraint fijado en
 * el CREATE TABLE — no se puede alterar in-place sin doctrine/dbal (no
 * instalado en este proyecto), así que ahí se recrea la columna como string
 * simple, sin CHECK. Mismo resultado práctico: cualquiera de los 5 valores
 * es válido.
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
                $table->string('split_type_tmp', 30)->nullable();
            });
            // Esta línea sirve para copiar los valores actuales a la columna temporal.
            DB::statement('UPDATE routines SET split_type_tmp = split_type');
            // Esta línea sirve para modificar la tabla routines.
            Schema::table('routines', function ($table) {
                // Esta línea sirve para borrar la columna original.
                $table->dropColumn('split_type');
            });
            // Esta línea sirve para modificar la tabla routines.
            Schema::table('routines', function ($table) {
                // Esta línea sirve para renombrar la columna temporal con el nombre original.
                $table->renameColumn('split_type_tmp', 'split_type');
            });

            // Esta línea sirve para terminar (en SQLite no hay más que hacer).
            return;
        }

        // Esta línea sirve para agregar 'ppl_upper_lower' a los valores permitidos del enum (MySQL).
        DB::statement("ALTER TABLE routines MODIFY split_type ENUM('full_body', 'upper_lower', 'push_pull_legs', 'bro_split', 'ppl_upper_lower')");
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para revisar si la base de datos es SQLite.
        if (DB::connection()->getDriverName() === 'sqlite') {
            // Esta línea sirve para terminar sin cambios en SQLite.
            return;
        }

        // Esta línea sirve para quitar 'ppl_upper_lower' de los valores permitidos (MySQL).
        DB::statement("ALTER TABLE routines MODIFY split_type ENUM('full_body', 'upper_lower', 'push_pull_legs', 'bro_split')");
    }
};
