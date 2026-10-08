<?php

// Esta línea sirve para importar la clase base de las migraciones.
use Illuminate\Database\Migrations\Migration;
// Esta línea sirve para importar Blueprint para definir las columnas.
use Illuminate\Database\Schema\Blueprint;
// Esta línea sirve para importar la fachada Schema para crear y modificar tablas.
use Illuminate\Support\Facades\Schema;

/**
 * `cities` traía unique(country_id, name) — heredado de cuando solo
 * existían unas pocas ciudades "principales" por país. Con el import real
 * de countries-states-cities-database eso colisiona: hay muchísimos
 * nombres de ciudad repetidos entre departamentos/estados distintos del
 * mismo país (p.ej. varios municipios "San Antonio" en Colombia, varios
 * "Springfield" en EE.UU.). La combinación que sí es única en la práctica
 * es (state_id, name) — dos ciudades del mismo estado no comparten nombre,
 * pero el mismo nombre puede repetirse en dos estados distintos.
 *
 * No se toca `cities_state_id_foreign` (índice ya creado automáticamente
 * por el `constrained()` de la migración anterior) — sirve igual para las
 * búsquedas de OnboardingController::citiesByState() una vez que la tabla
 * tenga cientos de miles de filas.
 *
 * `cities_country_id_name_unique` resultó ser también el único índice que
 * cubre `country_id` — es el que InnoDB usa para satisfacer la FK
 * `cities_country_id_foreign`. Borrarlo sin más falla con error 1553
 * ("needed in a foreign key constraint"), así que primero se crea un
 * índice simple sobre `country_id` para que la FK siga teniendo soporte.
 */
// Esta línea sirve para devolver una migración anónima.
return new class extends Migration
{
    // Esta línea sirve para declarar el método que aplica la migración.
    public function up(): void
    {
        // Esta línea sirve para modificar la tabla cities.
        Schema::table('cities', function (Blueprint $table) {
            // Esta línea sirve para agregar un índice simple por país (lo necesita la clave foránea).
            $table->index('country_id');
            // Esta línea sirve para quitar la restricción de unicidad por país y nombre.
            $table->dropUnique('cities_country_id_name_unique');
            // Esta línea sirve para agregar la restricción de unicidad por estado y nombre.
            $table->unique(['state_id', 'name']);
        });
    }

    // Esta línea sirve para declarar el método que revierte la migración.
    public function down(): void
    {
        // Esta línea sirve para modificar la tabla cities.
        Schema::table('cities', function (Blueprint $table) {
            // Esta línea sirve para quitar la unicidad por estado y nombre.
            $table->dropUnique(['state_id', 'name']);
            // Esta línea sirve para volver a agregar la unicidad por país y nombre.
            $table->unique(['country_id', 'name']);
            // Esta línea sirve para borrar el índice simple por país.
            $table->dropIndex(['country_id']);
        });
    }
};
