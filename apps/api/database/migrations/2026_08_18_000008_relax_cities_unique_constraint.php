<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->index('country_id');
            $table->dropUnique('cities_country_id_name_unique');
            $table->unique(['state_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->dropUnique(['state_id', 'name']);
            $table->unique(['country_id', 'name']);
            $table->dropIndex(['country_id']);
        });
    }
};
