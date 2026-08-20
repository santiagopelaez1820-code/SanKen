<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
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
return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            Schema::table('routines', function ($table) {
                $table->string('split_type_tmp', 30)->nullable();
            });
            DB::statement('UPDATE routines SET split_type_tmp = split_type');
            Schema::table('routines', function ($table) {
                $table->dropColumn('split_type');
            });
            Schema::table('routines', function ($table) {
                $table->renameColumn('split_type_tmp', 'split_type');
            });

            return;
        }

        DB::statement("ALTER TABLE routines MODIFY split_type ENUM('full_body', 'upper_lower', 'push_pull_legs', 'bro_split', 'ppl_upper_lower')");
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }

        DB::statement("ALTER TABLE routines MODIFY split_type ENUM('full_body', 'upper_lower', 'push_pull_legs', 'bro_split')");
    }
};
