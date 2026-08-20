<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Snapshot de las metas del routine_exercise (o defaults para sesion libre)
 * tomado al iniciar la sesion — ver StartWorkoutSessionAction. Antes la
 * pantalla de entrenamiento dependia de una query aparte a /routines/active
 * cruzada por indice de array; con esto la sesion queda autosuficiente
 * (necesario para el cap estricto de 3 series y para que recargar la pagina
 * no pierda el peso recomendado).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workout_exercises', function (Blueprint $table) {
            $table->unsignedTinyInteger('target_sets')->default(3)->after('order');
            $table->string('target_reps')->nullable()->after('target_sets');
            $table->unsignedSmallInteger('rest_seconds')->nullable()->after('target_reps');
            $table->decimal('target_rpe', 3, 1)->nullable()->after('rest_seconds');
            $table->decimal('suggested_weight_kg', 6, 2)->nullable()->after('target_rpe');
        });
    }

    public function down(): void
    {
        Schema::table('workout_exercises', function (Blueprint $table) {
            $table->dropColumn(['target_sets', 'target_reps', 'rest_seconds', 'target_rpe', 'suggested_weight_kg']);
        });
    }
};
