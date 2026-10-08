<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar la fachada DB para ejecutar SQL.
use Illuminate\Support\Facades\DB;
// Esta línea sirve para importar la fachada Schema para modificar tablas.
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
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para revisar si la base de datos es SQLite.
        if (DB::connection()->getDriverName() === 'sqlite') {
            // Esta línea sirve para modificar la tabla users.
            Schema::table('users', function ($table) {
                // Esta línea sirve para agregar una columna temporal para el rol ("user" por defecto).
                $table->string('role_tmp', 20)->default('user');
            });
            // Esta línea sirve para copiar los roles cambiando "admin" por "super_admin".
            DB::statement("UPDATE users SET role_tmp = CASE WHEN role = 'admin' THEN 'super_admin' ELSE role END");
            // Esta línea sirve para modificar la tabla users.
            Schema::table('users', function ($table) {
                // Esta línea sirve para borrar la columna original del rol.
                $table->dropColumn('role');
            });
            // Esta línea sirve para modificar la tabla users.
            Schema::table('users', function ($table) {
                // Esta línea sirve para renombrar la columna temporal como "role".
                $table->renameColumn('role_tmp', 'role');
            });

            // Esta línea sirve para terminar (en SQLite no hay más que hacer).
            return;
        }

        // Ensancha el enum primero: MODIFY con un set que todavía no incluye
        // 'super_admin' trunca el UPDATE de abajo a '' en modo no estricto
        // (o falla en modo estricto, como acá) porque 'super_admin' no es
        // un valor válido hasta que el enum lo permite.
        // Esta línea sirve para agregar "super_admin" a los valores permitidos del enum.
        DB::statement("ALTER TABLE users MODIFY role ENUM('user', 'trainer', 'admin', 'super_admin') NOT NULL DEFAULT 'user'");
        // Esta línea sirve para cambiar los "admin" existentes a "super_admin".
        DB::statement("UPDATE users SET role = 'super_admin' WHERE role = 'admin'");
        // Esta línea sirve para dejar el enum solo con user, trainer y super_admin.
        DB::statement("ALTER TABLE users MODIFY role ENUM('user', 'trainer', 'super_admin') NOT NULL DEFAULT 'user'");
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para revisar si la base de datos es SQLite.
        if (DB::connection()->getDriverName() === 'sqlite') {
            // Esta línea sirve para volver a cambiar "super_admin" por "admin".
            DB::statement("UPDATE users SET role = 'admin' WHERE role = 'super_admin'");

            // Esta línea sirve para terminar en SQLite.
            return;
        }

        // Esta línea sirve para agregar "admin" a los valores permitidos del enum.
        DB::statement("ALTER TABLE users MODIFY role ENUM('user', 'trainer', 'admin', 'super_admin') NOT NULL DEFAULT 'user'");
        // Esta línea sirve para cambiar los "super_admin" existentes a "admin".
        DB::statement("UPDATE users SET role = 'admin' WHERE role = 'super_admin'");
        // Esta línea sirve para dejar el enum solo con user, trainer y admin.
        DB::statement("ALTER TABLE users MODIFY role ENUM('user', 'trainer', 'admin') NOT NULL DEFAULT 'user'");
    }
};
