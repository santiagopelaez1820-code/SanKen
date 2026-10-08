<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: `cities.country_id` se mantiene intacto (varios sitios ya leen
 * `city->country_id` directamente — RankingScopeResolver, AdminUserController,
 * etc. — tocar eso está fuera de alcance). `state_id` es una columna nueva
 * y nullable, poblada por StateSeeder para las ciudades ya sembradas.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla cities.
        Schema::table('cities', function (Blueprint $table) {
            // Esta línea sirve para agregar el estado (opcional; impide borrar un estado con ciudades).
            $table->foreignId('state_id')->nullable()->after('country_id')->constrained('states')->restrictOnDelete();
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla cities.
        Schema::table('cities', function (Blueprint $table) {
            // Esta línea sirve para borrar la clave foránea y la columna state_id.
            $table->dropConstrainedForeignId('state_id');
        });
    }
};
