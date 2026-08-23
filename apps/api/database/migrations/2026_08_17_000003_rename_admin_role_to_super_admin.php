<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * SUPER_ADMIN reemplaza a 'admin' (decisión del usuario: no es un tier nuevo
 * en paralelo, es un reemplazo de valor) — cuenta totalmente aparte de
 * trainer/coach, sin relación con el sistema de entrenadores. El panel
 * /admin/* existente se re-etiqueta pero sigue siendo la misma URL/lógica,
 * solo cambia el rol que la protege.
 *
 * Los datos se migran ANTES del ALTER del enum: si se alterara el enum
 * primero (quitando 'admin' del set de valores válidos) con filas que
 * todavía tienen 'admin', MySQL las convertiría silenciosamente a '' en modo
 * no estricto. Mismo patrón sqlite-safe que
 * 2026_08_16_000001_add_ppl_upper_lower_to_routines_split_type.php: SQLite
 * (tests) implementa enum() como CHECK fijado en el CREATE TABLE, así que se
 * recrea la columna como string simple en vez de alterar el enum in-place.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            Schema::table('users', function ($table) {
                $table->string('role_tmp', 20)->default('user');
            });
            DB::statement("UPDATE users SET role_tmp = CASE WHEN role = 'admin' THEN 'super_admin' ELSE role END");
            Schema::table('users', function ($table) {
                $table->dropColumn('role');
            });
            Schema::table('users', function ($table) {
                $table->renameColumn('role_tmp', 'role');
            });

            return;
        }

        // Ensancha el enum primero: MODIFY con un set que todavía no incluye
        // 'super_admin' trunca el UPDATE de abajo a '' en modo no estricto
        // (o falla en modo estricto, como acá) porque 'super_admin' no es
        // un valor válido hasta que el enum lo permite.
        DB::statement("ALTER TABLE users MODIFY role ENUM('user', 'trainer', 'admin', 'super_admin') NOT NULL DEFAULT 'user'");
        DB::statement("UPDATE users SET role = 'super_admin' WHERE role = 'admin'");
        DB::statement("ALTER TABLE users MODIFY role ENUM('user', 'trainer', 'super_admin') NOT NULL DEFAULT 'user'");
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            DB::statement("UPDATE users SET role = 'admin' WHERE role = 'super_admin'");

            return;
        }

        DB::statement("ALTER TABLE users MODIFY role ENUM('user', 'trainer', 'admin', 'super_admin') NOT NULL DEFAULT 'user'");
        DB::statement("UPDATE users SET role = 'admin' WHERE role = 'super_admin'");
        DB::statement("ALTER TABLE users MODIFY role ENUM('user', 'trainer', 'admin') NOT NULL DEFAULT 'user'");
    }
};
