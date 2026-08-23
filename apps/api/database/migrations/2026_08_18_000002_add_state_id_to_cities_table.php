<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Aditiva: `cities.country_id` se mantiene intacto (varios sitios ya leen
 * `city->country_id` directamente — RankingScopeResolver, AdminUserController,
 * etc. — tocar eso está fuera de alcance). `state_id` es una columna nueva
 * y nullable, poblada por StateSeeder para las ciudades ya sembradas.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->foreignId('state_id')->nullable()->after('country_id')->constrained('states')->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('cities', function (Blueprint $table) {
            $table->dropConstrainedForeignId('state_id');
        });
    }
};
