<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: agrega 'admin' al enum de routines.source para que Super Admin
 * pueda asignar rutinas personalizadas por usuario (ver AssignPersonalRoutineAction),
 * mismo patrón sqlite-safe usado en 2026_08_16_000001_add_ppl_upper_lower_to_routines_split_type.
 * No reescribe filas existentes — 'engine' y 'trainer' siguen siendo válidos.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            Schema::table('routines', function ($table) {
                $table->string('source_tmp', 20)->nullable();
            });
            DB::statement('UPDATE routines SET source_tmp = source');
            Schema::table('routines', function ($table) {
                $table->dropColumn('source');
            });
            Schema::table('routines', function ($table) {
                $table->renameColumn('source_tmp', 'source');
            });

            return;
        }

        DB::statement("ALTER TABLE routines MODIFY source ENUM('engine', 'trainer', 'admin') DEFAULT 'engine'");
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }

        DB::statement("ALTER TABLE routines MODIFY source ENUM('engine', 'trainer') DEFAULT 'engine'");
    }
};
